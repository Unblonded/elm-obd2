# MED17.7 (M278) engine data reference

Extracted from the Mercedes CBF diagnostic description. Send to header `7E0`, response from `7E8`.
Byte offsets use the app convention (index 0 = positive response SID). Formulas are in the app's formula syntax.

| request | bytes | formula | unit | name | values |
|---|---|---|---|---|---|
| `220100` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` |  | Programming Attempt Counter Customer Boot |  |
| `220100` | 3,4 | `u16(A,B)` |  | Reprogramming |  |
| `220100` | 5,6 | `u16(A,B)` |  | Max. Anzahl |  |
| `220100` | 7,8,9,10 | `(u16(A,B)*65536+u16(C,D))` |  | Programming Attempt Counter Code |  |
| `220100` | 11,12,13,14 | `(u16(A,B)*65536+u16(C,D))` |  | Programming Attempt Counter Data |  |
| `220101` | 3 | `A` |  | Historical Interrogation Record - DTC Read Counter |  |
| `220101` | 4,5 | `u16(A,B)*16` | km | Historical Interrogation Record - km Stand |  |
| `221002` | 33,34,35,36 | `(u16(A,B)*65536+u16(C,D))` |  | Lesen der Variantenkodierung Tester ID über geschützten Zugang |  |
| `221004` | 3 | `bit(A,0)` |  | CVN-Berechnung fertig | 0=Nein; 1=Ja |
| `221005` | 3,4 | `u16(A,B)*6` | min | Betriebszeit des Steuergeräts |  |
| `222000` | 3,4 | `u16(A,B)*0.25` | 1/min | Kurbelwellendrehzahl |  |
| `222001` | 3,4 | `u16(A,B)*0.023438` | % | Last |  |
| `222002` | 3 | `bit(A,0)` |  | Nockenwellengeber Bank 2 Auslaß | 0=Nein; 1=Ja |
| `222003` | 3 | `bit(A,0)` |  | Nockenwellengeber Bank 2 Einlaß | 0=Nein; 1=Ja |
| `222004` | 3 | `bit(A,0)` |  | Nockenwellengeber Bank 1 Auslaß | 0=Nein; 1=Ja |
| `222005` | 3 | `bit(A,0)` |  | Nockenwellengeber Bank 1 Einlaß | 0=Nein; 1=Ja |
| `222006` | 3 | `bit(A,0)` |  | Klopfsensor - Klopfen erkannt | 0=Nein; 1=Ja |
| `222007` | 3,4 | `u16(A,B)*0.1` | kg/h | Massentrom aus HFM |  |
| `222008` | 3,4 | `u16(A,B)*0.004883` | V | Spannung O2-Regelsonde Bank 2 Rohwert (DE: Frontkat) |  |
| `222009` | 3,4 | `u16(A,B)*0.004883` | V | Spannung O2-Regelsonde Bank 1 Rohwert (DE: Frontkat) |  |
| `222010` | 3,4 | `u16(A,B)*0.004883-1` | V | Spannung O2-Diagnosesonde Bank 2 Rohwert |  |
| `222011` | 3 | `A*0.75-48` | °C | Kuehlmitteltemperatur gefiltert u. mit Ersatzwertbehandlung |  |
| `222012` | 3,4 | `u16(A,B)*0.004883-1` | V | Spannung O2-Diagnosesonde Bank 1 Rohwert |  |
| `222013` | 3 | `A*0.75-48` | °C | Kuehlmitteltemperatur |  |
| `222014` | 3 | `A*0.75-48` | °C | Ansauglufttemperatur in HFM bzw. vor DK |  |
| `222015` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Abgastemperatur NOX Kat Bank 2 |  |
| `222016` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Abgastemperatur NOX Kat Bank 1 |  |
| `222017` | 3,4 | `s16(A,B)*0.046875` | ° | PremAirkuehlertemperatur |  |
| `222018` | 3,4 | `u16(A,B)*0.078125` | hPa | Saugrohrdruck |  |
| `222019` | 3,4 | `s16(A,B)*0.001221` | hPa | Tankdruckdifferenz |  |
| `22201B` | 3,4 | `u16(A,B)*0.004883` | V | Oeldruck ROH |  |
| `22201C` | 3 | `A*0.75-48` | °C | Ansauglufttemperatur im Saugrohr |  |
| `22201D` | 3,4 | `u16(A,B)*0.004883` | V | Ansauglufttemperatur im Saugrohr Rohwert |  |
| `22201F` | 3 | `A*0.75-48` | °C | Ansauglufttemperatur in HFM bzw. vor DK mit Ersatzwertbehandlung |  |
| `222020` | 3,4 | `s16(A,B)*0.5` | hPa | Oeldruck |  |
| `222021` | 3,4 | `u16(A,B)*0.004883` | V | Ansauglufttemperatur in HFM bzw. vor DK Rohwert |  |
| `222022` | 3,4 | `u16(A,B)*0.02355` | V | Batteriespannung |  |
| `222023` | 3,4 | `u16(A,B)*0.004883` | V | Kühlmitteltemperatur Rohwert |  |
| `222024` | 3,4 | `u16(A,B)*0.1` | us | Luftmasse durch HFM Bank 1 Rohwert |  |
| `222025` | 3,4 | `u16(A,B)*0.004883` | V | Pedalwertgeber Potentiometer 1 Rohwert |  |
| `222026` | 3,4 | `u16(A,B)*0.004883` | V | Pedalwertgeber Potentiometer 2 Rohwert |  |
| `222027` | 3,4 | `u16(A,B)*0.004883` | V | Saugrohrdruck Rohwert |  |
| `222028` | 3,4 | `u16(A,B)*0.004883` | V | Tankdruckdifferenz Rohwert |  |
| `222029` | 3,4 | `u16(A,B)*0.001526` | % | Pedalwertgeberstellung |  |
| `22202A` | 3,4 | `u16(A,B)*0.004883` | V | Regenerierleitung Druck ROH |  |
| `22202A` | 3,4 | `u16(A,B)*0.000305` | V | Regenerierleitung Druck ROH |  |
| `22202B` | 3,4 | `s16(A,B)*0.078125` | hPa | Regenerierleitung Druck |  |
| `22202B` | 3,4 | `u16(A,B)*0.039062` | hPa | Regenerierleitung Druck |  |
| `222030` | 3,4 | `u16(A,B)*0.1` | l | Tankfuellstand |  |
| `222032` | 3 | `A*0.75-48` | °C | Kraftstofftemperatur im Tank |  |
| `222033` | 3,4 | `u16(A,B)*0.004883` | V | Spg. über Innenwid. Lambdasonde Bank 2 vor Kat (DE: Frontkat) |  |
| `222034` | 3,4 | `u16(A,B)*0.004883` | V | Spg. über Innenwid. Lambdasonde Bank 1 vor Kat (DE: Frontkat) |  |
| `222035` | 3,4 | `u16(A,B)*0.039063` | Ohm | Innenwiderstand Lambdasonde Bank 2 vor Kat (DE: Frontkat) |  |
| `222036` | 3,4 | `u16(A,B)*0.039063` | Ohm | Innenwiderstand Lambdasonde Bank 1 vor Kat (DE: Frontkat) |  |
| `222037` | 3,4 | `u16(A,B)*0.000076` | V | Steuergeraete Innentemperatur Rohwert |  |
| `222038` | 3 | `A*0.75-48` | °C | Steuergeraete Innentemperatur |  |
| `222039` | 3,4 | `u16(A,B)*0.004883` | V | Umgebungsdruck Rohwert |  |
| `222040` | 3,4 | `u16(A,B)*0.039063` | hPa | Umgebungsdruck |  |
| `222041` | 3,4 | `u16(A,B)*0.004883` | V | Pedalwertgeber 50% der Versorgungsspannung |  |
| `222044` | 3,4 | `u16(A,B)*0.002` | ms | Periodendauer Korrektursignal HFM Bank 1 |  |
| `222045` | 3,4 | `s16(A,B)*0.039063` | hPa | Offset-Spannung Drucksensor Saugrohr |  |
| `222046` | 3,4 | `u16(A,B)*0.000244` |  | Lambda vor Kat (DE: Frontkat) Istwert Bank 1 |  |
| `222047` | 3,4 | `u16(A,B)*0.000244` |  | Lambda vor Kat (DE: Frontkat) Istwert Bank 2 |  |
| `22204A` | 3,4 | `u16(A,B)*0.003052` | % | Relative Heizleistung Vorkatsonde Rechts |  |
| `22204B` | 3,4 | `u16(A,B)*0.003052` | % | Relative Heizleistung Vorkatsonde Links |  |
| `22204C` | 3,4 | `u16(A,B)*2` | Ohm | Innenwiderstand Nachkatsonde Rechts |  |
| `22204D` | 3,4 | `u16(A,B)*2` | Ohm | Innenwiderstand Nachkatsonde Links |  |
| `222050` | 3,4 | `u16(A,B)*0.001221` | V | Motoroelpumpe Ventil Spannung ueber Shunt |  |
| `222051` | 3,4 | `u16(A,B)*0.03125` | mA | Regenerierventil LPV gemessener Stromwert |  |
| `222052` | 3,4 | `u16(A,B)*0.004883` | V | Regenerierventil LPV gemessener Stromwert Rohwert |  |
| `222057` | 3,4 | `u16(A,B)*0.001221` | V | Abgasrueckfuehrung Temperatur ROH |  |
| `222058` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Abgasrueckfuehrung Temperatur |  |
| `222059` | 3,4 | `u16(A,B)*0.004883` | V | Abgasrueckfuehrung Druck Bank 1 Rohwert |  |
| `22205A` | 3,4 | `u16(A,B)*0.078125` | hPa | Abgasrueckfuehrung Druck Bank 1 |  |
| `22205B` | 3,4 | `u16(A,B)*0.001221` | V | Temperatursensor Kühlmittel am AGR Steller Bank 1 Rohwert |  |
| `22205C` | 3,4 | `u16(A,B)*0.125` | K | Temperatursensor Kühlmittel am AGR Steller Bank 1 |  |
| `22205D` | 3,4 | `u16(A,B)*0.001221` | V | Temperatursensor Kühlmittel am AGR Steller Bank 2 Rohwert |  |
| `22205E` | 3,4 | `u16(A,B)*0.125` | K | Temperatursensor Kühlmittel am AGR Steller Bank 2 |  |
| `222064` | 3,4 | `u16(A,B)*0.004883` | V | AGR Poti Spannung Bank 1 |  |
| `222065` | 3,4 | `u16(A,B)*0.004883` | V | AGR Poti Spannung Bank 2 |  |
| `222066` | 3,4 | `u16(A,B)*0.004883` | V | Abgastemperatur Bank 1 Rohwert |  |
| `222067` | 3,4 | `u16(A,B)*0.004883` | V | Abgastemperatur Bank 2 Rohwert |  |
| `222068` | 3,4 | `u16(A,B)*0.004883` | V | Temperaturfuehler Kraftstoff (Hochdruck) ROH |  |
| `222069` | 3 | `A*0.75-48` | °C | Temperaturfuehler Kraftstoff (Hochdruck) |  |
| `22206F` | 3,4 | `u16(A,B)*0.0005` | MPa | Raildruck Istwert mit Filterung u. Ersatzwertbehandlung |  |
| `222070` | 3,4 | `u16(A,B)*0.000305` | V | Raildruck Istwert nach Kraftstoffpumpe ROH |  |
| `222071` | 3,4 | `u16(A,B)*0.0005` | MPa | Raildruck Istwert nach Kraftstoffpumpe |  |
| `222076` | 3,4 | `u16(A,B)*0.004883` | V | Ladedrucksensor P2 vor Drosselklappe Rohwert |  |
| `222077` | 3,4 | `u16(A,B)*0.078125` | hPa | Ladedrucksensor P2 vor Drosselklappe |  |
| `222078` | 3,4 | `u16(A,B)*0.004883` | V | Drucksensor vor Verdichter P1 Bank 1 ROH |  |
| `222079` | 3,4 | `u16(A,B)*0.039063` | hPa | Drucksensor vor Verdichter P1 Bank 1 |  |
| `22207A` | 3,4 | `u16(A,B)*0.078125` | hPa | Ladedrucksensor P2 vor Drosselklappe mit Korrekturwert aus Nachlauf |  |
| `22207B` | 3,4 | `u16(A,B)*0.039063` | hPa | Drucksensor vor Verdichter P1 rechts mit Korrekturwert aus Nachlauf |  |
| `22207C` | 3,4 | `u16(A,B)*0.039063` | hPa | Drucksensor vor Verdichter P1 links mit Korrekturwert aus Nachlauf |  |
| `222080` | 3,4 | `u16(A,B)*0.004883` | V | Drucksensor nach Luftfilter P1 Bank 2 ROH |  |
| `222081` | 3,4 | `u16(A,B)*0.039063` | hPa | Drucksensor nach Luftfilter P1 Bank 2 |  |
| `222082` | 3 | `A` |  | O2 Sondenheizung nach Kat (DE: Frontkat) Bank 1 Endstufe angesteuert |  |
| `222083` | 3 | `A` |  | O2 Sondenheizung nach Kat (DE: Frontkat) Bank 2 Endstufe angesteuert |  |
| `222084` | 3,4 | `u16(A,B)*0.000031` |  | Lambdawert O2 Sonde nach Kat (DE: Frontkat) Bank 1 |  |
| `222085` | 3,4 | `u16(A,B)*0.000031` |  | Lambdawert O2 Sonde nach Kat (DE: Frontkat) Bank 2 |  |
| `222086` | 3 | `bit(A,0)` |  | Sondenbereitschaft nach Kat (DE: Frontkat) Bank 1 | 0=Nein; 1=Ja |
| `222087` | 3 | `bit(A,0)` |  | Sondenbereitschaft nach Kat (DE: Frontkat) Bank 2 | 0=Nein; 1=Ja |
| `222090` | 3 | `bit(A,0)` |  | O2 Sonde nach Kat (DE: Frontkat) Bank 1 Taupunkt erreicht | 0=Nein; 1=Ja |
| `222091` | 3 | `bit(A,0)` |  | O2 Sonde nach Kat (DE: Frontkat) Bank 2 Taupunkt erreicht | 0=Nein; 1=Ja |
| `222095` | 3 | `A*0.75-48` | °C | Temperatursensor Oel |  |
| `222098` | 3,4 | `u16(A,B)*0.1` | kPa | Kraftstoffdruck vor Kraftstoffpumpe |  |
| `222110` | 3,4 | `s16(A,B)*0.1` | kg/h | Luftmasse durch HFM Bank 2 |  |
| `222111` | 3,4 | `u16(A,B)*0.1` | us | Luftmasse durch HFM Bank 2 Rohwert |  |
| `222113` | 3 | `A*0.1` | V | Rückgelesene Versorgungsspannung für HFM |  |
| `222120` | 3,4 | `s16(A,B)*0.125` | K | Temperaturfuehler Kraftstoff (Hochdruck) im Kaltstart |  |
| `222121` | 3,4 | `s16(A,B)*0.125` | K | Ansauglufttemperatur im Saugrohr im Kaltstart |  |
| `222122` | 3,4 | `s16(A,B)*0.125` | K | Ansauglufttemperatur in HFM bzw. vor DK im Kaltstart |  |
| `222123` | 3,4 | `s16(A,B)*0.125` | K | Abgastemperatur NOX Kat Bank 1 im Kaltstart |  |
| `222124` | 3,4 | `s16(A,B)*0.125` | K | Abgastemperatur NOX Kat Bank 2 im Kaltstart |  |
| `222125` | 3,4 | `u16(A,B)*0.004883` | V | Abgasrueckfuehrung Druck Bank 2 Rohwert |  |
| `222126` | 3,4 | `u16(A,B)*0.078125` | hPa | Abgasrueckfuehrung Druck Bank 2 |  |
| `222130` | 3,4 | `u16(A,B)*0.455111` | kJ | O2 Sonde vor Kat Bank 1 Wärmemenge Ist-Wert für Taupunkt Ende |  |
| `222131` | 3,4 | `u16(A,B)*0.455111` | kJ | O2 Sonde vor Kat Bank 2 Wärmemenge Ist-Wert für Taupunkt Ende |  |
| `222132` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000007` | kJ | O2 Sonde vor Kat Bank 1 Wärmemenge Soll-Wert für Taupunkt Ende |  |
| `222133` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000007` | kJ | O2 Sonde vor Kat Bank 2 Wärmemenge Soll-Wert für Taupunkt Ende |  |
| `222134` | 3,4 | `u16(A,B)*0.455111` | kJ | O2 Sonde nach Kat (DE: Frontkat) Bank 1 Wärmemenge Ist-Wert für Taupunkt Ende |  |
| `222135` | 3,4 | `u16(A,B)*0.455111` | kJ | O2 Sonde nach Kat (DE: Frontkat) Bank 2 Wärmemenge Ist-Wert für Taupunkt Ende |  |
| `222136` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000007` | kJ | O2 Sonde nach Kat (DE: Frontkat) Bank 1 Wärmemenge Soll-Wert für Taupunkt Ende |  |
| `222137` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000007` | kJ | O2 Sonde nach Kat (DE: Frontkat) Bank 2 Wärmemenge Soll-Wert für Taupunkt Ende |  |
| `223000` | 3,4 | `u16(A,B)` |  | Digitale Schalterleisten aktuelle Werte Leiste 1 |  |
| `223004` | 3,4 | `u16(A,B)` |  | Digitale Schalterleisten "High" erkannt Leiste 1 |  |
| `223006` | 3,4 | `u16(A,B)` |  | Digitale Schalterleisten "Low" erkannt Leiste 1 |  |
| `223011` | 3 | `bit(A,0)` |  | Kickdownschalter / -erkennung | 0=Aus; 1=Ein |
| `223012` | 3 | `bit(A,0)` |  | Bremsschalter | 0=Aus; 1=Ein |
| `223013` | 3 | `bit(A,0)` |  | Bremslichtschalter | 0=Aus; 1=Ein |
| `223015` | 3 | `bit(A,0)` |  | Crashsignal über die direkte Leitung | 0=Nein; 1=Ja |
| `223016` | 3 | `bit(A,0)` |  | Zuendung Klemme 15 | 0=Nein; 1=Ja |
| `223017` | 3 | `bit(A,0)` |  | Motoroelfuellstandschalter | 0=OK; 1=Niedrig |
| `223018` | 3 | `bit(A,0)` |  | Interlockschalter | 0=Aus; 1=Ein |
| `223019` | 3 | `bit(A,0)` |  | Kupplungsschalter oben (Ein: Pedal ist in Ruhestellung) | 0=Aus; 1=Ein |
| `22301E` | 3,4 | `u16(A,B)*0.001221` | V | Neutralgangsensor Rohwert 1 |  |
| `22301F` | 3,4 | `u16(A,B)*0.001221` | V | Neutralgangsensor Rohwert 2 |  |
| `223020` | 3 | `bit(A,0)` |  | Neutralgangsensor | 0=NichtNeutral; 1=Neutral |
| `223024` | 3 | `bit(A,0)` |  | Hybrid Schutzeinrichtung Motorhabenkontaktschalter | 0=Auf; 1=Zu |
| `223025` | 3 | `bit(A,0)` |  | Automatik Getriebe | 0=Nein; 1=Ja |
| `223029` | 3 | `bit(A,0)` |  | Motoroelfuellstandschalter gefiltertes Signal | 0=OK; 1=Niedrig |
| `223030` | 3 | `bit(A,0)` |  | Weckimpuls aus Netzwerkmanagement | 0=Nein; 1=Ja |
| `224002` | 3,4 | `u16(A,B)*0.001221` | V | Drosselklappensteller Potentiometer 1 |  |
| `224003` | 3,4 | `u16(A,B)*0.001221` | V | Drosselklappensteller Potentiometer 2 |  |
| `224004` | 3 | `bit(A,0)` |  | Luefternachlauf angefordert | 0=Nein; 1=Ja |
| `224005` | 3,4 | `s16(A,B)*0.003906` | % | Luefternachlauf Korrektur |  |
| `224006` | 3 | `bit(A,0)` |  | Drosselklappe Lernvorgang beendet | 0=Nein; 1=Ja |
| `224007` | 3 | `bit(A,0)` |  | Drosselklappe gelernt fertig | 0=Nein; 1=Ja |
| `224008` | 3 | `bit(A,0)` |  | Nockenwellenadaptionszustand Auslass | 0=Nein; 1=Ja |
| `224009` | 3 | `bit(A,0)` |  | Nockenwellenadaptionszustand Einlass | 0=Nein; 1=Ja |
| `224010` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellen Auslass Bank 1 |  |
| `224011` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellen Auslass Bank 2 |  |
| `224012` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellen Einlass Bank 1 |  |
| `224013` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellen Einlass Bank 2 |  |
| `224014` | 3,4 | `u16(A,B)*0.001526` | % | Aktuelles Ist-Tastverhaeltnis Tankentlueftungsventil |  |
| `224015` | 3,4 | `u16(A,B)*0.001221` | V | Spannung DK-Poti 1 am unteren Anschlag |  |
| `224016` | 3,4 | `u16(A,B)*0.001221` | V | Spannung DK-Poti 2 am unteren Anschlag |  |
| `224017` | 3,4 | `u16(A,B)*0.001526` | % | DK-Winkel der Notluftposition |  |
| `224018` | 3,4 | `u16(A,B)*0.003906` |  | Verstärkung DK-Poti 1 |  |
| `224019` | 3,4 | `s16(A,B)*0.001221` | V | Spannungsoffset Verstärker DK-Poti 1 |  |
| `22401B` | 3 | `bit(A,0)` |  | DK Adaption erfolgreich als neue Ur-Referenz gespeichert | 0=Nein; 1=Ja |
| `224020` | 3 | `A` |  | Rückmeldung an Tester von Tumbleklappen Prüfung |  |
| `224021` | 3,4 | `u16(A,B)*0.004883` | V | Verstaerkte Spannung DK-Poti 1 |  |
| `224022` | 3 | `bit(A,0)` |  | AGR Verstellfreigabe | 0=Nein; 1=Ja |
| `224023` | 3 | `bit(A,0)` |  | AGR Erstadaptionsfreigabe Bank 1 | 0=Nein; 1=Ja |
| `224024` | 3 | `bit(A,0)` |  | AGR Erstadaptionsfreigabe Bank 2 | 0=Nein; 1=Ja |
| `224025` | 3 | `bit(A,0)` |  | AGR Freigabe unterer Mengenanschlag Adaption Bank 1 | 0=Nein; 1=Ja |
| `224026` | 3 | `bit(A,0)` |  | AGR Freigabe unterer Mengenanschlag Adaption Bank 2 | 0=Nein; 1=Ja |
| `224027` | 3 | `bit(A,0)` |  | AGR Adaption Bank 1 laeuft | 0=Nein; 1=Ja |
| `224028` | 3 | `bit(A,0)` |  | AGR Adaption Bank 2 laeuft | 0=Nein; 1=Ja |
| `224029` | 3 | `bit(A,0)` |  | AGR Adaption Bank 1 erfolgreich | 0=Nein; 1=Ja |
| `224030` | 3 | `bit(A,0)` |  | AGR Adaption Bank 2 erfolgreich | 0=Nein; 1=Ja |
| `224031` | 3 | `A` |  | AGR Adaption Bank 1 Fehlercode |  |
| `224032` | 3 | `A` |  | AGR Adaption Bank 2 Fehlercode |  |
| `224033` | 3 | `A*0.392157` | % | DK-Winkel bezogen auf unteren Anschlag |  |
| `224037` | 3 | `bit(A,0)` |  | Bedingung Mengensteuerventil aktiv | 0=Nein; 1=Ja |
| `224039` | 3,4 | `s16(A,B)*0.1` | ° | Vorsteuerwert Förderdauer SAC-MSV in Grad KW |  |
| `224040` | 3,4 | `u16(A,B)*0.006104` | mA | SG intern gemessener Ausgangsstrom zur DMTL Pumpe |  |
| `224041` | 3 | `bit(A,0)` |  | Motordrehzahlbegrenzung ist aktiv | 0=Nein; 1=Ja |
| `224042` | 3 | `bit(A,0)` |  | Funktion zur Fuelrailentlüftung wurde gestartet | 0=Nein; 1=Ja |
| `224046` | 3 | `bit(A,0)` |  | Maßnahmen der Fuelrailentlüftung nach erfolgtem Start werden angefordert | 0=Nein; 1=Ja |
| `224047` | 3 | `bit(A,0)` |  | Leerlaufdrehzahl Anhebung durch Fuelrailentlüftung ist aktiv | 0=Nein; 1=Ja |
| `224060` | 3 | `((A>>0)&7)` |  | Nockenwellenreferenzadaption Zustand Einlass Rechts | 0=EPMCAS_STNOADAP; 1=EPMCAS_STERRADAP; 2=EPMCAS_STADAP; 3=EPMCAS_STADAPSTOP; 4=EPMCAS_STFULLADAP |
| `224061` | 3 | `((A>>0)&7)` |  | Nockenwellenreferenzadaption Zustand Auslass Rechts | 0=EPMCAS_STNOADAP; 1=EPMCAS_STERRADAP; 2=EPMCAS_STADAP; 3=EPMCAS_STADAPSTOP; 4=EPMCAS_STFULLADAP |
| `224062` | 3 | `((A>>0)&7)` |  | Nockenwellenreferenzadaption Zustand Einlass Links | 0=EPMCAS_STNOADAP; 1=EPMCAS_STERRADAP; 2=EPMCAS_STADAP; 3=EPMCAS_STADAPSTOP; 4=EPMCAS_STFULLADAP |
| `224063` | 3 | `((A>>0)&7)` |  | Nockenwellenreferenzadaption Zustand Auslass Links | 0=EPMCAS_STNOADAP; 1=EPMCAS_STERRADAP; 2=EPMCAS_STADAP; 3=EPMCAS_STADAPSTOP; 4=EPMCAS_STFULLADAP |
| `224064` | 3,4 | `s16(A,B)*0.021973` | ° | Nockenwellenreferenzadaption Winkeldifferenz Einlass Rechts |  |
| `224065` | 3,4 | `s16(A,B)*0.021973` | ° | Nockenwellenreferenzadaption Winkeldifferenz Auslass Rechts |  |
| `224066` | 3,4 | `s16(A,B)*0.021973` | ° | Nockenwellenreferenzadaption Winkeldifferenz Einlass Links |  |
| `224067` | 3,4 | `s16(A,B)*0.021973` | ° | Nockenwellenreferenzadaption Winkeldifferenz Auslass Links |  |
| `22406A` | 3 | `A` |  | Mengensteuerventil Status der Ansteuerung |  |
| `22406B` | 3 | `s8(A)*0.390625` | % | Mengensteuerventil Offset des PWM Tastverhältnisses bei Adaption |  |
| `224070` | 3,4 | `u16(A,B)*6` | min | Niedertemperatur Pumpenlaufzeit |  |
| `224074` | 3 | `A` |  | Status des Mengensteuerventil Klackertests Bank 1 |  |
| `224075` | 3 | `A` |  | Status des Mengensteuerventil Klackertests Bank 2 |  |
| `224079` | 3 | `A` |  | NT_HT Koppelventil: Ausgangspin ist konfiguriert u. freigeschaltet | 0=Nein; 1=Ja |
| `22407A` | 3 | `A*5` | s | Dauer der Kühlung im Nachlauf durch (Zusatz-) Kühlmittelpumpe |  |
| `224090` | 3,4 | `s16(A,B)*0.003052` | % | Abgasrückführventil Bank 1 Tastverhältnis |  |
| `224091` | 3,4 | `s16(A,B)*0.003052` | % | Abgasrückführventil Bank 2 Tastverhältnis |  |
| `224094` | 3,4 | `u16(A,B)*0.004883` | V | Signal der Starter Freigabeleitung Klemme 50 |  |
| `224113` | 3 | `A` |  | Benzin Betrieb ist nach Crash bis Werkstattüberprüfung verboten | 0=Nein; 1=Ja |
| `225000` | 3,4 | `u16(A,B)` |  | Generatorkennung |  |
| `225001` | 3 | `A*0.25` | A | Eingestellter Erregerstrom |  |
| `225002` | 3 | `A*3.22581` | % | Auslastungsgrad |  |
| `225003` | 3 | `A` |  | Generator Funktionsfehler Detail Vorgemerkt |  |
| `225004` | 3,4 | `s16(A,B)*0.0625` | Nm | Messwert berechnetes Generatormoment Generator |  |
| `225006` | 3 | `bit(A,0)` |  | Generatorfehler Kommunikationsfehler | 0=Nein; 1=Ja |
| `225007` | 3 | `bit(A,0)` |  | Generatorfehler elektrisch | 0=Nein; 1=Ja |
| `225008` | 3 | `bit(A,0)` |  | Generatorfehler mechanisch | 0=Nein; 1=Ja |
| `225009` | 3 | `bit(A,0)` |  | Generatorfehler Timeout | 0=Nein; 1=Ja |
| `225010` | 3 | `A` |  | Generator Funktionsfehler Vorgemerkt Häufigkeit |  |
| `225011` | 3,4 | `s16(A,B)*0.1` | s | Generator Funktionsfehler Vorgemerkt Max Dauer |  |
| `225012` | 3 | `bit(A,0)` |  | Klemme 61: Generator Ladekontrolle | 0=Nein; 1=Ja |
| `225013` | 3 | `bit(A,0)` |  | Klemme 61: Generator Ladekontrolle, altes Label | 0=Nein; 1=Ja |
| `225014` | 3 | `A` |  | Generator Kommunikationsfehler Vorgemerk Häufigkeit |  |
| `225015` | 3,4 | `s16(A,B)*0.1` | s | Generator Kommunikationsfehler Vorgemerkt Max Dauer |  |
| `225016` | 3 | `A` |  | Generator Kommunikationsfehler Detail Vorgemerkt |  |
| `225017` | 3 | `bit(A,0)` |  | Generator Kommunikationsfehler Vorgemerkt | 0=Nein; 1=Ja |
| `225018` | 3 | `bit(A,0)` |  | Generatorfehler Hochtemperatur von aktivem Generator | 0=Nein; 1=Ja |
| `225019` | 3 | `A` |  | Detail Generatorfunktionsfehler (vor Entprellung) innerhalb Zündungslauf |  |
| `22501A` | 3,4 | `u16(A,B)` |  | Generatorvorgaben Information 1 |  |
| `22501B` | 3,4 | `u16(A,B)` |  | Generatorvorgaben Information 2 |  |
| `22501C` | 3,4 | `u16(A,B)` |  | Generatorfehler Umgebungsdaten Information 1 |  |
| `22501D` | 3,4 | `u16(A,B)` |  | Generatorfehler Umgebungsdaten Information 2 |  |
| `225020` | 3 | `A` |  | aktuelle(r) Gang / Fahrstufe | 0=P/N; 1=1; 2=2; 3=3; 4=4; 5=5; 6=6; 7=R; 8-255=Fehler |
| `225021` | 3,4 | `u16(A,B)*0.0625` | km/h | Geschwindigkeit der Hinterachse |  |
| `225022` | 3 | `A*1.25` | km/h | Geschwindigkeit der Vorderachse |  |
| `225023` | 3 | `((A>>0)&3)` |  | Klimaanlage | 0=Aus; 1=Ein; 2=Derating; 3=SNA |
| `225025` | 3 | `bit(A,0)` |  | Allrad Low Range aus AGK | 0=Nein; 1=Ja |
| `225027` | 3 | `A` | % | Klimaanforderung Vorne |  |
| `225028` | 3 | `A` | % | Luefter Klimaanforderung |  |
| `225029` | 3,4 | `u16(A,B)` |  | Luefter Kuehlanforderung |  |
| `225030` | 3 | `A*0.75-48` | °C | Aussenlufttemperatur |  |
| `225031` | 3 | `A*0.75-48` | °C | Aussenlufttemperatur CAN (Kombi) |  |
| `225032` | 3 | `A*0.75-48` | °C | Extern modelierte Aussenlufttemperatur von CAN Kombi |  |
| `225033` | 3 | `bit(A,0)` |  | Getriebefreigabe Automatgetriebe | 0=Nein; 1=Ja |
| `225034` | 3 | `bit(A,0)` |  | Klemme 50 Startanforderung EZS | 0=Nein; 1=Ja |
| `225035` | 3 | `bit(A,0)` |  | PremAir Nachricht erkannt | 0=Ja; 1=Nein |
| `225036` | 3 | `bit(A,0)` |  | ESIM Schalter offen (vom FSCM) | 0=Nein; 1=Ja |
| `225100` | 3,4 | `u16(A,B)*0.1` | V | Vorgabewert der Niederspannung für DCDC Wandler durch Betriebsstrategie |  |
| `225101` | 3,4 | `u16(A,B)*0.1` | V | Vorgabewert der Hochspannung für DCDC Wandler durch Betriebsstrategie |  |
| `225102` | 3,4 | `u16(A,B)*0.01` | A | Vorgabewert des Stromes auf Niederspannungsseite für DCDC Wandler durch Betriebsstrategie |  |
| `225103` | 3,4 | `u16(A,B)*0.01` | A | Vorgabewert des Stromes auf Hochsspannungsseite für DCDC Wandler durch Betriebsstrategie |  |
| `225104` | 3 | `A` |  | Vorgabestatus für DCDC Wandler durch Betriebsstrategie |  |
| `225105` | 3,4 | `u16(A,B)*0.1` | V | Wert der aktuellen Hochspannung |  |
| `225106` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 bereit Bank 1 | 0=Nein; 1=Ja |
| `225107` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 bereit Bank 2 | 0=Nein; 1=Ja |
| `225108` | 3,4 | `u16(A,B)*0.000244` |  | NOX Sonde Position 4_Lambda_Bank 1 |  |
| `225109` | 3,4 | `u16(A,B)*0.000244` |  | NOX Sonde Position 4_Lambda_Bank 2 |  |
| `225110` | 3 | `bit(A,0)` |  | NOX Sonde Position 4_NOX_Wert_Gueltig_Bank 1 | 0=Nein; 1=Ja |
| `225111` | 3 | `bit(A,0)` |  | NOX Sonde Position 4_NOX_Wert_Gueltig_Bank 2 | 0=Nein; 1=Ja |
| `225112` | 3,4 | `s16(A,B)` | ppm | NOX Sonde Position 4_NOX_Gehalt_Bank 1 |  |
| `225113` | 3,4 | `s16(A,B)` | ppm | NOX Sonde Position 4_NOX_Gehalt_Bank 2 |  |
| `225114` | 3,4 | `u16(A,B)-200` | mV | NOX Sonde Position 4_Spannung_Bank 1 |  |
| `225115` | 3,4 | `u16(A,B)-200` | mV | NOX Sonde Position 4_Spannung_Bank 2 |  |
| `225116` | 3,4 | `u16(A,B)*6` | km | Kilometerstand von CAN-Bus |  |
| `225117` | 3 | `((A>>0)&127)` |  | Status der Diagnose des NOX-Speicherkats (NSC) 2 Bank 1 | 0=NoAdapNsc; 10=AdapNscNoChk; 20=FltNscHdAdapReq; 30=FltNscDeSuReq; 40=FltNscDeSuFlt; 50=FltNscDeSuRdy; 60=AdapNscSensWt; 90=AdapNscErrEnd; 100=AdapNscNoErr; 110=ErrNscSuTmp; 120=ErrNscOldFin |
| `225118` | 3 | `((A>>0)&127)` |  | Status der Diagnose des NOX-Speicherkats (NSC) 2 Bank 2 | 0=NoAdapNsc; 10=AdapNscNoChk; 20=FltNscHdAdapReq; 30=FltNscDeSuReq; 40=FltNscDeSuFlt; 50=FltNscDeSuRdy; 60=AdapNscSensWt; 90=AdapNscErrEnd; 100=AdapNscNoErr; 110=ErrNscSuTmp; 120=ErrNscOldFin |
| `225120` | 3,4 | `u16(A,B)*0.073457+0.073457` | mm | Niveau Motoröl vom LIN Ölsensor (nur M278 AMG) |  |
| `225121` | 3,4 | `u16(A,B)*0.004897+0.995103` |  | Qualität Motoröl vom LIN Ölsensor (nur M278 AMG) |  |
| `225122` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Temperatur Motoröl vom LIN Ölsensor (nur M278 AMG) |  |
| `225123` | 3 | `A` |  | Version Motorölsensor LIN (nur M278 AMG) |  |
| `225124` | 3 | `A` |  | Status Motorölsensor LIN (nur M278 AMG) |  |
| `225130` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` |  | CVN der NOX Sonde Position 4 Bank 1 |  |
| `225131` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` |  | CVN der NOX Sonde Position 4 Bank 2 |  |
| `225134` | 3 | `bit(A,0)` |  | CVN / CALID der NOX Sonde Position 4 Übertragung abgeschlossen Bank 1 | 0=Nein; 1=Ja |
| `225135` | 3 | `bit(A,0)` |  | CVN / CALID der NOX Sonde Position 4 Übertragung abgeschlossen Bank 2 | 0=Nein; 1=Ja |
| `225136` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Sachnr u. Sensor SW Version übertragen Bank 1 | 0=Nein; 1=Ja |
| `225137` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Sachnr u. Sensor SW Version übertragen Bank 2 | 0=Nein; 1=Ja |
| `225140` | 3 | `A` |  | NOX Sonde Position 4 SW Version Bank 1 |  |
| `225141` | 3 | `A` |  | NOX Sonde Position 4 SW Version Bank 2 |  |
| `225142` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Para Liste, Seriennr u. QStatus übertragen Bank 1 | 0=Nein; 1=Ja |
| `225143` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Para Liste, Seriennr u. QStatus übertragen Bank 2 | 0=Nein; 1=Ja |
| `225144` | 3 | `A` |  | NOX Sonde Position 4 Parameter Liste Bank 1 |  |
| `225145` | 3 | `A` |  | NOX Sonde Position 4 Parameter Liste Bank 2 |  |
| `225148` | 3 | `A` |  | NOX Sonde Position 4 Q Status Bank 1 |  |
| `225149` | 3 | `A` |  | NOX Sonde Position 4 Q Status Bank 2 |  |
| `22514A` | 3,4 | `u16(A,B)*0.455111` | kJ | NOX Sonde Position 4 Bank 1 Wärmemenge Ist-Wert für Taupunkt Ende |  |
| `22514B` | 3,4 | `u16(A,B)*0.455111` | kJ | NOX Sonde Position 4 Bank 2 Wärmemenge Ist-Wert für Taupunkt Ende |  |
| `22514C` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000007` | kJ | NOX Sonde Position 4 Bank 1 Wärmemenge Soll-Wert für Taupunkt Ende |  |
| `22514D` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000007` | kJ | NOX Sonde Position 4 Bank 2 Wärmemenge Soll-Wert für Taupunkt Ende |  |
| `225182` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Heizer_Kurzschluss Bank 1 | 0=Nein; 1=Ja |
| `225183` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Heizer_Kurzschluss Bank 2 | 0=Nein; 1=Ja |
| `225186` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Heizer_Leerlauf Bank 1 | 0=Nein; 1=Ja |
| `225187` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Heizer_Leerlauf Bank 2 | 0=Nein; 1=Ja |
| `22518A` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Binaersignal_Kurzschluss Bank 1 | 0=Nein; 1=Ja |
| `22518B` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Binaersignal_Kurzschluss Bank 2 | 0=Nein; 1=Ja |
| `22518E` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Binaersignal_Leerlauf Bank 1 | 0=Nein; 1=Ja |
| `22518F` | 3 | `bit(A,0)` |  | NOX Sonde Position 4 Binaersignal_Leerlauf Bank 2 | 0=Nein; 1=Ja |
| `225190` | 3,4 | `s16(A,B)*0.125` | °C | Aussenlufttemperatur CAN (Kombi) im Kaltstart |  |
| `226000` | 3,4 | `s16(A,B)*0.0625` | Nm | Drehmoment |  |
| `226001` | 3 | `A*0.75-48` | °C | Motorstarttemperatur |  |
| `226002` | 3 | `bit(A,0)` |  | Schubabschaltung | 0=Nein; 1=Ja |
| `226003` | 3 | `bit(A,0)` |  | Leerlauferkennung | 0=Nein; 1=Ja |
| `226004` | 3 | `bit(A,0)` |  | Leerlaufregelung Aktiv | 0=Nein; 1=Ja |
| `226005` | 3 | `bit(A,0)` |  | Vollasterkennung | 0=Nein; 1=Ja |
| `226006` | 3 | `bit(A,0)` |  | Getriebeschutz | 0=Inaktiv; 1=Aktiv |
| `226008` | 3 | `bit(A,0)` |  | Nachstart aktiv | 0=Nein; 1=Ja |
| `22600A` | 3 | `bit(A,0)` |  | Start ist aktiv | 0=Nein; 1=Ja |
| `226011` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 1 |  |
| `226012` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 2 |  |
| `226013` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 3 |  |
| `226014` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 4 |  |
| `226015` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 5 |  |
| `226016` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 6 |  |
| `226017` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 7 |  |
| `226018` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Zylinder 8 |  |
| `226020` | 3 | `A` |  | Kompressionspruefungsstatus |  |
| `226021` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 1 |  |
| `226022` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 2 |  |
| `226023` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 3 |  |
| `226024` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 4 |  |
| `226025` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 5 |  |
| `226026` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 6 |  |
| `226027` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 7 |  |
| `226028` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.0001` | ms | Kompressionszeit Zylinder 8 |  |
| `226030` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Laufruhe Zylinder 1 |  |
| `226030` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 1 |  |
| `226031` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Laufruhe Zylinder 2 |  |
| `226031` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 2 |  |
| `226032` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Laufruhe Zylinder 3 |  |
| `226032` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 3 |  |
| `226033` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Laufruhe Zylinder 4 |  |
| `226033` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 4 |  |
| `226034` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Laufruhe Zylinder 5 |  |
| `226034` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 5 |  |
| `226035` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Laufruhe Zylinder 6 |  |
| `226035` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 6 |  |
| `226036` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 7 |  |
| `226037` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Laufruhe Zylinder 8 |  |
| `226040` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Mittelwert |  |
| `226041` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 1 |  |
| `226042` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 2 |  |
| `226043` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 3 |  |
| `226044` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 4 |  |
| `226045` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 5 |  |
| `226046` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 6 |  |
| `226047` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 7 |  |
| `226048` | 3 | `s8(A)*0.75` | ° | Zündwinkelspätverstellung Zyl. 8 |  |
| `226050` | 3 | `A*0.007813` |  | FlexibelFuelEthanolAnreicherungsfaktor gem Zündreihenfolge |  |
| `226051` | 3 | `A*0.392157` | % | FlexibelFuelAktuellerEthanolgehaltInProzent |  |
| `226052` | 3,4 | `u16(A,B)` |  | FlexibelFuelAnzahlBetankungenEthanol |  |
| `226053` | 3 | `bit(A,0)` |  | Flexibel Fuel aktueller Ethanolgehalt größer als applizierbare Schwelle | 0=Nein; 1=Ja |
| `226054` | 3 | `bit(A,0)` |  | FlexibelFuelKraftstofflernvorgangBeendet | 0=Nein; 1=Ja |
| `226055` | 3 | `bit(A,0)` |  | FlexibelFuelBoilOffistBeendet | 0=Nein; 1=Ja |
| `226056` | 3 | `bit(A,0)` |  | FlexibelFuelLernvorgangKraftstoffGestartet | 0=Nein; 1=Ja |
| `226060` | 3 | `bit(A,0)` |  | BedingungFuelOnAdaptionGestoppt | 0=Nein; 1=Ja |
| `226061` | 3 | `bit(A,0)` |  | AnforderungFuelOnAdaptionResetDurchfuehren | 0=Nein; 1=Ja |
| `226062` | 3 | `bit(A,0)` |  | ResetFuelOnAdaptionDurchgefuehrt | 0=Nein; 1=Ja |
| `226063` | 3 | `bit(A,0)` |  | FuelOnAdaptionFertigDominanterBereich | 0=Nein; 1=Ja |
| `226064` | 3 | `bit(A,0)` |  | FuelOnAdaptionAngehalten | 0=Nein; 1=Ja |
| `226065` | 3 | `bit(A,0)` |  | FuelOnAdaptionGestoppt | 0=Nein; 1=Ja |
| `226066` | 3 | `bit(A,0)` |  | FuelOnAdaptionReset | 0=Nein; 1=Ja |
| `226067` | 3 | `bit(A,0)` |  | FuelOnAdaption | 0=Nein; 1=Ja |
| `226068` | 3 | `bit(A,0)` |  | FuelOnAdaptionAktuellerBereich | 0=Nein; 1=Ja |
| `226069` | 3 | `bit(A,0)` |  | FuelOnAdaptionStatus | 0=Inaktiv; 1=Aktiv |
| `22606B` | 3 | `bit(A,0)` |  | Geberradadaption angehalten wg. Aussetzer | 0=Nein; 1=Ja |
| `22606C` | 3 | `bit(A,0)` |  | Geberradadaption angehalten wg. zu großer Laufunruhe | 0=Nein; 1=Ja |
| `22606D` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Fuel On Adaption Laufunruhe Testgroesse |  |
| `22606D` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Fuel On Adaption Laufunruhe Testgroesse |  |
| `22606F` | 3 | `bit(A,0)` |  | Fuel-Off Adaption Freigabe DMDFOF3 | 0=Nein; 1=Ja |
| `226070` | 3 | `bit(A,0)` |  | Fuel On Bedingung Adaption aktuell Fertig | 0=Nein; 1=Ja |
| `226070` | 3 | `bit(A,0)` |  | FuelOnBedingungAdaptionAktuell ReadyFertig | 0=Nein; 1=Ja |
| `226071` | 3 | `bit(A,0)` |  | Fuel-Off Adaption Fertig Bereich1 | 0=Nein; 1=Ja |
| `226072` | 3 | `bit(A,0)` |  | Fuel-Off Adaption Freigabe | 0=Nein; 1=Ja |
| `226073` | 3 | `bit(A,0)` |  | FuelOffAdaptionLaeuft | 0=Nein; 1=Ja |
| `226074` | 3 | `((A>>0)&3)` |  | FuelOffAdaptionFertig | 0=Ja; 1=Ungueltig; 2=Nein |
| `226079` | 3 | `bit(A,0)` |  | Fuel On Adaption Status | 0=Inaktiv; 1=Aktiv |
| `22607D` | 3,4 | `u16(A,B)*0.000153-5` | ° | Fuel_Off_Adaption_Ergebniswert_DMDFOF3 |  |
| `22607E` | 3 | `A` |  | Fuel-Off Adaption läuft im Segment für Katheizen | 0=Nein; 1=Ja |
| `22607F` | 3 | `A` |  | Fuel-Off Adaption Fertig im Segment für Katheizen | 0=Nein; 1=Ja |
| `226080` | 3 | `bit(A,0)` |  | Multiplikative Gemischadaption aktiv | 0=Inaktiv; 1=Aktiv |
| `226081` | 3 | `bit(A,0)` |  | Additive Gemischadaption aktiv | 0=Inaktiv; 1=Aktiv |
| `226082` | 3 | `bit(A,0)` |  | Gemischadaptionsphase aktiv | 0=Inaktiv; 1=Aktiv |
| `226083` | 3 | `bit(A,0)` |  | Additiver Bereich in der Gemischadaption ist aktiv Bank 1 | 0=Inaktiv; 1=Aktiv |
| `226084` | 3 | `bit(A,0)` |  | Additiver Bereich in der Gemischadaption ist aktiv Bank 2 | 0=Inaktiv; 1=Aktiv |
| `226085` | 3 | `bit(A,0)` |  | Gemischadaption Additiv Integrator Stabil Bank 1 | 0=Nein; 1=Ja |
| `226086` | 3 | `bit(A,0)` |  | Gemischadaption Additiv Integrator Stabil Bank 2 | 0=Nein; 1=Ja |
| `226087` | 3,4 | `s16(A,B)*0.046875` | % | Additive Gemischkorrektur Bank 1 (Leerlauf) |  |
| `226088` | 3,4 | `s16(A,B)*0.046875` | % | Additive Gemischkorrektur Bank 2 |  |
| `226089` | 3,4 | `s16(A,B)*0.046875` | % | Additive Gemischkorrektur Bank 1 HFM |  |
| `226090` | 3,4 | `s16(A,B)*0.046875` | % | Additive Gemischkorrektur Bank 2 HFM |  |
| `226091` | 3,4 | `s16(A,B)*0.046875` | % | Additive Gemischkorrektur Bank 1 (P-System) |  |
| `226092` | 3,4 | `s16(A,B)*0.046875` | % | Additive Gemischkorrektur Bank 2 (P-System) |  |
| `226095` | 3 | `bit(A,0)` |  | Integrator fra Bank 1 unten | 0=Nein; 1=Ja |
| `226096` | 3 | `bit(A,0)` |  | Integrator fra Bank 2 unten | 0=Nein; 1=Ja |
| `226097` | 3 | `bit(A,0)` |  | Integrator tra Bank 1 | 0=Nein; 1=Ja |
| `226098` | 3 | `bit(A,0)` |  | Integrator tra Bank 2 | 0=Nein; 1=Ja |
| `226099` | 3 | `bit(A,0)` |  | Grundadaption Bank 1 fra-Integrator | 0=Nein; 1=Ja |
| `226100` | 3 | `bit(A,0)` |  | Grundadaption Bank 2 fra-Integrator | 0=Nein; 1=Ja |
| `226101` | 3 | `bit(A,0)` |  | Multiplikativer Bereich in der Gemischadaption ist aktiv Bank 1 | 0=Inaktiv; 1=Aktiv |
| `226102` | 3 | `bit(A,0)` |  | Multiplikativer Bereich in der Gemischadaption ist aktiv Bank 2 | 0=Inaktiv; 1=Aktiv |
| `226103` | 3,4 | `u16(A,B)*0.000031` |  | Multiplikative Gemischkorrektur Bank 1 unten (Teillast) |  |
| `226104` | 3,4 | `u16(A,B)*0.000031` |  | Multiplikative Gemischkorrektur Bank 2 unten |  |
| `226105` | 3,4 | `u16(A,B)*0.000031` |  | Multiplikativer Gemischadaptionsfaktor Bank 1 (Teillast) |  |
| `226106` | 3,4 | `u16(A,B)*0.000031` |  | Multiplikativer Gemischadaptionsfaktor Bank 2 |  |
| `226107` | 3,4 | `u16(A,B)*0.000031` |  | Multiplikative Gemischkorrektur Bank 1 |  |
| `226108` | 3,4 | `u16(A,B)*0.000031` |  | Multiplikative Gemischkorrektur Bank 2 |  |
| `226109` | 3,4 | `u16(A,B)*0.000031` |  | Temperaturabhängige Gemischadaptionsfaktor Bank 1 |  |
| `226110` | 3,4 | `u16(A,B)*0.000031` |  | Temperaturabhängige Gemischadaptionsfaktor Bank 2 |  |
| `226111` | 3,4 | `u16(A,B)*0.000031` |  | Gemischadaption Kurztest Ergebnis Bank 1 |  |
| `226112` | 3,4 | `u16(A,B)*0.000031` |  | Gemischadaption Kurztest Ergebnis Bank 2 |  |
| `226113` | 3 | `bit(A,0)` |  | Gemischadaption Kurztest Errorflag Bank 1 | 0=Nein; 1=Ja |
| `226114` | 3 | `bit(A,0)` |  | Gemischadaption Kurztest Errorflag Bank 2 | 0=Nein; 1=Ja |
| `226115` | 3 | `bit(A,0)` |  | Gemischadaption Kurztest Zyklusflag Bank 1 | 0=Nein; 1=Ja |
| `226116` | 3 | `bit(A,0)` |  | Gemischadaption Kurztest Zyklusflag Bank 2 | 0=Nein; 1=Ja |
| `226117` | 3 | `bit(A,0)` |  | Kurztest Signalfehler Bank 1 | 0=Nein; 1=Ja |
| `226118` | 3 | `bit(A,0)` |  | Kurztest Signalfehler Bank 2 | 0=Nein; 1=Ja |
| `226119` | 3 | `bit(A,0)` |  | Gemischadaption Kurztest Ergebnis Unplausibel Bank 1 | 0=Nein; 1=Ja |
| `226120` | 3 | `bit(A,0)` |  | Gemischadaption Kurztest Ergebnis Unplausibel Bank 2 | 0=Nein; 1=Ja |
| `226121` | 3 | `bit(A,0)` |  | angestoßene Gemischadaption Leerlauf ist stabil Bank 1 | 0=Nein; 1=Ja |
| `226122` | 3 | `bit(A,0)` |  | angestoßene Gemischadaption Teillast- Unten ist stabil Bank 1 | 0=Nein; 1=Ja |
| `226127` | 3 | `bit(A,0)` |  | Gemischadaption nach Reset mind. einmal eingeschwungen | 0=Nein; 1=Ja |
| `226130` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaregelwert Bank 2 |  |
| `226131` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaregelwert Bank 1 |  |
| `226132` | 3,4 | `u16(A,B)*0.000031` |  | Schneller Mittelwert Lambdaregelfaktors Bank 1 |  |
| `226133` | 3,4 | `u16(A,B)*0.000031` |  | Schneller Mittelwert Lambdaregelfaktors Bank 2 |  |
| `226134` | 3,4 | `u16(A,B)*0.000031` |  | Mittelwert vom Produkt Abweichung Lambdaregler-Lambda |  |
| `226135` | 3 | `bit(A,0)` |  | O2Regelsonde Bank 1 bereit | 0=Nein; 1=Ja |
| `226136` | 3 | `bit(A,0)` |  | O2Regelsonde Bank 2 bereit | 0=Nein; 1=Ja |
| `226139` | 3,4 | `s16(A,B)*0.039063` | Ohm | Adaptionswert für IC-Offset LSU rechte Bank |  |
| `226140` | 3,4 | `s16(A,B)*0.039063` | Ohm | Adaptionswert für IC-Offset LSU linke Bank |  |
| `226143` | 3,4 | `u16(A,B)*0.000244` |  | Lambda Sollwert Bank 1 |  |
| `226144` | 3,4 | `u16(A,B)*0.000244` |  | Lambda Sollwert Bank 2 |  |
| `226145` | 3 | `A` |  | Anzahl der Dynamikmessungen LSU rechte Bank |  |
| `226146` | 3 | `A` |  | Anzahl der Dynamikmessungen LSU linke Bank |  |
| `226147` | 3,4 | `s16(A,B)*0.000031` |  | Lambdaregelung I Anteil hinter Kat rechte Bank (DE: Frontkat) |  |
| `226148` | 3,4 | `s16(A,B)*0.000031` |  | Lambdaregelung I Anteil hinter Kat linke Bank (DE: Frontkat) |  |
| `226149` | 3,4 | `u16(A,B)*0.000244` |  | Dynamikwert der LSU rechte Bank |  |
| `226150` | 3,4 | `u16(A,B)*0.000244` |  | Dynamikwert der LSU linke Bank |  |
| `226151` | 3,4 | `u16(A,B)*0.000244` |  | Kat (DE: Frontkat) Überwachung - gefiltertes Sauerstoffspeichervermögen Bank 1 |  |
| `226152` | 3,4 | `u16(A,B)*0.000244` |  | Kat (DE: Frontkat) Überwachung - gefiltertes Sauerstoffspeichervermögen Bank 2 |  |
| `226153` | 3,4 | `u16(A,B)*0.000579` | g | Schwefelbeladung des NOX Kats 2 Bank 1 |  |
| `226154` | 3,4 | `u16(A,B)*0.000579` | g | Schwefelbeladung des NOX Kats 2 Bank 2 |  |
| `226155` | 3 | `bit(A,0)` |  | Entschwefelung des NOX Kats 2 Bank 1 erforderlich | 0=----; 1=TRUE |
| `226156` | 3 | `bit(A,0)` |  | Entschwefelung des NOX Kats 2 Bank 2 erforderlich | 0=----; 1=TRUE |
| `226157` | 3,4 | `u16(A,B)*0.000031` |  | Alterungsfaktor des NOX Kats 2 Bank 1 |  |
| `226158` | 3,4 | `u16(A,B)*0.000031` |  | Alterungsfaktor des NOX Kats 2 Bank 2 |  |
| `226160` | 3 | `bit(A,0)` |  | Verbrennung läuft | 0=Nein; 1=Ja |
| `226161` | 3 | `A` |  | Bitleiste zur Anzeige von Abbruchgruenden bei der Erhoehung der Leerlaufdrehzahl als Steller |  |
| `226161` | 3 | `bit(A,3)` |  | Abbruchgrund Leerlaufdrehzahlanhebung Bremspedal betätigt | 0=Nein; 1=Ja |
| `226161` | 3 | `bit(A,4)` |  | Abbruchgrund Leerlaufdrehzahlanhebung Fahrpedal betätigt | 0=Nein; 1=Ja |
| `226161` | 3 | `bit(A,1)` |  | Abbruchgrund Leerlaufdrehzahlanhebung mind 1 Rad rollt | 0=Nein; 1=Ja |
| `226161` | 3 | `bit(A,2)` |  | Abbruchgrund Leerlaufdrehzahlanhebung Gangstufe eingelegt | 0=Nein; 1=Ja |
| `226161` | 3 | `bit(A,0)` |  | Abbruchgrund Leerlaufdrehzahlanhebung Kommunikationsabbruch | 0=Nein; 1=Ja |
| `226161` | 3 | `bit(A,5)` |  | Abbruchgrund Leerlaufdrehzahlanhebung Überwachung Ebene 2 | 0=Nein; 1=Ja |
| `226162` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000278` | km | Gefahrene km Verbrennungsmotor |  |
| `226163` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000278` | km | Gefahrene km E-Motor |  |
| `226169` | 3 | `bit(A,0)` |  | Kat (DE: Frontkat) Überwachung laeuft Bank 1 | 0=Nein; 1=Ja |
| `22616A` | 3 | `bit(A,0)` |  | Kat (DE: Frontkat) Überwachung laeuft Bank 2 | 0=Nein; 1=Ja |
| `226171` | 3 | `bit(A,0)` |  | Testerverstellzyklus Nockenwelle Auslass Bank 1 beendet | 0=Nein; 1=Ja |
| `226172` | 3 | `bit(A,0)` |  | Testerverstellzyklus Nockenwelle Auslass Bank 2 beendet | 0=Nein; 1=Ja |
| `226173` | 3 | `bit(A,0)` |  | Testerverstellzyklus Nockenwelle Einlass Bank 1 beendet | 0=Nein; 1=Ja |
| `226174` | 3 | `bit(A,0)` |  | Testerverstellzyklus Nockenwelle Einlass Bank 2 beendet | 0=Nein; 1=Ja |
| `226175` | 3 | `A` |  | Nockenwellenzustand Auslass |  |
| `226176` | 3 | `A` |  | Nockenwellenzustand Einlass |  |
| `226179` | 3 | `bit(A,0)` |  | Nockenwelle Auslass Grob Feinadaption Beendet | 0=Nein; 1=Ja |
| `226180` | 3 | `bit(A,0)` |  | Nockenwelle Einlass Grob Feinadaption Beendet | 0=Nein; 1=Ja |
| `226181` | 3,4 | `s16(A,B)*0.007813` | ° | Sollwinkel Auslassventil Bank 1 |  |
| `226182` | 3,4 | `s16(A,B)*0.007813` | ° | Sollwinkel Auslassventil Bank 2 |  |
| `226183` | 3,4 | `s16(A,B)*0.007813` | ° | Sollwinkel Einlassventil Bank 1 |  |
| `226184` | 3,4 | `s16(A,B)*0.007813` | ° | Sollwinkel Einlassventil Bank 2 |  |
| `226193` | 3 | `bit(A,0)` |  | Nockenwellensteuerung | 0=Nein; 1=Ja |
| `226210` | 3 | `bit(A,0)` |  | Sekundärluft aktiv | 0=Nein; 1=Ja |
| `226211` | 3 | `bit(A,0)` |  | SLS-Diagnose aktiv | 0=Nein; 1=Ja |
| `226220` | 3,4 | `u16(A,B)*0.000024` | hPa/s | Unterdruckaufbaugradient |  |
| `226221` | 3,4 | `u16(A,B)*0.000024` | hPa/s | Leckschwelle für Tenkleckdiagnose 0.5mm Prüfung |  |
| `226222` | 3 | `bit(A,0)` |  | Zyklusflag: Tankentlüftung: Grobleck | 0=Nein; 1=Ja |
| `226223` | 3 | `bit(A,0)` |  | Zyklusflag: Tankentlüftung: Kleinstleck | 0=Nein; 1=Ja |
| `226224` | 3 | `A` |  | Tankdichtepruefung Status |  |
| `226225` | 3 | `A` |  | Tankdichtepruefung Abbruchstatus |  |
| `226226` | 3 | `bit(A,0)` |  | Errorflag: Tankdichtepruefung Grobleck | 0=Nein; 1=Ja |
| `226227` | 3 | `bit(A,0)` |  | Bedingung Abbruch TLD wegen hoher Ausgasung | 0=Nein; 1=Ja |
| `226228` | 3 | `bit(A,0)` |  | Tankdichtigkeitspruefung Aktiv | 0=Nein; 1=Ja |
| `226229` | 3 | `bit(A,0)` |  | Tankdichtigkeitspruefung Sammelabbruch | 0=Nein; 1=Ja |
| `22622A` | 3,4 | `u16(A,B)*0.000024` | hPa/s | Unterdruckabbaugradient |  |
| `226230` | 3 | `bit(A,0)` |  | Tankdichtigkeitspruefung Lambdaregler Abbruch | 0=Nein; 1=Ja |
| `226231` | 3,4 | `s16(A,B)*0.000031` |  | Tankdichtigkeitspruefung Max Abweichung Lambda |  |
| `226232` | 3,4 | `u16(A,B)*0.000024` | hPa/s | Tankentlueftung Ausgasungswert |  |
| `226233` | 3,4 | `u16(A,B)` | s | Tankentlueftungszeit seit Start minus Parkzeit |  |
| `226234` | 3 | `bit(A,0)` |  | Basisbedingung der Tankdichtigkeitspruefung | 0=Nein; 1=Ja |
| `226235` | 3 | `bit(A,0)` |  | Tankleckdiagnose-Freigabe bzüglich sperrender Fehler | 0=Nein; 1=Ja |
| `226236` | 3 | `bit(A,0)` |  | Tankleckdiagnose-Bedingung Lambda-regelung vor Kat (Bank 1) | 0=Nein; 1=Ja |
| `226237` | 3 | `bit(A,0)` |  | Tankleckdiagnose-Bedingung Tankdruck-differenz Einganmgssignal | 0=Nein; 1=Ja |
| `226238` | 3 | `bit(A,0)` |  | Tankleckdiagnose-Bedingung Batterie-spannung | 0=Nein; 1=Ja |
| `226239` | 3 | `bit(A,0)` |  | Tankleckdiagnose-Bedingung Alle Evs aktiv | 0=Nein; 1=Ja |
| `226240` | 3 | `bit(A,0)` |  | Tankleckdiagnose-Bedingung Funktions-anfoderung über Tester | 0=Nein; 1=Ja |
| `226241` | 3,4 | `s16(A,B)*0.046875` | % | Relativer Gemischanteil Tankentlueftung |  |
| `226242` | 3,4 | `u16(A,B)*0.000391` | kg/h | Massenstrom Tankentlueftung ins Saugrohr |  |
| `226244` | 3,4 | `s16(A,B)*0.001953` |  | Beladung des Aktivkohlefilters |  |
| `226245` | 3,4 | `u16(A,B)*0.046875` | % | Relative Kraftstoffmasse |  |
| `226246` | 3 | `s8(A)*0.5` |  | Beladung des Aktivkohlefilters - gefiltert |  |
| `226247` | 3,4 | `s16(A,B)*0.000061` |  | Faktor Kraftstoffanteil Tankentlüftung bei LPV Ventil |  |
| `22624B` | 3,4 | `u16(A,B)*0.001526` | % | Aktueller Sollwert der LPV Ansteuerung |  |
| `22624C` | 3 | `bit(A,0)` |  | Tankentlüftungsventil ist angesteuert und geöffnet | 0=Nein; 1=Ja |
| `226250` | 3,4 | `s16(A,B)*0.125` | °C | Solltemperatur |  |
| `226251` | 3 | `bit(A,0)` |  | Freigabe Klopfregelung | 0=Nein; 1=Ja |
| `226252` | 3,4 | `u16(A,B)*0.1` | kg/h | Luftmassenfluß |  |
| `226253` | 3 | `bit(A,0)` |  | Ladungsbewegungsklappe Freigabe | 0=Nein; 1=Ja |
| `226254` | 3,4 | `u16(A,B)` | s | Zaehler: Ueberschreitung des 1. SG-Temperaturgrenzwertes |  |
| `226255` | 3,4 | `u16(A,B)` | s | Zaehler: Ueberschreitung des 2. SG-Temperaturgrenzwertes |  |
| `226256` | 3 | `bit(A,0)` |  | Schaltlinienverschiebung | 0=Inaktiv; 1=Aktiv |
| `226257` | 3,4 | `u16(A,B)` | km | Gefahrene Kilometer seit letztem Fehlerspeicher loeschen oder Powerfail |  |
| `226258` | 3 | `bit(A,0)` |  | Bedingung Einspritzventile aktiv | 0=Nein; 1=Ja |
| `226264` | 3,4 | `u16(A,B)*0.000061` |  | Korrektur Faktor Massenstrom Nebenfüllungssignal |  |
| `226265` | 3,4 | `u16(A,B)*0.000061` |  | Korrekturfaktor langsamer MSA |  |
| `226266` | 3,4 | `u16(A,B)*0.000061` |  | Korrekturfaktor langsamer MSA (auch bei Fehlerfall in Betrieb) |  |
| `226268` | 3,4 | `s16(A,B)*0.000031` |  | Delta Füllungssensor zu Alpha/n-System |  |
| `226269` | 3,4 | `u16(A,B)*0.1` | kg/h | Norm. Leckluftmassenstrom über Drosselklappe |  |
| `22626A` | 3,4 | `u16(A,B)*0.1` | kg/h | Abgasmassenstrom im Kat (DE: Frontkat) Rechts |  |
| `22626B` | 3,4 | `u16(A,B)*0.1` | kg/h | Abgasmassenstrom im Kat (DE: Frontkat) Links |  |
| `22626C` | 3,4 | `u16(A,B)*0.1` | kg/h | Abgasmassenstrom Hauptkat (DE: NOX) Rechts |  |
| `22626D` | 3,4 | `u16(A,B)*0.1` | kg/h | Abgasmassenstrom Hauptkat (DE: NOX) Links |  |
| `22626E` | 3,4 | `s16(A,B)*0.1` | kg/h | Korrektur Offset Massenstrom Nebenfüllungssignal |  |
| `22626F` | 3,4 | `u16(A,B)*0.000061` |  | Korrektur Faktor Massenstrom Hauptfüllungssignal |  |
| `226270` | 3,4 | `u16(A,B)*0.000031` |  | Multiplikative Korrektur von fupsrl |  |
| `226271` | 3,4 | `s16(A,B)*0.039063` | hPa | Offsetkorrektur von pbrintuk_w HFM/DSS Adaption |  |
| `226272` | 3,4 | `s16(A,B)*0.003052` | % | Delta Moment aus Momentenadaption für Leerlauf bei Klima ein und eingelegter Fahrstufe |  |
| `226273` | 3,4 | `s16(A,B)*0.003052` | % | Delta Moment aus Momentenadaption für Leerlauf bei Klima aus und eingelegter Fahrstufe |  |
| `226274` | 3,4 | `s16(A,B)*0.003052` | % | Delta Moment aus Momentenadaption für Leerlauf bei Klima ein und ohne Fahrstufe |  |
| `226275` | 3,4 | `s16(A,B)*0.003052` | % | Delta Moment aus Momentenadaption für Leerlauf bei Klima aus und ohne Fahrstufe |  |
| `226276` | 3,4 | `s16(A,B)*0.003052` | % | Delta Moment aus Momentenadaption für Teillast |  |
| `226277` | 3,4 | `s16(A,B)*0.003052` | % | Delta Moment aus Momentenadaption - zeitl. Mittelwert des I-Anteils |  |
| `226278` | 3 | `A` |  | Anzahl Starts mit Benzin im Oel |  |
| `226279` | 3,4 | `s16(A,B)*0.5` | ° | Adaptierter Max. Lenkwinkel Bank 2 |  |
| `22627A` | 3 | `bit(A,0)` |  | Offsetadaption des Drosselklappen Massenstroms eingeschwungen | 0=----; 1=TRUE |
| `22627B` | 3 | `bit(A,0)` |  | Faktoradaption des Drosselklappen Massenstroms eingeschwungen | 0=----; 1=TRUE |
| `226280` | 3,4 | `s16(A,B)*0.5` | ° | Adaptierter Max. Lenkwinkel Bank 1 |  |
| `226281` | 3 | `A` |  | Resetcounter |  |
| `226282` | 3 | `bit(A,0)` |  | Heißfilmluftmassensensor messbereit | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,3)` |  | Status der FBS3 Wegfahrsperre - Aktiviert | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,6)` |  | Status der FBS3 Wegfahrsperre - Authentifikation laeuft | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,0)` |  | Status der FBS3 Wegfahrsperre - Initialisiert | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,4)` |  | Status der FBS3 Wegfahrsperre - Neutralisiert | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,2)` |  | Status der FBS3 Wegfahrsperre - Personalisiert | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,5)` |  | Status der FBS3 Wegfahrsperre - Startfreigabe | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,1)` |  | Status der FBS3 Wegfahrsperre - Transportschutz geloest | 0=Nein; 1=Ja |
| `226283` | 3 | `bit(A,7)` |  | Status der FBS3 Wegfahrsperre - reserviert | 0=Nein; 1=Ja |
| `226285` | 3,4 | `u16(A,B)*0.004883` | V | RAM Spannung UMA AGR Ventil 1 im letzten klemmt Fehler |  |
| `226286` | 3,4 | `u16(A,B)*0.004883` | V | RAM Spannung UMA AGR Ventil 2 im letzten klemmt Fehler |  |
| `226287` | 3,4 | `u16(A,B)*0.002441` | %/V | Steigung Sensorkennlinie AGR-Ventil 1 im letzten Klemmt-Fehler |  |
| `226288` | 3,4 | `u16(A,B)*0.002441` | %/V | Steigung Sensorkennlinie AGR-Ventil 2 im letzten Klemmt-Fehler |  |
| `226289` | 3,4 | `u16(A,B)*0.002441` | %/V | Steigung Sensorkennlinie AGR-Ventil 1 beim letzten Lernen |  |
| `226290` | 3,4 | `u16(A,B)*0.002441` | %/V | Steigung Sensorkennlinie AGR-Ventil 2 beim letzten Lernen |  |
| `226291` | 3 | `bit(A,0)` |  | Aussetzer_kritische_Rate_Vorhanden | 0=Nein; 1=Ja |
| `226292` | 3 | `bit(A,0)` |  | Homogenbetrieb | 0=Nein; 1=Ja |
| `226293` | 3 | `bit(A,0)` |  | Homogen Kochschutz | 0=Nein; 1=Ja |
| `226294` | 3 | `bit(A,0)` |  | Homogen Mager | 0=Nein; 1=Ja |
| `226295` | 3 | `bit(A,0)` |  | Homogen Schicht | 0=Nein; 1=Ja |
| `226296` | 3 | `bit(A,0)` |  | Homogen Split | 0=Nein; 1=Ja |
| `226297` | 3 | `bit(A,0)` |  | Schichtbetrieb | 0=Nein; 1=Ja |
| `226298` | 3 | `bit(A,0)` |  | Schicht Katheizen | 0=Nein; 1=Ja |
| `226299` | 3,4 | `u16(A,B)*0.01` | s | Betriebszeit_nach_Motor_Start |  |
| `226300` | 3 | `A` |  | Einspritzventilabschaltung_Durch_Aussetzer_Status |  |
| `226301` | 3 | `bit(A,0)` |  | Ethanolbetrieb_aktiv | 0=Nein; 1=Ja |
| `226302` | 3,4 | `u16(A,B)*0.002747` | ° | Fuel Off Adaption Lernfilter aktuell |  |
| `226303` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 1 |  |
| `226304` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 2 |  |
| `226305` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 3 |  |
| `226306` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 4 |  |
| `226307` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 5 |  |
| `226308` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 6 |  |
| `226309` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 7 |  |
| `226310` | 3,4 | `u16(A,B)*0.002` | mAs | Istladung Zylinder 8 |  |
| `226311` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 1 |  |
| `226312` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 2 |  |
| `226313` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 3 |  |
| `226314` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 4 |  |
| `226315` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 5 |  |
| `226316` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 6 |  |
| `226317` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 7 |  |
| `226318` | 3,4 | `u16(A,B)*0.002` | mAs | Sollladung Zylinder 8 |  |
| `226319` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 1 |  |
| `226320` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 2 |  |
| `226321` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 3 |  |
| `226322` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 4 |  |
| `226323` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 5 |  |
| `226324` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 6 |  |
| `226325` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 7 |  |
| `226326` | 3,4 | `u16(A,B)*0.01` | V | Plateauspannung Zylinder 8 |  |
| `226329` | 3 | `A*0.75-48` | °C | Modellwert für Kraftstofftemperatur |  |
| `22632A` | 3 | `A*0.75-48` | °C | Kraftstofftemperatur je nach Codewort von Sensor, Modell oder Ersatzwert |  |
| `226330` | 3 | `A*0.007813` |  | Kraftstoffqualitaet ggf. nur fuer Flex Fuel |  |
| `226331` | 3,4 | `s16(A,B)*0.023438` | % | Luftmassenaenderung_Pro_Arbeitsspiel |  |
| `226332` | 3 | `A` |  | Momentenanforderung_Durch_Reduzierstufe_Ist |  |
| `226333` | 3 | `A` |  | Momentenanforderung_Durch_Reduzierstufe_Soll |  |
| `226334` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Kat (DE: NOX) Temperatur aus Modell Bank 1 |  |
| `226335` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Kat (DE: NOX) Temperatur aus Modell Bank 2 |  |
| `226336` | 3 | `bit(A,0)` |  | Phasengebernotlauf_Phasensuche_aktiv | 0=Nein; 1=Ja |
| `226337` | 3,4 | `u16(A,B)*0.000977` |  | Injektoren Bank 1 Undichtigkeit über Schwingungsintensität detektiert |  |
| `226338` | 3,4 | `u16(A,B)*0.000977` |  | Injektoren Bank 2 Undichtigkeit über Schwingungsintensität detektiert |  |
| `226339` | 3 | `bit(A,0)` |  | Zylinderausblendung_durch_Tester_aktiv | 0=Nein; 1=Ja |
| `22633A` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Nach Kat (DE: NOX) Temperatur aus Modell Bank 1 |  |
| `22633B` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Nach Kat (DE: NOX) Temperatur aus Modell Bank 2 |  |
| `22633C` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Frontkat Temperatur aus Modell Bank 1 |  |
| `22633D` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Frontkat Temperatur aus Modell Bank 2 |  |
| `22633E` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Krümmer Temperatur aus Modell Bank 1 |  |
| `22633F` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Krümmer Temperatur aus Modell Bank 2 |  |
| `226340` | 3 | `A` |  | DMTL Tankdichtigkeitsprüfung Zustandsautomat | 0=Active; 1=Active-reference measurement; 2=Rough leak and 1 mm leak test active; 3=0.5 mm leak test active; 4=Active-2nd reference measurement; 5=Test not running; 6=Test complete; 7-9=Invalid State; 10=Test can not be started; 11=Test can not be started- Ubatt outside range; 12=Test can not be started- fluctuation of reference current too big; 13=Test can not be started- electrical fault present; 14=Test can not be started- timeout reached resp. exceeded; 15=Test can not be started- no rough leak enable clearance; 16-19=Invalid State; 20=Test has been aborted; 21-22=Invalid State; 23=Test aborted- Ubatt fluctuation too big; 24=Test aborted- ignition on-off-on; 25-29=Invalid State |
| `226341` | 3 | `A` |  | DMTL Tankdichtigkeitsprüfung Ergebnis Status | 0=Active; 1=Active-reference measurement; 2=Rough leak and 1 mm leak test active; 3=0.5 mm leak test active; 4=Active-2nd reference measurement; 5=Test not running; 6=Test complete; 7-9=Invalid State; 10=Test can not be started; 11=Test can not be started- Ubatt outside range; 12=Test can not be started- fluctuation of reference current too big; 13=Test can not be started- electrical fault present; 14=Test can not be started- timeout reached resp. exceeded; 15=Test can not be started- no rough leak enable clearance; 16-19=Invalid State; 20=Test has been aborted; 21-22=Invalid State; 23=Test aborted- Ubatt fluctuation too big; 24=Test aborted- ignition on-off-on; 25-29=Invalid State |
| `226342` | 3,4 | `u16(A,B)*0.1` | s | DMTL Tankprüfung: Zeitdifferenz für Stromgradient |  |
| `226343` | 3,4 | `u16(A,B)*0.1` | s | DMTL Tankprüfung: Zeitdifferenz für Stromgradient gespeichert |  |
| `226344` | 3,4 | `u16(A,B)*0.000031` |  | DMTL Tankprüfung: Grenzwert. Entfernung Stromschwelle zum Stromhub |  |
| `226345` | 3,4 | `u16(A,B)*0.1` | s | DMTL Tankprüfung: Zeitdifferenz für Stromgradient Grenzwert |  |
| `226354` | 3 | `bit(A,4)` |  | vorzeitiger Abbruch - Adaptionsanforderung wird weggenommen solange die Adaption nicht abgeschlossen ist | 0=Nein; 1=Ja |
| `226354` | 3 | `bit(A,6)` |  | Signal nicht stationär - Signal wackelt, Adaption wird nicht freigegeben | 0=Nein; 1=Ja |
| `226354` | 3 | `bit(A,5)` |  | keine Nulllage erkannt - Signal ausserhalb Nullage, Adaption wird nicht freigegeben | 0=Nein; 1=Ja |
| `226354` | 3 | `bit(A,7)` |  | Elektrischer Fehler - Rohwerte fehlerhaft | 0=Nein; 1=Ja |
| `226354` | 3 | `bit(A,0)` |  | gespeicherte Adaptionswerte aus dem MSG sind im gültigen Bereich | 0=Nein; 1=Ja |
| `226354` | 3 | `bit(A,3)` |  | Testerroutine fertig - negative Flanke der Adaptionsanforderung | 0=Nein; 1=Ja |
| `226354` | 3 | `bit(A,2)` |  | Adaptionsanforderung liegt an, Freigaben erfolgt und Entprellzeit bis zum Schreiben der Adaptionswerte noch nicht abgelaufen | 0=Nein; 1=Ja |
| `226354` | 3 | `bit(A,1)` |  | Adaptionsanforderung liegt an | 0=Nein; 1=Ja |
| `226355` | 3,4 | `s16(A,B)*0.003906` | mm | Ergebniswert der Neutralgangsensor Adaption |  |
| `226360` | 3,4 | `u16(A,B)` | min | Zeitdauer bis Schließen ESIM Schalter letzter Nachlauf |  |
| `226361` | 3 | `A-40` | °C | Speicher f. Außenlufttemp. Im letzten Rechner Nachlauf |  |
| `226362` | 3 | `bit(A,0)` |  | Offener Tankdeckel erkannt | 0=Nein; 1=Ja |
| `226363` | 3,4 | `u16(A,B)` |  | Vorbedingungen 1 für Grobleckprüfung |  |
| `226364` | 3,4 | `u16(A,B)` |  | Vorbedingungen 2 für Grobleckprüfung |  |
| `226365` | 3 | `bit(A,0)` |  | Anstoß der Routine Groblecktest durch Tester erfolgreich | 0=Nein; 1=Ja |
| `226366` | 3 | `bit(A,0)` |  | ESIM Groblecktest läuft | 0=Nein; 1=Ja |
| `226367` | 3 | `bit(A,0)` |  | ESIM Groblecktest fertig | 0=Nein; 1=Ja |
| `226368` | 3 | `bit(A,0)` |  | ESIM Groblecktest- kein Grobleck erkannt | 0=Nein; 1=Ja |
| `226369` | 3 | `bit(A,0)` |  | ESIM Groblecktest nicht bestanden | 0=Nein; 1=Ja |
| `226370` | 3,4 | `u16(A,B)` |  | Grobleckprüfung:Sammlung von Abbruchbedingungen |  |
| `226371` | 3 | `bit(A,0)` |  | ESIM Feinlecktest läuft | 0=Nein; 1=Ja |
| `226372` | 3 | `bit(A,0)` |  | ESIM Feinlecktest fertig | 0=Nein; 1=Ja |
| `226373` | 3 | `bit(A,0)` |  | ESIM Feinlecktest- kein Feinleck erkannt | 0=Nein; 1=Ja |
| `226374` | 3 | `A` |  | Feinleckprüfung:Sammlung von Abbruchbedingungen |  |
| `22637A` | 3 | `A` |  | Fuel On Adaption Status DMDADAP |  |
| `22637B` | 3,4 | `u16(A,B)` |  | Fuel On Adaption niedrige Last |  |
| `22637C` | 3,4 | `u16(A,B)` |  | Fuel On Adaption mittlere Last |  |
| `22637D` | 3,4 | `u16(A,B)` |  | Fuel On Adaption hohe Last |  |
| `22637E` | 3 | `A` |  | Zählindex für die Samples Erfassung |  |
| `226384` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` |  | Anzahl Zündungen im Homogen u. Schichtbetrieb |  |
| `226385` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` |  | Anzahl Zündungen im Schichtbetrieb |  |
| `226403` | 3,4 | `s16(A,B)*0.03125` |  | Leerlauf Drehzahlbegrenzung Zeitzaehler bis Aktivierung |  |
| `226404` | 3 | `bit(A,0)` |  | Leerlauf Drehzahlbegrenzung Grenzwert Zeitzaehler | 0=----; 1=TRUE |
| `226405` | 3,4 | `s16(A,B)*0.5` | 1/min | Leerlauf Drehzahlbegrenzung aktuelle Drehzahlgrenze |  |
| `226406` | 3 | `A` |  | Anzahl restl. Fahrzyklen f. Stoppverbot im Fahrzeugwerk |  |
| `226407` | 3,4 | `u16(A,B)` |  | Stoppverbot Verursacher Sammelnachricht |  |
| `226407` | 5 | `A` |  | Stoppverbot durch reversible Fehlerreaktion der erweiterten Überwachung | 0=----; 1=TRUE |
| `226407` | 6 | `A` |  | Stoppverbot durch reversible Fehlerreaktion der Überwachung | 0=----; 1=TRUE |
| `226407` | 7 | `A` |  | Stoppverbot durch reversible Fehlerreaktion der Überwachung durch Synchroverlust | 0=----; 1=TRUE |
| `226407` | 8 | `A` |  | Stoppverbot durch irreversible Fehlerreaktion mit Kraftstoffabschaltung | 0=----; 1=TRUE |
| `226407` | 9 | `A` |  | Stoppverbot durch irreversible Fehlerreaktion Funktionsrechner mit Kraftstoffabschaltung | 0=----; 1=TRUE |
| `226407` | 10 | `A` |  | Stoppverbot durch Anforderung Notluftfahren vom Funktionsrechner | 0=----; 1=TRUE |
| `226408` | 3 | `bit(A,0)` |  | Start Stopp Vorbedingg. mech. Getriebe Bremsmoment groesser Schwelle | 0=Nein; 1=Ja |
| `226408` | 3 | `bit(A,2)` |  | Start Stopp Vorbedingg. mech. Getriebe Geschwindigkeit kleiner Schwelle | 0=Nein; 1=Ja |
| `226408` | 3 | `bit(A,3)` |  | Start Stopp Vorbedingg. mech. Getriebe Triebstrang offen | 0=Nein; 1=Ja |
| `226408` | 4 | `bit(A,5)` |  | Start Stopp Vorbedingg. mech. Getriebe Fahrpedal kleiner Schwelle | 0=Nein; 1=Ja |
| `226408` | 4 | `bit(A,0)` |  | Start Stopp mech Getriebe System aktiviert über Geschwindigkeitsschwelle | 0=Nein; 1=Ja |
| `226408` | 4 | `bit(A,3)` |  | Start Stopp Vorbedingg. mech. Getriebe Lenkwinkel u. -geschwindigkeit kleiner Schwelle | 0=Nein; 1=Ja |
| `226408` | 4 | `bit(A,4)` |  | Start Stopp Vorbedingg. mech. Getriebe Motordrehzahl größer Schwelle | 0=Nein; 1=Ja |
| `226408` | 4 | `bit(A,1)` |  | Start Stopp Vorbedingg. mech. Getriebe System fehlerfrei und Freigaben bestehen | 0=Nein; 1=Ja |
| `226408` | 4 | `bit(A,6)` |  | Start Stopp Vorbedingg. mech. Getriebe automatischer Start nicht aktiv | 0=Nein; 1=Ja |
| `226409` | 3 | `bit(A,0)` |  | Start Stopp Fehlerstatus Bordnetzfehler | 0=Ja; 1=Nein |
| `226409` | 3 | `bit(A,5)` |  | Start Stopp Fehlerstatus Fahreranwesenheit FAE fehlerhaft | 0=Ja; 1=Nein |
| `226409` | 3 | `bit(A,2)` |  | Start Stopp Fehlerstatus Hill Start Assist (im ESP) oder Bremsunterdrucksensor | 0=Ja; 1=Nein |
| `226409` | 3 | `bit(A,1)` |  | Start Stopp Fehlerstatus Kommunikationsfehler ESP | 0=Ja; 1=Nein |
| `226409` | 3 | `bit(A,4)` |  | Start Stopp Fehlerstatus Kommunikationsfehler mit Lenkung | 0=Ja; 1=Nein |
| `226409` | 3 | `bit(A,3)` |  | Start Stopp Fehlerstatus Kommunikationsfehler mit elektr. Parkbremse | 0=Ja; 1=Nein |
| `226409` | 3 | `bit(A,7)` |  | Start Stopp Fehlerstatus Monitoring Stop/Startverhinderung war aktiv oder Startabbruch wg. eines Fehlers | 0=Ja; 1=Nein |
| `226409` | 3 | `bit(A,6)` |  | Start Stopp Fehlerstatus Motorhaube unplausibel oder Kommunikationsfehler | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,4)` |  | Start Stopp Fehlerstatus AT: KüB Fehler bzw. kein Fahrstufenwechsel nach P im Stoppmode; MT: Fehler Kupplungssensorik | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,5)` |  | Start Stopp Fehlerstatus Fahrpedalfehler | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,3)` |  | Start Stopp Fehlerstatus Getriebe meldet Fehler | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,6)` |  | Start Stopp Fehlerstatus Kommunikationsfehler Active Body Control liegt vor | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,2)` |  | Start Stopp Fehlerstatus (AG: Komm. Fehler) (SG: Nullagensensor) liegt vor | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,1)` |  | Start Stopp Fehlerstatus Kommunikationsfehler Shift by Wire Modul liegt vor | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,0)` |  | Start Stopp Fehlerstatus Motorfehler liegt vor | 0=Ja; 1=Nein |
| `226409` | 4 | `bit(A,7)` |  | Start Stopp Fehlerstatus Starter | 0=Ja; 1=Nein |
| `22640A` | 3 | `bit(A,1)` |  | Stoppverbot Verursacher Fahrpedal | 0=Nein; 1=Ja |
| `22640A` | 3 | `bit(A,2)` |  | Stoppverbot Verursacher Lenkrad | 0=Nein; 1=Ja |
| `22640A` | 4 | `bit(A,7)` |  | Stoppverbot durch Fahrzeuggeschwindigkeit (ggf. zuvor rückwärts gerollt) | 0=Nein; 1=Ja |
| `22640B` | 3 | `bit(A,2)` |  | Start Stopp Startanforderer Außentemperaturschwelle unterschritten | 0=Ja; 1=Nein |
| `22640B` | 3 | `bit(A,0)` |  | Start Stopp Startanforderer Bremsunterdruck | 0=Ja; 1=Nein |
| `22640B` | 3 | `bit(A,1)` |  | Start Stopp Startanforderer ECO-Taste aus | 0=Ja; 1=Nein |
| `22640B` | 3 | `bit(A,5)` |  | Start Stopp Startanforderer PKW: Einsatzfahrzeug, Transporter: PSM-Modul | 0=Ja; 1=Nein |
| `22640B` | 3 | `bit(A,3)` |  | Start Stopp Startanforderer Offroadpaket ist aktiv | 0=Ja; 1=Nein |
| `22640B` | 3 | `bit(A,4)` |  | Start Stopp Startanforderer Steigung erkannt | 0=Ja; 1=Nein |
| `22640B` | 3 | `bit(A,6)` |  | Start Stopp Startanforderer offene Motorhaube (oberhalb Geschw. Schwelle, nur bei Hybrid) | 0=Ja; 1=Nein |
| `22640B` | 4 | `bit(A,4)` |  | Start Stopp Startanforderer Bordnetz | 0=Ja; 1=Nein |
| `22640B` | 4 | `bit(A,7)` |  | Start Stopp Startanforderer Fahreranwesenheit (FAE) | 0=Ja; 1=Nein |
| `22640B` | 4 | `bit(A,6)` |  | Start Stopp Startanforderer Klima | 0=Ja; 1=Nein |
| `22640B` | 4 | `bit(A,5)` |  | Start Stopp Startanforderer Luftfeder | 0=Ja; 1=Nein |
| `22640B` | 4 | `bit(A,1)` |  | Start Stopp Startanforderer Motor | 0=Ja; 1=Nein |
| `22640B` | 4 | `bit(A,3)` |  | Start Stopp Startanforderer Starter | 0=Ja; 1=Nein |
| `22640B` | 4 | `bit(A,0)` |  | Start Stopp Startanforderer fehlerhaftes System | 0=Ja; 1=Nein |
| `22640C` | 3 | `bit(A,2)` |  | Stoppverbot Verursacher Außentemperaturschwelle | 0=Ja; 1=Nein |
| `22640C` | 3 | `bit(A,0)` |  | Stoppverbot Verursacher Bremsunterdruck | 0=Ja; 1=Nein |
| `22640C` | 3 | `bit(A,1)` |  | Stoppverbot Verursacher ECO-Taste | 0=Ja; 1=Nein |
| `22640C` | 3 | `bit(A,5)` |  | Stoppverbot Verursacher PKW: Einsatzfahrzeug, Transporter: PSM-Modul | 0=Ja; 1=Nein |
| `22640C` | 3 | `bit(A,6)` |  | Stoppverbot Verursacher Motorhaube | 0=Ja; 1=Nein |
| `22640C` | 3 | `bit(A,3)` |  | Stoppverbot Verursacher Offroadpaket aktiv | 0=Ja; 1=Nein |
| `22640C` | 3 | `bit(A,4)` |  | Stoppverbot Verursacher Steigung erkannt | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,4)` |  | Stoppverbot Verursacher Bordnetz | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,7)` |  | Stoppverbot Verursacher Fahreranwesenheit FAE | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,2)` |  | Stoppverbot Verursacher Getriebe | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,6)` |  | Stoppverbot Verursacher Klima | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,5)` |  | Stoppverbot Verursacher Luftfeder | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,1)` |  | Stoppverbot Verursacher Motor | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,3)` |  | Stoppverbot Verursacher Starter | 0=Ja; 1=Nein |
| `22640C` | 4 | `bit(A,0)` |  | Stoppverbot Verursacher System fehlerhaft | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,0)` |  | Start Stopp vorheriger Fehlerstatus Bordnetzfehler | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,5)` |  | Start Stopp vorheriger Fehlerstatus FAE fehlerhaft | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,2)` |  | Start Stopp vorheriger Fehlerstatus Hill Start Assist (im ESP) oder Bremsunterdrucksensor | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,1)` |  | Start Stopp vorheriger Fehlerstatus Kommunikationsfehler ESP | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,4)` |  | Start Stopp vorheriger Fehlerstatus Kommunikationsfehler mit Lenkung | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,3)` |  | Start Stopp vorheriger Fehlerstatus Kommunikationsfehler mit elektr. Parkbremse | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,7)` |  | Start Stopp vorheriger Fehlerstatus Monitoring Stop/Startverhinderung war aktiv oder Startabbruch wg. eines | 0=Ja; 1=Nein |
| `22640D` | 3 | `bit(A,6)` |  | Start Stopp vorheriger Fehlerstatus Motorhaube unplausibel oder Kommunikationsfehler | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,4)` |  | Start Stopp vorheriger Fehlerstatus AT: KüB Fehler bzw. kein Fahrstufenwechsel nach P im Stoppmode; MT: Fehl | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,5)` |  | Start Stopp vorheriger Fehlerstatus Fahrpedalfehler | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,3)` |  | Start Stopp vorheriger Fehlerstatus Getriebe meldet Fehler | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,6)` |  | Start Stopp vorheriger Fehlerstatus Kommunikationsfehler Active Body Control | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,2)` |  | Start Stopp vorheriger Fehlerstatus (AG: Komm. Fehler) (SG: Nullagensensor) liegt vor | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,1)` |  | Start Stopp vorheriger Fehlerstatus Kommunikationsfehler Shift by Wire Modul liegt vor | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,0)` |  | Start Stopp vorheriger Fehlerstatus Motorfehler liegt vor | 0=Ja; 1=Nein |
| `22640D` | 4 | `bit(A,7)` |  | Start Stopp vorheriger Fehlerstatus Starter | 0=Ja; 1=Nein |
| `22640E` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` | Km | Start Stopp vorheriger Fehlerstatus km-Stand bei Abspeicherung |  |
| `22640F` | 3 | `bit(A,0)` |  | Stoppverbot Verursacher MSG Innentemperatur | 0=Ja; 1=Nein |
| `22640F` | 3 | `bit(A,1)` |  | Stoppverbot Verursacher Katheizen | 0=Ja; 1=Nein |
| `22640F` | 3 | `bit(A,4)` |  | Stoppverbot Verursacher Kraftstofftemperatur | 0=Ja; 1=Nein |
| `22640F` | 3 | `bit(A,7)` |  | Stoppverbot Verursacher Kühlmitteltemperatur | 0=Ja; 1=Nein |
| `22640F` | 3 | `bit(A,5)` |  | Stoppverbot Verursacher Öltemperatur | 0=Ja; 1=Nein |
| `22640F` | 3 | `bit(A,3)` |  | Stoppverbot Verursacher Raildruck | 0=Ja; 1=Nein |
| `22640F` | 3 | `bit(A,6)` |  | Stoppverbot Verursacher Ugebungsdruck | 0=Ja; 1=Nein |
| `22640F` | 3 | `bit(A,2)` |  | Stoppverbot Verursacher Wärmemanagement | 0=Ja; 1=Nein |
| `22640F` | 4 | `bit(A,1)` |  | Stoppverbot Verursacher gespeicherte Kühlmitteltemperatur | 0=Ja; 1=Nein |
| `22640F` | 4 | `bit(A,5)` |  | Stoppverbot Verursacher Motorsteuerung | 0=Ja; 1=Nein |
| `22640F` | 4 | `bit(A,3)` |  | Stoppverbot Verursacher Nox Speicher Kat | 0=Ja; 1=Nein |
| `22640F` | 4 | `bit(A,0)` |  | Stoppverbot Verursacher Tankfüllstand | 0=Ja; 1=Nein |
| `22640F` | 4 | `bit(A,7)` |  | Stoppverbot Verursacher keine Diagnosen in Motorsteuerung aktiv | 0=Ja; 1=Nein |
| `22640F` | 4 | `bit(A,6)` |  | Stoppverbot Verursacher keine Startanforderung aus motorischer Sicht | 0=Ja; 1=Nein |
| `226410` | 3,4 | `u16(A,B)*0.01` | s | ESIM Groblecktest Zeit bis Diagnose bestanden |  |
| `226411` | 3,4 | `u16(A,B)*0.01` | s | ESIM Groblecktest aktuelle Testdauer |  |
| `226416` | 3 | `bit(A,4)` |  | Start Stopp Startanforderer Diagnosen in Motorsteuerung aktiv | 0=Nein; 1=Ja |
| `226416` | 3 | `bit(A,1)` |  | Start Stopp Startanforderer Katalysatortemperatur | 0=Nein; 1=Ja |
| `226416` | 3 | `bit(A,0)` |  | Start Stopp Startanforderer Kühlmitteltemperatur | 0=Nein; 1=Ja |
| `226416` | 3 | `bit(A,2)` |  | Start Stopp Startanforderer Raildruck | 0=Nein; 1=Ja |
| `226416` | 3 | `bit(A,3)` |  | Start Stopp Startanforderer Stoppzeit | 0=Nein; 1=Ja |
| `226420` | 3 | `bit(A,0)` |  | Gemischadaption FAPAFG läuft | 0=Nein; 1=Ja |
| `226421` | 3 | `bit(A,0)` |  | Gemischadaption FAPAFG fertig | 0=Nein; 1=Ja |
| `226422` | 3 | `A` |  | Aktueller Betriebsbereich |  |
| `226423` | 3 | `bit(A,0)` |  | FAPAFG Reset der Gradienten Stabilität | 0=Nein; 1=Ja |
| `226424` | 3 | `bit(A,0)` |  | FAPAFG Reset der Offset Stabilität | 0=Nein; 1=Ja |
| `226425` | 3,4 | `u16(A,B)*0.001526` | % | FAPAFG Momenten Reserve bei Funktionsanforderung |  |
| `226426` | 3 | `bit(A,3)` |  | FAPAFG - Allgemeiner Abbruch | 0=Nein; 1=Ja |
| `226426` | 3 | `bit(A,7)` |  | FAPAFG - Abbruch durch Überwachung Ebene 2 | 0=Nein; 1=Ja |
| `226426` | 3 | `bit(A,6)` |  | FAPAFG - Ansauglufttemperatur zu hoch | 0=Nein; 1=Ja |
| `226426` | 3 | `bit(A,1)` |  | FAPAFG - Fehler erkannt durch FAPAFG oder vorausgesetzter Funktion | 0=Nein; 1=Ja |
| `226426` | 3 | `bit(A,4)` |  | FAPAFG - sperrender Fehlerspeichereintrag vorhanden | 0=Nein; 1=Ja |
| `226426` | 3 | `A` |  | FAPAFG Statusbyte |  |
| `226426` | 3 | `bit(A,5)` |  | FAPAFG - Kühlmitteltemp zu niedrig oder keine Lambdaregelung | 0=Nein; 1=Ja |
| `226427` | 3 | `A*10` | 1/min | FAPAFG Solldrehzahl während der Routine |  |
| `226428` | 3,4 | `s16(A,B)*0.1` | kg/h | FAPAFG Ergebnis adaptierter Offset Massenstrom |  |
| `226429` | 3,4 | `s16(A,B)*0.078125` | hPa | FAPAFG Ergebnis adaptierter Offset Saugrohrdruck |  |
| `22642A` | 3 | `bit(A,0)` |  | FAPAFG - Info: Lastanforderung liegt vor (Lüfter, Klima?) | 0=Nein; 1=Ja |
| `22642B` | 3 | `bit(A,4)` |  | Fahrerlose Drehzahlanhebung abgebrochen weil Bremse betätigt | 0=Nein; 1=Ja |
| `22642B` | 3 | `bit(A,1)` |  | Fahrerlose Drehzahlanhebung abgebrochen weil Bremseninfo unplausibel | 0=Nein; 1=Ja |
| `22642B` | 3 | `bit(A,5)` |  | Fahrerlose Drehzahlanhebung abgebrochen weil FAPAFG inaktiv | 0=Nein; 1=Ja |
| `22642B` | 3 | `bit(A,3)` |  | Fahrerlose Drehzahlanhebung abgebrochen weil Fahrpedal betätigt | 0=Nein; 1=Ja |
| `22642B` | 3 | `bit(A,2)` |  | Fahrerlose Drehzahlanhebung abgebrochen weil Fahrzeug nicht steht | 0=Nein; 1=Ja |
| `22642B` | 3 | `A` |  | Fahrerlose Drehzahlanhebung Abbruchstatus Gesamt |  |
| `22642B` | 3 | `bit(A,6)` |  | Fahrerlose Drehzahlanhebung abgebrochen weil Lambda Adaption inaktiv | 0=Nein; 1=Ja |
| `22642B` | 3 | `bit(A,0)` |  | Fahrerlose Drehzahlanhebung abgebrochen wegen aktivem PrelCO Reset | 0=Nein; 1=Ja |
| `22642C` | 3 | `bit(A,0)` |  | Überwachung erlaubt fahrerlose Drehzahlanhebung | 0=Nein; 1=Ja |
| `226430` | 3,4 | `u16(A,B)*0.078125` | hPa | gefilterter Saugrohrdruck |  |
| `226431` | 3,4 | `u16(A,B)*0.001526` | % | koordiniertes Motordrehmoment für Füllung |  |
| `226432` | 3,4 | `u16(A,B)*0.078125` | hPa | gefilterter und plausibilisierter Saugrohrdruck |  |
| `226433` | 3,4 | `u16(A,B)*0.001526` | % | Motor Referenzmoment für Aussetzererkennung |  |
| `226434` | 3,4 | `u16(A,B)*0.001526` | % | Gefiltertes Verlustmoment des Motors |  |
| `226435` | 3 | `bit(A,0)` |  | Fuel-Off Adaption Fertig Bereich1 im end of line Modus | 0=Nein; 1=Ja |
| `226436` | 3,4 | `u16(A,B)*0.000153-5` | ° | Fuel Off Adaption Lernfilter aktuell Katheiz Segment |  |
| `226437` | 3 | `A` |  | Fuel Off Adaption Lernfilter Resetzähler |  |
| `226438` | 3 | `A` |  | Fuel Off Adaption Lernfilter Resetzähler Katheiz Segment |  |
| `22643B` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.05` | us | Fuel Off Adadaption korrigierte Segmentdauer |  |
| `226440` | 3,4 | `u16(A,B)*0.000031` |  | Faktor für Korrektur Solldifferenz zwischen Druck in WG-Druckdose und Umgebungsdruck |  |
| `226441` | 3,4 | `s16(A,B)*0.039062` | hPa | Offset für Korrektur Solldifferenz zwischen Druck in WG-Druckdose und Umgebungsdruck |  |
| `226442` | 3,4 | `s16(A,B)*0.000061` |  | Ladedruck Regelabweichung |  |
| `226443` | 3,4 | `s16(A,B)*0.078125` | hPa | Gemittelte Ladedruck Regelabweichung |  |
| `226444` | 3,4 | `s16(A,B)*0.000061` |  | Integralanteil vom Ladedruck PID Regler |  |
| `226445` | 3,4 | `u16(A,B)*0.078125` | hPa | Sollwert des Ladedruck PID Reglers |  |
| `226450` | 3,4 | `u16(A,B)*0.001526` | % | Anteil der Betriebsart Schicht an der Gesamtzeit |  |
| `226451` | 3,4 | `u16(A,B)*0.001526` | % | Anteil der Betriebsart Homogen an der Gesamtzeit |  |
| `226452` | 3,4 | `u16(A,B)*0.001526` | % | Anteil der Betriebsart Homogen Klopfschutz an der Gesamtzeit |  |
| `226453` | 3,4 | `u16(A,B)*0.001526` | % | Anteil der Betriebsart Homogen Mager an der Gesamtzeit |  |
| `226454` | 3,4 | `u16(A,B)*0.001526` | % | Anteil der Betriebsart Homogen Schicht an der Gesamtzeit |  |
| `226455` | 3,4 | `u16(A,B)*0.001526` | % | Anteil der Betriebsart Homogen Split an der Gesamtzeit |  |
| `226458` | 3,4 | `u16(A,B)` |  | Prioritätswert des Diagnose Schedulers für Gemischadaption ora |  |
| `22646A` | 3 | `A` |  | Status der Routine -Erweiterte Analyse Stoppverhinderer- |  |
| `226470` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Abgastemperatur NOX Kat aus Modell Bank 1 |  |
| `226471` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Abgastemperatur NOX Kat aus Modell Bank 2 |  |
| `226472` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Max. Abgastemperatur im NOX Kat Bank 1 |  |
| `226473` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Max. Abgastemperatur im NOX Kat Bank 2 |  |
| `226474` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Abgastemperatur NOX Kat aus alternativ Modell Bank 1 |  |
| `226475` | 3,4 | `u16(A,B)*0.023438-273.149994` | °C | Abgastemperatur NOX Kat aus alternativ Modell Bank 2 |  |
| `22649C` | 3,4 | `u16(A,B)*0.2` | s | Gemischadaption Count Down Zähler für physikalische Dringlichkeiten |  |
| `2264A0` | 3 | `bit(A,0)` |  | Laufunruhedifferenz-Testgröße größer Schwelle im akt. Betriebsbereich | 0=Nein; 1=Ja |
| `2264A1` | 3 | `bit(A,0)` |  | Motorlaufunruhe größer Schwelle im akt. Betriebsbereich | 0=Nein; 1=Ja |
| `2264A2` | 3 | `bit(A,0)` |  | Aussetzer erkannt - Verknüpfung mehrerer Funktionen | 0=Nein; 1=Ja |
| `2264A3` | 3 | `A` |  | Kraftstoffmenge ab Reset für Reiserechner wurde erfolgreich geschrieben |  |
| `226501` | 3,4 | `u16(A,B)*0.000122` |  | Korrekturfaktor Innerwiderstand HV Batterie beim Laden |  |
| `226502` | 3,4 | `u16(A,B)*0.000122` |  | Korrekturfaktor Innerwiderstand HV Batterie beim Entaden |  |
| `226503` | 3,4 | `s16(A,B)*0.1` | A | Batteriestrom der HV-Batterie |  |
| `226504` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` | As | Stromintegral zur Bestimmung der Kapazitaet der HV-Batterie |  |
| `226505` | 3,4 | `u16(A,B)*0.1` | % | Ladezustand (SOC) der HV-Batterie |  |
| `226506` | 3,4 | `u16(A,B)*0.1` | % | Ladezustand (SOC) der HV-Batterie nach Spannungs-tabelle |  |
| `226509` | 3,4 | `u16(A,B)` | As | Aktuelle Kapazität der HV-Batterie |  |
| `226511` | 3 | `A` |  | Status des HV Batterie Befundungstests |  |
| `226511` | 4,5 | `u16(A,B)*10` | As | Ergebnis HV Batterie Befundungstest - Kapazität |  |
| `226511` | 6,7 | `u16(A,B)*0.01` | V | Ergebnis HV Batterie Befundungstest - Startspannung |  |
| `226511` | 53,54 | `u16(A,B)*0.000122` |  | Ergebnis HV Batterie Befundungstest - Widerstandsabgleich bei Ladung |  |
| `226511` | 55,56 | `u16(A,B)*0.000122` |  | Ergebnis HV Batterie Befundungstest - Widerstandsabgleich bei Entladung |  |
| `226511` | 57,58 | `u16(A,B)` | V | Ergebnis HV Batterie Befundungstest - max. Zellenspannung bei Widerstandsmessung |  |
| `226511` | 59,60 | `u16(A,B)` | V | Ergebnis HV Batterie Befundungstest - max. Zellenspannung bei Kapazitätsmessung |  |
| `226511` | 61 | `A` |  | Ergebnis HV Batterie Befundungstest - Umgebungsinfo über Widerstandsmessung |  |
| `226520` | 3,4 | `u16(A,B)` |  | log. Nummer des Zyl., der zu einer Grenzwertverletzung der Mengenfehlerkomp. Führt |  |
| `226521` | 3 | `A` |  | log. Nummer des Zyl., der durch Aussetzer zu einem Fehler der Mengenfehlerkomp. Führt |  |
| `226522` | 3 | `s8(A)*0.003906` |  | Vorsteuerkorrekturwert der Mengenfehlerkompensation |  |
| `226523` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 1 |  |
| `226524` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 2 |  |
| `226525` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 3 |  |
| `226526` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 4 |  |
| `226527` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 5 |  |
| `226528` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 6 |  |
| `226529` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 7 |  |
| `22652A` | 3,4 | `s16(A,B)*0.000015` |  | Eingriffswert der Mengenfehlerkompensation HWZyl 8 |  |
| `226531` | 3 | `A*0.75-48` | °C | modellierte Eigentemperatur der Piezoinjektoren |  |
| `226532` | 3,4 | `s16(A,B)*0.000015` |  | Offset Kleinmengenadaption Bank 1 |  |
| `226532` | 5,6 | `s16(A,B)*0.000015` |  | Offset Mittlere Mengen Adaptionswerte Bank 1 |  |
| `226533` | 3,4 | `s16(A,B)*0.000015` |  | Offset Kleinmengenadaption Bank 2 |  |
| `226533` | 5,6 | `s16(A,B)*0.000015` |  | Offset Mittlere Mengen Adaptionswerte Bank 2 |  |
| `226534` | 3,4 | `u16(A,B)` |  | Zähler für Anzahl Überspannungsereignisse Piezoinjektoren |  |
| `226535` | 3,4 | `u16(A,B)*0.000031` |  | CSERS Schleppzeiger relative Abweichung der Ladung |  |
| `226536` | 3,4 | `s16(A,B)*0.023438` | ° | CSERS Schleppzeiger absolute Abweichung der Einspritzwinkel |  |
| `226537` | 3,4 | `u16(A,B)*0.000031` |  | CSERS Schleppzeiger relative Abweichung der Einspritzzeit |  |
| `226538` | 3 | `A` |  | Zähler CSERS Winkelfehler unplausibel |  |
| `226539` | 3,4 | `u16(A,B)` |  | Zähler CSERS relevante, fehlerhafte Einspritzungen |  |
| `22653B` | 3,4 | `u16(A,B)` |  | CSERS Anzahl fehlerhafter Verbrennungen mit Bedingung Katheizen mit Mehrfacheinspritzung aktiv |  |
| `22653C` | 3,4 | `u16(A,B)*0.001` | ms | Kleinmengenadaption Offset Stützstellen Einspritzzeit |  |
| `22653C` | 5,6 | `u16(A,B)*0.001` | ms | Mittlere Mengen Adaption Offset Stützstellen Einspritzzeit |  |
| `22653C` | 7,8 | `u16(A,B)*0.001` | ms | Linearer Mengenbereich Adaption Offset Stützstellen Einspritzzeit |  |
| `226540` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 1 |  |
| `226541` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 2 |  |
| `226542` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 3 |  |
| `226543` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 4 |  |
| `226544` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 5 |  |
| `226545` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 6 |  |
| `226546` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 7 |  |
| `226547` | 3,4 | `u16(A,B)*0.004883` | V | Klopferkennung Referenzpegel Zylinder 8 |  |
| `226550` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 1 |  |
| `226551` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 2 |  |
| `226552` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 3 |  |
| `226553` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 4 |  |
| `226554` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 5 |  |
| `226555` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 6 |  |
| `226556` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 7 |  |
| `226557` | 3,4 | `u16(A,B)*0.000031` |  | Piezoinjektoren Hubkorrektur_Kompensationsfaktor Zylinder 8 |  |
| `226560` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 1 |  |
| `226561` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 2 |  |
| `226562` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 3 |  |
| `226563` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 4 |  |
| `226564` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 5 |  |
| `226565` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 6 |  |
| `226566` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 7 |  |
| `226567` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Ladungsregelung Stellgröße Zylinder 8 |  |
| `226570` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 1 |  |
| `226570` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 1 |  |
| `226571` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 2 |  |
| `226571` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 2 |  |
| `226572` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 3 |  |
| `226572` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 3 |  |
| `226573` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 4 |  |
| `226573` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 4 |  |
| `226574` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 5 |  |
| `226574` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 5 |  |
| `226575` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 6 |  |
| `226575` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 6 |  |
| `226576` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 7 |  |
| `226576` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 7 |  |
| `226577` | 3,4 | `s16(A,B)*0.000015` |  | Piezoinjektoren Kleinmengenadaptionswerte Zylinder 8 |  |
| `226577` | 5,6 | `s16(A,B)*0.000015` |  | Piezoinjektoren Mittlere Mengen Adaptionswerte Zylinder 8 |  |
| `226580` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 1 |  |
| `226581` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 2 |  |
| `226582` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 3 |  |
| `226583` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 4 |  |
| `226584` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 5 |  |
| `226585` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 6 |  |
| `226586` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 7 |  |
| `226587` | 3,4 | `u16(A,B)*0.000031` |  | Lambdaabweichung Zylinder 8 |  |
| `226590` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 1 |  |
| `226591` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 2 |  |
| `226592` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 3 |  |
| `226593` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 4 |  |
| `226594` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 5 |  |
| `226595` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 6 |  |
| `226596` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 7 |  |
| `226597` | 3,4 | `s16(A,B)*0.000488` |  | Piezoinjektoren Entladeregler Stellgröße Zylinder 8 |  |
| `2265A0` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 1 |  |
| `2265A1` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 2 |  |
| `2265A2` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 3 |  |
| `2265A3` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 4 |  |
| `2265A4` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 5 |  |
| `2265A5` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 6 |  |
| `2265A6` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 7 |  |
| `2265A7` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Homogen Zylinder 8 |  |
| `2265B0` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 1 |  |
| `2265B1` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 2 |  |
| `2265B2` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 3 |  |
| `2265B3` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 4 |  |
| `2265B4` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 5 |  |
| `2265B5` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 6 |  |
| `2265B6` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 7 |  |
| `2265B7` | 3,4 | `u16(A,B)` |  | Zündaussetzerzähler Schicht Zylinder 8 |  |
| `2265C0` | 3 | `bit(A,0)` |  | Bereitschaft zur Schubabschaltung | 0=Nein; 1=Ja |
| `2265C1` | 3 | `bit(A,0)` |  | Bereitschaft zur Schubabschaltung trotz Bauteileschutz | 0=Ja; 1=Nein |
| `2265C2` | 3 | `bit(A,0)` |  | Bereitschaft zur Schubabschaltung für Regenerierventil TEV Schließen | 0=Nein; 1=Ja |
| `2265C3` | 3 | `bit(A,0)` |  | Bereitschaft zur Schubabschaltung von AGK | 0=Ja; 1=Nein |
| `2265C4` | 3 | `bit(A,0)` |  | Bereitschaft zur Schubabschaltung freigegeben | 0=Nein; 1=Ja |
| `2265C5` | 3 | `bit(A,0)` |  | Bereitschaft zur Schubabschaltung aus Abgastemperaturmodell | 0=Nein; 1=Ja |
| `2265C6` | 3 | `bit(A,0)` |  | Anfettung bzw. Füllungsreduktion zur Reduktion Abgastemperatur aktiv | 0=Nein; 1=Ja |
| `2265F0` | 3,4 | `u16(A,B)*0.1` | Km | Wegstrecke damit EONV ablaufen kann |  |
| `2265F1` | 3,4 | `u16(A,B)*0.1` | s | Motorlaufzeit damit EONV ablaufen kann |  |
| `2265F2` | 3 | `A` |  | Fehler weshalb EONV über Tester nicht abläuft |  |
| `2265F3` | 3 | `A` |  | Grund weshalb EONV über Tester nicht abläuft |  |
| `2265F4` | 3 | `A` |  | Status zum EONV Start durch Tester |  |
| `2265F5` | 3 | `A` |  | Zustand Tankleckdiagnose Servicetest |  |
| `2265F6` | 3 | `A` |  | Aufzählung Abbruch EONV Service Test |  |
| `2265F7` | 3 | `A` |  | Ergebnis von EONV Service Test |  |
| `226600` | 3,4 | `u16(A,B)` | s | Motorabstellzeit |  |
| `226601` | 3 | `bit(A,0)` |  | Motorabstellzeit ist gültig | 0=Nein; 1=Ja |
| `226602` | 3 | `bit(A,0)` |  | O2 Sonde nach Kat Beginn Überwachung in Bereichsprüfung Bank 1 | 0=Nein; 1=Ja |
| `226603` | 3 | `bit(A,0)` |  | O2 Sonde nach Kat Beginn Überwachung in Bereichsprüfung Bank 2 | 0=Nein; 1=Ja |
| `226641` | 3,4 | `s16(A,B)*0.001` | g | Ruß Beladungsgrad des Otto Partikelfilters |  |
| `226642` | 3 | `bit(A,0)` |  | Regeneration des Otto Partikelfilters war erfolgreich | 0=Nein; 1=Ja |
| `226643` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` | m | Fahrstrecke seit letzter erfolgreicher Otto Partikelfilter Regeneration |  |
| `226644` | 3,4 | `s16(A,B)*0.001` |  | Ruß Entlastungsrate während der Otto Partikelfilter Regeneration |  |
| `226645` | 3 | `bit(A,0)` |  | Partikelfilter Regeneration: Zeitkriterium abgelaufen | 0=Nein; 1=Ja |
| `226646` | 3 | `bit(A,0)` |  | Partikelfilter Regeneration: Ansauglufttemperatur kleiner Schwelle | 0=Nein; 1=Ja |
| `226647` | 3 | `bit(A,0)` |  | Partikelfilter Regeneration: Abgas Modelltemp. weicht zu stark von Solltemp. ab | 0=Nein; 1=Ja |
| `226648` | 3 | `bit(A,0)` |  | Partikelfilter Regeneration: Modell zeigt genügend Rußmasse um Reg. freizugeben | 0=Ja; 1=Nein |
| `226670` | 3 | `bit(A,0)` |  | FBS4 Steuergerät | 0=Nein; 1=Ja |
| `226671` | 3 | `bit(A,4)` |  | Status der FBS4 Wegfahrsperre - Aktiviert | 0=Nein; 1=Ja |
| `226671` | 3 | `bit(A,6)` |  | Status der FBS4 Wegfahrsperre - Authentifikation laeuft | 0=Nein; 1=Ja |
| `226671` | 3 | `bit(A,1)` |  | Status der FBS4 Wegfahrsperre - Initialisiert | 0=Nein; 1=Ja |
| `226671` | 3 | `bit(A,0)` |  | Status der FBS4 Wegfahrsperre - Komplettiert (ist im Feld Fehler) | 0=Nein; 1=Ja |
| `226671` | 3 | `bit(A,3)` |  | Status der FBS4 Wegfahrsperre - Personalisiert | 0=Nein; 1=Ja |
| `226671` | 3 | `A` |  | Status der FBS4 Wegfahrsperre |  |
| `226672` | 3 | `bit(A,0)` |  | Status der FBS4 Wegfahrsperre - Startfreigabe | 0=Nein; 1=Ja |
| `22B000` | 3 | `bit(A,0)` |  | Readiness Katalysator | 0=Ja; 1=Nein |
| `22B001` | 3 | `bit(A,0)` |  | Readiness Sekundaerluftsystem | 0=Ja; 1=Nein |
| `22B002` | 3 | `bit(A,0)` |  | Readiness O2-Sonde | 0=Ja; 1=Nein |
| `22B003` | 3 | `bit(A,0)` |  | Readiness O2-Sondenheizung | 0=Ja; 1=Nein |
| `22B004` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ora2 LR-Adaption Additiv Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B005` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ora LR-Adaption Additiv Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B006` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_fra2 LR-Adaption Multiplikativ Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B007` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_fra LR-Adaption Multiplikativ Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B008` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_dylsu LSU Dynamikdiagnose Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B009` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_dylsu2 LSU Dynamikdiagnose Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B010` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_helsu LSU Fehlerpfad HELSU Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B011` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_helsu2 LSU Fehlerpfad HELSU Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B012` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hsh LS Heizung hinter Kat (DE: NOx) Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B013` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hsh2 LS Heizung hinter Kat (DE: NOx) Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B014` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hshe LS Heizung hinter Kat (DE: NOx) Endstufe Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B015` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hshe2 LS Heizung hinter Kat (DE: NOx) Endstufe Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B016` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hsv LS Heizung vor Kat Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B017` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hsv2 LS Heizung vor Kat Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B018` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hsve LS Heizung vor Kat Endstufe Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B019` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_hsve2 LS Heizung vor Kat Endstufe Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B020` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_iclsu LSU Auswerte IC Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B021` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_iclsu2 LSU Auswerte IC Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B022` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lash LS Alterung hinter Kat (DE: NOx) Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B023` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lash2 LS Alterung hinter Kat (DE: NOx)Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B024` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lshv LS Vertauschung_Hinter_Kat (DE: NOx) | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B025` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsvv LS Vertauschung_Vor_Kat | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B026` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ulsu LS an Luft Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B027` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ulsu2 LS an Luft Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B028` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsh LS hinter Kat (DE: NOx) Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B029` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsh2 LS hinter Kat (DE: NOx) Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B030` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuia LS Leitung an Bond IA Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B031` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuia2 LS Leitung an Bond IA Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B032` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuip Leitungssunterbrechung an IP Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B033` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuip2 Leitungssunterbrechung an IP Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B034` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuks Kurzschluss Sondenleitung Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B035` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuks2 Kurzschluss Sondenleitung Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B036` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuun LS Leitung an Bond UN Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B037` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuun2 LS Leitung an Bond UN Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B038` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuvm LS Leitung an Bond VM Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B039` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsuvm2 LS Leitung an Bond VM Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B040` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsv LS vor Kat Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B041` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsv2 LS vor Kat Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B042` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsve Elektrischer Fehler Vor Kat Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B043` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_lsve2 Elektrischer Fehler Vor Kat Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B044` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_pllsu Plausibilitaet der LSU Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B045` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_pllsu2 Plausibilitaet der LSU Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B046` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwkwe Zuordnung Einlass NW zu KW Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B047` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwkwe2 Zuordnung Einlass NW zu KW Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B048` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwkwa Zuordnung Auslass NW zu KW Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B049` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwkwa2 Zuordnung Auslass NW zu KW Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B050` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwvpe Verriegelungsposition Einlass waehrend Start Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B051` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwvpe2 Verriegelungsposition Einlass waehrend Start Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B052` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwvpa Verriegelungsposition Auslass waehrend Start Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B053` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_nwvpa2 Verriegelungsposition Auslass waehrend Start Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B054` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_sls Sekundaerluftsystem Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B055` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_sls2 Sekundaerluftsystem Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B056` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_slv Sekundaerventil Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B057` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_slv2 Sekundaerventil Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B058` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_slpe Sekundaerpumpe Endstufe | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B059` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_slve Sekundaerventil Endstufe | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B060` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_aav Absperrventil Aktivkohlefilter | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B061` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_tesf Tankentlueftlungssystem_Feinleck | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B062` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_tesg Tankentlueftlungssystem_Grobleck | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B063` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_tesk Tankentlueftlungssystem_Kleinstleck | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B064` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_tldtev Tankentlueftlungssystem_TLD | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B065` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agrs | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B066` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agre | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B067` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agre2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B068` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agrvm | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B069` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agrvm2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B070` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agrl | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B071` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agrl2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B072` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agrv | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B073` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agrv2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B074` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agro | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B075` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ agro2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B078` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_kat Frontkatalysator Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B079` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_kat2 Frontkatalysator Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B07A` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_katno NOx Katalysator Bank 1 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B07B` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_katno2 NOx Katalysator Bank 2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B080` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ lasfk | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B081` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ lasfk2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B082` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ hsf | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B083` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ hsf2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B084` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ hsfe | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B085` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ hsfe2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B086` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ lsf | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B087` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ lsf2 | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B088` | 3 | `((A>>0)&3)` |  | Statusbyte DFP_ lsfv | 0=Pending; 1=Undefiniert; 2=Ok; 3=Fault |
| `22B100` | 3 | `bit(A,7)` |  | Readiness PID 1 - EGR and/or VVT system monitoring | 0=Ready; 1=NotReady |
| `22B100` | 3 | `bit(A,0)` |  | Readiness PID 1 - Catalyst monitoring | 0=Ready; 1=NotReady |
| `22B100` | 3 | `bit(A,1)` |  | Readiness PID 1 - Heated catalyst monitoring | 0=Ready; 1=NotReady |
| `22B100` | 3 | `bit(A,4)` |  | Readiness PID 1 - A/C system refrigerant monitoring | 0=Ready; 1=NotReady |
| `22B100` | 3 | `bit(A,5)` |  | Readiness PID 1 - Oxygen sensor monitoring | 0=Ready; 1=NotReady |
| `22B100` | 3 | `bit(A,6)` |  | Readiness PID 1 - Oxygen sensor heater monitoring | 0=Ready; 1=NotReady |
| `22B100` | 3 | `bit(A,3)` |  | Readiness PID 1 - Secondary air system monitoring | 0=Ready; 1=NotReady |
| `22B100` | 3 | `bit(A,2)` |  | Readiness PID 1 - Evaporative system monitoring | 0=Ready; 1=NotReady |
| `22B101` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))` |  | Readiness Informationen aus Service 1 PID 41 |  |
| `22B500` | 3,4 | `u16(A,B)` |  | RBM Zündzyklenzähler |  |
| `22B501` | 3,4 | `u16(A,B)` |  | RBM Allgemeiner Nenner |  |
| `22B502` | 3,4 | `u16(A,B)` |  | RBM Zaehler Katalysator Bank 1 |  |
| `22B503` | 3,4 | `u16(A,B)` |  | RBM Nenner Katalysator Bank 1 |  |
| `22B504` | 3,4 | `u16(A,B)` |  | RBM Zaehler Katalysator Bank 2 |  |
| `22B505` | 3,4 | `u16(A,B)` |  | RBM Nenner Katalysator Bank 2 |  |
| `22B506` | 3,4 | `u16(A,B)` |  | RBM Zaehler EVAP |  |
| `22B507` | 3,4 | `u16(A,B)` |  | RBM Nenner EVAP |  |
| `22B508` | 3,4 | `u16(A,B)` |  | RBM Zaehler Sekundärluft |  |
| `22B509` | 3,4 | `u16(A,B)` |  | RBM Nenner Sekundärluft |  |
| `22B510` | 3,4 | `u16(A,B)` |  | RBM Zaehler O2-Sensor Bank 1 |  |
| `22B511` | 3,4 | `u16(A,B)` |  | RBM Nenner O2-Sensor Bank 1 |  |
| `22B512` | 3,4 | `u16(A,B)` |  | RBM Zaehler O2-Sensor Bank 2 |  |
| `22B513` | 3,4 | `u16(A,B)` |  | RBM Nenner O2-Sensor Bank 2 |  |
| `22B514` | 3,4 | `u16(A,B)` |  | RBM Zaehler AGR/VVT |  |
| `22B515` | 3,4 | `u16(A,B)` |  | RBM Nenner AGR/VVT |  |
| `22C000` | 3 | `A` |  | Korrekturwert Anfettung Start |  |
| `22C001` | 3,4 | `s16(A,B)*0.046875` | % | Korrekturwert CO Korrektur |  |
| `22C002` | 3 | `bit(A,0)` |  | KorrekturwertKraftstoffpumpe | 0=Aus; 1=Ein |
| `22C003` | 3 | `s8(A)*0.005216` | V | Korrekturwert Lambda Regelschwelle nach KAT (DE: Frontkat) |  |
| `22C004` | 3 | `A` |  | Korrekturwert Lastschlagdaempfung |  |
| `22C005` | 3 | `A*0.015625` |  | Korrekturwert Laufruhe |  |
| `22C006` | 3 | `s8(A)` | 1/min | Korrekturwert Leerlaufsolldrehzahl | -128--1=; 0-127= |
| `22C007` | 3 | `s8(A)` | 1/min | Korrekturwert Leerlaufsolldrehzahl mit Fahrstufe | -128--1=; 0-127= |
| `22C008` | 3 | `A*0.007813` |  | Korrekturwert Leistungsgewicht |  |
| `22C009` | 3 | `A` |  | Korrekturwert MKV |  |
| `22C010` | 3 | `A` |  | Korrekturwert ROZ |  |
| `22C011` | 3 | `bit(A,0)` |  | Korrekturwert Hybrid Ladezustand Modus Quick Charge | 0=Aus; 1=Ein |
| `22C100` | 3 | `A` |  | IMA für Zylinder 1 HEX Einzeln: Nullhub |  |
| `22C100` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 1 HEX: HEX |  |
| `22C100` | 4 | `A` |  | IMA für Zylinder 1 HEX Einzeln: Referenzhub |  |
| `22C101` | 3 | `A` |  | IMA für Zylinder 2 HEX Einzeln: Nullhub |  |
| `22C101` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 2 HEX: HEX |  |
| `22C101` | 4 | `A` |  | IMA für Zylinder 2 HEX Einzeln: Referenzhub |  |
| `22C102` | 3 | `A` |  | IMA für Zylinder 3 HEX Einzeln: Nullhub |  |
| `22C102` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 3 HEX: HEX |  |
| `22C102` | 4 | `A` |  | IMA für Zylinder 3 HEX Einzeln: Referenzhub |  |
| `22C103` | 3 | `A` |  | IMA für Zylinder 4 HEX Einzeln: Nullhub |  |
| `22C103` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 4 HEX: HEX |  |
| `22C103` | 4 | `A` |  | IMA für Zylinder 4 HEX Einzeln: Referenzhub |  |
| `22C104` | 3 | `A` |  | IMA für Zylinder 5 HEX Einzeln: Nullhub |  |
| `22C104` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 5 HEX: HEX |  |
| `22C104` | 4 | `A` |  | IMA für Zylinder 5 HEX Einzeln: Referenzhub |  |
| `22C105` | 3 | `A` |  | IMA für Zylinder 6 HEX Einzeln: Nullhub |  |
| `22C105` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 6 HEX: HEX |  |
| `22C105` | 4 | `A` |  | IMA für Zylinder 6 HEX Einzeln: Referenzhub |  |
| `22C106` | 3 | `A` |  | IMA für Zylinder 7 HEX Einzeln: Nullhub |  |
| `22C106` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 7 HEX: HEX |  |
| `22C106` | 4 | `A` |  | IMA für Zylinder 7 HEX Einzeln: Referenzhub |  |
| `22C107` | 3 | `A` |  | IMA für Zylinder 8 HEX Einzeln: Nullhub |  |
| `22C107` | 3,4 | `u16(A,B)` |  | IMA für Zylinder 8 HEX: HEX |  |
| `22C107` | 4 | `A` |  | IMA für Zylinder 8 HEX Einzeln: Referenzhub |  |
| `22C111` | 4 | `A` |  | Belastungskollektive für Starter: BLK Version |  |
| `22C112` | 4 | `A` |  | Belastungskollektive für Direktstart: BLK Version |  |
| `22C112` | 5,6,7,8 | `(u16(A,B)*65536+u16(C,D))` |  | Belastungskollektive für Direktstart: BLK Data |  |
| `22C114` | 4 | `A` |  | Belastungskollektive für die Kohlebürste im Starter: BLK Version |  |
| `22C114` | 5,6,7,8 | `(u16(A,B)*65536+u16(C,D))*0.1` | µm | Belastungskollektive für die Kohlebürste im Starter: BLK Data |  |
| `22C117` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.000031` |  | Kraftstoffmenge ab Reset für Reiserechner |  |
| `22C201` | 3,4 | `u16(A,B)` | As | Durch Tester emittelte bzw. Default-Kapazitaet der HV Batterie |  |
| `22C220` | 3,4 | `s16(A,B)*0.5` | 1/min | Einstellung einer Maximaldrehzahl (für Produktion und Service) |  |
| `22D000` | 3,4 | `u16(A,B)*0.000244` |  | Anfettung Start Nachstart |  |
| `22D001` | 3,4 | `u16(A,B)*0.046875` | % | CO Korrektur |  |
| `22D002` | 3 | `bit(A,0)` |  | Kraftstoffpumpe | 0=Aus; 1=Ein |
| `22D003` | 3,4 | `u16(A,B)*0.004883-1` | V | Regelschwelle Lambda nach KAT (DE: Frontkat) |  |
| `22D004` | 3 | `A` |  | Lastschlagdämpfung |  |
| `22D005` | 3,4 | `s16(A,B)*0.006316` | (Umdr./sec)^2 | Empfindlichkeit der Laufruhebewertung |  |
| `22D005` | 3,4 | `s16(A,B)*0.003553` | (Umdr./sec)^2 | Empfindlichkeit der Laufruhebewertung |  |
| `22D006` | 3,4 | `u16(A,B)*0.25` | 1/min | Leerlaufsolldrehzahl |  |
| `22D008` | 3 | `A*0.007813` |  | Korrekturfaktor Leistungsgewicht |  |
| `22D010` | 3 | `s8(A)*0.75` | ° | ROZ Korrektur Zündwinkelausgabe |  |
| `22D020` | 3 | `bit(A,0)` |  | Aktivkohleabsperrventil | 0=Auf; 1=Zu |
| `22D021` | 3 | `bit(A,0)` |  | Systemwarnlampe | 0=Aus; 1=Ein |
| `22D022` | 3,4 | `u16(A,B)*0.01` | % | Drehschieber des Waermemanagements von Fahrsoftware |  |
| `22D022` | 5,6 | `u16(A,B)*0.01` | % | Drehschieber des Waermemanagements nur Testervorgabe |  |
| `22D022` | 7,8 | `u16(A,B)*0.01` | % | Drehschieber des Waermemanagements |  |
| `22D023` | 3,4 | `u16(A,B)*0.1` | ° | Drosselklappenwinkel |  |
| `22D024` | 3 | `bit(A,0)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl1 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,2)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl2 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,4)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl3 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,1)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl4 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,3)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl5 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,5)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl6 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,3)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl2 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,5)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl3 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,2)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl4 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,1)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl5 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,4)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl6 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,6)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl7 | 0=Aktiv; 1=Aus |
| `22D024` | 3 | `bit(A,7)` |  | Ausblendmuster Einspritzventile bzw. Injektoren HWZyl8 | 0=Aktiv; 1=Aus |
| `22D025` | 3 | `A*0.015625` |  | Gemischanpassung Bank 2 |  |
| `22D025` | 4 | `A*0.015625` |  | Gemischanpassung Bank 1 |  |
| `22D026` | 3,4 | `s16(A,B)*0.05` | A | Erregerstrombegrenzung |  |
| `22D027` | 3,4 | `s16(A,B)*0.01` | V | Regelspannung |  |
| `22D028` | 3,4 | `s16(A,B)*0.1` | s | Rampenzeit |  |
| `22D029` | 3,4 | `s16(A,B)*0.5` | 1/min | Drehzahlschwelle |  |
| `22D030` | 3 | `bit(A,0)` |  | Heizabsperrventil | 0=Auf; 1=Zu |
| `22D031` | 3,4 | `u16(A,B)*0.003052` | % | Kuehlerjalousie Testervorgabe von Fahrsoftware |  |
| `22D031` | 5,6 | `u16(A,B)*0.003052` | % | Kuehlerjalousie Testervorgabe nur Testervorgabe |  |
| `22D032` | 3 | `bit(A,0)` |  | Lambdaregelung Bank 2 | 0=Aus; 1=Ein |
| `22D032` | 4 | `bit(A,0)` |  | Lambdaregelung Bank 1 | 0=Aus; 1=Ein |
| `22D034` | 3 | `A*0.390625` | % | Lüfteransteuerung von Fahrsoftware |  |
| `22D034` | 4 | `A*0.390625` | % | Lüfteransteuerung nur Testervorgabe |  |
| `22D035` | 3 | `A*10` | s | Nachlaufverlaengerung FBS |  |
| `22D036` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellensteller Auslass Bank 2 |  |
| `22D037` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellensteller Auslass Bank 1 |  |
| `22D038` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellensteller Einlass Bank 2 |  |
| `22D039` | 3,4 | `s16(A,B)*0.007813` | ° | Nockenwellensteller Einlass Bank 1 |  |
| `22D03B` | 3,4 | `s16(A,B)*0.003052` | % | Kuehlerjalousie LIN |  |
| `22D040` | 3 | `A` |  | Normierte Leistung Heizung O2-Sonde Nach Kat (DE: nach Frontkat) Bank 2 | 0=Aus; 1-255=Ein |
| `22D041` | 3 | `A` |  | Normierte Leistung Heizung O2-Sonde Nach Kat (DE: nach Frontkat) Bank 1 | 0=Aus; 1-255=Ein |
| `22D042` | 3,4 | `u16(A,B)*0.003052` | % | Heizung O2-Regelsonde Bank 2 (DE: Frontkat) |  |
| `22D043` | 3,4 | `u16(A,B)*0.003052` | % | Heizung O2-Regelsonde Bank 1 (DE: Frontkat) |  |
| `22D044` | 3,4 | `u16(A,B)*0.001526` | % | Regenerierventil |  |
| `22D049` | 3 | `s8(A)*0.75` | ° | Zuendw.-Fruehverstellung Bank 1 |  |
| `22D050` | 3 | `s8(A)*0.75` | ° | Zuendw.-Fruehverstellung Bank 2 |  |
| `22D051` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.001` | ms | Einspritzzeit Bank 1 |  |
| `22D052` | 3,4,5,6 | `(u16(A,B)*65536+u16(C,D))*0.001` | ms | Einspritzzeit Bank 2 |  |
| `22D053` | 3,4 | `u16(A,B)*0.001526` | % | Abgasrückführventil Bank 1 |  |
| `22D054` | 3,4 | `u16(A,B)*0.001526` | % | Abgasrückführventil Bank 2 |  |
| `22D055` | 3 | `bit(A,0)` |  | NT Absperrventil | 0=Zu; 1=Auf |
| `22D056` | 3,4 | `u16(A,B)*0.001526` | % | Druckabbauventil |  |
| `22D057` | 3,4 | `s16(A,B)*0.1` | ° | Mengensteuerventil |  |
| `22D058` | 3,4 | `u16(A,B)*0.0005` | MPa | Hochdrucksollwert |  |
| `22D059` | 3 | `bit(A,0)` |  | Regelungstyp Hochdruckkreis | 0=MSV_geregelt; 1=DAV_geregelt |
| `22D05A` | 3 | `((A>>0)&3)` |  | Mengensteuerventil bankselektiv abschalten | 0=Eingeschaltet; 1=RechteBankAus; 2=LinkeBankAus |
| `22D060` | 3,4 | `u16(A,B)*0.01` | % | Niedertemperatur Kühlmittelpumpe |  |
| `22D061` | 3,4 | `u16(A,B)*0.25` | 1/min | Anhebung der Leerlaufdrehzahl |  |
| `22D062` | 3,4 | `u16(A,B)*0.001526` | % | Tastverhaeltnis Wastegate |  |
| `22D068` | 3 | `bit(A,0)` |  | Schubumluftventil Bank 1 | 0=Zu; 1=Auf |
| `22D069` | 3 | `bit(A,0)` |  | Schubumluftventil Bank 2 | 0=Zu; 1=Auf |
| `22D06F` | 3 | `A*0.390625` | % | Ladeluftkuehlmittelpumpe PWM Ansteuerung |  |
| `22D070` | 3 | `bit(A,0)` |  | Relais Ladeluftkuehlepumpe | 0=Aus; 1=Ein |
| `22D071` | 3 | `bit(A,0)` |  | Mengensteuerventil Bank 1 | 0=Zu; 1=Auf |
| `22D073` | 3 | `A*0.392157` | % | Ventil Motoroelpumpe |  |
| `22D074` | 3 | `bit(A,0)` |  | Relais Radlaufluefter bzw. Zusatzwasserpumpe AMG | 0=Aus; 1=Ein |
| `22D080` | 3 | `bit(A,0)` |  | Stopp Funktion Verbr. motor bei Hybrid und Direktstart unterdrücken | 0=Aus; 1=Ein |
| `22D081` | 3 | `bit(A,0)` |  | Hybrid Schub ohne Motorabschalten ermöglichen | 0=Aus; 1=Ein |
| `22D082` | 3,4 | `u16(A,B)*0.001526` | % | Momentenvorgabe Verbr. motor Hybrid |  |
| `22D083` | 3 | `bit(A,0)` |  | Unterdrückt Stoppwirkung Motorhaubenschalter | 0=Inaktiv; 1=Aktiv |
| `22D084` | 3 | `bit(A,0)` |  | DMTL Tanksystem - Pumpe | 0=Aus; 1=Ein |
| `22D085` | 3 | `bit(A,0)` |  | DMTL Tanksystem - Ventil | 0=Aus; 1=Ein |
| `22D086` | 3 | `bit(A,0)` |  | DMTL Tanksystem - Heizung | 0=Aus; 1=Ein |
| `22D087` | 3 | `bit(A,0)` |  | Tank Absperrventil FTIV | 0=Zu; 1=Auf |
| `22D088` | 3 | `((A>>0)&3)` |  | Auslösung Ladezustand Modus SOC | 0=NichtAktiv; 1=Low; 2=High |
| `22D089` | 3 | `bit(A,0)` |  | Hybrid Entladestrompuls Elektromaschine | 0=Inaktiv; 1=Aktiv |
| `22D090` | 3 | `bit(A,0)` |  | Hybrid Entladestrompuls DCDC Umsetzer | 0=Inaktiv; 1=Aktiv |
| `22D091` | 3 | `bit(A,0)` |  | Hybrid Entladestrompuls EKMV (el. Kältemittelverdichter) | 0=Inaktiv; 1=Aktiv |
| `22D092` | 3 | `bit(A,0)` |  | Hybrid Anforderung an Energiemanagement - stromloser Zustand | 0=Inaktiv; 1=Aktiv |
| `22D093` | 3 | `A*0.392157` | % | Lineares Regenerierventil (Linear Purge Valve) |  |
| `22D095` | 3 | `bit(A,0)` |  | Auslösung Ladezustand QuickCharge ueber Diagnosesizung hinaus | 0=----; 1=TRUE |
| `22D097` | 3 | `bit(A,0)` |  | Saugrohrwalze | 0=Aus; 1=Ein |
| `22D098` | 3 | `bit(A,0)` |  | Saugrohrklappen | 0=Zu; 1=Auf |
| `22D099` | 3 | `bit(A,0)` |  | Bordnetzumschaltung im SAM Stützbatt - Hauptbatt Start-Stopp | 0=----; 1=TRUE |
| `22D100` | 3 | `bit(A,0)` |  | Schaltbares Motorlager | 0=Weich; 1=Hart |
| `22D104` | 3 | `A` |  | Getriebeölpumpe über Relais bei Fzg. Mit Getriebeölkühlung | 0=Aus; 1=Ein |
| `22D105` | 3 | `bit(A,0)` |  | Absperrventil Getriebeanwärmung über Relais | 0=Aus; 1=Ein |
| `22D107` | 3 | `A` |  | Abgasklappe | 0=Auf; 1=Zu |
| `22D10A` | 3 | `A*0.392157` | % | Abgasklappe PWM Ansteuerung |  |
| `22D111` | 3 | `bit(A,0)` |  | Nachlaufkühlung: BR166 NT HT Koppelventil, sonst Zusatz Kühlmittelpumpe | 0=Zu; 1=Auf |
| `22EF00` | 3 | `A` |  | SW-Module Identification - Application - AUTOSAR: Major version |  |
| `22EF00` | 4 | `A` |  | SW-Module Identification - Application - AUTOSAR: Minor version |  |
| `22EF00` | 5 | `A` |  | SW-Module Identification - Application - AUTOSAR: Patch version |  |
| `22EF00` | 6 | `A` |  | SW-Module Identification - Application - AUTOSAR: Number of included AUTOSAR SW modules |  |
| `22EF00` | 7 | `A` |  | SW-Module Identification - Application - AUTOSAR: Standard identification #1 | 0=AUTOSAR Standard Module; 1=Daimler Standard Module |
| `22EF00` | 8 | `A` |  | SW-Module Identification - Application - AUTOSAR: AUTOSAR Module ID #1 | 1=Operating System; 2-9=Reserved; 10=ECU State Manager; 11=Function Inhibition Manager; 12=Communication Manager; 13=Watchdog Manager; 14=Reserved; 15=Development Error Tracer; 16-19=Reserved; 20=NVRAM Manager; 21=Flash EEPROM Emulation; 22=Memory Abstraction Interface; 23-28=Reserved; 29=Generic NM Interface; 30=Reserved; 31=CAN NM; 32=FlexRay NM; 33-34=Reserved; 35=CAN Transport Layer; 36=FlexRay Transport Layer |
| `22EF00` | 9 | `A` |  | SW-Module Identification - Application - AUTOSAR: AUTOSAR Supplier ID #1 | 0=Not assigned, to be used by not (yet) listed vendors; 1=3Soft; 2=AEV; 3=Audi; 4=Bertrandt; 5=BMW; 6=Bosch; 7=Carmeq; 8=ContiTeves; 9=Daimler AG; 10=DeComSys; 11=ETAS; 12=Fujitsu; 13=Hella; 14=IAV GmbH; 15=IBM; 16=MBtech; 17=Infineon; 18=Kostal; 19=Livedevices |
| `22EF00` | 10 | `A` |  | SW-Module Identification - Application - AUTOSAR: Major version SWS #1 |  |
| `22EF00` | 11 | `A` |  | SW-Module Identification - Application - AUTOSAR: Minor version SWS #1 |  |
| `22EF00` | 12 | `A` |  | SW-Module Identification - Application - AUTOSAR: Patch level version #1 |  |
| `22EF00` | 13 | `A` |  | SW-Module Identification - Application - AUTOSAR: Major version SW Module #1 |  |
| `22EF00` | 14 | `A` |  | SW-Module Identification - Application - AUTOSAR: Minor version SW Module #1 |  |
| `22EF00` | 15 | `A` |  | SW-Module Identification - Application - AUTOSAR: Patch level version SW Module #1 |  |
| `22EF03` | 3 | `A` |  | Standard Software Package Information: SIP ID - Major Version |  |
| `22EF03` | 4 | `A` |  | Standard Software Package Information: SIP ID - Minor Version |  |
| `22EF03` | 5 | `A` |  | Standard Software Package Information: SIP ID - Patch Level Version |  |
| `22EF03` | 6 | `A` |  | Standard Software Package Information: SIP ID - Build Version |  |
| `22EF03` | 7,8,9,10 | `(u16(A,B)*65536+u16(C,D))` |  | Standard Software Package Information: Software Licence Number |  |
| `22F100` | 3 | `bit(A,0)` |  | Aktive Diagnose Information: Aktive SG Software | 0=Applikation aktiv; 1=Bootloader aktiv |
| `22F100` | 3 | `bit(A,1)` |  | Aktive Diagnose Information: Gateway | 0=nicht wahr; 1=wahr |
| `22F100` | 4 | `A` |  | Aktive Diagnose Information: Active Diagnostic Variant |  |
| `22F100` | 5 | `A` |  | Aktive Diagnose Information: Aktive Diagnose Version |  |
| `22F100` | 6 | `((A>>0)&127)` |  | Aktive Diagnose Information: Active Diagnostic Session | 1=Default; 2=Programming; 3=Extended; 4=Safety System Diagnostic Session; 73=StandBy |
| `22F10A` | 3 | `A` |  | ECU Herkunft |  |
| `22F150` | 3 | `A` |  | Hardware Version Information: HW - year |  |
| `22F150` | 4 | `A` |  | Hardware Version Information: HW - week | 1-52=; 0=Ungültiger Wert; 53-255=Ungültiger Wert |
| `22F150` | 5 | `A` |  | Hardware Version Information: HW - patch level |  |
| `22F151` | 3 | `A` |  | SW - year |  |
| `22F151` | 4 | `A` |  | SW - week | 1-52=; 0=Ungültiger Wert; 53-255=Ungültiger Wert |
| `22F151` | 5 | `A` |  | SW - patch level |  |
| `22F154` | 3,4 | `u16(A,B)` |  | Hardware Supplier Identification: Hardware Supplier Identification | 0=Reserved; 1=Becker; 2=Blaupunkt; 3=Bosch; 4=MB / DCS; 5=HuF; 6=Kammerer; 7=Kostal; 8=Siemens; 9=Stribel; 10=MicroHeat; 11=JATCO; 12=Cummins; 13=ZF Lenksysteme; 14-15=Reserved; 16=SWF; 17=VDO; 18=Webasto; 19=Dornier; 20=TEG |
| `22F155` | 3,4 | `u16(A,B)` |  | SW Lieferantenkennung CustomerBoot | 0=Reserved; 1=Becker; 2=Blaupunkt; 3=Bosch; 4=MB / DCS; 5=HuF; 6=Kammerer; 7=Kostal; 8=Siemens; 9=Stribel; 10=MicroHeat; 11=JATCO; 12=Cummins; 13=ZF Lenksysteme; 14-15=Reserved; 16=SWF; 17=VDO; 18=Webasto; 19=Dornier; 20=TEG |
| `22F155` | 5,6 | `u16(A,B)` |  | SW Lieferantenkennung Code | 0=Reserved; 1=Becker; 2=Blaupunkt; 3=Bosch; 4=MB / DCS; 5=HuF; 6=Kammerer; 7=Kostal; 8=Siemens; 9=Stribel; 10=MicroHeat; 11=JATCO; 12=Cummins; 13=ZF Lenksysteme; 14-15=Reserved; 16=SWF; 17=VDO; 18=Webasto; 19=Dornier; 20=TEG |
| `22F155` | 7,8 | `u16(A,B)` |  | SW Lieferantenkennung Data | 0=Reserved; 1=Becker; 2=Blaupunkt; 3=Bosch; 4=MB / DCS; 5=HuF; 6=Kammerer; 7=Kostal; 8=Siemens; 9=Stribel; 10=MicroHeat; 11=JATCO; 12=Cummins; 13=ZF Lenksysteme; 14-15=Reserved; 16=SWF; 17=VDO; 18=Webasto; 19=Dornier; 20=TEG |
| `22F806` | 3 | `A` |  | Anzahl der CVNs |  |
| `22F806` | 4,5,6,7 | `(u16(A,B)*65536+u16(C,D))` |  | Calibration Verification Number |  |
