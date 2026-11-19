#include "display.h"
#include "board.h"

static Arduino_DataBus *bus = nullptr;
static Arduino_GFX *gfx = nullptr;
static uint16_t *fb = nullptr;  // SCREEN_W * SCREEN_H, RGB565

namespace Display {

void begin() {
  bus = new Arduino_HWSPI(LCD_DC, LCD_CS, LCD_SCK, LCD_MOSI);
  gfx = new Arduino_ST7789(bus, LCD_RST, 0, false, LCD_W, LCD_H, LCD_COL_OFFSET, 0, LCD_COL_OFFSET, 0);
  gfx->begin(40000000);
  lcd_reg_init(bus);
  gfx->setRotation(1);
  fb = (uint16_t *)malloc(SCREEN_W * SCREEN_H * 2);
  ledcAttach(LCD_BL, 5000, 8);
  setBrightness(255);
  clear();
  push();
}

void setBrightness(uint8_t level) { ledcWrite(LCD_BL, level); }

void clear(uint16_t c) {
  for (int i = 0; i < SCREEN_W * SCREEN_H; i++) fb[i] = c;
}

void fillRect(int x, int y, int w, int h, uint16_t c) {
  if (x < 0) { w += x; x = 0; }
  if (y < 0) { h += y; y = 0; }
  if (x + w > SCREEN_W) w = SCREEN_W - x;
  if (y + h > SCREEN_H) h = SCREEN_H - y;
  if (w <= 0 || h <= 0) return;
  for (int j = y; j < y + h; j++) {
    uint16_t *p = fb + j * SCREEN_W + x;
    for (int i = 0; i < w; i++) p[i] = c;
  }
}

void fillRound(int x, int y, int w, int h, int r, uint16_t c) {
  if (r * 2 > h) r = h / 2;
  if (r * 2 > w) r = w / 2;
  fillRect(x, y + r, w, h - 2 * r, c);
  for (int j = 0; j < r; j++) {
    int dy = r - j;
    int dx = r - (int)sqrtf((float)(r * r - dy * dy));
    fillRect(x + dx, y + j, w - 2 * dx, 1, c);
    fillRect(x + dx, y + h - 1 - j, w - 2 * dx, 1, c);
  }
}

void hline(int x, int y, int w, uint16_t c) { fillRect(x, y, w, 1, c); }

static const Glyph *glyph(const Font &f, uint16_t cp) {
  for (uint16_t i = 0; i < f.count; i++)
    if (f.glyphs[i].cp == cp) return &f.glyphs[i];
  return nullptr;
}

// Decode one UTF-8 code point (only needs Latin-1 range, e.g. the degree sign).
static uint16_t nextCp(const char *&s) {
  uint8_t c = (uint8_t)*s++;
  if (c < 0x80) return c;
  if ((c & 0xE0) == 0xC0 && *s) return ((c & 0x1F) << 6) | ((uint8_t)*s++ & 0x3F);
  return '?';
}

int textWidth(const Font &f, const char *s) {
  int w = 0;
  while (*s) {
    const Glyph *g = glyph(f, nextCp(s));
    if (g) w += g->adv;
  }
  return w;
}

static inline uint16_t blend(uint16_t bg, uint16_t fg, uint8_t a /*0..15*/) {
  if (a == 0) return bg;
  if (a == 15) return fg;
  uint32_t rb = ((fg & 0xF81F) * a + (bg & 0xF81F) * (15 - a)) / 15;
  uint32_t g = ((fg & 0x07E0) * a + (bg & 0x07E0) * (15 - a)) / 15;
  return (rb & 0xF81F) | (g & 0x07E0);
}

void text(const Font &f, int x, int y, const char *s, uint16_t c, Align a) {
  if (a != LEFT) {
    int w = textWidth(f, s);
    x -= (a == CENTER) ? w / 2 : w;
  }
  while (*s) {
    const Glyph *g = glyph(f, nextCp(s));
    if (!g) continue;
    const uint8_t *bmp = f.bmp + g->off;
    int gx = x + g->xo, gy = y + g->yo;
    for (int j = 0; j < g->h; j++) {
      int py = gy + j;
      for (int i = 0; i < g->w; i++) {
        int idx = j * g->w + i;
        uint8_t byte = pgm_read_byte(bmp + (idx >> 1));
        uint8_t al = (idx & 1) ? (byte & 0x0F) : (byte >> 4);
        int px = gx + i;
        if (al && px >= 0 && px < SCREEN_W && py >= 0 && py < SCREEN_H) {
          uint16_t &d = fb[py * SCREEN_W + px];
          d = blend(d, c, al);
        }
      }
    }
    x += g->adv;
  }
}

void push() { gfx->draw16bitRGBBitmap(0, 0, fb, SCREEN_W, SCREEN_H); }

}  // namespace Display
