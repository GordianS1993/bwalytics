# 🚀 Supabase Quick-Start Guide

## Schnelleinstieg in 10 Minuten

### ⚡ Schritt-für-Schritt

#### 1️⃣ Supabase Account (2 Min)

```bash
# Browser öffnen
open https://supabase.com

# Account erstellen mit:
- GitHub Account (empfohlen) ODER
- Email + Passwort
```

#### 2️⃣ Neues Projekt (3 Min)

```
Name: BWA-Dashboard-Production
Datenbank-Passwort: [Generieren - SICHER AUFBEWAHREN!]
Region: ⚠️ WICHTIG → Europe (Frankfurt) - eu-central-1
Plan: Free (50.000 User inklusive)
```

#### 3️⃣ SQL Schema ausführen (2 Min)

```sql
1. Im Supabase Dashboard → SQL Editor
2. Kopieren Sie KOMPLETTES SQL aus SUPABASE_SETUP.md (Zeile 20-250)
3. Einfügen → "Run" klicken
4. ✅ Erfolgsmeldung: "Success. No rows returned"
```

#### 4️⃣ Storage Bucket (1 Min)

```
Storage → Create new bucket
- Name: bwa-pdfs
- Public: OFF ❌
- File size limit: 10 MB
- Allowed types: application/pdf

→ Storage Policies aus SUPABASE_SETUP.md (Zeile 260-285) einfügen
```

#### 5️⃣ Authentication (1 Min)

```
Authentication → Providers
✅ Email (enable email confirmations: ON)
✅ Google OAuth (optional - später konfigurieren)
✅ Microsoft OAuth (optional - später konfigurieren)
```

#### 6️⃣ API Keys kopieren (1 Min)

```
Project Settings → API

Kopieren Sie:
1. Project URL: https://xxxxx.supabase.co
2. anon key: eyJhbGc...
```

#### 7️⃣ Konfigurationsdatei erstellen

**Option A: Automatisch (empfohlen)**
```bash
cd /Users/gordianschmitz/Kleinunternehmer-Dashboard_2
./setup-supabase.sh
```

**Option B: Manuell**
```bash
# Kopiere Template
cp supabase-config.example.js supabase-config.js

# Öffne mit Editor
open supabase-config.js

# Trage ein:
url: 'https://DEIN-PROJEKT.supabase.co'
anonKey: 'eyJhbGc...' (Dein Key)
```

#### 8️⃣ Test der Verbindung

```bash
# HTTP Server starten (falls nicht läuft)
python3 -m http.server 8000

# Test-Seite öffnen
open http://localhost:8000/test-supabase.html
```

**Erwartetes Ergebnis:**
- ✅ Konfiguration geladen
- ✅ Verbindung erfolgreich
- ✅ Authentication bereit
- ✅ Datenbank-Zugriff erfolgreich

---

## 🎯 Häufige Fehler & Lösungen

### ❌ "Project URL nicht konfiguriert"
→ Öffne `supabase-config.js` und trage deine Project URL ein

### ❌ "Anon Key nicht konfiguriert"
→ Kopiere den anon key aus: Project Settings → API

### ❌ "Datenbank-Fehler: relation does not exist"
→ SQL-Schema wurde nicht ausgeführt  
→ Gehe zu SQL Editor und führe Schema aus SUPABASE_SETUP.md aus

### ❌ "Row-Level-Security policy violation"
→ RLS Policies fehlen  
→ Führe RLS-Policies aus SUPABASE_SETUP.md aus (Zeile 170-220)

### ❌ "Storage bucket not found"
→ Storage Bucket wurde nicht erstellt  
→ Gehe zu Storage → Create bucket "bwa-pdfs"

---

## ✅ Checkliste

- [ ] Supabase Account erstellt
- [ ] Projekt "BWA-Dashboard-Production" erstellt
- [ ] Region: EU Frankfurt ausgewählt ⚠️
- [ ] SQL Schema ausgeführt (alle 9 Tabellen + Policies)
- [ ] Storage Bucket "bwa-pdfs" erstellt
- [ ] Storage Policies hinzugefügt
- [ ] Email Authentication aktiviert
- [ ] API Keys kopiert
- [ ] `supabase-config.js` erstellt
- [ ] `test-supabase.html` → alle Tests ✅

---

## 🔐 Sicherheit

✅ **Was ist sicher:**
- `anon key` im Frontend verwenden (Row-Level-Security schützt Daten)
- Supabase SDK im Browser
- Public Storage URLs (durch Policies geschützt)

❌ **Was NIEMALS im Frontend:**
- `service_role key` (nur Backend!)
- Datenbank-Passwort
- OAuth Client Secrets

---

## 📞 Nächste Schritte

Nach erfolgreichem Setup:

1. **Authentication-System implementieren** (Todo #4)
   - Login/Logout Funktionen mit Supabase verbinden
   - OAuth-Provider konfigurieren
   - Session-Management aktivieren

2. **BWA-Historie entwickeln** (Todo #5)
   - Upload-Funktion mit Supabase Storage verbinden
   - Daten in PostgreSQL speichern
   - Historie-Liste anzeigen

3. **Feature-Gating aktivieren** (Todo #6)
   - Analytics für Free-User sperren
   - Upgrade-Prompts einbauen

---

**Geschätzte Zeit für komplettes Setup:** 10-15 Minuten  
**Support:** SUPABASE_SETUP.md (detaillierte Anleitung)

🎉 **Viel Erfolg!**
