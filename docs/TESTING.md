# BWAlytics - Testing Strategy

**Version:** 1.0.0  
**Letzte Aktualisierung:** 22. Oktober 2025

---

## 🎯 Testing-Ziele

1. **Korrektheit:** BWA-Extraktion muss 100% zuverlässig sein
2. **Format-Agnostik:** Funktioniert mit DATEV, Lexoffice, sevDesk, etc.
3. **Regression-Sicherheit:** Neue Features brechen alte nicht
4. **Performance:** < 3 Sekunden für typische BWA-Analyse

---

## 🧪 Testing-Pyramide

```
                   ╱╲
                  ╱  ╲
                 ╱ E2E╲         < 10% (UI-Tests, komplette Workflows)
                ╱──────╲
               ╱        ╲
              ╱ Integr. ╲       < 20% (Module zusammen)
             ╱────────────╲
            ╱              ╲
           ╱  Unit-Tests    ╲   > 70% (einzelne Funktionen)
          ╱──────────────────╲
```

---

## 📋 Test-Kategorien

### 1. **Unit-Tests** (Jest/Vitest)

**Ziel:** Einzelne Funktionen isoliert testen

#### Core-Funktionen zu testen:

##### `extractDetailedCostBreakdown(text)`
```javascript
describe('extractDetailedCostBreakdown', () => {
  test('extrahiert DATEV-Konten korrekt', () => {
    const text = `
      4120 Gehälter                   49.939,50
      4130 Gesetzliche soziale Aufw.  12.605,31
      4140 Freiwillige soziale Aufw.   5.348,00
    `;
    const result = extractDetailedCostBreakdown(text);
    
    expect(result.personal.total).toBe(67892.81);
    expect(result.personal.items).toHaveLength(3);
    expect(result.personal.items[0]).toEqual({
      account: '4120',
      description: 'Gehälter',
      amount: 49939.50
    });
  });

  test('funktioniert mit Lexoffice-Format', () => {
    const text = `
      Lohnkosten               49939.50
      Sozialversicherung       12605.31
    `;
    const result = extractDetailedCostBreakdown(text);
    
    expect(result.personal.total).toBeGreaterThan(60000);
  });

  test('ignoriert irrelevante Zeilen', () => {
    const text = `
      Kopfzeile BWA
      4120 Gehälter 49.939,50
      Seitenumbruch
      Fußzeile
    `;
    const result = extractDetailedCostBreakdown(text);
    
    expect(result.personal.total).toBe(49939.50);
  });

  test('handhabt fehlende Konten gracefully', () => {
    const text = `4210 Miete 5000`;
    const result = extractDetailedCostBreakdown(text);
    
    expect(result.personal.total).toBe(0);
    expect(result.raum.total).toBe(5000);
  });
});
```

##### `extractBWADataFromText(text)`
```javascript
describe('extractBWADataFromText', () => {
  test('extrahiert Umsatz und Kosten aus BWA-Übersicht', () => {
    const text = `
      Umsatzerlöse                S u m m e   50.705,00
      Gesamtkosten               S u m m e   25.099,75
    `;
    const result = extractBWADataFromText(text);
    
    expect(result.revenue).toBe(50705);
    expect(result.costs).toBe(25099.75);
    expect(result.profit).toBe(25605.25);
    expect(result.margin).toBeCloseTo(50.5, 1);
  });

  test('berechnet Fix/Variable korrekt', () => {
    const text = `...`; // Full BWA text
    const result = extractBWADataFromText(text);
    
    expect(result.fixedCosts).toBeGreaterThan(result.variableCosts);
    expect(result.fixedCosts + result.variableCosts).toBe(result.costs);
  });
});
```

##### Regex-Pattern-Tests
```javascript
describe('Regex Patterns', () => {
  const accountPattern = /(\d{4})\s+([^\d]+?)\s+([\d,\.]+)/;

  test('matched DATEV-Format', () => {
    const line = '4120 Gehälter 49.939,50';
    const match = line.match(accountPattern);
    
    expect(match[1]).toBe('4120');
    expect(match[2]).toBe('Gehälter');
    expect(match[3]).toBe('49.939,50');
  });

  test('matched Lexoffice-Format', () => {
    const line = 'Lohnkosten 49939.50';
    // ... custom pattern for Lexoffice
  });
});
```

##### Amount-Parsing-Tests
```javascript
describe('parseAmount', () => {
  test('parst deutsche Zahlenformate', () => {
    expect(parseAmount('49.939,50')).toBe(49939.50);
    expect(parseAmount('1.234.567,89')).toBe(1234567.89);
  });

  test('parst englische Zahlenformate', () => {
    expect(parseAmount('49,939.50')).toBe(49939.50);
    expect(parseAmount('1,234,567.89')).toBe(1234567.89);
  });

  test('handhabt edge cases', () => {
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('')).toBe(0);
    expect(parseAmount('invalid')).toBe(0);
  });
});
```

---

### 2. **Integration-Tests** (Jest + PDF.js)

**Ziel:** Module zusammen testen (PDF-Upload → Extraktion → Visualisierung)

```javascript
describe('PDF Upload → Extraction Pipeline', () => {
  test('verarbeitet echte DATEV-BWA PDF', async () => {
    const pdfBuffer = fs.readFileSync('./fixtures/datev-bwa-2024-05.pdf');
    const pdf = await pdfjsLib.getDocument(pdfBuffer).promise;
    
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map(item => item.str).join(' ');
    }
    
    const result = extractBWADataFromText(fullText);
    
    expect(result.revenue).toBeGreaterThan(0);
    expect(result.costBreakdown.personal).toBeGreaterThan(0);
  });

  test('handhabt korrupte PDFs gracefully', async () => {
    const invalidPdf = Buffer.from('invalid pdf content');
    
    await expect(
      pdfjsLib.getDocument(invalidPdf).promise
    ).rejects.toThrow();
  });
});
```

---

### 3. **E2E-Tests** (Playwright/Cypress)

**Ziel:** Komplette User-Workflows testen (Browser-Simulation)

#### Test-Szenarien:

##### Happy Path: BWA hochladen & analysieren
```javascript
test('User lädt BWA hoch und sieht Analyse', async ({ page }) => {
  // 1. Öffne App
  await page.goto('http://localhost:8080/bwa-upload-working.html');
  
  // 2. Erstelle Passwort
  await page.fill('#password-input', 'TestPassword123');
  await page.click('#create-password-btn');
  
  // 3. Upload BWA
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles('./fixtures/datev-bwa-2024-05.pdf');
  
  // 4. Warte auf Extraktion
  await page.waitForSelector('.analysis-complete', { timeout: 5000 });
  
  // 5. Validiere Ergebnisse
  const revenue = await page.textContent('#revenue-value');
  expect(revenue).toContain('50.705');
  
  const personalCosts = await page.textContent('#personal-costs');
  expect(personalCosts).toContain('67.892');
  
  // 6. Check Chart existiert
  const chart = await page.locator('canvas#cost-breakdown-chart');
  expect(await chart.isVisible()).toBe(true);
});
```

##### Error-Handling: Falsches Passwort
```javascript
test('Zeigt Fehler bei falschem Passwort', async ({ page }) => {
  await page.goto('http://localhost:8080/bwa-upload-working.html');
  
  // Setup: Speichere verschlüsselte Daten
  await page.evaluate(() => {
    const encrypted = CryptoJS.AES.encrypt('test', 'CorrectPassword');
    localStorage.setItem('bwaData', encrypted.toString());
  });
  
  // Try wrong password
  await page.fill('#password-input', 'WrongPassword');
  await page.click('#unlock-btn');
  
  // Validate error message
  const error = await page.textContent('.error-message');
  expect(error).toContain('Falsches Passwort');
});
```

##### Performance: Large PDF
```javascript
test('verarbeitet große BWA in < 5 Sekunden', async ({ page }) => {
  await page.goto('http://localhost:8080/bwa-upload-working.html');
  
  const startTime = Date.now();
  
  await page.fill('#password-input', 'Test123');
  await page.click('#create-password-btn');
  await page.setInputFiles('input[type="file"]', './fixtures/large-bwa-50-pages.pdf');
  
  await page.waitForSelector('.analysis-complete');
  
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(5000);
});
```

---

### 4. **Regression-Tests** (Golden Master Testing)

**Ziel:** Sicherstellen, dass bekannte BWAs immer gleiche Ergebnisse liefern

```javascript
describe('Golden Master Tests', () => {
  const goldenMasters = [
    { file: 'datev-bwa-2024-05.pdf', expected: './golden/datev-2024-05.json' },
    { file: 'lexoffice-bwa-2024-06.pdf', expected: './golden/lexoffice-2024-06.json' },
    { file: 'sevdesk-bwa-2024-07.pdf', expected: './golden/sevdesk-2024-07.json' }
  ];

  goldenMasters.forEach(({ file, expected }) => {
    test(`${file} produces consistent results`, async () => {
      const pdfBuffer = fs.readFileSync(`./fixtures/${file}`);
      const result = await processBWA(pdfBuffer);
      
      const expectedResult = JSON.parse(fs.readFileSync(expected, 'utf-8'));
      
      expect(result).toEqual(expectedResult);
    });
  });
});
```

---

## 🛠️ Testing-Infrastructure

### Setup (package.json)
```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.54.0",
    "prettier": "^3.1.0"
  },
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

### GitHub Actions CI/CD
```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📊 Test-Coverage-Ziele

### Minimum-Coverage
- **Unit-Tests:** > 80% Code-Coverage
- **Core-Funktionen:** 100% Coverage für `extractDetailedCostBreakdown()`, `extractBWADataFromText()`
- **E2E-Tests:** Alle kritischen User-Flows

### Coverage-Ausnahmen
- UI-Code (Chart.js Visualisierung) → nur E2E-Tests
- Legacy-Code (alte Versionen) → Deprecation geplant

---

## 🗂️ Test-Fixtures

### Benötigte Test-Daten
```
tests/
  fixtures/
    datev-bwa-2024-05.pdf          # Typische DATEV-BWA
    datev-bwa-missing-accounts.pdf # Edge Case: Fehlende Konten
    datev-bwa-large.pdf            # Performance-Test (50 Seiten)
    lexoffice-bwa-2024-06.pdf      # Lexoffice-Format
    sevdesk-bwa-2024-07.pdf        # sevDesk-Format
    corrupted.pdf                  # Error-Handling
  golden/
    datev-2024-05.json             # Erwartete Ergebnisse
    lexoffice-2024-06.json
    sevdesk-2024-07.json
```

**Datenschutz:** Alle Test-BWAs sind **anonymisierte Dummy-Daten**, keine echten Unternehmensdaten!

---

## 🐛 Bug-Reproduktion-Workflow

1. **Issue-Erstellung:** User meldet Bug via GitHub Issue (Template: `bug_report.yml`)
2. **Test-Case schreiben:** Erstelle failing test für den Bug
3. **Bug fixen:** Fix implementieren, bis Test grün
4. **Regression-Test:** Test bleibt im Suite, um zukünftige Regressionen zu vermeiden

---

## 🚀 Test-First-Development (TDD)

### Workflow für neue Features
```
1. Write failing test (RED)
   ↓
2. Implement feature (GREEN)
   ↓
3. Refactor code (REFACTOR)
   ↓
4. Commit (test + feature zusammen)
```

**Beispiel: Cashflow-Runway Feature**
```javascript
// 1. RED: Test schreiben
test('berechnet Cashflow-Runway korrekt', () => {
  const geldbestaende = 50000; // Kasse + Bank
  const monthlyBurn = 10000;
  
  const runway = calculateCashflowRunway(geldbestaende, monthlyBurn);
  
  expect(runway).toBe(5); // 5 Monate Runway
});

// 2. GREEN: Feature implementieren
function calculateCashflowRunway(cash, burn) {
  if (burn === 0) return Infinity;
  return Math.floor(cash / burn);
}

// 3. REFACTOR: Edge Cases hinzufügen
test('handhabt Zero-Burn gracefully', () => {
  expect(calculateCashflowRunway(50000, 0)).toBe(Infinity);
});
```

---

## 📚 Testing-Best-Practices

### Do's ✅
- ✅ Teste **Verhalten**, nicht Implementierung
- ✅ Nutze **descriptive test names** (deutsch OK!)
- ✅ **Isolierte Tests** (keine Dependencies zwischen Tests)
- ✅ **Fast Tests** (< 100ms pro Unit-Test)
- ✅ **Deterministic Tests** (gleiche Input → gleiche Output)

### Don'ts ❌
- ❌ Keine Tests, die auf externe Services angewiesen sind (z.B. echte PDFs von Server laden)
- ❌ Keine flaky Tests (manchmal grün, manchmal rot)
- ❌ Keine zu komplexen Tests (wenn Test länger als Code → refactor!)
- ❌ Keine Tests für Third-Party-Code (PDF.js, CryptoJS sind schon getestet)

---

## 🎯 Next Steps

### Phase 1: Basic Testing (Q4 2025)
- [ ] Jest/Vitest Setup
- [ ] Unit-Tests für Core-Funktionen (80% Coverage)
- [ ] GitHub Actions CI/CD

### Phase 2: E2E Testing (Q1 2026)
- [ ] Playwright Setup
- [ ] Happy-Path E2E-Tests
- [ ] Error-Handling E2E-Tests

### Phase 3: Advanced Testing (Q2 2026)
- [ ] Visual Regression Testing (Percy/Chromatic)
- [ ] Performance Testing (Lighthouse CI)
- [ ] Golden Master Tests für alle BWA-Formate

---

**Fragen? Siehe [GitHub Discussions](https://github.com/GordianS1993/bwalytics/discussions) oder öffne ein Issue!**
