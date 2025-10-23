/**
 * Test-Fixture: DATEV Summen- und Saldenliste
 * Beispiel-BWA-Daten für Unit-Tests
 */

export const DATEV_SUSA_SAMPLE = `
SUMMEN- UND SALDENLISTE
Mandant: Mustermann GmbH
Zeitraum: 01.01.2025 - 31.03.2025

Kontonummer  Bezeichnung                    Soll         Haben        Saldo
4120         Gehälter                       45.000,00    0,00         45.000,00
4130         Gesetzliche Sozialaufwendungen 9.500,00     0,00         9.500,00
4210         Miete                          3.600,00     0,00         3.600,00
4240         Strom, Gas, Wasser             850,00       0,00         850,00
4530         Kfz-Betriebskosten             1.240,00     0,00         1.240,00
4600         Werbekosten                    2.800,00     0,00         2.800,00
4920         Telefon, Internet              450,00       0,00         450,00
4960         Rechts- und Beratungskosten    1.200,00     0,00         1.200,00
4980         Sonstige Betriebskosten        780,00       0,00         780,00

8400         Erlöse                         0,00         95.500,00    95.500,00
`;

export const LEXOFFICE_SAMPLE = `
Betriebswirtschaftliche Auswertung
Musterfirma UG

Konten (Klasse 4 - Betriebliche Aufwendungen):
Konto 4120 - Gehälter und Löhne: 45.000,00 EUR
Konto 4130 - Sozialabgaben: 9.500,00 EUR
Konto 4210 - Raumkosten/Mieten: 3.600,00 EUR
Konto 4530 - Kfz-Kosten: 1.240,00 EUR
Konto 4600 - Werbung: 2.800,00 EUR

Erlöse (Klasse 8):
Konto 8400 - Umsatzerlöse: 95.500,00 EUR
`;

export const MINIMAL_BWA = `
SUMMEN- UND SALDENLISTE

4120 Gehälter 30.000,00
8400 Erlöse 80.000,00
`;

export const INVALID_BWA = `
Dies ist kein gültiges BWA-Format.
Keine Kontonummern vorhanden.
`;

export const EMPTY_BWA = ``;

// Expected Results für Assertions
export const EXPECTED_BREAKDOWN_DATEV = {
  personal: {
    total: 54500, // 45000 + 9500
    itemCount: 2
  },
  raum: {
    total: 4450, // 3600 + 850
    itemCount: 2
  },
  kfz: {
    total: 1240,
    itemCount: 1
  },
  marketing: {
    total: 2800,
    itemCount: 1
  },
  büro: {
    total: 2430, // 450 + 1200 + 780 (Sonstige Betriebskosten wird auch als Büro kategorisiert)
    itemCount: 3
  },
  sonstige: {
    total: 0, // Alle wurden kategorisiert
    itemCount: 0
  }
};

export const EXPECTED_BWA_DATA_DATEV = {
  revenue: 95500,
  costs: 65420, // Summe aller Kosten
  profit: 30080, // 95500 - 65420
  margin: 31.5, // ~31.5%
};
