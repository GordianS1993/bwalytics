# Tests

Dieses Verzeichnis enthält automatisierte Tests für BWAlytics.

## Struktur

```
tests/
├── unit/                  # Unit Tests (isolierte Funktionen)
│   └── bwa-extraction.test.js
├── integration/           # Integration Tests (End-to-End Flows)
│   └── bwa-full-extraction.test.js
├── fixtures/              # Test-Daten (Beispiel-BWAs)
│   └── bwa-samples.js
└── helpers/               # Testbare Module (extrahiert aus HTML)
    └── bwa-extractor.js
```

## Tests ausführen

```bash
# Alle Tests einmalig ausführen
npm test

# Tests im Watch-Mode (re-run bei Änderungen)
npm run test:watch

# Tests mit UI (Browser-Interface)
npm run test:ui

# Tests mit Coverage-Report
npm run test:coverage
```

## Test-Coverage Ziele

- **Unit Tests**: Einzelne Funktionen isoliert testen (parseGermanNumber, extractDetailedCostBreakdown)
- **Integration Tests**: Vollständige Workflows testen (BWA-Upload → Extraktion → Visualisierung)
- **Fixtures**: Realistische Test-Daten (DATEV, Lexoffice, sevDesk Formate)

## Test-Prinzipien (aus docs/TESTING.md)

1. **Format-Agnostisch**: Tests mit verschiedenen BWA-Formaten (DATEV, Lexoffice, etc.)
2. **Edge Cases**: Leere BWAs, ungültige Formate, fehlende Konten
3. **Präzision**: Teste echte Extraktionen, keine Schätzungen
4. **Datenschutz**: Keine echten Kundendaten in Tests verwenden

## Nächste Schritte

- [ ] E2E-Tests mit Playwright (PDF-Upload simulieren)
- [ ] Golden Tests für UI-Snapshots
- [ ] Performance Tests (große BWA-PDFs >100 Seiten)
