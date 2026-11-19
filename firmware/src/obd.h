// OBD task: adapter connection, polling, phone bridge, fault codes. Shared state for the UI.
#pragma once
#include <Arduino.h>
#include <string>
#include <vector>
#include "ble_link.h"

enum ValueId { V_RPM, V_SELECTOR, V_PROGRAM, V_GEAR, V_TRANS, V_OIL, V_COOLANT, V_FUEL, V_AMBIENT, V_BOOST,
               V_INTAKE, V_BATTERY, V_OUTSIDE, V_COUNT };

struct Live {
  volatile float value = 0;
  volatile bool has = false;
  volatile uint32_t ts = 0;
  volatile bool error = false;
};

enum class LinkState { Idle, Scanning, PickDevice, Connecting, Init, Live, Lost };

struct Fault {
  char code[10];
  char sub[3];
  uint8_t status;
  bool kwp;
  const char *text;
};

namespace Obd {
extern Live live[V_COUNT];
extern volatile LinkState state;
extern char statusText[48];
extern volatile float cmdPerSec;

void begin();

// UI -> task requests
void requestScan();
void pickDevice(int index);            // from the scan list
std::vector<Link::Found> devices();    // copy of last scan
void forgetDevice();
void requestReadFaults();
void requestClearFaults();
bool faultsBusy();
std::vector<Fault> faults(bool &read, std::string &err);

const char *selectorLetter();          // "P","R","N","D","M","-"
const char *programName();             // "Sport","Comfort","Agility","Manual",""
}  // namespace Obd
