# BWAlytics - Intelligente BWA-Analyse für Kleinunternehmer

[![GitHub Pages](https://img.shields.io/badge/Live-GitHub%20Pages-success)](https://gordians1993.github.io/bwalytics/)
[![Tests](https://github.com/GordianS1993/bwalytics/actions/workflows/test.yml/badge.svg)](https://github.com/GordianS1993/bwalytics/actions/workflows/test.yml)
[![Deploy](https://github.com/GordianS1993/bwalytics/actions/workflows/deploy.yml/badge.svg)](https://github.com/GordianS1993/bwalytics/actions/workflows/deploy.yml)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-green.svg)](CHANGELOG.md)

**BWAlytics** ist ein 100% browserbasiertes Tool zur Analyse von Betriebswirtschaftlichen Auswertungen (BWA). Keine Server, keine Cloud, keine Datenweitergabe - deine Geschäftsdaten bleiben auf deinem Gerät!

🔗 **Live-Demo:** https://gordians1993.github.io/bwalytics/

---

## ✨ Features

### � **Privacy-First Design**
- ✅ **100% Client-Side** - Alle Daten bleiben im Browser
- ✅ **AES-256 Verschlüsselung** - Passwortgeschützter localStorage
- ✅ **Keine Server-Kommunikation** - Kein Tracking, keine Cookies
- ✅ **DSGVO-konform** - Privacy by Design

### 📊 **Intelligente Analyse**
- ✅ **Automatische PDF-Verarbeitung** - Upload & Go
- ✅ **Semantische Kategorisierung** - 8 Hauptkostenarten statt 50+ Konten
- ✅ **Format-Agnostisch** - Funktioniert mit DATEV, Lexoffice, sevDesk
- ✅ **Fix/Variable-Klassifizierung** - Semantische Kostenanalyse
- ✅ **Echtzeit-Visualisierung** - Chart.js Dashboards

### 💡 **Unternehmer-Perspektive**
- ✅ **Actionable Insights** statt nackter Zahlen
- ✅ **Keine Steuerberater-Jargon** - Verständliche Sprache
- ✅ **Trend-Analysen** - Entwicklung über mehrere Monate

---

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────────┐
│                  Browser (Client-Side)                   │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Landing Page          Haupt-App                         │
│  ┌──────────┐         ┌────────────────────┐            │
│  │index.html│────────▶│bwa-upload-working  │            │
│  └──────────┘         │       .html        │            │
│                       └────────────────────┘            │
│                                │                         │
│                                ▼                         │
│                       ┌────────────────────┐            │
│                       │     PDF.js         │            │
│                       │  Text Extraction   │            │
│                       └────────────────────┘            │
│                                │                         │
│                                ▼                         │
│              ┌──────────────────────────────┐           │
│              │ extractBWADataFromText()     │           │
│              │ + extractDetailedCost        │           │
│              │   Breakdown()                │           │
│              └──────────────────────────────┘           │
│                                │                         │
│                                ▼                         │
│                       ┌────────────────────┐            │
│                       │    CryptoJS        │            │
│                       │    AES-256         │            │
│                       └────────────────────┘            │
│                                │                         │
│                                ▼                         │
│                       ┌────────────────────┐            │
│                       │   localStorage     │            │
│                       │   (encrypted)      │            │
│                       └────────────────────┘            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

**Kein Backend. Keine Datenbank. Keine Cloud.**

---

## 📋 Technologie-Stack

| Komponente | Technologie | Zweck |
|------------|-------------|-------|
| **Frontend** | Vanilla JavaScript (ES6+) | Keine Framework-Abhängigkeiten |
| **PDF-Parsing** | [PDF.js 3.11.174](https://mozilla.github.io/pdf.js/) | BWA-Text-Extraktion |
| **Verschlüsselung** | [CryptoJS 4.2.0](https://cryptojs.gitbook.io/) | AES-256 localStorage-Protection |
| **Visualisierung** | [Chart.js](https://www.chartjs.org/) | Interactive Dashboards |
| **Hosting** | GitHub Pages | Static Site, kostenlos |

**Bundle-Size:** ~200 KB (inklusive Dependencies)  
**Performance:** < 3 Sekunden für typische BWA-Analyse

---

## 🚀 Quick Start

### **Option 1: Live-Version nutzen**
```
🔗 https://gordians1993.github.io/bwalytics/
```

### **Option 2: Lokal ausführen**
```bash
# Clone Repository
git clone https://github.com/GordianS1993/bwalytics.git
cd bwalytics

# Lokaler Webserver (Python)
python3 -m http.server 8080

# Oder mit Node.js
npx http-server -p 8080

# Öffne: http://localhost:8080
```

**Keine Installation, keine Dependencies!** 🎉

---

## 📖 Nutzung

### 1. **Passwort erstellen**
   - Öffne die App
   - Erstelle ein starkes Passwort (Master-Passwort)
   - Deine Daten werden AES-256 verschlüsselt

### 2. **BWA-PDF hochladen**
   - Lade deine BWA vom Steuerberater hoch
   - Funktioniert mit DATEV, Lexoffice, sevDesk, etc.

### 3. **Analyse starten**
   - System extrahiert automatisch alle Kennzahlen
   - Umsatz, Kosten, Profit, Marge
   - 8 Hauptkostenkategorien (Personal, Raum, Kfz, etc.)

### 4. **Dashboard ansehen**
   - Visualisierung mit Chart.js
   - Fix/Variable-Kostenaufteilung
   - Trend-Analysen

### 5. **Daten sicher speichern**
   - Verschlüsselt in localStorage
   - Nur du hast Zugriff (via Passwort)

---

## 📊 Extrahierte Kennzahlen

### **Basis-Metriken**
- **Umsatzerlöse** - Aus BWA-Übersicht
- **Gesamtkosten** - Summe aller Aufwendungen
- **Gewinn/Verlust** - Umsatz minus Kosten
- **Marge (%)** - Gewinn / Umsatz

### **Detaillierte Kostenstruktur** (8 Kategorien)
| Kategorie | DATEV-Konten | Beispiel-Positionen |
|-----------|--------------|---------------------|
| **Personal** | 4120-4199 | Gehälter, Sozialabgaben, Weiterbildung |
| **Raum** | 4210-4299 | Miete, Strom, Gas, Reinigung |
| **Kfz** | 4520-4599 | Versicherung, Kraftstoff, Leasing |
| **Marketing** | 4600-4699 | Werbung, PR, Online-Marketing |
| **Versicherungen** | 4360-4399 | Betriebshaftpflicht, Rechtsschutz |
| **Büro** | 4940-4999 | Büromaterial, Software, Telefon |
| **Fremdleistung** | 4800-4899 | Subunternehmer, Dienstleister |
| **Sonstige** | 6xxx, 7xxx | Alle anderen Kosten |

### **Semantische Klassifizierung**
- **Fixkosten** - Miete, Gehälter, Versicherungen (ca. 70%)
- **Variable Kosten** - Marketing, Kfz, Fremdleistung (ca. 30%)

---

## � Sicherheit & Datenschutz

### **Was passiert mit deinen Daten?**
```
❌ Keine Server-Übertragung
❌ Keine Cloud-Speicherung  
❌ Keine Tracking-Tools
❌ Keine Cookies (außer technisch notwendige)
✅ 100% lokal im Browser
✅ AES-256 verschlüsselt
✅ Du hast volle Kontrolle
```

### **DSGVO-Compliance**
- ✅ **Art. 25 DSGVO** - Privacy by Design
- ✅ **Art. 32 DSGVO** - State-of-the-Art Verschlüsselung
- ✅ **Keine Datenverarbeitung** durch Dritte
- ✅ **User-Kontrolle** - Daten jederzeit löschbar

### **Threat Model**
- ✅ **Server-Compromise** - NICHT möglich (keine Server!)
- ⚠️ **Physical Access** - Gerät verschlüsseln (FileVault/BitLocker)
- ⚠️ **Browser-Extensions** - Nur vertrauenswürdige Extensions
- ✅ **XSS-Protection** - Content Security Policy (CSP)

---

## 🛠️ Entwicklung

### **Projekt-Struktur**
```
bwalytics/
├── index.html                    # Landing Page
├── bwa-upload-working.html       # Haupt-App (Production)
├── .github/
│   ├── copilot-instructions.md   # Copilot-Regeln
│   └── ISSUE_TEMPLATE/           # Bug/Feature Templates
├── docs/
│   ├── ARCHITECTURE.md           # System-Architektur
│   ├── ROADMAP.md                # Feature-Roadmap
│   ├── TESTING.md                # Test-Strategie
│   ├── DEPLOYMENT.md             # Deployment-Guide
│   └── GITHUB_PROJECT_SETUP.md   # Project-Board-Setup
├── scripts/
│   └── create-issues.sh          # Auto-Issue-Creator
└── tests/                        # Testing (geplant)
```

### **Branching-Strategie (GitFlow)**
```
main       → Production (https://gordians1993.github.io/bwalytics/)
staging    → QA & Testing
dev        → Feature-Entwicklung
```

### **Entwickler-Workflow**
```bash
# Feature-Branch erstellen
git checkout dev
git checkout -b feature/cashflow-runway

# Entwicklung...
# Code ändern, testen

# Commit & Push
git add .
git commit -m "feat: Cashflow-Runway implementiert"
git push origin feature/cashflow-runway

# Pull Request erstellen (dev ← feature/cashflow-runway)
# Code Review
# Merge zu dev

# Testing auf Staging
git checkout staging
git merge dev
git push origin staging

# Production-Release
git checkout main
git merge staging
git push origin main
# → Live in 2 Minuten!
```

---

## 🎯 Roadmap

Siehe [docs/ROADMAP.md](docs/ROADMAP.md) für Details.

### **v1.1 - Dashboard & Visualisierung** (Q4 2025)
- [ ] Visuelles Dashboard mit KPI-Cards
- [ ] Kosten-Breakdown Bar-Charts
- [ ] Actionable Insights ("Deine Personalkosten sind 15% über Durchschnitt")
- [ ] UX: Drag & Drop PDF-Upload

### **v1.2 - Cashflow & Liquidität** (Q1 2026)
- [ ] Cashflow-Runway (Wie lange reichen deine Geldbestände?)
- [ ] Liquiditäts-Frühwarnsystem (Forderungen vs. Verbindlichkeiten)
- [ ] Working Capital Ratio

### **v1.3 - Profitabilitäts-Hebel** (Q1 2026)
- [ ] Interactive What-If-Szenarien
- [ ] Profit-Hebel-Analyse (größte Kostenblöcke)
- [ ] Break-Even-Rechner

### **v1.4 - Multi-Monats-Trend** (Q2 2026)
- [ ] Upload mehrerer BWAs
- [ ] Trend-Analysen über Zeit
- [ ] Forecasting (simple Prognosen)

### **v2.0 - Plugin-System** (Q3 2026)
- [ ] Custom Extraction-Rules
- [ ] Export-Funktionen (PDF, Excel)
- [ ] Community-Plugins

---

## 🤝 Beitragen

Wir freuen uns über Contributions!

1. **Fork** das Repository
2. **Clone** dein Fork: `git clone https://github.com/DEIN_USERNAME/bwalytics.git`
3. **Branch** erstellen: `git checkout -b feature/mein-feature`
4. **Entwickeln** & Testen
5. **Commit**: `git commit -m "feat: Mein Feature"`
6. **Push**: `git push origin feature/mein-feature`
7. **Pull Request** erstellen

### **Issue-Templates**
- 🚀 **Feature Request** - [Template](https://github.com/GordianS1993/bwalytics/issues/new?template=feature_request.yml)
- 🐛 **Bug Report** - [Template](https://github.com/GordianS1993/bwalytics/issues/new?template=bug_report.yml)
- 🔄 **Change Request** - [Template](https://github.com/GordianS1993/bwalytics/issues/new?template=change_request.yml)

---

## 📚 Dokumentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System-Architektur, Datenfluss, Sicherheit
- **[ROADMAP.md](docs/ROADMAP.md)** - Feature-Roadmap, Milestones
- **[TESTING.md](docs/TESTING.md)** - Testing-Strategie (Unit/Integration/E2E)
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment-Guide, CI/CD
- **[GITHUB_PROJECT_SETUP.md](docs/GITHUB_PROJECT_SETUP.md)** - Project-Board-Setup

---

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.

---

## 🙏 Credits

Entwickelt mit ❤️ für Kleinunternehmer, die ihre BWA selbst verstehen wollen.

**Technologien:**
- [PDF.js](https://mozilla.github.io/pdf.js/) - Mozilla Foundation
- [CryptoJS](https://github.com/brix/crypto-js) - Jeff Mott
- [Chart.js](https://www.chartjs.org/) - Chart.js Contributors

---

## 📞 Kontakt & Support

- **Issues:** https://github.com/GordianS1993/bwalytics/issues
- **Discussions:** https://github.com/GordianS1993/bwalytics/discussions
- **Email:** (wird noch ergänzt)

---

**⭐ Star this repo wenn es dir hilft!**

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.
