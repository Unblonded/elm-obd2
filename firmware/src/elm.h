// ELM327 protocol over Link: one command at a time, buffer until '>', ISO-TP decode.
// Port of js/elm.js. Only call from the OBD task (blocking).
#pragma once
#include <Arduino.h>
#include <string>
#include <vector>

struct Msg {
  std::string header;  // "7E8"
  std::vector<uint8_t> bytes;
  bool complete = true;
};

struct Resp {
  std::string cmd;
  std::vector<std::string> lines;  // cleaned (echo / SEARCHING removed)
  std::string error;               // "", "NO DATA", "?", "TIMEOUT", "CAN ERROR", ...
  std::vector<Msg> msgs;
  uint32_t ms = 0;
};

struct Reply {
  bool ok = false;
  std::vector<uint8_t> bytes;  // positive response payload (index 0 = SID+0x40)
  int nrc = -1;
  std::string error;
};

namespace Elm {
extern std::string header;  // current ATSH
extern bool noCountDigit;
extern uint32_t cmdCount;
extern std::string version;

Resp cmd(const std::string &c, uint32_t timeoutMs = 1200);
bool setHeader(const std::string &h);
// Send to header and match the positive response from responseId.
Reply request(const std::string &hdr, const std::string &req, const std::string &resp, bool single, uint32_t timeoutMs = 1200);
bool init();
void reset();
std::vector<Msg> decode(const std::vector<std::string> &lines);
const Msg *find(const std::vector<Msg> &msgs, const std::string &resp, uint8_t sid);
std::string hex(const uint8_t *b, size_t n);
}  // namespace Elm
