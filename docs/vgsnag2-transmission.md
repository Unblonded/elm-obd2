# VGS-NAG2 (7G-Tronic) data reference

Extracted from the Mercedes CBF diagnostic description. Send to header `7E1`, response from `7E9`.
Byte offsets use the app convention (index 0 = positive response SID). Formulas are in the app's formula syntax.

| request | bytes | formula | unit | name | values |
|---|---|---|---|---|---|
| `1A87` | 3 | `A` |  | DCX-Identifikation: Lieferantenkennung | 0=*; 1=Becker; 2=Blaupunkt; 3=Bosch; 4=MB; 5=HuF; 6=Kammerer; 7=Kostal; 8=Siemens; 9=Stribel; 10=MicroHeat; 11=JATCO; 16=SWF; 17=VDO; 18=Webasto; 19=Dornier; 20=TEG; 21=Hella; 22=Lucas; 23=GKR |
| `1A87` | 4 | `bit(A,7)` |  | DCX-Identifikation: Produktion/Entwicklungsstatus | 0=in Serienproduktion; 1=in Entwicklung |
| `1A87` | 4 | `((A>>0)&127)` |  | DCX-Identifikation: Steuergeräte-Identifikation |  |
| `1A87` | 5 | `A` |  | DCX-Identifikation: Diagnosekennung |  |
| `1A87` | 7,8 | `u16(A,B)` |  | DCX-Identifikation: Hardware-Version |  |
| `1A89` | 2,3,4,5 | `(u16(A,B)*65536+u16(C,D))` |  | Software-Schiene: lesen |  |
| `1A97` | 2,3,4,5 | `(u16(A,B)*65536+u16(C,D))` |  | CVN: lesen |  |
| `1A9C` | 3 | `A` |  | ECU Code Software ID: Lieferantenkennung |  |
| `1A9C` | 4 | `bit(A,7)` |  | ECU Code Software ID: Produktion/Entwicklungsstatus | 0=Produktion; 1=Entwicklung |
| `1A9C` | 4 | `((A>>0)&127)` |  | ECU Code Software ID: Steuergeräte-Identifikation |  |
| `1A9C` | 5,6 | `u16(A,B)` |  | ECU Code Software ID: Diagnose-Version |  |
| `1A9D` | 3 | `A` |  | ECU Code Data ID: Lieferantenkennung |  |
| `1A9D` | 4 | `bit(A,7)` |  | ECU Code Data ID: Produktion/Entwicklungsstatus | 0=Produktion; 1=Entwicklung |
| `1A9D` | 4 | `((A>>0)&127)` |  | ECU Code Data ID: Steuergeräte-Identifikation |  |
| `1A9D` | 5,6 | `u16(A,B)` |  | ECU Code Data ID: Diagnose-Version |  |
| `2130` | 2,3 | `u16(A,B)` | 1/min | End of line Test: Wandlerschlupfdrehzahl |  |
| `2130` | 2,3 | `u16(A,B)` | 1/min | End of line Test: Ist-Differenzdrehzahl NAK |  |
| `2130` | 4,5 | `u16(A,B)` | 1/min | End of line Test: DrehzahldifferenzSoll |  |
| `2130` | 4 | `A` | 1/min | End of line Test: Soll-Drehzahldifferenz NAK |  |
| `2130` | 5 | `A*0.04-1.5` | bar | End of line Test: Sollvorsteuerdruck NAK |  |
| `2130` | 6,7 | `u16(A,B)` | mbar | End of line Test: Solldruck Kueb |  |
| `2130` | 6 | `A*0.04-1.5` | bar | End of line Test: Istvorsteuerdruck NAK |  |
| `2130` | 7 | `A*2-50` | °C | End of line Test: Lamellentemperatur der NAK |  |
| `2130` | 8 | `A` |  | End of line Test: Ueberbrueckungskupplungs Status | 0=offen; 1=offen -> schlupfend; 2=schlupfend -> offen; 3=schlupfend; 4=schlupfend -> geschlossen; 5=geschlossen -> schlupfend; 6=geschlossen |
| `2130` | 8 | `A` |  | End of line Test: Funktionsstatus NAK | 0=FKO_ST_START; 1=FKO_ST_R_ESS; 2=FKO_ST_PN_ESS; 3=FKO_ST_D_ESS; 4=FKO_ST_KRI; 5=FKO_ST_STS; 6=FKO_ST_ANF; 7=FKO_ST_ANH; 8=FKO_ST_SRS; 9=FKO_ST_KWS; 10=FKO_ST_ZUS; 11=FKO_ST_SKN; 12=FKO_ST_DIR |
| `2130` | 9 | `A` |  | End of line Test: Wählhebel intern | 0=Initialwert; 1=1; 2=2; 3=3; 4=4; 5=5; 6=6; 7=D; 8=N; 9=R; 10=P; 11=N-D; 12=R-N; 13=P-R; 99=Minus; 101=Plus; 249=over D; 250=over P; 255=inaktiv |
| `2130` | 10 | `A` |  | End of line Test: Fahrprogramm | 0=Standard; 1=Comfort; 2=Agility; 3=Manuell |
| `2130` | 11 | `A` |  | End of line Test: Gangerkennung | 0=inaktiv; 1=1. Gang; 2=2. Gang; 3=3. Gang; 4=4. Gang; 5=5. Gang; 6=6. Gang; 7=7. Gang; 9=1. Rückwärtsgang; 10=2. Rückwärtsgang; 11=3. Rückwärtsgang; 88=in Berechnung; 255=unplausibel |
| `2130` | 12 | `((A>>0)&15)` |  | End of line Test: Istgang | 0=Neutral; 1=1. Gang; 2=2. Gang; 3=3. Gang; 4=4. Gang; 5=5. Gang; 6=6. Gang; 7=7. Gang; 8-9=not defined; 10=3. Rückwärtsgang; 11=1. Rückwärtsgang; 12=2. Rückwärtsgang; 13=P; 14=kraftfrei; 15=Signal nicht vorhanden |
| `2130` | 12 | `((A>>4)&15)` |  | End of line Test: Zielgang | 0=Neutral; 1=1.Gang; 2=2.Gang; 3=3.Gang; 4=4.Gang; 5=5.Gang; 6=6.Gang; 7=7.Gang; 8-9=not defined; 10=3.Rückwärtsgang; 11=1.Rückwärtsgang; 12=2.Rückwärtsgang; 13=Parkposition; 14=kraftfrei; 15=Signal nicht vorhanden |
| `2130` | 13 | `A-50` | °C | End of line Test: Getriebeöltemperatur |  |
| `2130` | 14,15 | `s16(A,B)` | Nm | End of line Test: Motormoment |  |
| `2130` | 16,17 | `s16(A,B)` | Nm | End of line Test: gewandeltes Moment |  |
| `2130` | 18,19 | `u16(A,B)` | 1/min | End of line Test: Abtriebsdrehzahl, gefiltert |  |
| `2130` | 20 | `bit(A,7)` |  | End of line Test: Funktionsmode | 0=nein; 1=ja |
| `2130` | 20 | `bit(A,1)` |  | End of line Test: Kueb Offen Anforderung | 0=aus; 1=ein |
| `2130` | 20 | `bit(A,0)` |  | End of line Test: Kueb i O | 0=aus; 1=ein |
| `2130` | 20 | `bit(A,5)` |  | End of line Test: Lenkradtaster MINUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 20 | `bit(A,4)` |  | End of line Test: Lenkradtaster PLUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 20 | `bit(A,6)` |  | End of line Test: Null-Last Schaltung | 0=nein; 1=ja |
| `2130` | 20 | `bit(A,2)` |  | End of line Test: Anlassfreigabe | 0=nicht aktiv; 1=aktiv |
| `2130` | 20 | `bit(A,3)` |  | End of line Test: Grundschaltprogramm | 0=fehlerhaft; 1=ok |
| `2130` | 20 | `bit(A,1)` |  | End of line Test: Kueb aktiv | 0=aus; 1=ein |
| `2130` | 20 | `bit(A,0)` |  | End of line Test: Kueb geprüft | 0=aus; 1=ein |
| `2130` | 20 | `bit(A,4)` |  | End of line Test: Offroad | 0=nicht aktiv; 1=aktiv |
| `2130` | 20 | `bit(A,5)` |  | End of line Test: Tippschalter MINUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 20 | `bit(A,6)` |  | End of line Test: Tippschalter PLUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 20 | `bit(A,1)` |  | End of line Test: Drucksensor abgeglichen | 0=aus; 1=ein |
| `2130` | 20 | `bit(A,0)` |  | End of line Test: Touchpoint Init abgeschlossen | 0=aus; 1=ein |
| `2130` | 20 | `bit(A,7)` |  | End of line Test: Tp_adaptiert | 0=nein; 1=ja |
| `2130` | 20 | `bit(A,6)` |  | End of line Test: Tippschalter PLUS 1 | 0=nicht betätigt; 1=betätigt |
| `2130` | 21 | `bit(A,5)` |  | End of line Test: Anlassfreigabe | 0=nicht aktiv; 1=aktiv |
| `2130` | 21 | `bit(A,4)` |  | End of line Test: Grundschaltprogramm | 0=fehlerhaft; 1=ok |
| `2130` | 21 | `bit(A,6)` |  | End of line Test: Kueb aktiv | 0=aus; 1=ein |
| `2130` | 21 | `bit(A,7)` |  | End of line Test: Kueb geprüft | 0=aus; 1=ein |
| `2130` | 21 | `bit(A,2)` |  | End of line Test: Tippschalter MINUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 21 | `bit(A,1)` |  | End of line Test: Tippschalter PLUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 21 | `bit(A,0)` |  | End of line Test: Funktionsmode | 0=nein; 1=ja |
| `2130` | 21 | `bit(A,6)` |  | End of line Test: Kueb Offen Anforderung | 0=aus; 1=ein |
| `2130` | 21 | `bit(A,7)` |  | End of line Test: Kueb i O | 0=aus; 1=ein |
| `2130` | 21 | `bit(A,2)` |  | End of line Test: Lenkradtaster MINUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 21 | `bit(A,3)` |  | End of line Test: Lenkradtaster PLUS | 0=nicht betätigt; 1=betätigt |
| `2130` | 21 | `bit(A,1)` |  | End of line Test: Null-Last Schaltung | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,5)` |  | End of line Test: Anf. Neutral | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,2)` |  | End of line Test: Freigabeschaltung | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,4)` |  | End of line Test: Hochschaltung laeuft | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,7)` |  | End of line Test: Kickdown | 0=nicht aktiv; 1=aktiv |
| `2130` | 22 | `bit(A,6)` |  | End of line Test: Neutral halten | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,3)` |  | End of line Test: Rueckschaltung laeuft | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,0)` |  | End of line Test: Ueberhoehungsschaltung | 0=nicht aktiv; 1=aktiv |
| `2130` | 22 | `bit(A,4)` |  | End of line Test: Dynamikbit ME vorhalt | 0=nicht aktiv; 1=aktiv |
| `2130` | 22 | `bit(A,5)` |  | End of line Test: Dynamikbit Motoreingriff | 0=nicht aktiv; 1=aktiv |
| `2130` | 22 | `bit(A,7)` |  | End of line Test: Fehler aktuell | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,3)` |  | End of line Test: Knallstart | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,0)` |  | End of line Test: Lastwechsel | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,2)` |  | End of line Test: ME Reduktionsanforderung | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,1)` |  | End of line Test: ME einfrieren | 0=nein; 1=ja |
| `2130` | 22 | `bit(A,6)` |  | End of line Test: Notlauf | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,3)` |  | End of line Test: Dynamikbit ME vorhalt | 0=nicht aktiv; 1=aktiv |
| `2130` | 23 | `bit(A,2)` |  | End of line Test: Dynamikbit Motoreingriff | 0=nicht aktiv; 1=aktiv |
| `2130` | 23 | `bit(A,0)` |  | End of line Test: Fehler aktuell | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,4)` |  | End of line Test: Knallstart | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,7)` |  | End of line Test: Lastwechsel | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,5)` |  | End of line Test: ME Reduktionsanforderung | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,6)` |  | End of line Test: ME einfrieren | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,1)` |  | End of line Test: Notlauf | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,2)` |  | End of line Test: Anf. Neutral | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,5)` |  | End of line Test: Freigabeschaltung | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,3)` |  | End of line Test: Hochschaltung laeuft | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,0)` |  | End of line Test: Kickdown | 0=nicht aktiv; 1=aktiv |
| `2130` | 23 | `bit(A,1)` |  | End of line Test: Neutral halten | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,4)` |  | End of line Test: Rueckschaltung laeuft | 0=nein; 1=ja |
| `2130` | 23 | `bit(A,7)` |  | End of line Test: Ueberhoehungsschaltung | 0=nicht aktiv; 1=aktiv |
| `2131` | 2,3 | `u16(A,B)` | 1/min | Drehzahlen: Drehzahl Rad 2 |  |
| `2131` | 4,5 | `u16(A,B)` | 1/min | Drehzahlen: Abtriebsdrehzahl_ungefiltert |  |
| `2131` | 6,7 | `u16(A,B)` | 1/min | Drehzahlen: Turbinendrehzahl |  |
| `2131` | 8,9 | `u16(A,B)` | 1/min | Drehzahlen: Motordrehzahl |  |
| `2131` | 10,11 | `u16(A,B)` | 1/min | Drehzahlen: N Rad VL |  |
| `2131` | 12,13 | `u16(A,B)` | 1/min | Drehzahlen: N Rad VR |  |
| `2131` | 14,15 | `u16(A,B)` | 1/min | Drehzahlen: N Rad HL |  |
| `2131` | 16,17 | `u16(A,B)` | 1/min | Drehzahlen: N Rad HR |  |
| `2131` | 18,19 | `u16(A,B)*0.1` | km/h | Drehzahlen: Geschwindigkeit h |  |
| `2131` | 20,21 | `u16(A,B)*0.1` | km/h | Drehzahlen: Geschwindigkeit v |  |
| `2132` | 2 | `A` | % | Wahlprogramme: Pedalwert |  |
| `2132` | 3,4 | `u16(A,B)` | 1/min | Wahlprogramme: Schaltlinienverschiebung Hochschaltung |  |
| `2132` | 5,6 | `u16(A,B)` | 1/min | Wahlprogramme: Schaltlinienverschiebung Rückschaltung |  |
| `2132` | 7 | `A` | % | Wahlprogramme: Schaltlinienverschiebung Pedalwert |  |
| `2132` | 8,9 | `u16(A,B)*0.001` | % | Wahlprogramme: Steigung |  |
| `2132` | 12 | `A` |  | Wahlprogramme: kleinster zu fahrender Gang | 0=Initwert; 1=min. 1. Gang; 2=min. 2. Gang; 3=min. 3. Gang; 4=min. 4. Gang; 5=min. 5. Gang; 6=min. 6. Gang; 7=min. 7. Gang |
| `2132` | 13 | `A` |  | Wahlprogramme: höchster zu fahrender Gang | 0=Initwert; 1=max 1. Gang; 2=max 2. Gang; 3=max 3. Gang; 4=max 4. Gang; 5=max 5. Gang; 6=max 6. Gang; 7=max 7. Gang |
| `2132` | 14,15 | `u16(A,B)*0.1` | km/h | Wahlprogramme: Geschwindigkeit v |  |
| `2133` | 2,3 | `u16(A,B)` | mbar | Ventile: Druck K1 |  |
| `2133` | 4,5 | `u16(A,B)` | mbar | Ventile: Druck B1 |  |
| `2133` | 6,7 | `u16(A,B)` | mbar | Ventile: Druck B3 |  |
| `2133` | 8,9 | `u16(A,B)` | mbar | Ventile: Druck K3 |  |
| `2133` | 10,11 | `u16(A,B)` | mbar | Ventile: Druck K2 |  |
| `2133` | 12,13 | `u16(A,B)` | mbar | Ventile: Druck B2/BR |  |
| `2133` | 14,15 | `u16(A,B)` | mbar | Ventile: Arbeitsdruck |  |
| `2133` | 16,17 | `u16(A,B)` | mbar | Ventile: Druck KüB |  |
| `2134` | 2,3 | `u16(A,B)*0.025` | V | Spannungen: Batteriespannung |  |
| `2134` | 2,3 | `u16(A,B)*0.001` | V | Spannungen_VGS3: Batteriespannung |  |
| `2134` | 4,5 | `u16(A,B)*0.0075` | V | Spannungen: Getriebesensoren-Versorgungsspannung |  |
| `2134` | 4,5 | `u16(A,B)*0.001` | V | Spannungen_VGS3: Versorgung Drehzahlsensoren |  |
| `2134` | 6,7 | `u16(A,B)*0.001` | V | Spannungen: Positive PLCD-Spannung |  |
| `2134` | 6,7 | `u16(A,B)*0.001` | V | Spannungen_VGS3: Versorgung Drucksensor |  |
| `2134` | 8,9 | `u16(A,B)*0.001` | V | Spannungen: Negative PLCD-Spannung |  |
| `2134` | 8,9 | `u16(A,B)*0.024414` | % | Spannungen_VGS3: WBS-Position(roh) |  |
| `2134` | 10 | `A` |  | Spannungen: Gangwahlsensor gefiltert |  |
| `2134` | 10 | `A` |  | Spannungen_VGS3: Gangwahlsensor Rohsignal | 0=Initialwert; 1=1; 2=2; 3=3; 4=4; 5=5; 6=6; 7=D; 8=N; 9=R; 10=P; 11=N-D; 12=R-N; 13=P-R; 99=Minus; 101=Plus; 249=over D; 250=over P; 255=inaktiv |
| `2134` | 11 | `A` |  | Spannungen: Gangwahlsensor Rohsignal |  |
| `2134` | 11,12 | `s16(A,B)*0.1` | °C | Spannungen_VGS3: Getriebeöltemperatur |  |
| `2134` | 12 | `A-50` | °C | Spannungen: Getriebeöltemperatur |  |
| `2135` | 2 | `bit(A,7)` |  | CAN-Input: driving programm | 0=aus; 1=ein |
| `2135` | 2 | `bit(A,6)` |  | CAN-Input: driving programm button | 0=aus; 1=ein |
| `2135` | 2 | `bit(A,4)` |  | CAN-Input: elctric lock energized | 0=aus; 1=ein |
| `2135` | 2 | `bit(A,5)` |  | CAN-Input: kick down | 0=aus; 1=ein |
| `2135` | 3 | `A-50` | °C | CAN-Input: engine coolant temperature |  |
| `2140` | 2,3 | `u16(A,B)` | km | CAN km-Zaehler: lesen | 0-65534=; 65535=Signal nicht vorhanden |
| `2160` | 2,3 | `u16(A,B)` |  | Betriebsmodus: aktuell | 0=Fehler lesen; 1=Normal; 4=Rolle; 8=Slave; 64=Notlauf; 1024=Transportschutz gesetzt |
| `217A` | 2 | `A` |  | Mode $0A aktivieren: MODE_A_aktivieren | 0=aus; 1-255=ein |
| `21B0` | 2,3,4,5 | `(u16(A,B)*65536+u16(C,D))` |  | VARKENN LESEN |  |
| `21D2` | 5 | `A` |  | HEFIBLOCK: Prüfergebnis SP lesen | 0=ungeprueft; 1=i O; 2=n i O |
| `21D2` | 6 | `A` |  | HEFIBLOCK: Prüfergebnis FL lesen | 0=ungeprueft; 1=i O; 2=n i O |
| `21D2` | 7 | `A` |  | HEFIBLOCK: Prüfergebnis AG lesen | 0=ungeprueft; 1=i O; 2=n i O |
| `21D2` | 8 | `A` |  | HEFIBLOCK: Anzahl der Prüfungen SP lesen |  |
| `21D2` | 9 | `A` |  | HEFIBLOCK: Anzahl der Flashungen FL lesen |  |
| `21D2` | 10 | `A` |  | HEFIBLOCK: Anzahl der Prüfungen AG lesen |  |
| `21D2` | 14,15 | `u16(A,B)` |  | HEFIBLOCK: Prüfzeit SP lesen |  |
| `21D2` | 19,20 | `u16(A,B)` |  | HEFIBLOCK: Prüfzeit FL lesen |  |
| `21D2` | 24,25 | `u16(A,B)` |  | HEFIBLOCK: Prüfzeit AG lesen |  |
| `21D2` | 26 | `A` |  | HEFIBLOCK: Stationsnummer SP lesen |  |
| `21D2` | 27 | `A` |  | HEFIBLOCK: Stationsnummer FL lesen |  |
| `21D2` | 28 | `A` |  | HEFIBLOCK: Stationsnummer AG lesen |  |
| `21D2` | 29 | `A` |  | HEFIBLOCK: Abbruchgrund SP lesen |  |
| `21D2` | 30 | `A` |  | HEFIBLOCK: Abbruchgrund FL lesen |  |
| `21D2` | 31 | `A` |  | HEFIBLOCK: Abbruchgrund AG lesen |  |
| `21D2` | 32,33,34,35 | `(u16(A,B)*65536+u16(C,D))` |  | HEFIBLOCK: Fortschrittszahl FL lesen |  |
| `21D2` | 36,37,38,39 | `(u16(A,B)*65536+u16(C,D))` |  | HEFIBLOCK: Fortschrittszahl AG lesen |  |
| `21D2` | 40,41,42,43 | `(u16(A,B)*65536+u16(C,D))` |  | HEFIBLOCK: Prüfvorschrift Versionskennung SP lesen |  |
| `21D2` | 44,45,46,47 | `(u16(A,B)*65536+u16(C,D))` |  | HEFIBLOCK: Prüfvorschrift Versionskennung FL lesen |  |
| `21D2` | 48,49,50,51 | `(u16(A,B)*65536+u16(C,D))` |  | HEFIBLOCK: Prüfvorschrift Versionskennung AG lesen |  |
| `21D2` | 52 | `A` |  | HEFIBLOCK: Konstruktionsstand HW SP lesen |  |
| `21D2` | 53 | `A` |  | HEFIBLOCK: Konstruktionsstand HW AG lesen |  |
| `21DA` | 2 | `A` |  | Schaltqualitaet: Note 1-2-3 Anzahl Schaltungen/ATZ Buffer 1 |  |
| `21DA` | 3 | `A` |  | Schaltqualitaet: Note 4-5 Anzahl Schaltungen/ATZ Buffer 1 |  |
| `21DA` | 4 | `A*4` |  | Schaltqualitaet: Note 6 Anzahl Schaltungen/ATZ Buffer 1 |  |
| `21DA` | 5 | `A*10` |  | Schaltqualitaet: Note 7 Anzahl Schaltungen/ATZ Buffer 1 |  |
| `21DA` | 6 | `A*10` |  | Schaltqualitaet: Note 8 Anzahl Schaltungen/ATZ Buffer 1 |  |
| `21DA` | 7 | `A*10` |  | Schaltqualitaet: Note 9-10 Anzahl Schaltungen/ATZ Buffer 1 |  |
| `21DA` | 8 | `A` |  | Schaltqualitaet: Note 1-2-3 Anzahl Schaltungen/ATZ Buffer 2 |  |
| `21DA` | 9 | `A` |  | Schaltqualitaet: Note 4-5 Anzahl Schaltungen/ATZ Buffer 2 |  |
| `21DA` | 10 | `A*4` |  | Schaltqualitaet: Note 6 Anzahl Schaltungen/ATZ Buffer 2 |  |
| `21DA` | 11 | `A*10` |  | Schaltqualitaet: Note 7 Anzahl Schaltungen/ATZ Buffer 2 |  |
| `21DA` | 12 | `A*10` |  | Schaltqualitaet: Note 8 Anzahl Schaltungen/ATZ Buffer 2 |  |
| `21DA` | 13 | `A*10` |  | Schaltqualitaet: Note 9-10 Anzahl Schaltungen/ATZ Buffer 2 |  |
| `21DA` | 14,15 | `u16(A,B)*2` | km | Schaltqualitaet: Laufleistung bei Reset ATZ Buffer 1 |  |
| `21DA` | 16 | `A` |  | Schaltqualitaet: Schlechteste Schaltung 1_Note | 1=Note 1; 2=Note 2; 3=Note 3; 4=Note 4; 5=Note 5; 6=Note 6; 7=Note 7; 8=Note 8; 9=Note 9; 10=Note 10 |
| `21DA` | 17 | `((A>>2)&3)` |  | Schaltqualitaet: Schaltung 1_Art | 0=Zug-Hoch; 1=Schub-Hoch; 2=Zug-Rück; 3=Schub-Rück |
| `21DA` | 17 | `((A>>4)&15)` |  | Schaltqualitaet: Schaltung 1_Index | 0=1-2; 1=2-3; 2=3-4; 3=4-5; 4=5-6; 5=6-7; 6=1-3; 7=2-4; 8=3-5; 9=4-6; 10=5-7; 11=2-5; 12=3-6; 13=4-7; 14=2-6; 15=3-7 |
| `21DA` | 17 | `((A>>0)&3)` |  | Schaltqualitaet: Schaltung 1_Typ | 1=Überhöhung; 2=Freigabe; 3=Ausroll |
| `21DA` | 18,19 | `u16(A,B)` | 1/min | Schaltqualitaet: Schlechteste Schaltung 1_Abtriebsdrehzahl |  |
| `21DA` | 20,21 | `s16(A,B)` | Nm | Schaltqualitaet: Schlechteste Schaltung 1_Turbinenmoment |  |
| `21DA` | 22,23 | `u16(A,B)*2` | km | Schaltqualitaet: Schlechteste Schaltung 1_Laufleistung |  |
| `21DA` | 24 | `A` |  | Schaltqualitaet: Schlechteste Schaltung 2_Note | 1=Note 1; 2=Note 2; 3=Note 3; 4=Note 4; 5=Note 5; 6=Note 6; 7=Note 7; 8=Note 8; 9=Note 9; 10=Note 10 |
| `21DA` | 25 | `((A>>2)&3)` |  | Schaltqualitaet: Schaltung 2_Art | 0=Zug-Hoch; 1=Schub-Hoch; 2=Zug-Rück; 3=Schub-Rück |
| `21DA` | 25 | `((A>>4)&15)` |  | Schaltqualitaet: Schaltung 2_Index | 0=1-2; 1=2-3; 2=3-4; 3=4-5; 4=5-6; 5=6-7; 6=1-3; 7=2-4; 8=3-5; 9=4-6; 10=5-7; 11=2-5; 12=3-6; 13=4-7; 14=2-6; 15=3-7 |
| `21DA` | 25 | `((A>>0)&3)` |  | Schaltqualitaet: Schaltung 2_Typ | 1=Überhöhung; 2=Freigabe; 3=Ausroll |
| `21DA` | 26,27 | `u16(A,B)` | 1/min | Schaltqualitaet: Schlechteste Schaltung 2_Abtriebsdrehzahl |  |
| `21DA` | 28,29 | `s16(A,B)` | Nm | Schaltqualitaet: Schlechteste Schaltung 2_Turbinenmoment |  |
| `21E1` | 2,3,4,5 | `(u16(A,B)*65536+u16(C,D))` |  | Seriennummer: wert |  |
| `21E4` | 2 | `A` |  | ECU reprogramming Idetification: Flash document version number |  |
| `21E4` | 3 | `A` |  | ECU reprogramming Idetification: Status flags |  |
| `21E4` | 4 | `A` |  | ECU reprogramming Idetification: Support flags |  |
| `21E4` | 5 | `A` |  | ECU reprogramming Idetification: Reprogramming attempt counter |  |
| `21E4` | 6 | `A` |  | ECU reprogramming Idetification: maximimum number of reprogramming attempts |  |
| `21E4` | 7 | `A` |  | ECU reprogramming Idetification: security class |  |
| `314276030B` | 6 | `bit(A,7)` |  | FBS Status Schluesselschiene 0 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 6 | `bit(A,6)` |  | FBS Status Schluesselschiene 1 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 6 | `bit(A,5)` |  | FBS Status Schluesselschiene 2 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 6 | `bit(A,4)` |  | FBS Status Schluesselschiene 3 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 6 | `bit(A,3)` |  | FBS Status Schluesselschiene 4 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 6 | `bit(A,2)` |  | FBS Status Schluesselschiene 5 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 6 | `bit(A,1)` |  | FBS Status Schluesselschiene 6 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 6 | `bit(A,0)` |  | FBS Status Schluesselschiene 7 | 0=freigegeben; 1=nicht freigegeben |
| `314276030B` | 7 | `bit(A,5)` |  | FBS Startfreigabe | 0=nein; 1=ja |
| `314276030B` | 7 | `A` |  | FBS Status | 1=transportgeschützt; 3=Transportschutz gelöst; 4-7=personalisiert; 8-15=aktiviert |
| `314276030B` | 7 | `bit(A,3)` |  | FBS Status Akt | 0=nein; 1=ja |
| `314276030B` | 7 | `bit(A,7)` |  | FBS Status Ersatz | 0=nein; 1=ja |
| `314276030B` | 7 | `bit(A,2)` |  | FBS Status Pers | 0=nein; 1=ja |
| `314276030B` | 7 | `bit(A,1)` |  | FBS Status Trp | 0=nein; 1=ja |
| `314276030B` | 8,9 | `u16(A,B)` |  | FBS Req Diagn Comp Test Cnt |  |
| `314276030B` | 8,9 | `u16(A,B)` |  | FBS Status Test | 0=nein; 1-65535=ja |
| `314276030B` | 10 | `A` |  | FBS Req Diagn Comp SW Week |  |
| `314276030B` | 11 | `A` |  | FBS Req Diagn Comp SW Year |  |
| `314276030B` | 12 | `bit(A,0)` |  | FBS Req Diagn Comp Im Rel Inj | 0=Bit=0; 1=Bit=1 |
| `314276030B` | 12 | `bit(A,1)` |  | FBS Req Diagn Comp Im Rel Sta | 0=Bit=0; 1=Bit=1 |
| `314276030B` | 12 | `bit(A,2)` |  | FBS Req Diagn Comp Im Rep ECU | 0=Bit=0; 1=Bit=1 |
| `314376030B` | 6 | `bit(A,7)` |  | FBS Status Schluesselschiene 0 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 6 | `bit(A,6)` |  | FBS Status Schluesselschiene 1 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 6 | `bit(A,5)` |  | FBS Status Schluesselschiene 2 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 6 | `bit(A,4)` |  | FBS Status Schluesselschiene 3 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 6 | `bit(A,3)` |  | FBS Status Schluesselschiene 4 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 6 | `bit(A,2)` |  | FBS Status Schluesselschiene 5 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 6 | `bit(A,1)` |  | FBS Status Schluesselschiene 6 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 6 | `bit(A,0)` |  | FBS Status Schluesselschiene 7 AS | 0=freigegeben; 1=nicht freigegeben |
| `314376030B` | 7 | `bit(A,5)` |  | FBS Startfreigabe AS | 0=nein; 1=ja |
| `314376030B` | 7 | `A` |  | FBS Status AS |  |
| `314376030B` | 7 | `bit(A,3)` |  | FBS Status Akt AS | 0=nein; 1=ja |
| `314376030B` | 7 | `bit(A,7)` |  | FBS Status Ersatz AS | 0=nein; 1=ja |
| `314376030B` | 7 | `bit(A,2)` |  | FBS Status Pers AS | 0=nein; 1=ja |
| `314376030B` | 7 | `bit(A,1)` |  | FBS Status Trp AS | 0=nein; 1=ja |
| `314376030B` | 8,9 | `u16(A,B)` |  | FBS Req Diagn Comp Test Cnt AS |  |
| `314376030B` | 8,9 | `u16(A,B)` |  | FBS Status Test AS | 0=nein; 1-65535=ja |
| `314376030B` | 10 | `A` |  | FBS Req Diagn Comp SW Week AS |  |
| `314376030B` | 11 | `A` |  | FBS Req Diagn Comp SW Year AS |  |
| `314376030B` | 12 | `bit(A,0)` |  | FBS Req Diagn Comp Im Rel Inj AS | 0=Bit=0; 1=Bit=1 |
| `314376030B` | 12 | `bit(A,1)` |  | FBS Req Diagn Comp Im Rel Sta AS | 0=Bit=0; 1=Bit=1 |
| `314376030B` | 12 | `bit(A,2)` |  | FBS Req Diagn Comp Im Rep ECU AS | 0=Bit=0; 1=Bit=1 |
