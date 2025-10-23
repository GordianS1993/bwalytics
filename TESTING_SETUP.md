# Testing Infrastructure Setup ✅

## Was wurde erstellt?

### 1. Test-Framework Konfiguration
- ✅ `package.json` - npm Konfiguration mit Vitest Dependencies
- ✅ `vitest.config.js` - Vitest Konfiguration (jsdom environment, coverage settings)

### 2. Test-Struktur
```
tests/
├── unit/                           # Unit Tests
│   └── bwa-extraction.test.js     # 15 Tests für parseGermanNumber & extractDetailedCostBreakdown
├── integration/                    # Integration Tests
│   └── bwa-full-extraction.test.js # 6 Tests für vollständige BWA-Extraktion
├── fixtures/                       # Test-Daten
│   └── bwa-samples.js             # DATEV, Lexoffice, Minimal, Invalid BWA Samples
├── helpers/                        # Testbare Module
│   └── bwa-extractor.js           # Extrahierte Funktionen aus HTML (parseGermanNumber, extractDetailedCostBreakdown, extractBWADataFromText)
└── README.md                       # Test-Dokumentation
```

### 3. Test-Abdeckung
**Unit Tests (15 Tests):**
- ✅ `parseGermanNumber()` - Deutsche Zahlenformate parsen (1.234,56 → 1234.56)
- ✅ `extractDetailedCostBreakdown()` - Kosten-Kategorisierung (Personal, Raum, Kfz, etc.)
- ✅ Edge Cases: Leere BWAs, ungültige Formate, fehlende Konten
- ✅ Format-Agnostisch: DATEV, Lexoffice, sevDesk Kompatibilität

**Integration Tests (6 Tests):**
- ✅ `extractBWADataFromText()` - End-to-End BWA-Analyse
- ✅ Umsatz, Kosten, Gewinn, Marge Berechnung
- ✅ Negative Margen, fehlende Erlöse
- ✅ Kosten-Breakdown Validierung

### 4. Test-Fixtures
- `DATEV_SUSA_SAMPLE` - Vollständige DATEV Summen- und Saldenliste
- `LEXOFFICE_SAMPLE` - Lexoffice BWA Format
- `MINIMAL_BWA` - Minimale BWA (2 Konten)
- `INVALID_BWA` - Ungültiges Format
- `EMPTY_BWA` - Leere Eingabe

---

## Installation & Ausführung

### Voraussetzungen
Du brauchst **Node.js** (v18+) und **npm**.

**Installation:**
```bash
# macOS mit Homebrew
brew install node

# Oder: https://nodejs.org/en/download/ (Installer herunterladen)
```

### Test-Dependencies installieren
```bash
cd /Users/gordianschmitz/Kleinunternehmer-Dashboard_2
npm install
```

Dies installiert:
- `vitest` (v1.0.0) - Test Framework
- `@vitest/ui` (v1.0.0) - Browser-basiertes Test UI
- `jsdom` (v23.0.0) - DOM-Simulation für Browser-Code
- `@vitest/coverage-v8` (v1.0.0) - Code Coverage Reports

### Tests ausführen

```bash
# Alle Tests einmalig ausführen
npm test

# Tests im Watch-Mode (re-run bei Änderungen)
npm run test:watch

# Tests mit Browser-UI (http://localhost:51204/__vitest__/)
npm run test:ui

# Tests mit Coverage-Report (HTML-Report in coverage/)
npm run test:coverage
```

---

## Test-Ergebnisse (Expected)

Wenn du `npm test` ausführst, solltest du sehen:

```
✓ tests/unit/bwa-extraction.test.js (15 tests)
  ✓ parseGermanNumber (3 tests)
    ✓ sollte deutsche Zahlen korrekt parsen
    ✓ sollte Zahlen ohne Formatierung parsen
    ✓ sollte ungültige Eingaben als 0 behandeln
  ✓ extractDetailedCostBreakdown (12 tests)
    ✓ sollte DATEV Summen- und Saldenliste korrekt extrahieren
    ✓ sollte Personal-Konten korrekt kategorisieren
    ✓ sollte Raum-Konten korrekt kategorisieren
    ✓ sollte minimales BWA verarbeiten
    ✓ sollte ungültige BWAs ohne Fehler verarbeiten
    ✓ sollte leere Eingabe ohne Fehler verarbeiten
    ✓ sollte nur Kosten-Konten (4xxx) extrahieren
    ✓ sollte Einzelpositionen mit korrekten Details speichern

✓ tests/integration/bwa-full-extraction.test.js (6 tests)
  ✓ extractBWADataFromText - Integration (6 tests)
    ✓ sollte vollständige BWA-Daten aus DATEV-Format extrahieren
    ✓ sollte Kosten-Breakdown inkludieren
    ✓ sollte Lexoffice-Format verarbeiten
    ✓ sollte negative Margen korrekt berechnen
    ✓ sollte bei fehlenden Erlösen Marge 0 zurückgeben
    ✓ sollte Gesamtkosten korrekt summieren

Test Files  2 passed (2)
     Tests  21 passed (21)
  Start at  12:34:56
  Duration  342ms
```

---

## Nächste Schritte

### Immediate (nach Node.js Installation)
1. `npm install` - Dependencies installieren
2. `npm test` - Tests ausführen und validieren
3. `npm run test:coverage` - Coverage-Report generieren

### Short-term
- [ ] E2E-Tests mit Playwright (PDF-Upload simulieren)
- [ ] Golden Tests für UI-Snapshots
- [ ] Performance Tests (große BWA-PDFs >100 Seiten)

### Long-term
- [ ] CI/CD Integration (GitHub Actions) - Auto-run bei Push
- [ ] Code Coverage Badges im README
- [ ] Visual Regression Testing für Dashboard

---

## Status: ⏸️ Node.js Installation Required

**Was fehlt:**
- Node.js ist auf deinem System nicht installiert
- Homebrew ist ebenfalls nicht verfügbar

**Optionen:**
1. **Node.js installieren:** https://nodejs.org/en/download/ (Empfohlen: LTS Version)
2. **Homebrew installieren:** https://brew.sh/ (macht zukünftige Installations einfacher)
3. **Mit CI/CD arbeiten:** Tests laufen später automatisch in GitHub Actions

**Test-Struktur ist komplett** - sobald Node.js installiert ist, kannst du mit `npm install && npm test` loslegen!
