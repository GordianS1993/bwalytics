# BWAlytics - Feature Roadmap

**Version:** 1.0.0  
**Letzte Aktualisierung:** 22. Oktober 2025

---

## 🎯 Vision

**BWAlytics wird das führende Tool für Kleinunternehmer, um ihre BWA selbst zu analysieren - ohne Steuerberater-Jargon, mit actionable Insights.**

---

## 📍 Current State (Oktober 2025)

### ✅ **v1.0 - Intelligente Kostenarten-Extraktion** (RELEASED)

**Features:**
- ✅ PDF-Upload & Text-Extraktion (PDF.js)
- ✅ Intelligente Extraktion aus Summen- und Saldenliste
- ✅ 8 semantische Kostenkategorien (Personal, Raum, Kfz, Marketing, etc.)
- ✅ Format-agnostisch (DATEV, Lexoffice, sevDesk)
- ✅ AES-256 Verschlüsselung (localStorage)
- ✅ Basis-Visualisierung (Chart.js)
- ✅ Fix/Variable-Kostenklassifizierung (semantisch)
- ✅ Responsive Design
- ✅ DSGVO-konform (keine Server-Kommunikation)

**Metriken:**
- Revenue, Costs, Profit, Margin
- Cost Breakdown (8 Kategorien)
- Fixed vs. Variable Costs

---

## 🚀 Roadmap

### 📦 **v1.1 - Dashboard & Visualisierung** (Q4 2025)

**Ziel:** Unternehmer-Dashboard mit aggregierten Kategorien und Actionable Insights

**Features:**
- [ ] 📊 **Visuelles Dashboard**
  - Kosten-Breakdown als interaktive Bar-Charts
  - Fix/Variable-Ratio Pie-Chart
  - Marge & Profit als KPI-Cards
  - Trend-Indikatoren (↑ ↓ →)

- [ ] 💡 **Actionable Insights**
  - Automatische Empfehlungen: "Deine Personalkosten sind 15% über Branchen-Durchschnitt"
  - Warnung bei kritischen Margen (<10%)
  - Positive Highlights: "Deine Marge ist im letzten Monat um 5% gestiegen!"

- [ ] 🎨 **UX-Verbesserungen**
  - Drag & Drop für PDF-Upload
  - Loading-Animationen
  - Error-Handling mit hilfreichen Fehlermeldungen
  - Onboarding-Tutorial für Erstnutzer

**Priorität:** HIGH  
**Geschätzter Aufwand:** 2 Wochen  
**Dependencies:** v1.0 (✅ Done)

---

### 💰 **v1.2 - Cashflow & Liquidität** (Q1 2026)

**Ziel:** Liquiditätsplanung und Frühwarnsystem für Kleinunternehmer

**Features:**
- [ ] 💸 **Cashflow-Runway**
  - Extraktion: Geldbestände (Kasse + Bank) aus Summen- und Saldenliste
  - Berechnung: Durchschnittliche monatliche Ausgaben
  - Runway: "Mit deinen aktuellen Beständen kannst du X Monate ohne Umsatz überleben"
  - Warnung bei Runway < 3 Monate

- [ ] ⚠️ **Liquiditäts-Frühwarnsystem**
  - Forderungen vs. Verbindlichkeiten (aus Summen- und Saldenliste)
  - Working Capital Ratio: (Current Assets - Current Liabilities) / Revenue
  - Alert bei kritischen Werten
  - Empfehlungen: "Treibe Forderung XY ein" oder "Verhandle Zahlungsziele"

- [ ] 📈 **Liquiditäts-Trendanalyse**
  - Vergleich Geldbestände über mehrere Monate
  - Saisonale Schwankungen erkennen

**Priorität:** HIGH  
**Geschätzter Aufwand:** 3 Wochen  
**Dependencies:** v1.1 (Dashboard für Visualisierung)

---

### 🎯 **v1.3 - Profitabilitäts-Hebel** (Q1 2026)

**Ziel:** Interactive What-If-Szenarien für Profitabilitäts-Optimierung

**Features:**
- [ ] 🔍 **Top Profit-Hebel identifizieren**
  - Automatische Analyse: "Deine größten Kostenblöcke sind: Personal (35%), Marketing (18%), Kfz (15%)"
  - Hebel-Score: Welche Kostenkategorie hat größten Impact auf Profit?

- [ ] 🎛️ **Interactive Simulations-Schieberegler**
  - "Was wäre wenn..."-Szenarien
  - Beispiel: "Reduziere Personalkosten um 10%" → Neue Marge: 62% (vorher 50%)
  - Beispiel: "Erhöhe Marketing um 20%" → Erwarteter Umsatz-Boost?
  - Side-by-Side-Vergleich: Aktuell vs. Szenario

- [ ] 📊 **Break-Even-Analyse**
  - Fixkosten-Deck-Punkt: "Du musst X € Umsatz machen, um Fixkosten zu decken"
  - Ziel-Marge-Rechner: "Um 60% Marge zu erreichen, musst du Kosten um X € senken"

**Priorität:** MEDIUM  
**Geschätzter Aufwand:** 2 Wochen  
**Dependencies:** v1.1 (Dashboard), v1.0 (Cost Breakdown)

---

### 📅 **v1.4 - Multi-Monats-Trend** (Q2 2026)

**Ziel:** Vergleichende Analyse über mehrere BWAs hinweg

**Features:**
- [ ] 📂 **Multi-BWA-Upload**
  - Upload mehrerer BWAs (z.B. Januar-Dezember 2025)
  - Automatische Zuordnung nach Monat/Quartal
  - Verschlüsselte Speicherung aller BWAs

- [ ] 📈 **Trend-Visualisierung**
  - Umsatz-Trend über Zeit (Line-Chart)
  - Kosten-Trend pro Kategorie
  - Marge-Entwicklung
  - MoM (Month-over-Month) & YoY (Year-over-Year) Vergleiche

- [ ] 🎯 **Forecasting (einfache Prognose)**
  - Linear Regression für nächste 3 Monate
  - Saisonalitäts-Erkennung (z.B. Q4 immer stärker)
  - Warnung: "Dein Umsatz-Trend zeigt -5% Rückgang, handle jetzt!"

**Priorität:** MEDIUM  
**Geschätzter Aufwand:** 4 Wochen  
**Dependencies:** v1.2 (Liquidität), v1.0 (Extraction)

---

### 🔌 **v2.0 - Plugin-System & Custom Rules** (Q3 2026)

**Ziel:** Erweiterbarkeit für verschiedene BWA-Formate und Custom-Logiken

**Features:**
- [ ] 🧩 **Plugin-Architektur**
  - Registrierbare Extraction-Plugins für DATEV, Lexoffice, sevDesk, etc.
  - Custom Regex-Rules für unbekannte Formate
  - Community-Plugins (GitHub Marketplace?)

- [ ] ⚙️ **User-Konfiguration**
  - Custom Kategorien-Mappings (z.B. "4120 gehört zu Personal")
  - Individuelle Fix/Variable-Splits
  - Custom Alerts & Thresholds

- [ ] 📤 **Export-Funktionen**
  - PDF-Report generieren (mit Charts & Insights)
  - Excel-Export (strukturierte Daten)
  - JSON-API für Integration in andere Tools

**Priorität:** LOW (Future)  
**Geschätzter Aufwand:** 6 Wochen  
**Dependencies:** v1.4 (Multi-Monats-Trend)

---

### 🌐 **v2.1 - Collaboration (Optional)** (Q4 2026)

**Ziel:** Teilen von Analysen (optional, DSGVO-konform)

**Features:**
- [ ] 🔗 **Shareable Links**
  - Generiere Read-Only-Link für Steuerberater/Partner
  - End-to-End-Verschlüsselung (Passwort-geschützt)
  - Selbstzerstörender Link (expires nach 7 Tagen)

- [ ] 👥 **Multi-User (ohne Server!)**
  - P2P-Synchronisation via WebRTC?
  - Lokales "Team-Mode" (mehrere BWAs pro User)

**Priorität:** LOW (Nice-to-have)  
**Geschätzter Aufwand:** 8 Wochen  
**Dependencies:** v2.0 (Plugin-System)  
**Risiko:** DSGVO-Compliance muss gewährleistet bleiben!

---

## 🛠️ Technical Debt & Refactorings

### Phase 1: Testing-Infrastructure (parallel zu v1.1)
- [ ] Jest/Vitest Setup
- [ ] Unit-Tests für `extractDetailedCostBreakdown()`
- [ ] E2E-Tests mit Playwright/Cypress
- [ ] GitHub Actions CI/CD Pipeline

### Phase 2: Code-Qualität (parallel zu v1.2)
- [ ] ESLint + Prettier
- [ ] Pre-commit Hooks (Husky)
- [ ] TypeScript Migration (optional)
- [ ] Module-System (ES6 Imports)

### Phase 3: Performance (parallel zu v1.4)
- [ ] PDF.js Worker-Thread Optimierung
- [ ] Lazy-Loading für Charts
- [ ] IndexedDB statt localStorage (größere Kapazität)
- [ ] Service Worker für Offline-Support

---

## 📊 Success Metrics

### v1.1 Success Criteria
- [ ] 90% der Nutzer verstehen Dashboard ohne Anleitung
- [ ] < 3 Sekunden Loading-Zeit für typische BWA
- [ ] 0 Critical Bugs nach 1 Woche

### v1.2 Success Criteria
- [ ] Cashflow-Runway wird für 95% der BWAs korrekt berechnet
- [ ] Liquiditäts-Warnungen verhindern 1+ Zahlungsausfälle (User-Feedback)

### v1.3 Success Criteria
- [ ] Nutzer verwenden durchschnittlich 3+ "Was-wäre-wenn"-Szenarien pro Session
- [ ] 50% der Nutzer berichten: "Habe Kosteneinsparung durch Profitabilitäts-Hebel gefunden"

### v1.4 Success Criteria
- [ ] Nutzer laden durchschnittlich 6+ BWAs hoch (Multi-Monats-Analyse)
- [ ] Trend-Forecast hat < 10% Abweichung zu echten Werten (nächster Monat)

---

## 🎨 Design-Prinzipien

### User-Centric
- ✅ Keine Steuerberater-Jargon
- ✅ Actionable Insights > reine Zahlen
- ✅ "So what?" → Immer Kontext liefern

### Performance-First
- ✅ < 3 Sekunden Loading
- ✅ No-Flicker UI
- ✅ Offline-fähig (Service Worker)

### Privacy by Design
- ✅ Keine Server-Kommunikation
- ✅ Verschlüsselung by default
- ✅ User hat volle Datenkontrolle

---

## 🗓️ Milestone-Timeline

```
Q4 2025  ▓▓▓▓▓▓▓░░░░░  v1.1 Dashboard & Visualisierung
Q1 2026  ░░░░░░░▓▓▓▓▓  v1.2 Cashflow & Liquidität
         ░░░░░░░░░░▓▓  v1.3 Profitabilitäts-Hebel
Q2 2026  ░░░░░░░░░░░░  v1.4 Multi-Monats-Trend
Q3 2026  ░░░░░░░░░░░░  v2.0 Plugin-System
Q4 2026  ░░░░░░░░░░░░  v2.1 Collaboration (optional)
```

---

## 🤝 Community-Feedback

**Wie kannst du beitragen?**
1. 🐛 **Bug-Reports:** Nutze GitHub Issues (Template: `bug_report.yml`)
2. 💡 **Feature-Requests:** Nutze GitHub Issues (Template: `feature_request.yml`)
3. 🧪 **Beta-Testing:** Teste neue Features auf `staging` Branch
4. 📝 **Dokumentation:** Verbessere Docs, schreibe Tutorials
5. 💻 **Code-Contributions:** Pull Requests auf `dev` Branch

---

**Nächste Schritte:** Siehe [GitHub Issues](https://github.com/GordianS1993/bwalytics/issues) für aktuelle Tasks und Diskussionen.
