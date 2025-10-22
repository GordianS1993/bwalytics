# GitHub Copilot Instructions für BWAlytics

## Projekt-Kontext
BWAlytics ist ein Client-Side BWA-Analyse-Tool für Kleinunternehmer. Alle Daten bleiben lokal im Browser (AES-256 verschlüsselt), keine Server-Kommunikation.

## Technologie-Stack
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **PDF-Verarbeitung:** PDF.js 3.11.174
- **Verschlüsselung:** CryptoJS 4.2.0
- **Visualisierung:** Chart.js
- **Deployment:** GitHub Pages (Static Site)

## Code-Prinzipien

### 1. Datenschutz ist Pflicht
- ✅ Alle BWA-Daten bleiben im Browser
- ✅ AES-256 Verschlüsselung für localStorage
- ✅ Keine Tracking-Tools (DSGVO-konform)
- ❌ Keine Server-Requests mit Geschäftsdaten

### 2. Präzision vor Schätzungen
- ✅ Extrahiere echte Kontenwerte aus Summen- und Saldenliste
- ✅ Semantische Kategorisierung (Kontonummer + Beschreibung)
- ❌ Keine Prozentsatz-Schätzungen (z.B. `personalCosts = costs * 0.45`)
- ✅ Fallback nur wenn Extraktion unmöglich

### 3. Format-Agnostisch
- ✅ Funktioniert mit DATEV, Lexoffice, sevDesk, etc.
- ✅ Regex-Patterns für flexible Text-Extraktion
- ✅ Robuste Fehlerbehandlung bei unbekannten Formaten

### 4. Unternehmer-Perspektive
- ✅ Actionable Insights, keine reinen Zahlen
- ✅ Kategorisierung nach Business-Logik (Personal, Raum, Marketing, etc.)
- ✅ Semantische Fix/Variable-Klassifizierung (nicht arbitrary 60/40)

### 5. Code-Qualität
- ✅ Aussagekräftige Variablennamen (deutsch für BWA-Begriffe OK)
- ✅ Kommentare für komplexe Regex-Patterns
- ✅ Defensive Programmierung (null-checks, try-catch)
- ✅ DRY: Keine redundanten Extraktions-Logiken

## Wichtige Funktionen

### `extractDetailedCostBreakdown(text)`
**Zweck:** Extrahiert detaillierte Kostenaufschlüsselung aus Summen- und Saldenliste  
**Input:** PDF-Text mit DATEV-Konten (4xxx, 6xxx, 7xxx)  
**Output:** 8 Kategorien mit Real-Beträgen (Personal, Raum, Kfz, Marketing, etc.)  
**Regel:** IMMER verwenden statt Schätzungen!

### `extractBWADataFromText(text)`
**Zweck:** Main-Funktion für BWA-Analyse  
**Output:** `{ revenue, costs, profit, margin, costBreakdown, fixedCosts, variableCosts }`  
**Regel:** Nutzt `extractDetailedCostBreakdown()` für präzise Kostenanalyse

## Testing
- Teste mit echten DATEV-BWAs (verschiedene Formate)
- Validiere Kontenextraktion (4120 Gehälter, 4210 Miete, etc.)
- Prüfe Edge-Cases (fehlende Konten, unbekannte Formate)

## Deployment
- **Production:** `main` Branch → https://gordians1993.github.io/bwalytics/
- **Staging:** `staging` Branch → Test-Umgebung
- **Development:** `dev` Branch → Aktive Entwicklung

## Don'ts
- ❌ Keine serverseitigen Dependencies einführen
- ❌ Keine Breaking Changes ohne Diskussion
- ❌ Keine Tracking/Analytics ohne DSGVO-Konformität
- ❌ Keine Schätzungen wenn echte Daten verfügbar

## Feature-Requests
Neue Features sollten als GitHub Issues angelegt werden mit Template `feature_request.yml`
