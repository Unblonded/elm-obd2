# CLS Live firmware – Waveshare ESP32-C6-Touch-LCD-1.47

The ESP32-C6 connects to the BLE ELM327 adapter itself and shows the dash on its 1.47" screen.
It also acts as a **hub**: it advertises as `CLS-Live` with the same UART service as an ELM clone, so the
web app on your phone can connect to the display instead of the adapter (the adapter allows only one
connection). Phone commands are forwarded to the car between the display's own polls.

## Flash (no tools needed)

1. Plug the board into your Mac/PC with USB-C.
2. Download [`dist/cls-live-esp32c6.bin`](dist/cls-live-esp32c6.bin).
3. Open https://espressif.github.io/esptool-js/ in Chrome, **Connect**, pick the USB serial port.
   (If it won't connect: hold **BOOT**, tap **RESET**, release BOOT, connect again.)
4. Flash address `0x0`, choose the .bin, **Program**. Press **RESET** when done.

Or with PlatformIO: `cd firmware && pio run -t upload && pio device monitor`.

## Use

- On first start it scans and auto-connects to the first adapter that looks like an OBD dongle and remembers it.
  If it can't decide, the **Link** page lists nearby devices – tap yours.
- Tap the right side of the screen for the next page, left third for the previous page (or press BOOT).
  Pages: **Drive** (RPM + gear/program) · **Gauges** (oil, trans, boost, fuel) · **Engine** (coolant, intake, oil
  pressure, battery) · **Faults** (READ / CLEAR, tap CLEAR twice to confirm) · **Link** (adapter, rescan, brightness).
- Values keep their last reading if data drops out; glitches (out of range / sudden jumps) are ignored.
- Serial log at 115200 baud shows the adapter connection and init.

## Notes

- Engine values are batched into one UDS request (`22 2000 2077 …`), transmission values come from `21 30`.
  Same definitions as the web app (from the Mercedes CBF files).
- `tools/gen_assets.py` regenerates the fonts and fault-code texts (`src/fonts.h`, `src/dtc_text.h`).
- Panel init and touch read are adapted from andreimagic/ESP32_C6_Touch_LCD_1_47_LVGL_Animated_Clock (MIT),
  based on Waveshare's demo. Fonts: DejaVu Sans.
