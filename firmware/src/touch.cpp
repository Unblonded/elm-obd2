#include "touch.h"
#include <Wire.h>
#include "board.h"

#define AXS_ADDR 0x63
static volatile bool intFlag = false;
static void IRAM_ATTR onInt() { intFlag = true; }

static bool readReg(uint8_t reg, uint8_t *buf, size_t n) {
  Wire.beginTransmission(AXS_ADDR);
  Wire.write(reg);
  if (Wire.endTransmission() != 0) return false;
  if (Wire.requestFrom((uint8_t)AXS_ADDR, (uint8_t)n) != n) return false;
  Wire.readBytes(buf, n);
  return true;
}

namespace Touch {

static bool down = false;
static uint32_t downAt = 0, lastSeen = 0;
static int lx = 0, ly = 0;

void begin() {
  Wire.begin(TP_SDA, TP_SCL, 100000);
  pinMode(TP_RST, OUTPUT);
  digitalWrite(TP_RST, LOW);
  delay(200);
  digitalWrite(TP_RST, HIGH);
  delay(300);
  pinMode(TP_INT, INPUT_PULLUP);
  attachInterrupt(TP_INT, onInt, FALLING);
}

bool tap(int &x, int &y, bool &longPress) {
  uint32_t now = millis();
  if (intFlag) {
    intFlag = false;
    uint8_t d[14] = {0};
    if (readReg(0x01, d, 14) && d[1] > 0) {
      int rx = ((d[2] & 0x0F) << 8) | d[3];
      int ry = ((d[4] & 0x0F) << 8) | d[5];
      // rotation 1 (landscape): swap axes
      lx = ry;
      ly = rx;
      if (!down) { down = true; downAt = now; }
      lastSeen = now;
    }
  }
  // the controller stops interrupting when the finger lifts
  if (down && now - lastSeen > 120) {
    down = false;
    x = constrain(lx, 0, SCREEN_W - 1);
    y = constrain(ly, 0, SCREEN_H - 1);
    longPress = (lastSeen - downAt) > 700;
    return true;
  }
  return false;
}

}  // namespace Touch
