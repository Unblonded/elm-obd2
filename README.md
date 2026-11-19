# CLS Live

Mobile PWA dashboard for live car data from a BLE ELM327 adapter via Web Bluetooth.
Built for a 2013 Mercedes CLS550 (W218, M278, 7G-Tronic / VGS-NAG2) on CAN 11-bit 500 kbps (`ATSP6`).
No backend, no build step – plain ES modules.

## Run / host

- **GitHub Pages:** Settings → Pages → Source: *GitHub Actions*. The workflow in `.github/workflows/pages.yml` deploys on push to `main`.
  (Or choose *Deploy from a branch* → root.)
- **Local:** `python3 -m http.server 8000` → `http://localhost:8000` (Web Bluetooth works on localhost).
- **Browsers:** Chrome desktop/Android. On iPhone use **Bluefy** (Safari has no Web Bluetooth).
- Install: browser menu → *Add to Home Screen*. Launches fullscreen with a dark UI and keeps the screen awake while connected.
- **Demo mode** (Settings) simulates an ELM327 + car for testing without hardware.

## How it works

| File | Role |
|---|---|
| `js/ble.js` | Chooser with `optionalServices` for FFF0 / FFE0 / 18F0 / E7810A71 UART clones, auto-detects write + notify characteristics, 20-byte write chunks, auto-reconnect with backoff |
| `js/elm.js` | One-at-a-time command queue, `\r` terminated, buffers until `>`, strips echo/spaces/`SEARCHING...`, classifies `NO DATA`, `?`, `STOPPED`, `CAN ERROR`, etc., ISO-TP reassembly (headers on or off), negative-response/NRC 0x78 handling, timeout recovery |
| `js/poller.js` | Priority + round-robin scheduler. Groups values sharing one request, prefers the current header to avoid `ATSH` churn, backs off on failures, global command rate cap |
| `js/config.js` | Default value definitions + formula engine |
| `js/dashboard.js` | RPM gauge, gear display, auto-generated tiles |
| `js/debug.js` | TX/RX log, terminal, byte inspector with change highlighting |

`ATSH` is only sent when the header changes, and it is inserted immediately before the request that needs it, so terminal commands can never cause a poll to go to the wrong ECU.
Init: `ATZ ATE0 ATL0 ATS0 ATH1 ATSP6` (+ optional `ATCAF1 ATAT1`); commands that answer `?` are skipped.

## Value config

Edit in **Settings** (JSON, saved to localStorage, export/import supported). Each value:

```json
{
  "id": "transTemp", "name": "Trans Temp", "display": "tile",
  "header": "7E1", "request": "2130", "responseId": "7E9",
  "byteOffsets": [18], "formula": "A-50", "unit": "°C",
  "pollRateHz": 1, "priority": 2, "warnAbove": 110, "critAbove": 125,
  "enabled": true, "verified": false
}
```

- **byteOffsets** index the reassembled response payload; **index 0 is the response service byte** (`41`, `61`, `62`).
  So for `21 30` → `61 30 …`, the selector is at index 9.
- **formula** vars: `A`–`H` (bytes at byteOffsets), `x` (=A), `bytes`, helpers `s8(a)`, `u16(h,l)`, `s16(h,l)`, `bit(v,n)`.
- **map** turns raw values into labels (`{"0x0A":"P"}`); **validRange** hides out-of-range values.
- **display**: `gauge`, `gear-selector`, `gear-number`, `tile`.
- Values with the same header + request + responseId share a single request (selector, gear and trans temp all come from one `21 30`).
- `headerInit` sends commands once per connection when a header is first used, e.g. `{"7E1": ["1081"]}` for a diagnostic session.
- `useCRA` adds an `ATCRA` receive filter (auto-disabled if the clone returns `?`).

Defaults marked **UNVERIFIED** (engaged gear offset, trans temp, oil temp) are placeholders – find the real ones on the car.

## Finding unknown offsets (Debug tab)

1. Type `@7E1 2130` (sets header 7E1 if needed, then sends `2130`). `;` chains commands.
2. Tick **Repeat every 500 ms**. Bytes are shown with their index; bytes that changed since the last response are highlighted.
3. Shift through gears / let the car warm up and watch which index moves. Put that index into `byteOffsets`.
4. Try other local IDs (`2131`, `2132`, … on 7E1; `21xx` / `22xxxx` on 7E0) for oil temperature.

Pause polling while exploring if you want a clean log.

## Mercedes CBF reference

`docs/med177-engine.md` and `docs/vgsnag2-transmission.md` list every data request the engine (MED17.7)
and transmission (VGS-NAG2) ECUs define, with byte offsets and formulas in this app's syntax, ready to paste into Settings.
They were generated from the Mercedes `.cbf` files with `tools/cbf_to_md.py` (a Python port of the relevant parts of
[CaesarSuite](https://github.com/jglim/CaesarSuite), MIT). `.cbf` files themselves are not committed.

Some transmission requests list more than one layout (different transmission variants share a request); the
standard NAG2 layout for `21 30` is: byte 9 selector, 10 drive program, 12 actual/target gear (low/high nibble), 13 oil temp (A-50).
