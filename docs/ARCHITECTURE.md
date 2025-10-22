# BWAlytics - System-Architektur

**Version:** 1.0.0  
**Letzte Aktualisierung:** 22. Oktober 2025

---

## 🏗️ Architektur-Übersicht

BWAlytics ist eine **Client-Side Single-Page Application (SPA)** ohne Backend. Alle Datenverarbeitung erfolgt im Browser.

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client-Side)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │  index.html │───▶│ bwa-upload-  │───▶│  Chart.js     │  │
│  │  Landing    │    │  working.html│    │  Visualisierung│ │
│  └─────────────┘    └──────────────┘    └───────────────┘  │
│                             │                                │
│                             ▼                                │
│                     ┌──────────────┐                         │
│                     │   PDF.js     │                         │
│                     │ Text Extract │                         │
│                     └──────────────┘                         │
│                             │                                │
│                             ▼                                │
│               ┌─────────────────────────┐                    │
│               │ extractBWADataFromText()│                    │
│               │ + extractDetailedCost   │                    │
│               │   Breakdown()           │                    │
│               └─────────────────────────┘                    │
│                             │                                │
│                             ▼                                │
│                     ┌──────────────┐                         │
│                     │  CryptoJS    │                         │
│                     │  AES-256     │                         │
│                     └──────────────┘                         │
│                             │                                │
│                             ▼                                │
│                     ┌──────────────┐                         │
│                     │ localStorage │                         │
│                     │ (encrypted)  │                         │
│                     └──────────────┘                         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Datei-Struktur

```
bwalytics/
├── index.html                    # Landing Page
├── bwa-upload-working.html       # Haupt-App (Production)
├── bwa-upload-NEW.html          # Test-Version (Cache-free)
├── assets/
│   └── images/                  # Logo, Icons
├── .github/
│   ├── copilot-instructions.md  # Copilot-Regeln
│   └── ISSUE_TEMPLATE/          # Issue Templates
├── docs/
│   ├── ARCHITECTURE.md          # Diese Datei
│   ├── ROADMAP.md               # Feature-Roadmap
│   └── TESTING.md               # Test-Strategie
├── CHANGELOG.md                 # Version History
├── README.md                    # Projekt-Dokumentation
└── tests/                       # Testing (zukünftig)
```

---

## 🔍 Core-Komponenten

### 1. **PDF-Extraktion (PDF.js)**
```javascript
// PDF.js lädt und parsed BWA-PDF
pdfjsLib.getDocument(pdfData).promise
  .then(pdf => pdf.getPage(pageNum))
  .then(page => page.getTextContent())
  .then(textContent => extractBWADataFromText(fullText))
```

**Herausforderungen:**
- DATEV-PDFs haben keine strukturierte Daten-Layer
- Text-Positionen können variieren je nach BWA-Format
- Lösung: Regex-Pattern-Matching + Semantische Analyse

### 2. **BWA-Daten-Extraktion**

#### `extractBWADataFromText(text)`
Haupt-Funktion für BWA-Analyse.

**Input:** Roher PDF-Text (alle Seiten konkateniert)  
**Output:** Strukturiertes Datenobjekt

```javascript
{
  revenue: 50705,           // Umsatzerlöse
  costs: 25099,             // Gesamtkosten
  profit: 25606,            // Gewinn
  margin: 50.5,             // Marge in %
  costBreakdown: {          // 8 Hauptkategorien
    personal: 67892,        // Personalkosten
    rent: 9726,             // Raumkosten
    kfz: 20561,             // Kfz-Kosten
    marketing: 5234,        // Marketing & Werbung
    insurance: 3421,        // Versicherungen
    office: 2156,           // Büro & Verwaltung
    external: 1892,         // Fremdleistungen
    other: 4217             // Sonstige
  },
  detailedCosts: {          // Vollständige Account-Liste
    personal: {
      total: 67892,
      items: [
        { account: "4120", description: "Gehälter", amount: 49939.50 },
        { account: "4130", description: "Sozialabgaben", amount: 12605.31 }
      ]
    }
  },
  fixedCosts: 55234,        // Fixkosten (semantisch berechnet)
  variableCosts: 14865      // Variable Kosten
}
```

#### `extractDetailedCostBreakdown(text)`
**Zweck:** Intelligente Extraktion aus Summen- und Saldenliste

**Algorithmus:**
1. Parse PDF-Text Zeile-für-Zeile
2. Match Pattern: `(\d{4})\s+([^\d]+?)\s+([\d,\.]+)` → Konto, Beschreibung, Betrag
3. Semantische Kategorisierung via Regex-Rules:
   ```javascript
   categoryRules = {
     personal: [/4120.*gehalt/, /4130.*sozial/, /4140.*freiw/],
     raum: [/421\d.*miete/, /424\d.*strom|gas/],
     kfz: [/452\d.*versich/, /453\d.*kraftstoff/],
     // ... 8 Kategorien
   }
   ```
4. Summen-Berechnung pro Kategorie
5. Semantic Fix/Variable-Classification

**Vorteile:**
- ✅ Format-agnostisch (DATEV, Lexoffice, sevDesk)
- ✅ Keine Schätzungen, nur echte Kontenwerte
- ✅ Semantische Rules statt harte Kontonummer-Mappings

### 3. **Datenspeicherung (AES-256 verschlüsselt)**

```javascript
// Verschlüsselung
const encrypted = CryptoJS.AES.encrypt(
  JSON.stringify(data), 
  userPassword
).toString();
localStorage.setItem('bwaData', encrypted);

// Entschlüsselung
const decrypted = CryptoJS.AES.decrypt(
  localStorage.getItem('bwaData'), 
  userPassword
);
const data = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
```

**Sicherheits-Prinzipien:**
- ✅ Passwort-basierte Verschlüsselung (AES-256)
- ✅ Daten verlassen NIEMALS den Browser
- ✅ Keine Server-Kommunikation
- ✅ Keine Cookies, keine Tracking-Tools
- ✅ DSGVO-konform by design

### 4. **Visualisierung (Chart.js)**

```javascript
// Kosten-Breakdown Bar Chart
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Personal', 'Raum', 'Kfz', ...],
    datasets: [{
      data: [67892, 9726, 20561, ...],
      backgroundColor: ['#FF6384', '#36A2EB', ...]
    }]
  }
});
```

---

## 🔄 Datenfluss

```
1. Nutzer lädt BWA-PDF hoch
   ↓
2. PDF.js extrahiert Text (Seite für Seite)
   ↓
3. extractBWADataFromText() parsed Text
   ├─ Extrahiert Summen-Zeilen (Revenue, Costs)
   └─ Ruft extractDetailedCostBreakdown() auf
      ↓
4. extractDetailedCostBreakdown() analysiert Summen- und Saldenliste
   ├─ Regex-Matching für Konten (4120, 4130, etc.)
   ├─ Semantische Kategorisierung (8 Kategorien)
   └─ Fix/Variable-Klassifizierung
      ↓
5. Strukturiertes Datenobjekt wird zurückgegeben
   ↓
6. CryptoJS verschlüsselt Daten mit User-Passwort
   ↓
7. Verschlüsselte Daten in localStorage
   ↓
8. Chart.js visualisiert Ergebnisse
```

---

## 🛡️ Sicherheitsarchitektur

### Threat Model
**Angriffsvektoren:**
1. ❌ Server-Compromise → **NICHT relevant** (keine Server!)
2. ⚠️ Browser-Extension mit Zugriff auf localStorage
3. ⚠️ Physical Access zum Gerät
4. ⚠️ XSS-Injection (falls jemals Server-Features hinzukommen)

**Schutzmaßnahmen:**
- ✅ AES-256 Verschlüsselung (nur User kennt Passwort)
- ✅ Content Security Policy (CSP) Headers
- ✅ Keine externe JavaScript-Dependencies von CDNs (außer PDF.js, CryptoJS, Chart.js)
- ✅ Keine `eval()`, keine `innerHTML` ohne Sanitization

### DSGVO-Compliance
- ✅ Keine Datenübertragung an Server
- ✅ Keine Cookies (außer technisch notwendige)
- ✅ Keine Tracking-Tools
- ✅ Keine IP-Logging
- ✅ User hat volle Kontrolle über Daten (localStorage clear = Daten weg)

---

## 🚀 Deployment-Architektur

### GitHub Pages (Static Site Hosting)
```
GitHub Repository (main branch)
  ↓ Push to main
GitHub Actions (optional CI/CD)
  ↓ Build & Deploy
GitHub Pages Server
  ↓ HTTPS
User Browser
```

**Branches:**
- `main` → Production (https://gordians1993.github.io/bwalytics/)
- `staging` → Staging Environment (Test vor Production)
- `dev` → Development Branch

**Deployment-Prozess:**
1. Developer pusht zu `dev` Branch
2. Testing auf Staging Environment
3. Merge `dev` → `staging` → Code Review
4. Merge `staging` → `main` → Automatisches Deployment zu GitHub Pages

---

## 🧩 Erweiterbarkeit

### Geplante Features (siehe ROADMAP.md)
1. **Cashflow-Runway:** Liquiditäts-Prognose
2. **Multi-Monats-Vergleich:** Trend-Analyse über mehrere BWAs
3. **Profitabilitäts-Hebel:** Interactive What-If-Szenarien
4. **Export-Funktionen:** PDF-Report, Excel-Export

### Plugin-Architektur (zukünftig)
```javascript
// Plugin-System für custom Extraction-Rules
const plugins = [
  datevPlugin,      // DATEV-spezifische Rules
  lexofficePlugin,  // Lexoffice-Format
  sevDeskPlugin     // sevDesk-Format
];

plugins.forEach(plugin => plugin.register());
```

---

## 📊 Performance-Überlegungen

### Optimierungen
- ✅ PDF.js mit Worker-Thread (nicht-blockierend)
- ✅ Lazy-Loading von Chart.js (nur wenn benötigt)
- ✅ LocalStorage statt Server-Roundtrips
- ⚠️ Große PDFs (>50 Seiten) können langsam sein → Future: Pagination

### Bottlenecks
1. **PDF-Parsing:** 2-5 Sekunden für typische DATEV-BWA (3-5 Seiten)
2. **Regex-Matching:** O(n) Komplexität, aber n < 10.000 Zeilen → OK
3. **LocalStorage Limit:** 5-10 MB → Reicht für ~100 BWAs

---

## 🔧 Technische Schulden

### Known Issues
1. ⚠️ Keine Unit-Tests (kommt in Phase 2)
2. ⚠️ Hardcoded Chart.js CDN-Link (sollte lokal gehostet werden)
3. ⚠️ Keine Error-Boundary bei Parsing-Failures
4. ⚠️ Deutsche Variablennamen gemischt mit Englisch

### Future Refactorings
- [ ] Module-System (ES6 Imports statt alles in einer Datei)
- [ ] TypeScript für Type-Safety
- [ ] Vite/Webpack Build-Pipeline
- [ ] Jest/Vitest Testing-Framework

---

## 📚 Referenzen

- **PDF.js Dokumentation:** https://mozilla.github.io/pdf.js/
- **CryptoJS Docs:** https://cryptojs.gitbook.io/docs/
- **Chart.js Docs:** https://www.chartjs.org/docs/
- **DATEV SKR03/04 Kontenrahmen:** https://www.datev.de/

---

**Nächste Schritte:** Siehe [ROADMAP.md](./ROADMAP.md) für geplante Features und Milestones.
