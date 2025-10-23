# GitHub Project Board Setup für BWAlytics

**Version:** 1.0.0  
**Letzte Aktualisierung:** 23. Oktober 2025

---

## 🎯 Ziel

Ein **Kanban-Board** in GitHub Projects für visuelles Task-Management mit automatischer Issue-Integration.

---

## 📋 Setup-Anleitung (5 Minuten)

### Schritt 1: Projekt erstellen

1. Gehe zu: https://github.com/GordianS1993/bwalytics
2. Klicke auf **"Projects"** Tab (oben)
3. Klicke **"New project"** (grüner Button)
4. Wähle **"Team backlog"** Template (oder "Board" für einfaches Kanban)
5. Name: **"BWAlytics Roadmap"**
6. Description: **"Feature-Entwicklung und Task-Management für BWAlytics"**
7. Klicke **"Create project"**

---

### Schritt 2: Spalten konfigurieren

GitHub Projects erstellt automatisch Standard-Spalten. Passe sie an:

#### Empfohlene Spalten:

| Spalte | Beschreibung | Automation |
|--------|--------------|------------|
| **📥 Backlog** | Alle geplanten Features/Tasks | Neue Issues automatisch hier |
| **🎯 Ready** | Priorisiert, bereit für Entwicklung | Manuell verschieben |
| **🚧 In Progress** | Aktive Entwicklung | Auto wenn Issue assigned |
| **👀 Review** | Code Review / Testing | Auto bei PR-Erstellung |
| **✅ Done** | Fertiggestellt | Auto wenn Issue closed |

#### Anpassen:
1. Klicke auf Spalten-Titel → **"..."** → **"Rename column"**
2. Füge Emojis hinzu für bessere Übersicht
3. Setze Automations (siehe unten)

---

### Schritt 3: Automations aktivieren

Für jede Spalte → **"..."** → **"Manage automation"**:

#### **📥 Backlog:**
- ✅ **"Auto-add to project"**: Alle neuen Issues automatisch hier
- ✅ **"Auto-archive"**: Geschlossene Issues nach 7 Tagen archivieren

#### **🚧 In Progress:**
- ✅ **"Set status when issue assigned"**: Auto-Move wenn Issue assigned wird

#### **👀 Review:**
- ✅ **"Set status when PR created"**: Auto-Move bei PR-Erstellung

#### **✅ Done:**
- ✅ **"Set status when issue closed"**: Auto-Move wenn Issue closed

---

### Schritt 4: Milestones erstellen

Milestones für Roadmap-Tracking:

1. Gehe zu: https://github.com/GordianS1993/bwalytics/milestones
2. Klicke **"New milestone"**
3. Erstelle folgende Milestones:

| Milestone | Due Date | Description |
|-----------|----------|-------------|
| **v1.1 - Dashboard & Visualisierung** | Dez 2025 | Unternehmer-Dashboard, Actionable Insights |
| **v1.2 - Cashflow & Liquidität** | März 2026 | Cashflow-Runway, Liquiditäts-Frühwarnsystem |
| **v1.3 - Profitabilitäts-Hebel** | März 2026 | What-If-Szenarien, Break-Even-Analyse |
| **v1.4 - Multi-Monats-Trend** | Juni 2026 | Vergleichende Analyse, Forecasting |
| **v2.0 - Plugin-System** | Sep 2026 | Erweiterbarkeit, Custom Rules |

---

### Schritt 5: Labels erstellen

Labels für Issue-Kategorisierung:

1. Gehe zu: https://github.com/GordianS1993/bwalytics/labels
2. Erstelle folgende Labels:

| Label | Farbe | Beschreibung |
|-------|-------|--------------|
| `feature` | 🟢 `#0e8a16` | Neue Funktionalität |
| `bug` | 🔴 `#d73a4a` | Fehler beheben |
| `enhancement` | 🔵 `#0075ca` | Verbesserung bestehend |
| `documentation` | 📚 `#0075ca` | Dokumentation |
| `testing` | 🧪 `#bfd4f2` | Tests & QA |
| `infrastructure` | 🏗️ `#d4c5f9` | DevOps, CI/CD |
| `priority: high` | 🔥 `#e99695` | Hohe Priorität |
| `priority: medium` | ⚠️ `#fbca04` | Mittlere Priorität |
| `priority: low` | 💤 `#c2e0c6` | Niedrige Priorität |
| `good first issue` | 🌱 `#7057ff` | Einstieg für neue Contributor |
| `help wanted` | 🆘 `#008672` | Community-Hilfe erwünscht |
| `v1.1` | 📦 `#1d76db` | Für Release v1.1 |
| `v1.2` | 📦 `#1d76db` | Für Release v1.2 |

---

### Schritt 6: Views erstellen

GitHub Projects unterstützt **Custom Views** für verschiedene Perspektiven:

#### **1. Board-View (Standard):**
- Kanban-Board mit Spalten
- Drag & Drop zwischen Spalten

#### **2. Roadmap-View:**
1. Klicke **"+ New view"**
2. Typ: **"Roadmap"**
3. Name: **"Feature Roadmap"**
4. Gruppierung: Nach **Milestone**
5. Sortierung: Nach **Due Date**

#### **3. Priority-View:**
1. **"+ New view"**
2. Typ: **"Table"**
3. Name: **"Prioritized Backlog"**
4. Filter: `status:Backlog`
5. Sortierung: Nach **Priority Label** (high → low)

#### **4. Sprint-View (optional):**
1. **"+ New view"**
2. Typ: **"Board"**
3. Name: **"Current Sprint"**
4. Filter: `assignee:@me status:Ready,In Progress`
5. Gruppierung: Nach **Assignee**

---

## 🔗 Automatische Issue-Verknüpfung

### In Commit-Messages:
```bash
git commit -m "feat: Cashflow-Runway implementiert

Closes #15
Related to #12, #14"
```
→ Issue #15 wird automatisch zu **"Done"** verschoben

### In Pull Requests:
```markdown
## Changes
- Implementiert Cashflow-Runway Feature
- Extrahiert Geldbestände aus Summen- und Saldenliste

Closes #15
Fixes #16
```

---

## 📊 Beispiel-Issues erstellen

Erstelle Initial-Issues für Roadmap v1.1:

### Issue #1: Dashboard Layout erstellen
```markdown
**Title:** Dashboard Layout erstellen  
**Labels:** `feature`, `v1.1`, `priority: high`  
**Milestone:** v1.1 - Dashboard & Visualisierung  
**Assignee:** (dich selbst)

**Description:**
Erstelle das visuelle Layout für das Unternehmer-Dashboard.

**Acceptance Criteria:**
- [ ] Responsive Grid-Layout (Desktop + Mobile)
- [ ] KPI-Cards für Revenue, Costs, Profit, Margin
- [ ] Kosten-Breakdown Bar-Chart
- [ ] Fix/Variable Pie-Chart

**Technical Notes:**
- Nutze Chart.js für Visualisierungen
- Behalte Vanilla JavaScript (keine Frameworks)
```

### Issue #2: Actionable Insights implementieren
```markdown
**Title:** Actionable Insights für Kosten-Analyse  
**Labels:** `feature`, `v1.1`, `priority: high`

**Description:**
Automatische Empfehlungen basierend auf BWA-Analyse.

**Examples:**
- "Deine Personalkosten sind 15% über Branchendurchschnitt"
- "Warnung: Marge unter 10%"
- "✨ Positive: Marge ist um 5% gestiegen!"

**Depends on:** #1
```

### Issue #3: Cashflow-Runway Extraktion
```markdown
**Title:** Geldbestände aus Summen- und Saldenliste extrahieren  
**Labels:** `feature`, `v1.2`, `priority: high`  
**Milestone:** v1.2 - Cashflow & Liquidität

**Description:**
Extrahiere Kasse + Bank-Konten (Konten 1000-1200) aus Summen- und Saldenliste.

**Technical Details:**
- Pattern: `/^1[012]\d{2}/` (Konten 1000-1299)
- Kategorien: Kasse (1000), Bank (1200-1299)
- Return: `{ kasse: number, bank: number, total: number }`

**Testing:**
- [ ] Unit-Test mit DATEV-Format
- [ ] Edge-Case: Fehlende Konten
```

---

## 🤖 Bonus: GitHub CLI für schnelleres Setup

Wenn du **GitHub CLI** installiert hast, kannst du Issues schnell erstellen:

```bash
# Install GitHub CLI (einmalig)
brew install gh

# Login
gh auth login

# Issue erstellen
gh issue create \
  --title "Dashboard Layout erstellen" \
  --body "Responsive Grid-Layout für Unternehmer-Dashboard..." \
  --label "feature,v1.1,priority: high" \
  --milestone "v1.1 - Dashboard & Visualisierung"

# Issue zu Project hinzufügen (automatisch via Automation)
```

---

## 📱 Mobile App (optional)

GitHub Projects hat eine **Mobile App** für iOS/Android:
- Download: https://github.com/mobile
- Verwalte Issues unterwegs
- Drag & Drop zwischen Spalten

---

## 🎯 Workflow-Beispiel

### Neues Feature entwickeln:

1. **Backlog** → Issue erstellen (via Template)
2. **Ready** → Issue priorisieren & assignen
3. **In Progress** → Feature-Branch erstellen
   ```bash
   git checkout dev
   git checkout -b feature/cashflow-runway
   # Entwicklung...
   git commit -m "feat: Cashflow-Runway implementiert"
   git push origin feature/cashflow-runway
   ```
4. **Review** → Pull Request erstellen
   ```markdown
   Closes #15
   ```
5. **Done** → PR mergen → Issue automatisch closed

---

## 🔍 Project Insights (Analytics)

GitHub Projects zeigt automatisch:
- **Burn-Down-Chart**: Wie viele Issues pro Sprint geschlossen
- **Cycle Time**: Wie lange dauert ein Issue von "Ready" → "Done"
- **Throughput**: Wie viele Issues pro Woche geschlossen

→ Zugriff via **"Insights"** Tab im Project

---

## 📚 Weiterführende Ressourcen

- **GitHub Projects Docs:** https://docs.github.com/en/issues/planning-and-tracking-with-projects
- **Automation Guide:** https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project
- **GitHub CLI Docs:** https://cli.github.com/

---

## ✅ Checkliste: Setup komplett

- [ ] Project "BWAlytics Roadmap" erstellt
- [ ] Spalten konfiguriert (Backlog → Ready → In Progress → Review → Done)
- [ ] Automations aktiviert
- [ ] Milestones erstellt (v1.1, v1.2, v1.3, v1.4, v2.0)
- [ ] Labels erstellt (feature, bug, priority, etc.)
- [ ] Custom Views erstellt (Roadmap, Priority, Sprint)
- [ ] Initial-Issues aus ROADMAP.md erstellt
- [ ] Team-Mitglieder eingeladen (falls vorhanden)

---

**🚀 Nach dem Setup:** Gehe zu https://github.com/GordianS1993/bwalytics/projects und starte mit dem ersten Issue!
