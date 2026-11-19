// AXS5106L capacitive touch (I2C 0x63). Read logic adapted from
// andreimagic/ESP32_C6_Touch_LCD_1_47_LVGL_Animated_Clock (MIT) / Waveshare demo.
#pragma once
#include <Arduino.h>

namespace Touch {
void begin();
// Call every loop; returns true once per tap (finger released) with its coordinates
// in landscape screen space. longPress is set when the finger was held > 700 ms.
bool tap(int &x, int &y, bool &longPress);
}  // namespace Touch
