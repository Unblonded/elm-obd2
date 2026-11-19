// Framebuffer display: draw into RAM, push the whole frame to the panel.
#pragma once
#include <Arduino.h>
#include "fonts.h"

constexpr uint16_t rgb(uint8_t r, uint8_t g, uint8_t b) {
  return ((r & 0xF8) << 8) | ((g & 0xFC) << 3) | (b >> 3);
}

namespace C {
constexpr uint16_t BG = rgb(0, 0, 0);
constexpr uint16_t CARD = rgb(14, 16, 20);
constexpr uint16_t LINE = rgb(36, 40, 46);
constexpr uint16_t TEXT = rgb(242, 244, 247);
constexpr uint16_t MUTED = rgb(123, 132, 144);
constexpr uint16_t ACCENT = rgb(58, 209, 255);
constexpr uint16_t ACCENT2 = rgb(138, 125, 255);
constexpr uint16_t OK = rgb(61, 220, 132);
constexpr uint16_t WARN = rgb(255, 176, 32);
constexpr uint16_t CRIT = rgb(255, 59, 59);
constexpr uint16_t TRACK = rgb(27, 31, 37);
constexpr uint16_t REDZONE = rgb(90, 20, 20);
}  // namespace C

enum Align { LEFT, CENTER, RIGHT };

namespace Display {
void begin();
void setBrightness(uint8_t level);  // 0..255
void clear(uint16_t c = C::BG);
void fillRect(int x, int y, int w, int h, uint16_t c);
void fillRound(int x, int y, int w, int h, int r, uint16_t c);
void hline(int x, int y, int w, uint16_t c);
int textWidth(const Font &f, const char *s);
// y = baseline
void text(const Font &f, int x, int y, const char *s, uint16_t c, Align a = LEFT);
void push();
}  // namespace Display
