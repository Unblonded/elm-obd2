#include "obd.h"
#include <Preferences.h>
#include "elm.h"
#include "dtc_text.h"

// ---------------------------------------------------------------------------
// Value definitions (same as the web app; Mercedes IDs from the CBF files)
// b = positive response payload (index 0 = SID + 0x40)
// ---------------------------------------------------------------------------
static inline float u16(const std::vector<uint8_t> &b, size_t i) { return (b[i] << 8) | b[i + 1]; }
static inline float s16(const std::vector<uint8_t> &b, size_t i) { return (int16_t)((b[i] << 8) | b[i + 1]); }

struct Def {
  ValueId id;
  const char *header, *req, *resp;
  uint8_t minLen;  // payload bytes needed
  float (*fn)(const std::vector<uint8_t> &);
  float hz;
  int prio;
  float lo, hi, maxJump;  // plausibility filter (maxJump <= 0: none)
};

namespace Obd { Live live[V_COUNT]; }
using Obd::live;

static const Def DEFS[] = {
  {V_RPM, "7E0", "222000", "7E8", 5, [](auto &b) { return u16(b, 3) * 0.25f; }, 8, 10, 0, 8000, 3000},
  {V_SELECTOR, "7E1", "2130", "7E9", 10, [](auto &b) { return (float)b[9]; }, 3, 6, 0, 255, 0},
  {V_PROGRAM, "7E1", "2130", "7E9", 11, [](auto &b) { return (float)b[10]; }, 3, 6, 0, 255, 0},
  {V_GEAR, "7E1", "2130", "7E9", 13, [](auto &b) { return (float)(b[12] & 0x0F); }, 3, 6, 0, 15, 0},
  {V_TRANS, "7E1", "2130", "7E9", 14, [](auto &b) { return b[13] - 50.0f; }, 1, 2, -40, 160, 8},
  {V_OIL, "7E0", "222095", "7E8", 4, [](auto &b) { return b[3] * 0.75f - 48; }, 0.5, 2, -40, 170, 8},
  {V_COOLANT, "7E0", "222013", "7E8", 4, [](auto &b) { return b[3] * 0.75f - 48; }, 0.5, 1, -40, 140, 8},
  {V_FUEL, "7E0", "222030", "7E8", 5, [](auto &b) { return u16(b, 3) * 0.1f * 0.264172f; }, 0.2, 1, 0, 22, 1.5},
  {V_AMBIENT, "7E0", "222040", "7E8", 5, [](auto &b) { return u16(b, 3) * 0.0390625f / 10; }, 0.2, 1, 60, 110, 0},
  {V_BOOST, "7E0", "222077", "7E8", 5,
   [](auto &b) {
     float amb = live[V_AMBIENT].has ? live[V_AMBIENT].value : 101.3f;
     return (u16(b, 3) * 0.0078125f - amb) * 0.145038f;
   }, 4, 7, -15, 30, 12},
  {V_INTAKE, "7E0", "22201C", "7E8", 4, [](auto &b) { return b[3] * 0.75f - 48; }, 0.5, 1, -40, 120, 15},
  {V_BATTERY, "7E0", "222022", "7E8", 5, [](auto &b) { return u16(b, 3) * 0.02355f; }, 0.5, 1, 6, 17, 3},
  {V_OILPRESS, "7E0", "222020", "7E8", 5, [](auto &b) { return s16(b, 3) * 0.5f / 1000; }, 1, 2, -0.5, 10, 4},
};

struct Group {
  std::string header, req, resp, did;
  std::vector<const Def *> defs;
  float hz = 0;
  int prio = 0;
  uint32_t intervalMs = 1000, nextDue = 0;
  int fails = 0;
  int dataLen = -1;
  size_t lastLen = 0;
};
static std::vector<Group> groups;
static float candidate[V_COUNT];
static bool hasCandidate[V_COUNT];

namespace Obd {
volatile LinkState state = LinkState::Idle;
char statusText[48] = "Starting";
volatile float cmdPerSec = 0;
}  // namespace Obd
using Obd::state;

static void setStatus(LinkState s, const char *fmt, ...) {
  state = s;
  va_list ap;
  va_start(ap, fmt);
  vsnprintf(Obd::statusText, sizeof(Obd::statusText), fmt, ap);
  va_end(ap);
  Serial.printf("[OBD] %s\n", Obd::statusText);
}

static void buildGroups() {
  groups.clear();
  for (auto &d : DEFS) {
    Group *g = nullptr;
    for (auto &x : groups)
      if (x.header == d.header && x.req == d.req && x.resp == d.resp) g = &x;
    if (!g) {
      groups.push_back(Group());
      g = &groups.back();
      g->header = d.header;
      g->req = d.req;
      g->resp = d.resp;
      if (g->req.size() == 6 && g->req.rfind("22", 0) == 0) g->did = g->req.substr(2);
    }
    g->defs.push_back(&d);
    g->hz = max(g->hz, d.hz);
    g->prio = max(g->prio, d.prio);
  }
  for (auto &g : groups) g.intervalMs = (uint32_t)(1000 / g.hz);
}

static uint32_t effInterval(const Group &g) {
  if (!g.fails) return g.intervalMs;
  return min<uint32_t>(g.intervalMs << min(g.fails, 6), 10000);
}

static void store(const Def &d, float v) {
  Live &l = live[d.id];
  if (isnan(v) || isinf(v) || v < d.lo || v > d.hi) return;
  if (d.maxJump > 0 && l.has && fabsf(v - l.value) > d.maxJump) {
    // glitch unless the next reading confirms it
    if (!(hasCandidate[d.id] && fabsf(v - candidate[d.id]) <= d.maxJump)) {
      candidate[d.id] = v;
      hasCandidate[d.id] = true;
      return;
    }
  }
  hasCandidate[d.id] = false;
  l.value = v;
  l.has = true;
  l.error = false;
  l.ts = millis();
}

static void finish(Group &g, bool ok, const std::vector<uint8_t> &b, uint32_t t0) {
  uint32_t now = millis();
  if (ok) {
    g.fails = 0;
    g.lastLen = b.size();
    if (!g.did.empty()) g.dataLen = (int)b.size() - 3;
    g.nextDue = t0 + g.intervalMs;
    for (auto *d : g.defs) if (b.size() >= d->minLen) store(*d, d->fn(b));
  } else {
    g.fails++;
    g.nextDue = max(t0 + effInterval(g), now);
    for (auto *d : g.defs) live[d->id].error = true;  // value itself is kept on screen
  }
}

static bool noBatch = false;

static void pollGroup(Group &g) {
  uint32_t t0 = millis();
  // batch other due UDS DIDs on the same ECU into one 22 request
  std::vector<Group *> batch{&g};
  if (!g.did.empty() && g.dataLen >= 0 && !noBatch) {
    int len = 3 + g.dataLen;
    std::vector<Group *> cands;
    for (auto &o : groups)
      if (&o != &g && !o.did.empty() && o.dataLen >= 0 && o.header == g.header && o.resp == g.resp &&
          (int32_t)(o.nextDue - (t0 + effInterval(o) / 2)) <= 0)
        cands.push_back(&o);
    std::sort(cands.begin(), cands.end(), [](Group *a, Group *b) { return (int32_t)(a->nextDue - b->nextDue) < 0; });
    for (auto *o : cands) {
      if (batch.size() >= 6 || len + 2 + o->dataLen > 62) break;
      batch.push_back(o);
      len += 2 + o->dataLen;
    }
  }
  if (batch.size() > 1) {
    std::string req = "22";
    for (auto *x : batch) req += x->did;
    Elm::setHeader(g.header);
    Resp r = Elm::cmd(req);
    const Msg *m = r.error.empty() ? Elm::find(r.msgs, g.resp, 0x62) : nullptr;
    bool okSplit = m != nullptr;
    std::vector<std::vector<uint8_t>> parts;
    if (m) {
      size_t p = 1;
      for (auto *x : batch) {
        uint8_t hi = strtol(x->did.substr(0, 2).c_str(), nullptr, 16), lo = strtol(x->did.substr(2).c_str(), nullptr, 16);
        if (p + 2 + x->dataLen > m->bytes.size() || m->bytes[p] != hi || m->bytes[p + 1] != lo) { okSplit = false; break; }
        std::vector<uint8_t> part{0x62, hi, lo};
        part.insert(part.end(), m->bytes.begin() + p + 2, m->bytes.begin() + p + 2 + x->dataLen);
        parts.push_back(part);
        p += 2 + x->dataLen;
      }
      if (p != m->bytes.size()) okSplit = false;
    }
    if (!okSplit) {
      if (r.error != "DISCONNECTED") {
        noBatch = true;
        Serial.printf("[OBD] multi-DID read rejected (%s), using single requests\n", r.error.c_str());
      }
      return;
    }
    for (size_t i = 0; i < batch.size(); i++) finish(*batch[i], true, parts[i], t0);
    return;
  }
  bool single = g.lastLen > 0 && g.lastLen <= 7;
  Reply rep = Elm::request(g.header, g.req, g.resp, single);
  finish(g, rep.ok, rep.bytes, t0);
}

static Group *pick(uint32_t now, uint32_t &earliest) {
  Group *best = nullptr;
  float bestScore = -1e9;
  earliest = UINT32_MAX;
  for (auto &g : groups) {
    int32_t until = (int32_t)(g.nextDue - now);
    if (until > 0) { earliest = min<uint32_t>(earliest, until); continue; }
    float overdue = (float)(-until) / effInterval(g);
    float score = g.prio + 5 * min(overdue, 4.0f) + (g.header == Elm::header ? 3 : 0);
    if (score > bestScore) { bestScore = score; best = &g; }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Phone bridge: the web app talks to us exactly like to an ELM327 clone.
// Adapter-setup AT commands are answered locally (the adapter is already set up the
// way the app expects: E0 L0 S0 H1 SP6); everything else is forwarded.
// ---------------------------------------------------------------------------
static std::string phoneHeader = "7DF";

static void handlePhone(const std::string &line) {
  std::string c;
  for (char ch : line) if (!isspace((unsigned char)ch)) c += toupper(ch);
  if (c.empty()) { Link::phoneSend("\r>"); return; }
  auto reply = [](const std::string &body) { Link::phoneSend(body + "\r\r>"); };
  if (c.rfind("AT", 0) == 0) {
    std::string a = c.substr(2);
    if (a == "Z" || a == "WS" || a == "D") { phoneHeader = "7DF"; reply(a == "D" ? "OK" : "ELM327 v1.5"); return; }
    if (a == "I") { reply("ELM327 v1.5"); return; }
    if (a.rfind("SH", 0) == 0 && a.size() >= 5) { phoneHeader = a.substr(2); reply("OK"); return; }
    static const char *local[] = {"E0", "E1", "L0", "L1", "S0", "S1", "H0", "H1", "SP", "CAF", "AT", "CRA", "ST", "M0", "M1"};
    for (auto *p : local)
      if (a.rfind(p, 0) == 0) { reply("OK"); return; }
    Resp r = Elm::cmd(c, 2000);  // ATRV, ATDP, ...
    std::string body;
    for (auto &l : r.lines) body += (body.empty() ? "" : "\r") + l;
    reply(body.empty() ? (r.error.empty() ? "OK" : r.error) : body);
    return;
  }
  Elm::setHeader(phoneHeader);
  Resp r = Elm::cmd(c, 4000);
  std::string body;
  for (auto &l : r.lines) body += (body.empty() ? "" : "\r") + l;
  if (body.empty()) body = r.error.empty() ? "NO DATA" : r.error;
  reply(body);
}

// ---------------------------------------------------------------------------
// Fault codes
// ---------------------------------------------------------------------------
static std::vector<Fault> faultList;
static bool faultsRead = false;
static std::string faultErr;
static volatile bool wantFaults = false, wantClear = false, faultBusy = false;
static SemaphoreHandle_t faultMx;

static const char *lookup(const DtcText *t, uint16_t n, const char *code) {
  int lo = 0, hi = n - 1;
  while (lo <= hi) {
    int mid = (lo + hi) / 2;
    int c = strcmp(t[mid].code, code);
    if (c == 0) return t[mid].text;
    if (c < 0) lo = mid + 1; else hi = mid - 1;
  }
  return nullptr;
}

static void readFaults() {
  std::vector<Fault> list;
  std::string err;
  // engine, UDS 19 02 2D
  {
    Elm::setHeader("7E0");
    Resp r = Elm::cmd("19022D", 5000);
    const Msg *m = Elm::find(r.msgs, "7E8", 0x59);
    if (!m) err += "Engine: " + (r.error.empty() ? std::string("rejected") : r.error) + ". ";
    else
      for (size_t i = 3; i + 3 < m->bytes.size(); i += 4) {
        const uint8_t *b = &m->bytes[i];
        Fault f{};
        snprintf(f.code, sizeof(f.code), "%c%02X%02X", "PCBU"[b[0] >> 6], b[0] & 0x3F, b[1]);
        snprintf(f.sub, sizeof(f.sub), "%02X", b[2]);
        f.status = b[3];
        f.kwp = false;
        char full[10];
        snprintf(full, sizeof(full), "%s%s", f.code, f.sub);
        f.text = lookup(DTC_7E8, DTC_7E8_N, full);
        if (!f.text) { snprintf(full, sizeof(full), "%s00", f.code); f.text = lookup(DTC_7E8, DTC_7E8_N, full); }
        list.push_back(f);
      }
  }
  // transmission, KWP2000 18 02 FF 00
  {
    Elm::setHeader("7E1");
    Resp r = Elm::cmd("1802FF00", 5000);
    const Msg *m = Elm::find(r.msgs, "7E9", 0x58);
    if (!m) err += "Trans: " + (r.error.empty() ? std::string("rejected") : r.error) + ".";
    else
      for (size_t i = 2; i + 2 < m->bytes.size(); i += 3) {
        const uint8_t *b = &m->bytes[i];
        Fault f{};
        snprintf(f.code, sizeof(f.code), "%02X%02X", b[0], b[1]);
        f.status = b[2];
        f.kwp = true;
        f.text = lookup(DTC_7E9, DTC_7E9_N, f.code);
        list.push_back(f);
      }
  }
  xSemaphoreTake(faultMx, portMAX_DELAY);
  faultList = list;
  faultErr = err;
  faultsRead = true;
  xSemaphoreGive(faultMx);
}

static void clearFaults() {
  Elm::setHeader("7E0");
  Elm::cmd("14FFFFFF", 5000);
  Elm::setHeader("7E1");
  Elm::cmd("14FF00", 5000);
  readFaults();
}

// ---------------------------------------------------------------------------
// Connection state machine
// ---------------------------------------------------------------------------
static Preferences prefs;
static std::vector<Link::Found> found;
static SemaphoreHandle_t foundMx;
static volatile bool wantScan = false;
static volatile int wantPick = -1;
static std::string savedAddr;
static uint8_t savedType = 0;

static void doScan(bool autoPick) {
  setStatus(LinkState::Scanning, "Scanning for adapter...");
  auto list = Link::scan(5000);
  xSemaphoreTake(foundMx, portMAX_DELAY);
  found = list;
  xSemaphoreGive(foundMx);
  if (autoPick && !list.empty() && list[0].likely) {
    savedAddr = list[0].addr;
    savedType = list[0].type;
    prefs.putString("addr", savedAddr.c_str());
    prefs.putUChar("type", savedType);
    return;
  }
  setStatus(LinkState::PickDevice, list.empty() ? "No adapters found" : "Tap your adapter");
}

static void obdTask(void *) {
  prefs.begin("clslive", false);
  savedAddr = prefs.getString("addr", "").c_str();
  savedType = prefs.getUChar("type", 0);
  buildGroups();
  uint32_t lastRate = millis(), lastCount = 0;
  int connectFails = 0;

  for (;;) {
    if (wantScan) { wantScan = false; Link::disconnect(); savedAddr.clear(); doScan(false); continue; }
    if (wantPick >= 0) {
      xSemaphoreTake(foundMx, portMAX_DELAY);
      if (wantPick < (int)found.size()) { savedAddr = found[wantPick].addr; savedType = found[wantPick].type; }
      xSemaphoreGive(foundMx);
      wantPick = -1;
      prefs.putString("addr", savedAddr.c_str());
      prefs.putUChar("type", savedType);
      connectFails = 0;
    }

    if (!Link::connected()) {
      if (state == LinkState::Live) setStatus(LinkState::Lost, "Connection lost, reconnecting");
      if (savedAddr.empty()) {
        if (state != LinkState::PickDevice) doScan(true);
        if (savedAddr.empty()) { vTaskDelay(pdMS_TO_TICKS(100)); continue; }
      }
      if (state != LinkState::Lost) setStatus(LinkState::Connecting, "Connecting %s", savedAddr.c_str());
      std::string err;
      if (!Link::connect(savedAddr, savedType, err)) {
        connectFails++;
        setStatus(LinkState::Lost, "Retrying (%s)", err.c_str());
        vTaskDelay(pdMS_TO_TICKS(min(1000 * connectFails, 5000)));
        continue;
      }
      connectFails = 0;
      setStatus(LinkState::Init, "Initializing adapter");
      noBatch = false;
      for (auto &g : groups) { g.nextDue = 0; g.fails = 0; }
      if (!Elm::init()) continue;
      setStatus(LinkState::Live, "Live %s", Elm::version.c_str());
    }

    // phone commands first (interactive)
    std::string line;
    if (Link::phoneLine(line)) { handlePhone(line); continue; }

    if (wantFaults || wantClear) {
      faultBusy = true;
      if (wantClear) clearFaults(); else readFaults();
      wantFaults = wantClear = false;
      faultBusy = false;
      continue;
    }

    uint32_t now = millis();
    if (now - lastRate >= 1000) {
      Obd::cmdPerSec = (Elm::cmdCount - lastCount) * 1000.0f / (now - lastRate);
      lastCount = Elm::cmdCount;
      lastRate = now;
    }
    uint32_t earliest;
    Group *g = pick(now, earliest);
    if (!g) { vTaskDelay(pdMS_TO_TICKS(min<uint32_t>(max<uint32_t>(earliest, 2), 20))); continue; }
    pollGroup(*g);
  }
}

namespace Obd {

void begin() {
  faultMx = xSemaphoreCreateMutex();
  foundMx = xSemaphoreCreateMutex();
  xTaskCreate(obdTask, "obd", 12288, nullptr, 3, nullptr);
}

void requestScan() { wantScan = true; }
void pickDevice(int i) { wantPick = i; }
void forgetDevice() {
  prefs.remove("addr");
  wantScan = true;
}
std::vector<Link::Found> devices() {
  xSemaphoreTake(foundMx, portMAX_DELAY);
  auto c = found;
  xSemaphoreGive(foundMx);
  return c;
}
void requestReadFaults() { wantFaults = true; }
void requestClearFaults() { wantClear = true; }
bool faultsBusy() { return faultBusy || wantFaults || wantClear; }
std::vector<Fault> faults(bool &read, std::string &err) {
  xSemaphoreTake(faultMx, portMAX_DELAY);
  auto c = faultList;
  read = faultsRead;
  err = faultErr;
  xSemaphoreGive(faultMx);
  return c;
}

const char *selectorLetter() {
  if (!live[V_SELECTOR].has) return "-";
  int s = (int)live[V_SELECTOR].value;
  bool manualProg = live[V_PROGRAM].has && (int)live[V_PROGRAM].value == 3;
  switch (s) {
    case 7: case 249: return manualProg ? "M" : "D";
    case 8: case 11: case 12: return "N";
    case 9: case 13: return "R";
    case 10: case 250: return "P";
    case 1: case 2: case 3: case 4: case 5: case 6: case 99: case 101: return "M";
    default: return "-";
  }
}

const char *programName() {
  if (!strcmp(selectorLetter(), "M")) return "Manual";
  if (!live[V_PROGRAM].has) return "";
  switch ((int)live[V_PROGRAM].value) {
    case 0: return "Sport";
    case 1: return "Comfort";
    case 2: return "Agility";
    case 3: return "Manual";
    default: return "";
  }
}

}  // namespace Obd
