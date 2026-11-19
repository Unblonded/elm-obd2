// CLS Live - ESP32-C6 dashboard + BLE hub for an ELM327 BLE adapter.
// Screen: Waveshare ESP32-C6-Touch-LCD-1.47 (320x172 landscape). Tap right/left half to change page.
#include <Arduino.h>
#include "board.h"
#include "display.h"
#include "touch.h"
#include "ble_link.h"
#include "obd.h"

using namespace Display;

enum Page { P_DRIVE, P_GAUGES, P_ENGINE, P_FAULTS, P_LINK, P_COUNT };
static int page = P_DRIVE;
static float rpmShown = 0;
static uint8_t brightness = 255;
static uint32_t clearArmedAt = 0;

struct Btn { int x, y, w, h; };
static bool hit(const Btn &b, int x, int y) { return x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h; }
static void button(const Btn &b, const char *label, uint16_t bg, uint16_t fg = C::TEXT) {
  fillRound(b.x, b.y, b.w, b.h, 8, bg);
  text(F_LABEL, b.x + b.w / 2, b.y + b.h / 2 + 5, label, fg, CENTER);
}

static void fmt(char *out, size_t n, ValueId id, int decimals) {
  if (!Obd::live[id].has) { snprintf(out, n, "--"); return; }
  snprintf(out, n, "%.*f", decimals, (double)Obd::live[id].value);
}

static uint16_t levelColor(float v, float warnAbove, float critAbove, bool below = false) {
  if (below ? v <= critAbove : v >= critAbove) return C::CRIT;
  if (below ? v <= warnAbove : v >= warnAbove) return C::WARN;
  return C::TEXT;
}

// ---------------------------------------------------------------------------
static void statusBar() {
  uint16_t dot = C::MUTED;
  switch (Obd::state) {
    case LinkState::Live: dot = C::OK; break;
    case LinkState::Lost: dot = C::CRIT; break;
    case LinkState::Idle: case LinkState::PickDevice: dot = C::MUTED; break;
    default: dot = C::WARN;
  }
  fillRound(6, 5, 8, 8, 4, dot);
  char buf[64];
  if (Obd::state == LinkState::Live) snprintf(buf, sizeof(buf), "LIVE  %.0f/s", (double)Obd::cmdPerSec);
  else snprintf(buf, sizeof(buf), "%s", Obd::statusText);
  text(F_SMALL, 18, 14, buf, C::MUTED);
  if (Link::phoneConnected()) text(F_LABEL, SCREEN_W - 6, 14, "PHONE", C::ACCENT, RIGHT);
  // page dots
  for (int i = 0; i < P_COUNT; i++)
    fillRound(SCREEN_W / 2 - P_COUNT * 6 + i * 12, SCREEN_H - 6, 6, 4, 2, i == page ? C::ACCENT : C::LINE);
}

static void tile(int x, int y, int w, int h, const char *label, ValueId id, int dec, const char *unit, uint16_t col) {
  fillRound(x, y, w, h, 10, C::CARD);
  text(F_LABEL, x + 8, y + 16, label, C::MUTED);
  char v[16];
  fmt(v, sizeof(v), id, dec);
  int vw = textWidth(F_MED, v);
  text(F_MED, x + 8, y + h - 10, v, Obd::live[id].has ? col : C::MUTED);
  text(F_LABEL, x + 12 + vw, y + h - 10, unit, C::MUTED);
}

static void drawDrive() {
  // RPM
  float target = Obd::live[V_RPM].has ? Obd::live[V_RPM].value : 0;
  rpmShown += (target - rpmShown) * 0.35f;
  char v[12];
  if (Obd::live[V_RPM].has) snprintf(v, sizeof(v), "%d", ((int)(rpmShown + 5) / 10) * 10);
  else snprintf(v, sizeof(v), "----");
  fillRound(4, 20, 206, 140, 12, C::CARD);
  text(F_LABEL, 14, 38, "RPM", C::MUTED);
  text(F_BIG, 196, 112, v, rpmShown >= 6200 ? C::CRIT : C::TEXT, RIGHT);
  // bar
  const int bx = 14, by = 128, bw = 186, bh = 16;
  fillRound(bx, by, bw, bh, 6, C::TRACK);
  int red = bw * 6200 / 7000;
  fillRect(bx + red, by, bw - red, bh, C::REDZONE);
  int fw = (int)(bw * min(max(rpmShown, 0.0f), 7000.0f) / 7000);
  if (fw > 0) fillRound(bx, by, fw, bh, 6, rpmShown >= 6200 ? C::CRIT : C::ACCENT);
  for (int k = 1; k < 7; k++) fillRect(bx + bw * k / 7, by + bh, 1, 4, C::MUTED);

  // gear
  fillRound(214, 20, 102, 140, 12, C::CARD);
  const char *sel = Obd::selectorLetter();
  uint16_t gc = C::TEXT;
  if (!strcmp(sel, "D")) gc = C::OK;
  else if (!strcmp(sel, "R")) gc = C::CRIT;
  else if (!strcmp(sel, "N")) gc = C::WARN;
  else if (!strcmp(sel, "M")) gc = C::ACCENT2;
  bool showNum = (!strcmp(sel, "D") || !strcmp(sel, "M")) && Obd::live[V_GEAR].has &&
                 Obd::live[V_GEAR].value >= 1 && Obd::live[V_GEAR].value <= 7;
  int cx = showNum ? 252 : 265;
  text(F_GEAR, cx, 128, sel, gc, CENTER);
  if (showNum) {
    char n[4];
    snprintf(n, sizeof(n), "%d", (int)Obd::live[V_GEAR].value);
    text(F_MED, 306, 128, n, C::ACCENT, RIGHT);
  }
  text(F_LABEL, 265, 152, Obd::programName(), C::MUTED, CENTER);
}

static void drawGauges() {
  const int w = 154, h = 66;
  tile(4, 22, w, h, "OIL TEMP", V_OIL, 0, "\xC2\xB0" "C", levelColor(Obd::live[V_OIL].value, 130, 145));
  tile(162, 22, w, h, "TRANS TEMP", V_TRANS, 0, "\xC2\xB0" "C", levelColor(Obd::live[V_TRANS].value, 110, 125));
  tile(4, 94, w, h, "BOOST", V_BOOST, 1, "psi", levelColor(Obd::live[V_BOOST].value, 15, 19));
  tile(162, 94, w, h, "FUEL", V_FUEL, 1, "gal", levelColor(Obd::live[V_FUEL].value, 3, 1.5, true));
}

static void drawEngine() {
  const int w = 154, h = 66;
  tile(4, 22, w, h, "COOLANT", V_COOLANT, 0, "\xC2\xB0" "C", levelColor(Obd::live[V_COOLANT].value, 110, 118));
  tile(162, 22, w, h, "INTAKE AIR", V_INTAKE, 0, "\xC2\xB0" "C", C::TEXT);
  tile(4, 94, w, h, "OIL PRESS", V_OILPRESS, 1, "bar", C::TEXT);
  tile(162, 94, w, h, "BATTERY", V_BATTERY, 1, "V", levelColor(-Obd::live[V_BATTERY].value, -12.0, -11.5));
}

static const Btn BTN_READ{4, 132, 100, 32}, BTN_CLEAR{110, 132, 100, 32};
static void drawFaults() {
  bool read;
  std::string err;
  auto list = Obd::faults(read, err);
  int y = 36;
  if (Obd::faultsBusy()) text(F_SMALL, 8, y, "Reading...", C::MUTED);
  else if (!read) text(F_SMALL, 8, y, "Tap READ to check engine + transmission", C::MUTED);
  else if (list.empty()) text(F_SMALL, 8, y, err.empty() ? "No fault codes" : err.c_str(), err.empty() ? C::OK : C::CRIT);
  else {
    char head[48];
    snprintf(head, sizeof(head), "%d code%s", (int)list.size(), list.size() > 1 ? "s" : "");
    text(F_LABEL, SCREEN_W - 8, 14 + 18, head, C::WARN, RIGHT);
    for (size_t i = 0; i < list.size() && i < 6; i++) {
      auto &f = list[i];
      bool active = f.kwp ? ((f.status >> 5) & 3) == 3 : (f.status & 0x01);
      text(F_LABEL, 8, y, f.code, active ? C::CRIT : C::WARN);
      char t[44];
      snprintf(t, sizeof(t), "%.38s", f.text ? f.text : "Unknown code");
      text(F_SMALL, 62, y, t, C::TEXT);
      y += 16;
    }
  }
  button(BTN_READ, Obd::faultsBusy() ? "..." : "READ", C::ACCENT, rgb(0, 16, 24));
  bool armed = millis() - clearArmedAt < 3000;
  button(BTN_CLEAR, armed ? "CONFIRM" : "CLEAR", armed ? C::CRIT : rgb(58, 13, 13));
}

static const Btn BTN_SCAN{4, 132, 100, 32}, BTN_BRIGHT{110, 132, 100, 32};
static void drawLink() {
  text(F_LABEL, 8, 34, "ADAPTER", C::MUTED);
  text(F_SMALL, 8, 52, Obd::statusText, C::TEXT);
  if (Obd::state == LinkState::PickDevice || Obd::state == LinkState::Scanning) {
    auto devs = Obd::devices();
    for (size_t i = 0; i < devs.size() && i < 4; i++) {
      char row[64];
      snprintf(row, sizeof(row), "%s  %s  %ddBm", devs[i].name.empty() ? "(no name)" : devs[i].name.c_str(),
               devs[i].addr.c_str(), devs[i].rssi);
      fillRound(4, 58 + i * 18, 312, 16, 4, devs[i].likely ? rgb(10, 40, 50) : C::CARD);
      text(F_SMALL, 8, 71 + i * 18, row, C::TEXT);
    }
  } else {
    text(F_SMALL, 8, 72, Link::phoneConnected() ? "Phone app connected via this display" : "Phone: connect the web app to \"CLS-Live\"",
         C::MUTED);
  }
  button(BTN_SCAN, "RESCAN", C::CARD);
  char b[24];
  snprintf(b, sizeof(b), "LIGHT %d%%", brightness * 100 / 255);
  button(BTN_BRIGHT, b, C::CARD);
}

static void handleTouch() {
  int x, y;
  bool lp;
  if (!Touch::tap(x, y, lp)) return;
  if (page == P_FAULTS) {
    if (hit(BTN_READ, x, y)) { Obd::requestReadFaults(); return; }
    if (hit(BTN_CLEAR, x, y)) {
      if (millis() - clearArmedAt < 3000) { Obd::requestClearFaults(); clearArmedAt = 0; }
      else clearArmedAt = millis();
      return;
    }
  }
  if (page == P_LINK) {
    if (hit(BTN_SCAN, x, y)) { Obd::forgetDevice(); return; }
    if (hit(BTN_BRIGHT, x, y)) {
      brightness = brightness > 64 ? brightness - 64 : 255;
      setBrightness(brightness);
      return;
    }
    if (Obd::state == LinkState::PickDevice && y >= 58 && y < 58 + 4 * 18) {
      Obd::pickDevice((y - 58) / 18);
      return;
    }
  }
  page = (x < SCREEN_W / 3) ? (page + P_COUNT - 1) % P_COUNT : (page + 1) % P_COUNT;
}

void setup() {
  Serial.begin(115200);
  Display::begin();
  Touch::begin();
  Link::begin("CLS-Live");
  Obd::begin();
  pinMode(BOOT_BTN, INPUT_PULLUP);
}

void loop() {
  static uint32_t lastFrame = 0;
  static bool bootWasDown = false;
  handleTouch();
  bool boot = digitalRead(BOOT_BTN) == LOW;  // BOOT button = next page
  if (boot && !bootWasDown) page = (page + 1) % P_COUNT;
  bootWasDown = boot;
  // go to the link page automatically when the adapter needs choosing
  static LinkState lastState = LinkState::Idle;
  if (Obd::state != lastState && Obd::state == LinkState::PickDevice) page = P_LINK;
  lastState = Obd::state;

  if (millis() - lastFrame < 40) { delay(2); return; }
  lastFrame = millis();
  clear();
  switch (page) {
    case P_DRIVE: drawDrive(); break;
    case P_GAUGES: drawGauges(); break;
    case P_ENGINE: drawEngine(); break;
    case P_FAULTS: drawFaults(); break;
    case P_LINK: drawLink(); break;
  }
  statusBar();
  push();
}
