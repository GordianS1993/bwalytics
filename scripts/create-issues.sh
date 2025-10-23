#!/bin/bash

# BWAlytics - Quick Issue Creator
# Erstellt automatisch Issues aus ROADMAP.md für GitHub Project Board

echo "🚀 BWAlytics - GitHub Issues Creator"
echo "===================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) ist nicht installiert!"
    echo "📦 Installation: brew install gh"
    echo "🔗 Oder: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔐 Bitte erst mit GitHub authentifizieren:"
    echo "   gh auth login"
    exit 1
fi

echo "✅ GitHub CLI ist bereit!"
echo ""

# Repository
REPO="GordianS1993/bwalytics"

# Milestones erstellen (falls nicht vorhanden)
echo "📅 Erstelle Milestones..."

gh api repos/$REPO/milestones --method POST \
  -f title="v1.1 - Dashboard & Visualisierung" \
  -f description="Unternehmer-Dashboard mit aggregierten Kategorien und Actionable Insights" \
  -f due_on="2025-12-31T23:59:59Z" \
  2>/dev/null || echo "  → v1.1 existiert bereits"

gh api repos/$REPO/milestones --method POST \
  -f title="v1.2 - Cashflow & Liquidität" \
  -f description="Cashflow-Runway und Liquiditäts-Frühwarnsystem" \
  -f due_on="2026-03-31T23:59:59Z" \
  2>/dev/null || echo "  → v1.2 existiert bereits"

gh api repos/$REPO/milestones --method POST \
  -f title="v1.3 - Profitabilitäts-Hebel" \
  -f description="Interactive What-If-Szenarien und Break-Even-Analyse" \
  -f due_on="2026-03-31T23:59:59Z" \
  2>/dev/null || echo "  → v1.3 existiert bereits"

gh api repos/$REPO/milestones --method POST \
  -f title="v1.4 - Multi-Monats-Trend" \
  -f description="Vergleichende Analyse und Forecasting über mehrere BWAs" \
  -f due_on="2026-06-30T23:59:59Z" \
  2>/dev/null || echo "  → v1.4 existiert bereits"

gh api repos/$REPO/milestones --method POST \
  -f title="v2.0 - Plugin-System" \
  -f description="Erweiterbarkeit und Custom Rules für verschiedene BWA-Formate" \
  -f due_on="2026-09-30T23:59:59Z" \
  2>/dev/null || echo "  → v2.0 existiert bereits"

echo ""
echo "📋 Erstelle Initial-Issues aus Roadmap..."
echo ""

# Issue 1: Dashboard Layout
echo "  📊 Dashboard Layout..."
gh issue create \
  --repo $REPO \
  --title "📊 Dashboard Layout erstellen" \
  --label "feature,enhancement,v1.1,priority: high" \
  --milestone "v1.1 - Dashboard & Visualisierung" \
  --body "## Beschreibung
Erstelle das visuelle Layout für das Unternehmer-Dashboard mit aggregierten Kategorien.

## Acceptance Criteria
- [ ] Responsive Grid-Layout (Desktop + Mobile)
- [ ] KPI-Cards für Revenue, Costs, Profit, Margin
- [ ] Kosten-Breakdown Bar-Chart (8 Kategorien)
- [ ] Fix/Variable Pie-Chart
- [ ] Trend-Indikatoren (↑ ↓ →)

## Technical Notes
- Nutze Chart.js für Visualisierungen (bereits im Projekt)
- Behalte Vanilla JavaScript (keine Frameworks)
- Responsive Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Color-Scheme: siehe bwa-upload-working.html

## Dependencies
- Keine (kann sofort gestartet werden)

## Siehe auch
- docs/ROADMAP.md (v1.1 Features)
- docs/ARCHITECTURE.md (Visualisierung-Komponente)" \
  2>/dev/null || echo "  → Issue bereits vorhanden"

# Issue 2: Actionable Insights
echo "  💡 Actionable Insights..."
gh issue create \
  --repo $REPO \
  --title "💡 Actionable Insights für Kosten-Analyse" \
  --label "feature,enhancement,v1.1,priority: high" \
  --milestone "v1.1 - Dashboard & Visualisierung" \
  --body "## Beschreibung
Automatische Empfehlungen und Insights basierend auf BWA-Analyse statt nur roher Zahlen.

## Examples
- **Warnung:** \"Deine Personalkosten (35%) sind 15% über Branchendurchschnitt (20%)\"
- **Kritisch:** \"Marge unter 10% - Cashflow-Risiko!\"
- **Positiv:** \"✨ Deine Marge ist im Vergleich zum Vormonat um 5% gestiegen!\"
- **Empfehlung:** \"Größter Kostenhebel: Marketing (18%). Reduzierung um 10% würde Marge auf 62% erhöhen.\"

## Acceptance Criteria
- [ ] Automatische Kategorisierung: Warnung (rot), Info (blau), Positiv (grün)
- [ ] Mindestens 5 Insight-Regeln implementiert
- [ ] Insights werden prominent im Dashboard angezeigt
- [ ] Insights sind actionable (\"Was kann ich tun?\")

## Technical Implementation
\`\`\`javascript
function generateInsights(bwaData) {
  const insights = [];
  
  // Regel 1: Marge-Warnung
  if (bwaData.margin < 10) {
    insights.push({
      type: 'warning',
      message: 'Kritische Marge unter 10%',
      action: 'Prüfe deine größten Kostenblöcke'
    });
  }
  
  // Regel 2: Personalkosten-Check
  const personalRatio = bwaData.costBreakdown.personal / bwaData.costs;
  if (personalRatio > 0.35) {
    insights.push({
      type: 'info',
      message: \`Personalkosten hoch (\${(personalRatio*100).toFixed(0)}%)\`,
      action: 'Vergleiche mit Branchendurchschnitt'
    });
  }
  
  return insights;
}
\`\`\`

## Dependencies
- Depends on: Dashboard Layout (#1)

## Siehe auch
- docs/ROADMAP.md (Actionable Insights Konzept)" \
  2>/dev/null || echo "  → Issue bereits vorhanden"

# Issue 3: Drag & Drop PDF-Upload
echo "  📤 UX: Drag & Drop..."
gh issue create \
  --repo $REPO \
  --title "📤 UX-Verbesserung: Drag & Drop PDF-Upload" \
  --label "enhancement,v1.1,priority: medium" \
  --milestone "v1.1 - Dashboard & Visualisierung" \
  --body "## Beschreibung
Verbessere UX beim PDF-Upload mit Drag & Drop statt nur File-Input-Button.

## Acceptance Criteria
- [ ] Drag & Drop Zone mit visuellem Feedback
- [ ] \"Drop here\" Anzeige beim Hovern mit Datei
- [ ] Akzeptiert nur PDF-Dateien (Validation)
- [ ] Loading-Animation während PDF-Parsing
- [ ] Error-Handling mit hilfreichen Fehlermeldungen

## Design
- Gestrichelte Box mit Icon \"📄 BWA-PDF hier ablegen oder klicken\"
- Hover: Grüner Border + Highlight
- Loading: Spinner + \"Analysiere BWA...\"

## Technical Notes
- HTML5 Drag & Drop API
- File-Type-Validation: \`application/pdf\`
- Max File-Size: 10 MB

## Siehe auch
- bwa-upload-working.html (aktueller Upload-Code)" \
  2>/dev/null || echo "  → Issue bereits vorhanden"

# Issue 4: Cashflow-Runway Extraktion
echo "  💰 Cashflow-Runway Extraktion..."
gh issue create \
  --repo $REPO \
  --title "💰 Geldbestände aus Summen- und Saldenliste extrahieren" \
  --label "feature,v1.2,priority: high" \
  --milestone "v1.2 - Cashflow & Liquidität" \
  --body "## Beschreibung
Extrahiere Kasse + Bank-Konten aus Summen- und Saldenliste für Cashflow-Runway-Berechnung.

## Technical Details
**DATEV SKR03/04 Konten:**
- **1000-1099:** Kasse
- **1200-1299:** Bank (Girokonten, Sparkonten)

**Regex-Pattern:**
\`\`\`javascript
const kassePattern = /^10\d{2}.*?([\d,.]+)/;
const bankPattern = /^12\d{2}.*?([\d,.]+)/;
\`\`\`

**Return-Struktur:**
\`\`\`javascript
{
  kasse: 5000,        // Summe aller 1000er Konten
  bank: 45000,        // Summe aller 1200er Konten
  total: 50000,       // Kasse + Bank
  items: [
    { account: '1000', description: 'Kasse', amount: 5000 },
    { account: '1200', description: 'Bank', amount: 45000 }
  ]
}
\`\`\`

## Acceptance Criteria
- [ ] Funktion \`extractCashBalances(text)\` implementiert
- [ ] Format-agnostisch (funktioniert mit DATEV, Lexoffice, sevDesk)
- [ ] Unit-Tests mit echten BWA-Fixtures
- [ ] Edge-Case: Fehlende Konten (return 0)
- [ ] Integration in \`extractBWADataFromText()\`

## Testing
- [ ] Test mit DATEV-BWA (fixtures/datev-bwa-2024-05.pdf)
- [ ] Test mit fehlenden Konten
- [ ] Test mit negativen Beständen (Überziehung)

## Dependencies
- Keine (kann parallel zu Dashboard entwickelt werden)

## Siehe auch
- docs/ARCHITECTURE.md (extractDetailedCostBreakdown als Vorbild)
- docs/TESTING.md (Unit-Test-Strategie)" \
  2>/dev/null || echo "  → Issue bereits vorhanden"

# Issue 5: Cashflow-Runway Berechnung
echo "  📊 Cashflow-Runway Berechnung..."
gh issue create \
  --repo $REPO \
  --title "📊 Cashflow-Runway Berechnung & Warnung" \
  --label "feature,v1.2,priority: high" \
  --milestone "v1.2 - Cashflow & Liquidität" \
  --body "## Beschreibung
Berechne Cashflow-Runway basierend auf Geldbeständen und durchschnittlichen monatlichen Kosten.

## Formula
\`\`\`
Runway (Monate) = Geldbestände / Durchschnittliche monatliche Kosten
\`\`\`

**Beispiel:**
- Geldbestände: 50.000 €
- Monatliche Kosten: 10.000 €
- **Runway: 5 Monate**

## Acceptance Criteria
- [ ] Funktion \`calculateCashflowRunway(cashBalances, costs)\` implementiert
- [ ] Warnung bei Runway < 3 Monate (kritisch!)
- [ ] Info bei Runway 3-6 Monate (beobachten)
- [ ] Positiv bei Runway > 6 Monate (sicher)
- [ ] Visualisierung im Dashboard (Fortschrittsbalken?)

## UI/UX
**Anzeige:**
\`\`\`
💰 Cashflow-Runway: 5 Monate
────────────────────────────
▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░  50% sicher
────────────────────────────
Mit deinen aktuellen Geldbeständen (50.000 €) 
kannst du 5 Monate ohne Umsatz überleben.

💡 Empfehlung: Runway ist gesund. Weiter so!
\`\`\`

**Bei kritischem Runway (<3 Monate):**
\`\`\`
⚠️ Cashflow-Runway: NUR 2 Monate!
────────────────────────────
▓▓▓▓░░░░░░░░░░░░░░░░  20% - KRITISCH!
────────────────────────────
🚨 Handlungsbedarf:
  • Treibe Forderungen ein
  • Verschiebe Investitionen
  • Prüfe Kostensenkungen
\`\`\`

## Technical Implementation
\`\`\`javascript
function calculateCashflowRunway(cashBalances, monthlyCosts) {
  if (monthlyCosts === 0) return Infinity;
  
  const runway = Math.floor(cashBalances.total / monthlyCosts);
  
  let status = 'critical';
  let message = '';
  
  if (runway < 3) {
    status = 'critical';
    message = \`⚠️ NUR \${runway} Monate! Handlungsbedarf!\`;
  } else if (runway < 6) {
    status = 'warning';
    message = \`⚠️ \${runway} Monate - Beobachten!\`;
  } else {
    status = 'safe';
    message = \`✅ \${runway} Monate - Gesund!\`;
  }
  
  return { runway, status, message };
}
\`\`\`

## Dependencies
- Depends on: Geldbestände-Extraktion (#4)

## Testing
- [ ] Test mit verschiedenen Runway-Szenarien (1, 3, 6, 12 Monate)
- [ ] Test mit Zero-Kosten (Edge-Case)
- [ ] Test mit negativem Cashflow (Überziehung)

## Siehe auch
- docs/ROADMAP.md (Cashflow-Runway Feature)
- docs/TESTING.md (Test-Cases)" \
  2>/dev/null || echo "  → Issue bereits vorhanden"

# Issue 6: Testing Infrastructure
echo "  🧪 Testing Infrastructure..."
gh issue create \
  --repo $REPO \
  --title "🧪 Testing Infrastructure aufsetzen (Jest/Vitest)" \
  --label "infrastructure,testing,priority: high" \
  --body "## Beschreibung
Setup Testing-Infrastructure mit Jest oder Vitest für Unit- und Integration-Tests.

## Acceptance Criteria
- [ ] package.json mit Jest/Vitest Dependencies
- [ ] tests/ Ordner-Struktur angelegt
- [ ] GitHub Actions Workflow für automatische Tests
- [ ] Mindestens 1 Beispiel-Test läuft grün
- [ ] README.md mit Testing-Anleitung aktualisiert

## Ordner-Struktur
\`\`\`
tests/
  unit/
    extraction.test.js          # extractDetailedCostBreakdown()
    calculations.test.js        # Marge, Fix/Variable
    parsing.test.js             # Amount-Parsing
  integration/
    pdf-extraction.test.js      # PDF.js + Extraction
    end-to-end.test.js          # Kompletter Flow
  fixtures/
    datev-bwa-2024-05.pdf       # Test-BWA (anonymisiert!)
    lexoffice-bwa-2024-06.pdf
  golden/
    datev-2024-05.json          # Expected Results
\`\`\`

## package.json Setup
\`\`\`json
{
  \"devDependencies\": {
    \"vitest\": \"^1.0.0\",
    \"@vitest/ui\": \"^1.0.0\",
    \"jsdom\": \"^23.0.0\",
    \"pdfjs-dist\": \"^3.11.174\"
  },
  \"scripts\": {
    \"test\": \"vitest\",
    \"test:ui\": \"vitest --ui\",
    \"test:coverage\": \"vitest --coverage\"
  }
}
\`\`\`

## Beispiel-Test
\`\`\`javascript
import { describe, test, expect } from 'vitest';
import { extractDetailedCostBreakdown } from '../bwa-upload-working.html';

describe('extractDetailedCostBreakdown', () => {
  test('extrahiert DATEV-Konten korrekt', () => {
    const text = \`
      4120 Gehälter                   49.939,50
      4130 Gesetzliche soziale Aufw.  12.605,31
    \`;
    
    const result = extractDetailedCostBreakdown(text);
    
    expect(result.personal.total).toBe(62544.81);
    expect(result.personal.items).toHaveLength(2);
  });
});
\`\`\`

## GitHub Actions Workflow
\`\`\`.github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test
\`\`\`

## Siehe auch
- docs/TESTING.md (vollständige Testing-Strategie)
- docs/DEPLOYMENT.md (CI/CD Integration)" \
  2>/dev/null || echo "  → Issue bereits vorhanden"

echo ""
echo "✅ Issues erstellt!"
echo ""
echo "🔗 Nächste Schritte:"
echo "   1. Gehe zu: https://github.com/$REPO/issues"
echo "   2. Erstelle GitHub Project: https://github.com/$REPO/projects"
echo "   3. Aktiviere Auto-Add für neue Issues"
echo ""
echo "📚 Siehe auch: docs/GITHUB_PROJECT_SETUP.md"
