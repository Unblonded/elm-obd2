#include "elm.h"
#include "ble_link.h"

namespace Elm {

std::string header;
bool noCountDigit = false;
uint32_t cmdCount = 0;
std::string version;

static std::string norm(const std::string &s) {
  std::string o;
  for (char c : s) if (!isspace((unsigned char)c)) o += toupper(c);
  return o;
}

static bool startsWith(const std::string &s, const char *p) { return s.rfind(p, 0) == 0; }

static const char *classify(const std::string &l) {
  if (startsWith(l, "NO DATA")) return "NO DATA";
  if (l == "?") return "?";
  if (startsWith(l, "STOPPED")) return "STOPPED";
  if (l.find("CAN ERROR") != std::string::npos) return "CAN ERROR";
  if (l.find("UNABLE TO CONNECT") != std::string::npos) return "UNABLE TO CONNECT";
  if (l.find("BUFFER FULL") != std::string::npos) return "BUFFER FULL";
  if (l.find("BUS ERROR") != std::string::npos) return "BUS ERROR";
  if (l.find("BUS BUSY") != std::string::npos) return "BUS BUSY";
  if (l.find("DATA ERROR") != std::string::npos) return "DATA ERROR";
  if (l.find("RX ERROR") != std::string::npos) return "RX ERROR";
  if (startsWith(l, "ERR")) return "ERROR";
  return nullptr;
}

Resp cmd(const std::string &c, uint32_t timeoutMs) {
  Resp r;
  r.cmd = c;
  uint32_t t0 = millis();
  Link::flushRx();
  std::string out = c + "\r";
  if (!Link::write(out.data(), out.size())) { r.error = "WRITE"; return r; }
  cmdCount++;
  std::string buf;
  char tmp[128];
  bool prompt = false;
  while (millis() - t0 < timeoutMs) {
    size_t n = Link::read(tmp, sizeof(tmp), 20);
    for (size_t i = 0; i < n; i++) {
      if (tmp[i] == '>') { prompt = true; break; }
      buf += tmp[i];
    }
    if (prompt) break;
    if (!Link::connected()) { r.error = "DISCONNECTED"; return r; }
  }
  r.ms = millis() - t0;
  if (!prompt) {
    // interrupt the ELM and wait for its prompt so the next command starts clean
    Link::write("\r", 1);
    uint32_t t1 = millis();
    while (millis() - t1 < 800) {
      size_t n = Link::read(tmp, sizeof(tmp), 20);
      bool p = false;
      for (size_t i = 0; i < n; i++) if (tmp[i] == '>') p = true;
      if (p) break;
    }
    r.error = "TIMEOUT";
  }
  // split lines
  std::string line;
  std::string nc = norm(c);
  bool first = true;
  auto flush = [&]() {
    size_t a = line.find_first_not_of(" \t"), b = line.find_last_not_of(" \t");
    std::string t = a == std::string::npos ? "" : line.substr(a, b - a + 1);
    line.clear();
    if (t.empty()) return;
    if (first && norm(t) == nc) { first = false; return; }  // echo
    first = false;
    if (startsWith(t, "SEARCHING") || startsWith(t, "BUS INIT")) return;
    r.lines.push_back(t);
  };
  for (char ch : buf) {
    if (ch == '\r' || ch == '\n') flush();
    else line += ch;
  }
  flush();
  std::vector<std::string> data;
  const char *firstErr = nullptr;
  for (auto &l : r.lines) {
    const char *e = classify(l);
    if (e) { if (!firstErr) firstErr = e; }
    else data.push_back(l);
  }
  if (r.error.empty() && data.empty() && firstErr) r.error = firstErr;
  if (r.error.empty() && data.empty() && !startsWith(nc, "AT")) r.error = "EMPTY";
  if (!startsWith(nc, "AT")) r.msgs = decode(data);
  // track header changes made by anyone (incl. the phone)
  if (startsWith(nc, "ATSH")) header = (r.error.empty() && !firstErr) ? nc.substr(4) : "";
  if (startsWith(nc, "ATZ") || startsWith(nc, "ATD") || startsWith(nc, "ATWS")) header = "";
  return r;
}

static int hv(char c) {
  if (c >= '0' && c <= '9') return c - '0';
  c = toupper(c);
  if (c >= 'A' && c <= 'F') return c - 'A' + 10;
  return -1;
}

std::vector<Msg> decode(const std::vector<std::string> &lines) {
  std::vector<Msg> msgs;
  struct Pend { size_t idx; size_t len; };
  std::vector<std::pair<std::string, Pend>> pending;
  for (auto &l0 : lines) {
    std::string l = norm(l0);
    bool hexOnly = !l.empty();
    for (char c : l) if (hv(c) < 0) hexOnly = false;
    if (!hexOnly) continue;
    size_t hLen = (l.size() % 2) ? 3 : 8;
    if (l.size() < hLen + 2) continue;
    std::string hdr = l.substr(0, hLen);
    std::vector<uint8_t> b;
    for (size_t i = hLen; i + 1 < l.size(); i += 2) b.push_back(hv(l[i]) * 16 + hv(l[i + 1]));
    uint8_t type = b[0] >> 4;
    if (type == 0) {
      size_t len = b[0] & 0x0F;
      Msg m;
      m.header = hdr;
      m.bytes.assign(b.begin() + 1, b.begin() + 1 + std::min(len, b.size() - 1));
      m.complete = b.size() - 1 >= len;
      msgs.push_back(m);
    } else if (type == 1 && b.size() >= 2) {
      size_t len = ((b[0] & 0x0F) << 8) | b[1];
      Msg m;
      m.header = hdr;
      m.bytes.assign(b.begin() + 2, b.end());
      m.complete = false;
      msgs.push_back(m);
      pending.erase(std::remove_if(pending.begin(), pending.end(), [&](auto &p) { return p.first == hdr; }), pending.end());
      pending.push_back({hdr, {msgs.size() - 1, len}});
    } else if (type == 2) {
      for (auto &p : pending) {
        if (p.first != hdr) continue;
        Msg &m = msgs[p.second.idx];
        m.bytes.insert(m.bytes.end(), b.begin() + 1, b.end());
        if (m.bytes.size() >= p.second.len) { m.bytes.resize(p.second.len); m.complete = true; }
        break;
      }
    }
  }
  return msgs;
}

const Msg *find(const std::vector<Msg> &msgs, const std::string &resp, uint8_t sid) {
  for (auto &m : msgs) {
    if (!resp.empty() && m.header != resp) continue;
    if (!m.bytes.empty() && m.bytes[0] == sid) return &m;
  }
  return nullptr;
}

bool setHeader(const std::string &h) {
  if (h.empty() || h == header) return true;
  Resp r = cmd("ATSH" + h);
  return r.error.empty() && header == h;
}

Reply request(const std::string &hdr, const std::string &req, const std::string &resp, bool single, uint32_t timeoutMs) {
  Reply out;
  if (!setHeader(hdr)) { out.error = "ATSH"; return out; }
  bool useCount = single && !noCountDigit;
  Resp r = cmd(useCount ? req + "1" : req, timeoutMs);
  if (useCount && r.error == "?") {
    noCountDigit = true;
    r = cmd(req, timeoutMs);
  }
  if (!r.error.empty()) { out.error = r.error; return out; }
  uint8_t sid = hv(req[0]) * 16 + hv(req[1]);
  size_t echo = (sid == 0x22) ? 2 : (req.size() >= 4 ? 1 : 0);
  for (auto &m : r.msgs) {
    if (!resp.empty() && m.header != resp) continue;
    auto &b = m.bytes;
    if (b.size() >= 3 && b[0] == 0x7F && b[1] == sid) {
      if (b[2] == 0x78) continue;
      out.nrc = b[2];
      continue;
    }
    if (b.empty() || b[0] != (uint8_t)(sid + 0x40)) continue;
    bool echoOk = true;
    for (size_t i = 1; i <= echo && 2 * i + 1 < req.size() + 1; i++) {
      if (i >= b.size() || b[i] != hv(req[2 * i]) * 16 + hv(req[2 * i + 1])) echoOk = false;
    }
    if (!echoOk) continue;
    out.ok = true;
    out.bytes = b;
    return out;
  }
  out.error = out.nrc >= 0 ? "NRC" : "NO MATCH";
  return out;
}

void reset() { header.clear(); }

bool init() {
  reset();
  struct Step { const char *c; uint32_t t; uint32_t delayAfter; };
  static const Step steps[] = {
    {"ATZ", 4000, 500}, {"ATE0", 1200, 0}, {"ATL0", 1200, 0}, {"ATS0", 1200, 0},
    {"ATH1", 1200, 0}, {"ATSP6", 1200, 0}, {"ATCAF1", 1200, 0}, {"ATAT1", 1200, 0},
  };
  for (auto &s : steps) {
    Resp r = cmd(s.c, s.t);
    if (r.error == "DISCONNECTED" || r.error == "WRITE") return false;
    if (std::string(s.c) == "ATZ")
      for (auto &l : r.lines) if (l.find("ELM") != std::string::npos) version = l;
    if (!r.error.empty()) Serial.printf("[ELM] %s -> %s (skipped)\n", s.c, r.error.c_str());
    if (s.delayAfter) delay(s.delayAfter);
  }
  setHeader("7DF");
  Resp w = cmd("0100", 6000);
  Serial.printf("[ELM] wake 0100 -> %s\n", w.error.empty() ? "ok" : w.error.c_str());
  return Link::connected();
}

std::string hex(const uint8_t *b, size_t n) {
  static const char *H = "0123456789ABCDEF";
  std::string s;
  for (size_t i = 0; i < n; i++) { s += H[b[i] >> 4]; s += H[b[i] & 15]; }
  return s;
}

}  // namespace Elm
