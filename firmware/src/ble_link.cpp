#include "ble_link.h"
#include <NimBLEDevice.h>
#include <deque>
#include <freertos/stream_buffer.h>

namespace Link {

struct Profile { const char *svc, *write, *notify; };
static const Profile PROFILES[] = {
  {"fff0", "fff2", "fff1"},
  {"ffe0", "ffe1", "ffe1"},
  {"18f0", "2af1", "2af0"},
  {"e7810a71-73ae-499d-8c15-faa9aef0c3f2", "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f", "bef8d6c9-9c21-4c9e-b632-bd58c1009f9f"},
};

static NimBLEClient *client = nullptr;
static NimBLERemoteCharacteristic *wChar = nullptr, *nChar = nullptr;
static StreamBufferHandle_t rx = nullptr;
static volatile bool linkUp = false;
static std::string name;

static NimBLEServer *server = nullptr;
static NimBLECharacteristic *phoneChar = nullptr;
static volatile bool phoneUp = false;
static volatile uint16_t phoneMtu = 23;
static SemaphoreHandle_t phoneMx;
static std::string phoneBuf;
static std::deque<std::string> phoneQ;

class ClientCb : public NimBLEClientCallbacks {
  void onDisconnect(NimBLEClient *, int reason) override {
    linkUp = false;
    Serial.printf("[BLE] adapter disconnected (%d)\n", reason);
  }
};
static ClientCb clientCb;

class ServerCb : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer *, NimBLEConnInfo &info) override {
    phoneUp = true;
    phoneMtu = info.getMTU();
    Serial.println("[BLE] phone connected");
  }
  void onDisconnect(NimBLEServer *, NimBLEConnInfo &, int) override {
    phoneUp = false;
    Serial.println("[BLE] phone disconnected");
  }
  void onMTUChange(uint16_t mtu, NimBLEConnInfo &) override { phoneMtu = mtu; }
};
static ServerCb serverCb;

class PhoneCharCb : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic *c, NimBLEConnInfo &) override {
    std::string v = c->getValue();
    xSemaphoreTake(phoneMx, portMAX_DELAY);
    for (char ch : v) {
      if (ch == '\r' || ch == '\n') {
        if (!phoneBuf.empty()) phoneQ.push_back(phoneBuf);
        phoneBuf.clear();
      } else if (phoneBuf.size() < 64) {
        phoneBuf += ch;
      }
    }
    xSemaphoreGive(phoneMx);
  }
};
static PhoneCharCb phoneCharCb;

void begin(const char *deviceName) {
  rx = xStreamBufferCreate(4096, 1);
  phoneMx = xSemaphoreCreateMutex();
  NimBLEDevice::init(deviceName);
  NimBLEDevice::setMTU(247);

  server = NimBLEDevice::createServer();
  server->setCallbacks(&serverCb);
  server->advertiseOnDisconnect(true);
  NimBLEService *svc = server->createService("FFE0");
  phoneChar = svc->createCharacteristic("FFE1", NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE |
                                                    NIMBLE_PROPERTY::WRITE_NR | NIMBLE_PROPERTY::NOTIFY);
  phoneChar->setCallbacks(&phoneCharCb);
  svc->start();
  NimBLEAdvertising *adv = NimBLEDevice::getAdvertising();
  adv->setName(deviceName);
  adv->addServiceUUID("FFE0");
  adv->enableScanResponse(true);
  adv->start();
}

static bool nameLooksObd(const std::string &n) {
  std::string u = n;
  for (auto &c : u) c = toupper(c);
  for (const char *k : {"OBD", "ELM", "LINK", "VGATE", "ICAR", "KONNWEI", "VEEPEAK", "CAR"})
    if (u.find(k) != std::string::npos) return true;
  return false;
}

std::vector<Found> scan(uint32_t ms) {
  std::vector<Found> out;
  NimBLEScan *s = NimBLEDevice::getScan();
  s->setActiveScan(true);
  s->setInterval(100);
  s->setWindow(99);
  NimBLEScanResults res = s->getResults(ms, false);
  for (int i = 0; i < res.getCount(); i++) {
    const NimBLEAdvertisedDevice *d = res.getDevice(i);
    Found f;
    f.name = d->haveName() ? d->getName() : "";
    f.addr = d->getAddress().toString();
    f.type = d->getAddress().getType();
    f.rssi = d->getRSSI();
    f.likely = nameLooksObd(f.name);
    for (auto &p : PROFILES)
      if (d->isAdvertisingService(NimBLEUUID(p.svc))) f.likely = true;
    if (f.name.empty() && !f.likely) continue;
    out.push_back(f);
  }
  s->clearResults();
  std::sort(out.begin(), out.end(), [](const Found &a, const Found &b) {
    if (a.likely != b.likely) return a.likely;
    return a.rssi > b.rssi;
  });
  return out;
}

static void onNotify(NimBLERemoteCharacteristic *, uint8_t *data, size_t len, bool) {
  xStreamBufferSend(rx, data, len, 0);
}

bool connect(const std::string &addr, uint8_t type, std::string &err) {
  if (!client) {
    client = NimBLEDevice::createClient();
    client->setClientCallbacks(&clientCb, false);
    client->setConnectTimeout(8000);
  }
  if (client->isConnected()) client->disconnect();
  linkUp = false;
  wChar = nChar = nullptr;
  if (!client->connect(NimBLEAddress(addr, type))) { err = "connect failed"; return false; }
  for (auto &p : PROFILES) {
    NimBLERemoteService *svc = client->getService(NimBLEUUID(p.svc));
    if (!svc) continue;
    const auto &chars = svc->getCharacteristics(true);
    NimBLERemoteCharacteristic *w = svc->getCharacteristic(NimBLEUUID(p.write));
    NimBLERemoteCharacteristic *n = svc->getCharacteristic(NimBLEUUID(p.notify));
    if (!w || !(w->canWrite() || w->canWriteNoResponse()))
      for (auto *c : chars) if (c->canWrite() || c->canWriteNoResponse()) { w = c; break; }
    if (!n || !(n->canNotify() || n->canIndicate()))
      for (auto *c : chars) if (c->canNotify() || c->canIndicate()) { n = c; break; }
    if (w && n) {
      if (!n->subscribe(n->canNotify(), onNotify, true)) continue;
      wChar = w;
      nChar = n;
      name = client->getPeerAddress().toString();
      linkUp = true;
      Serial.printf("[BLE] adapter ready: svc %s write %s notify %s\n", p.svc,
                    w->getUUID().toString().c_str(), n->getUUID().toString().c_str());
      return true;
    }
  }
  err = "no UART service";
  client->disconnect();
  return false;
}

bool connected() { return linkUp && client && client->isConnected(); }

void disconnect() {
  if (client && client->isConnected()) client->disconnect();
  linkUp = false;
}

bool write(const char *s, size_t n) {
  if (!connected() || !wChar) return false;
  bool resp = !wChar->canWriteNoResponse();
  for (size_t i = 0; i < n; i += 20) {
    size_t k = min((size_t)20, n - i);
    if (!wChar->writeValue((const uint8_t *)s + i, k, resp)) return false;
  }
  return true;
}

size_t read(char *buf, size_t max, uint32_t waitMs) {
  return xStreamBufferReceive(rx, buf, max, pdMS_TO_TICKS(waitMs));
}

void flushRx() { xStreamBufferReset(rx); }

const std::string &adapterName() { return name; }

bool phoneConnected() { return phoneUp; }

bool phoneLine(std::string &out) {
  bool got = false;
  xSemaphoreTake(phoneMx, portMAX_DELAY);
  if (!phoneQ.empty()) {
    out = phoneQ.front();
    phoneQ.pop_front();
    got = true;
  }
  xSemaphoreGive(phoneMx);
  return got;
}

void phoneSend(const std::string &s) {
  if (!phoneUp) return;
  size_t chunk = phoneMtu > 23 ? phoneMtu - 3 : 20;
  for (size_t i = 0; i < s.size(); i += chunk) {
    size_t k = min(chunk, s.size() - i);
    phoneChar->notify((const uint8_t *)s.data() + i, k);
  }
}

}  // namespace Link
