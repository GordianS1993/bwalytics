# BWA-Dashboard für Kleinunternehmer

Ein intelligentes Dashboard zur Analyse von Betriebswirtschaftlichen Auswertungen (BWA) mit automatischer PDF-Verarbeitung und KI-basierten Empfehlungen.

## 🚀 Features

- **📄 PDF-Upload**: Einfacher Upload von BWA-PDFs vom Steuerberater
- **📊 Dashboard**: Übersichtliche Wirtschaftsplan-Visualisierung
- **📈 Scoring-System**: Automatische Bewertung der Unternehmensgesundheit
- **📅 Historie**: Langzeit-Trends und Entwicklungsanalyse
- **🤖 KI-Empfehlungen**: Intelligente Vorschläge zur Unternehmenssteuerung

## 🏗️ Architektur

```
kleinunternehmer-dashboard/
├── client/          # React Frontend
├── server/          # Node.js Backend API
├── database/        # Datenbankschemas und Migrationen
└── docs/           # Dokumentation
```

## 📋 Technologie-Stack

**Frontend:**
- React 18 mit TypeScript
- Material-UI / Chakra UI für Design
- Chart.js für Datenvisualisierung
- React Query für API-Aufrufe

**Backend:**
- Node.js mit Express
- PDF-js für PDF-Parsing
- Prisma ORM für Datenbankzugriff
- JWT für Authentifizierung

**Datenbank:**
- PostgreSQL für Produktiv
- SQLite für Entwicklung

**KI & Analytics:**
- OpenAI API für Empfehlungen
- Custom Scoring-Algorithmen

## 🚀 Quick Start

```bash
# Installation aller Abhängigkeiten
npm run install:all

# Entwicklung starten (Backend + Frontend)
npm run dev

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

## 📖 Nutzung

1. **BWA-PDF hochladen**: Drag & Drop oder Datei-Browser
2. **Automatische Analyse**: System extrahiert Kennzahlen
3. **Dashboard ansehen**: Visualisierung der Unternehmensdaten
4. **Scoring prüfen**: Gesundheitsbewertung des Unternehmens
5. **Empfehlungen befolgen**: KI-basierte Handlungsvorschläge

## 🔧 Entwicklung

```bash
# Backend isoliert starten
npm run server:dev

# Frontend isoliert starten  
npm run client:dev

# Tests ausführen
npm test

# Produktions-Build
npm run build
```

## 📊 BWA-Kennzahlen

Das System analysiert folgende Schlüsselkennzahlen:

- **Umsätze**: Entwicklung und Trends
- **Kosten**: Struktur und Optimierungspotential
- **Gewinn/Verlust**: Rentabilitätsanalyse
- **Liquidität**: Cashflow-Bewertung
- **Kapitalstruktur**: Finanzstabilität

## 🎯 Roadmap

- [ ] Basis-Dashboard und PDF-Upload
- [ ] BWA-Parser und Kennzahlen-Extraktion
- [ ] Scoring-Algorithmus
- [ ] Historie und Trend-Analyse
- [ ] KI-Empfehlungssystem
- [ ] Mobile App
- [ ] Benchmarking mit Branchendaten

## 📄 Lizenz

MIT License - siehe [LICENSE](LICENSE) für Details.