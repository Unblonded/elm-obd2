// BLE: client to the ELM327 adapter + UART server for the phone (hub mode).
#pragma once
#include <Arduino.h>
#include <string>
#include <vector>

namespace Link {

struct Found {
  std::string name, addr;
  uint8_t type;
  int rssi;
  bool likely;  // advertises a known UART service or has an OBD-ish name
};

void begin(const char *deviceName);

// ---- adapter (we are the BLE central) ----
std::vector<Found> scan(uint32_t ms);
bool connect(const std::string &addr, uint8_t type, std::string &err);
bool connected();
void disconnect();
bool write(const char *s, size_t n);
size_t read(char *buf, size_t max, uint32_t waitMs);  // bytes from adapter notifications
void flushRx();
const std::string &adapterName();

// ---- phone (we are a peripheral exposing FFE0/FFE1 like an ELM clone) ----
bool phoneConnected();
bool phoneLine(std::string &out);  // next complete '\r'-terminated command, non-blocking
void phoneSend(const std::string &s);

}  // namespace Link
