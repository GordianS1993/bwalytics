# BWAlytics - GitHub Issues Backlog

**Gesamt: 11 Issues**  
**Stand:** 23. Oktober 2025

---

## 🏗️ Infrastructure (1 Issue)

### Issue #1: Wiederverwendbares Projekt-Template erstellen

**Labels:** `infrastructure`, `priority:medium`  
**Milestone:** v1.1 Dashboard

**Beschreibung:**

## 🎯 Ziel
GitHub Template Repository für zukünftige Projekte

## 📋 Beschreibung
Die komplette BWAlytics-Infrastruktur als wiederverwendbares Template verpacken:
- Git Branching (dev/staging/main)
- Documentation Structure
- Issue Templates
- CI/CD Workflows
- Testing Infrastructure

## ✅ Akzeptanzkriterien
- [ ] GitHub Template Repository erstellt
- [ ] `setup-project.sh` Script zum Initialisieren
- [ ] Generalisierte Struktur (Platzhalter statt BWAlytics-spezifisch)
- [ ] README mit Anleitung zur Template-Nutzung
- [ ] Beispiel-Projekt zum Testen

## 🔗 Dependencies
Keine (Infrastructure steht)

## 📚 Referenzen
- INFRASTRUCTURE_COMPLETE.md

---

## 📊 v1.1 Dashboard (4 Issues)

### Issue #2: Dashboard Layout mit KPI-Cards erstellen

**Labels:** `feature`, `v1.1`, `priority:high`, `ux`  
**Milestone:** v1.1 Dashboard

**Beschreibung:**

## 🎯 Ziel
Visuelles Dashboard mit Umsatz, Kosten, Gewinn, Marge als KPI-Cards

## 📋 Beschreibung
Responsive Grid-Layout mit großen KPI-Karten:
- Umsatz (Revenue)
- Kosten (Costs)
- Gewinn (Profit)
- Marge (Margin)

Jede Card: Aktueller Wert + Trend-Indikator (↑ ↓ →)

## ✅ Akzeptanzkriterien
- [ ] 4 KPI-Cards im Responsive Grid (2x2 auf Desktop, 1x4 auf Mobile)
- [ ] Große, gut lesbare Zahlen (Umsatz: 95.500 €)
- [ ] Trend-Indikatoren basierend auf letztem Monat (wenn vorhanden)
- [ ] Farb-Coding: Grün (positiv), Rot (negativ), Grau (neutral)
- [ ] Smooth Animations beim Laden

## 🔧 Technische Details
- Vanilla JS, kein Framework
- CSS Grid für Layout
- Chart.js für Visualisierungen
- Responsive: Mobile-First Design

## 🔗 Dependencies
- v1.0 (extractDetailedCostBreakdown funktioniert bereits) ✅

## 📚 Referenzen
- docs/ROADMAP.md v1.1
- bwa-upload-working.html (aktueller Stand)

---

### Issue #3: Kosten-Breakdown Bar-Charts implementieren

**Labels:** `feature`, `v1.1`, `priority:high`, `analytics`  
**Milestone:** v1.1 Dashboard

**Beschreibung:**

## 🎯 Ziel
Interaktive Bar-Charts für die 8 Kostenkategorien

## 📋 Beschreibung
Visualisierung der Kostenaufschlüsselung:
- Personal (35%)
- Raum (12%)
- Kfz (10%)
- Marketing (18%)
- Versicherungen (5%)
- Büro (15%)
- Fremdleistungen (3%)
- Sonstige (2%)

## ✅ Akzeptanzkriterien
- [ ] Horizontal Bar-Chart (Chart.js)
- [ ] Sortiert nach Höhe (größte Kategorie oben)
- [ ] Prozentanzeige + Absolut-Betrag
- [ ] Tooltip mit Details beim Hover
- [ ] Responsive (Mobile-optimiert)
- [ ] Farb-Palette: 8 unterscheidbare Farben

## 🔧 Technische Details
- Chart.js Bar-Chart (horizontal)
- Daten aus `extractDetailedCostBreakdown()`
- Colors: Kategorie-spezifische Palette

## 🔗 Dependencies
- v1.0 extractDetailedCostBreakdown ✅

## 📚 Referenzen
- docs/ROADMAP.md v1.1
- .github/copilot-instructions.md (Präzision vor Schätzungen)

---

### Issue #4: Actionable Insights Engine implementieren

**Labels:** `feature`, `v1.1`, `priority:high`, `analytics`  
**Milestone:** v1.1 Dashboard

**Beschreibung:**

## 🎯 Ziel
Automatische Empfehlungen basierend auf BWA-Analyse

## 📋 Beschreibung
Rule-Engine für businessrelevante Insights:
- Vergleich mit Branchen-Durchschnitt (wenn verfügbar)
- Warnung bei kritischen Margen (<10%)
- Positive Highlights (Marge gestiegen, Kosten gesenkt)
- Actionable Recommendations: "Prüfe Personalkosten" statt nur "Personalkosten hoch"

## ✅ Akzeptanzkriterien
- [ ] Mindestens 5 Insight-Rules implementiert:
  - Marge < 10%: Warnung
  - Personalkosten > 40%: Empfehlung zur Prüfung
  - Marketing < 5%: Hinweis auf Wachstumspotenzial
  - Gewinn > 50%: Positive Bestätigung
  - Fixkosten > 60%: Flexibilität verbessern
- [ ] Insights als Cards im Dashboard
- [ ] Icon-basierte Kategorisierung (⚠️ Warnung, 💡 Empfehlung, ✅ Positiv)
- [ ] "Mehr erfahren"-Link zu Erklärungen

## 🔧 Technische Details
- Rule-Engine mit konfigurierbaren Thresholds
- Insight-Types: warning, recommendation, positive
- Priorität: high, medium, low

## 🔗 Dependencies
- v1.1 Dashboard Layout ✅

## 📚 Referenzen
- docs/ROADMAP.md v1.1
- .github/copilot-instructions.md (Unternehmer-Perspektive)

---

### Issue #5: UX: Drag & Drop PDF-Upload

**Labels:** `enhancement`, `v1.1`, `priority:medium`, `ux`  
**Milestone:** v1.1 Dashboard

**Beschreibung:**

## 🎯 Ziel
Intuitive Drag & Drop Zone für PDF-Upload

## 📋 Beschreibung
Verbesserte Upload-Experience:
- Große Drag & Drop Zone
- "Datei hierher ziehen oder klicken zum Auswählen"
- Preview: PDF-Icon + Dateiname + Größe
- Loading-Spinner während Verarbeitung
- Success/Error-Toast-Notifications

## ✅ Akzeptanzkriterien
- [ ] Drag & Drop Zone (min. 300px hoch, full width)
- [ ] Hover-State beim Drag-Over
- [ ] File-Input als Fallback (versteckt)
- [ ] File-Validation: Nur .pdf, max 50MB
- [ ] Progress-Indicator während Verarbeitung
- [ ] Toast-Notifications (Success, Error mit hilfreichen Messages)

## 🔧 Technische Details
- Vanilla JS DragEvent API
- FileReader API für lokales Lesen
- PDF.js für Verarbeitung (bereits implementiert)

## 🔗 Dependencies
- Keine (UX-Verbesserung von v1.0)

## 📚 Referenzen
- docs/ROADMAP.md v1.1

---

## 💰 v1.2 Cashflow & Liquidität (2 Issues)

### Issue #6: Cashflow-Runway Berechnung

**Labels:** `feature`, `v1.2`, `priority:high`, `analytics`  
**Milestone:** v1.2 Cashflow & Liquidität

**Beschreibung:**

## 🎯 Ziel
Liquiditäts-Runway: "Mit deinen aktuellen Beständen kannst du X Monate ohne Umsatz überleben"

## 📋 Beschreibung
Extraktion & Berechnung:
1. Geldbestände extrahieren (Kasse + Bank) aus Summen- und Saldenliste
2. Durchschnittliche monatliche Ausgaben berechnen
3. Runway = Geldbestände / Ø Monatl. Ausgaben
4. Warnung bei Runway < 3 Monate

## ✅ Akzeptanzkriterien
- [ ] Extraktion: Konten 1000-1999 (Kasse, Bank)
- [ ] Berechnung Ø Monatl. Ausgaben (aus Kosten)
- [ ] Runway-Anzeige: "X Monate Runway" mit Farb-Coding
- [ ] Warnung (rot) bei < 3 Monate
- [ ] Info-Tooltip: Erklärung was Runway bedeutet
- [ ] Funktioniert mit verschiedenen BWA-Formaten (DATEV, Lexoffice)

## 🔧 Technische Details
- Neue Funktion: `extractCashAndBankBalance(text)`
- Konten: 1000 (Kasse), 1200 (Bank), 1800 (Sonstige Geldkonten)
- Runway-Formel: `balance / (totalCosts / months)`

## 🔗 Dependencies
- v1.0 extractDetailedCostBreakdown ✅
- v1.1 Dashboard (für Visualisierung)

## 📚 Referenzen
- docs/ROADMAP.md v1.2
- .github/copilot-instructions.md (Präzision, semantische Kategorisierung)

---

### Issue #7: Liquiditäts-Frühwarnsystem

**Labels:** `feature`, `v1.2`, `priority:high`, `analytics`  
**Milestone:** v1.2 Cashflow & Liquidität

**Beschreibung:**

## 🎯 Ziel
Frühwarnsystem für kritische Liquiditätssituationen

## 📋 Beschreibung
Monitoring:
- Forderungen vs. Verbindlichkeiten
- Working Capital Ratio
- Alerts bei kritischen Werten
- Empfehlungen: "Treibe Forderung XY ein"

## ✅ Akzeptanzkriterien
- [ ] Extraktion: Forderungen (Konten 1400-1499)
- [ ] Extraktion: Verbindlichkeiten (Konten 1600-1699)
- [ ] Berechnung: Working Capital Ratio = (Forderungen - Verbindlichkeiten) / Umsatz
- [ ] Alert bei Ratio < -0.2 (kritisch)
- [ ] Empfehlungen basierend auf Ratio
- [ ] Dashboard-Widget mit Status-Ampel (🟢 🟡 🔴)

## 🔧 Technische Details
- Neue Funktion: `extractReceivablesAndPayables(text)`
- Konten: 1400-1499 (Forderungen), 1600-1699 (Verbindlichkeiten)
- Ratio-Calculation mit Thresholds

## 🔗 Dependencies
- v1.0 extractBWADataFromText ✅
- v1.2 Cashflow-Runway (ähnliche Logik)

## 📚 Referenzen
- docs/ROADMAP.md v1.2

---

## 🎯 v1.3 Profitabilitäts-Hebel (2 Issues)

### Issue #8: Top Profit-Hebel identifizieren

**Labels:** `feature`, `v1.3`, `priority:medium`, `analytics`  
**Milestone:** v1.3 Profitabilitäts-Hebel

**Beschreibung:**

## 🎯 Ziel
Automatische Analyse: "Deine größten Kostenblöcke sind: Personal (35%), Marketing (18%), Kfz (15%)"

## 📋 Beschreibung
Hebel-Score-Berechnung:
- Identifiziere Top 3-5 Kostenkategorien
- Berechne Impact auf Gewinn: Was passiert bei 10% Reduktion?
- Priorisierung: Welche Kategorie hat größten Hebel-Effekt?
- Empfehlungen: "Fokus auf Kategorie X für maximalen Impact"

## ✅ Akzeptanzkriterien
- [ ] Top 5 Kostenkategorien sortiert nach Impact
- [ ] Hebel-Score für jede Kategorie (0-100)
- [ ] Visualisierung: Ranking-Liste mit Impact-Prozent
- [ ] "Was wäre wenn"-Preview: -10% → +X € Gewinn
- [ ] Dashboard-Widget: "Top Profit Opportunities"

## 🔧 Technische Details
- Hebel-Score = (Kosten-Kategorie / Gesamt-Kosten) * 100
- Impact-Calculation: (category * 0.1) / revenue = Marge-Verbesserung

## 🔗 Dependencies
- v1.0 extractDetailedCostBreakdown ✅
- v1.1 Dashboard Layout

## 📚 Referenzen
- docs/ROADMAP.md v1.3

---

### Issue #9: Interactive Simulations-Schieberegler

**Labels:** `feature`, `v1.3`, `priority:medium`, `ux`, `analytics`  
**Milestone:** v1.3 Profitabilitäts-Hebel

**Beschreibung:**

## 🎯 Ziel
"Was wäre wenn..."-Szenarien mit Schiebereglern

## 📋 Beschreibung
Interactive What-If-Simulation:
- Slider für jede Kostenkategorie (-50% bis +50%)
- Live-Update: Neue Marge & Gewinn
- Side-by-Side-Vergleich: Aktuell vs. Szenario
- Speichern von Szenarien (lokal, verschlüsselt)

## ✅ Akzeptanzkriterien
- [ ] 8 Slider (eine pro Kostenkategorie)
- [ ] Wertebereich: -50% bis +50%
- [ ] Live-Update beim Slider-Move (debounced)
- [ ] Vergleichs-View: 2 Spalten (Aktuell | Szenario)
- [ ] "Reset"-Button zum Zurücksetzen
- [ ] "Szenario speichern"-Button (localStorage)

## 🔧 Technische Details
- HTML5 Range-Input (<input type="range">)
- Debounced Event-Handler (100ms)
- Reactive State: Änderung → Re-calculation → UI-Update

## 🔗 Dependencies
- v1.1 Dashboard Layout
- v1.3 Top Profit-Hebel (für initiale Werte)

## 📚 Referenzen
- docs/ROADMAP.md v1.3

---

## 📅 v1.4 Multi-Monats-Trend (2 Issues)

### Issue #10: Multi-BWA-Upload & Verschlüsselung

**Labels:** `feature`, `v1.4`, `priority:medium`  
**Milestone:** v1.4 Multi-Monats-Trend

**Beschreibung:**

## 🎯 Ziel
Upload mehrerer BWAs (z.B. Januar-Dezember 2025) mit automatischer Zuordnung

## 📋 Beschreibung
Erweiterte Upload-Funktion:
- Upload von 1-12 BWAs
- Automatische Monat/Quartal-Erkennung (aus BWA-Text oder Dateiname)
- Verschlüsselte Speicherung aller BWAs (AES-256)
- Liste aller gespeicherten BWAs
- Einzelne BWAs löschen/bearbeiten

## ✅ Akzeptanzkriterien
- [ ] Multi-File-Upload (Browser FileList API)
- [ ] Automatische Monat-Erkennung (Regex: "Zeitraum: 01.01.2025 - 31.01.2025" → Januar 2025)
- [ ] Fallback: Manuelles Monat-Dropdown
- [ ] Verschlüsselung: AES-256 für jede BWA separat
- [ ] localStorage-Key: `bwa_encrypted_{year}_{month}`
- [ ] BWA-Liste mit Edit/Delete-Buttons
- [ ] "Alle BWAs exportieren"-Funktion (JSON-Download)

## 🔧 Technische Details
- CryptoJS AES-256 (bereits implementiert)
- Monat-Detection-Regex: `/(0[1-9]|1[0-2])\\.(\\d{4})/`
- localStorage-Key-Pattern: `bwa_encrypted_YYYY_MM`

## 🔗 Dependencies
- v1.0 PDF-Extraktion ✅
- v1.0 AES-256 Verschlüsselung ✅

## 📚 Referenzen
- docs/ROADMAP.md v1.4
- .github/copilot-instructions.md (Datenschutz ist Pflicht)

---

### Issue #11: Trend-Visualisierung über mehrere Monate

**Labels:** `feature`, `v1.4`, `priority:medium`, `analytics`  
**Milestone:** v1.4 Multi-Monats-Trend

**Beschreibung:**

## 🎯 Ziel
Umsatz-, Kosten- und Marge-Trends über Zeit visualisieren

## 📋 Beschreibung
Line-Charts für Trend-Analyse:
- Umsatz-Trend (Monat für Monat)
- Kosten-Trend pro Kategorie (gestackte Area-Chart)
- Marge-Entwicklung
- MoM (Month-over-Month) & YoY (Year-over-Year) Vergleiche

## ✅ Akzeptanzkriterien
- [ ] Line-Chart: Umsatz über Zeit (Chart.js)
- [ ] Stacked Area-Chart: Kosten-Breakdown über Zeit
- [ ] Line-Chart: Marge-Entwicklung
- [ ] Tooltips mit MoM-Vergleich: "+5% vs. letztem Monat"
- [ ] Zoom-Funktion: Fokus auf Zeitbereich (z.B. Q4 2025)
- [ ] Responsive: Mobile-optimierte Charts

## 🔧 Technische Details
- Chart.js Line-Chart mit Time-Scale
- Data-Aggregation: Array von BWAs → Time-Series
- MoM-Calculation: `(current - previous) / previous * 100`

## 🔗 Dependencies
- v1.4 Multi-BWA-Upload
- v1.1 Dashboard (Chart.js bereits integriert)

## 📚 Referenzen
- docs/ROADMAP.md v1.4

---

## 📊 Zusammenfassung

**Gesamt: 11 Issues**
- 1 Infrastructure
- 4 v1.1 Dashboard (Q4 2025)
- 2 v1.2 Cashflow (Q1 2026)
- 2 v1.3 Profitabilität (Q1 2026)
- 2 v1.4 Multi-Monats (Q2 2026)

**Next Steps:**
1. Issues manuell in GitHub erstellen (copy-paste)
2. Milestones erstellen (v1.1, v1.2, v1.3, v1.4)
3. Labels erstellen (siehe Script)
4. GitHub Project Board einrichten (docs/GITHUB_PROJECT_SETUP.md)
