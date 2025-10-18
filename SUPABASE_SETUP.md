# 🔐 Supabase Setup für BWA-Dashboard

## Sicherheit & Compliance

**Warum Supabase?**
- ✅ **DSGVO-konform** - EU-Hosting in Frankfurt verfügbar
- ✅ **ISO 27001 zertifiziert** - Enterprise-Level Security
- ✅ **SOC 2 Type II** - Compliance-Standards
- ✅ **Row-Level-Security (RLS)** - User sieht nur eigene Daten
- ✅ **Verschlüsselte Verbindungen** - TLS 1.3 Standard
- ✅ **Audit Logs** - Nachvollziehbarkeit aller Zugriffe

---

## 🚀 Schritt-für-Schritt Anleitung

### 1. Supabase-Account erstellen

1. Gehe zu: https://supabase.com
2. Klicke auf **"Start your project"**
3. Registriere dich mit GitHub oder Email
4. **WICHTIG**: Wähle Region **"Frankfurt (eu-central-1)"** für DSGVO-Compliance

---

### 2. Neues Projekt erstellen

```
Projektname: BWA-Dashboard-Production
Datenbank-Passwort: [Sicheres Passwort generieren]
Region: Europe (Frankfurt) - eu-central-1
Pricing Plan: Free (bis 50.000 User kostenlos)
```

---

### 3. Datenbank-Schema einrichten

Gehe zu **SQL Editor** und führe folgendes Schema aus:

```sql
-- ============================================
-- BWA HISTORIE TABELLE
-- ============================================
CREATE TABLE bwa_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- BWA-Metadaten
  upload_date DATE NOT NULL,
  monat TEXT NOT NULL,
  jahr INTEGER NOT NULL,
  firmenname TEXT,
  branche TEXT,
  
  -- PDF-Storage
  pdf_url TEXT,
  pdf_file_name TEXT,
  
  -- Extrahierte Finanzdaten
  umsatz DECIMAL(12,2),
  kosten DECIMAL(12,2),
  gewinn DECIMAL(12,2),
  gewinnmarge DECIMAL(5,2),
  
  -- Liquidität
  liquide_mittel DECIMAL(12,2),
  forderungen DECIMAL(12,2),
  verbindlichkeiten DECIMAL(12,2),
  liquiditaetsgrad DECIMAL(5,2),
  
  -- Eigenkapital
  eigenkapital DECIMAL(12,2),
  fremdkapital DECIMAL(12,2),
  eigenkapitalquote DECIMAL(5,2),
  
  -- Kostenstruktur (JSON für Flexibilität)
  kostenaufschluessung JSONB,
  
  -- Business Score
  business_score INTEGER CHECK (business_score >= 0 AND business_score <= 100),
  
  -- Indizes für Performance
  CONSTRAINT unique_user_period UNIQUE(user_id, jahr, monat)
);

-- Index für schnelle Abfragen
CREATE INDEX idx_bwa_user_date ON bwa_uploads(user_id, jahr DESC, monat DESC);

-- ============================================
-- USER SUBSCRIPTIONS TABELLE
-- ============================================
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Subscription-Tier
  tier TEXT NOT NULL CHECK (tier IN ('free', 'basic', 'premium')) DEFAULT 'basic',
  
  -- Stripe-Integration
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'past_due')),
  
  -- Zeitstempel
  subscription_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER PROFILES TABELLE (für Firmenlogos etc.)
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Firmendaten
  firmenname TEXT,
  branche TEXT,
  company_logo_url TEXT,
  
  -- Präferenzen
  email_notifications BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW-LEVEL-SECURITY (RLS) AKTIVIEREN
-- ============================================

-- BWA Uploads: User sieht nur eigene Daten
ALTER TABLE bwa_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User kann eigene BWAs sehen"
  ON bwa_uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "User kann eigene BWAs erstellen"
  ON bwa_uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "User kann eigene BWAs löschen"
  ON bwa_uploads FOR DELETE
  USING (auth.uid() = user_id);

-- User Subscriptions: User sieht nur eigene Subscription
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User kann eigene Subscription sehen"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- User Profiles: User sieht nur eigenes Profil
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User kann eigenes Profil sehen"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "User kann eigenes Profil updaten"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "User kann eigenes Profil erstellen"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- TRIGGER: Automatisch Basic-Tier bei Registrierung
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, tier, status)
  VALUES (NEW.id, 'basic', 'active');
  
  INSERT INTO user_profiles (id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Funktion: Letzten 6 Monate BWAs abrufen
CREATE OR REPLACE FUNCTION get_last_6_months_bwas(p_user_id UUID)
RETURNS TABLE (
  monat TEXT,
  jahr INTEGER,
  umsatz DECIMAL,
  kosten DECIMAL,
  gewinn DECIMAL,
  business_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    b.monat,
    b.jahr,
    b.umsatz,
    b.kosten,
    b.gewinn,
    b.business_score
  FROM bwa_uploads b
  WHERE b.user_id = p_user_id
  ORDER BY b.jahr DESC, 
    CASE b.monat
      WHEN 'Januar' THEN 1
      WHEN 'Februar' THEN 2
      WHEN 'März' THEN 3
      WHEN 'April' THEN 4
      WHEN 'Mai' THEN 5
      WHEN 'Juni' THEN 6
      WHEN 'Juli' THEN 7
      WHEN 'August' THEN 8
      WHEN 'September' THEN 9
      WHEN 'Oktober' THEN 10
      WHEN 'November' THEN 11
      WHEN 'Dezember' THEN 12
    END DESC
  LIMIT 6;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### 4. Storage für BWA-PDFs einrichten

1. Gehe zu **Storage** → **Create a new bucket**
2. Name: `bwa-pdfs`
3. **Public access**: OFF (privat)
4. **Allowed MIME types**: `application/pdf`
5. **File size limit**: 10 MB

**Storage Policies erstellen:**

```sql
-- User kann eigene PDFs hochladen
CREATE POLICY "User kann eigene PDFs hochladen"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'bwa-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- User kann eigene PDFs lesen
CREATE POLICY "User kann eigene PDFs lesen"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'bwa-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- User kann eigene PDFs löschen
CREATE POLICY "User kann eigene PDFs löschen"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'bwa-pdfs' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

### 5. Authentication konfigurieren

1. Gehe zu **Authentication** → **Providers**
2. Aktiviere:
   - ✅ **Email** (mit Email-Bestätigung)
   - ✅ **Google OAuth**
   - ✅ **Microsoft OAuth** (Azure AD)

**Email-Templates anpassen:**
- Gehe zu **Authentication** → **Email Templates**
- Passe die Templates für dein Branding an

---

### 6. API-Keys kopieren

Gehe zu **Project Settings** → **API**

Kopiere folgende Werte:

```
Project URL: https://[dein-projekt].supabase.co
anon (public) key: eyJhbGc...
service_role key: eyJhbGc... (NUR Server-seitig verwenden!)
```

---

### 7. Supabase JavaScript SDK einbinden

Füge in `bwa-upload-working.html` im `<head>` ein:

```html
<!-- Supabase Client SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  // Supabase initialisieren
  const SUPABASE_URL = 'https://[dein-projekt].supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGc...'; // Dein anon key
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  console.log('✅ Supabase Client initialisiert');
</script>
```

---

## 🔒 Sicherheits-Checkliste

- [ ] EU-Region (Frankfurt) gewählt
- [ ] Row-Level-Security (RLS) für alle Tabellen aktiviert
- [ ] Storage-Bucket auf privat gesetzt
- [ ] Email-Verifizierung aktiviert
- [ ] API-Keys niemals im Frontend committed (verwende Environment Variables für Production)
- [ ] 2FA für Premium-User aktiviert (optional)
- [ ] Audit Logs regelmäßig prüfen

---

## 💾 Datenaufbewahrung (DSGVO)

**Free-Tier User:**
- Daten werden im SessionStorage gespeichert
- Automatische Löschung nach Browser-Schließung
- Keine Speicherung auf dem Server

**Basic/Premium User:**
- BWA-PDFs werden verschlüsselt gespeichert (AES-256)
- User kann jederzeit alle Daten löschen
- Automatische Löschung nach Account-Löschung (CASCADE)
- Backup-Retention: 30 Tage

---

## 📊 Monitoring & Logs

**Supabase Dashboard:**
- Gehe zu **Logs** für API-Requests
- Gehe zu **Auth** für Login-Aktivitäten
- Gehe zu **Database** → **Query Performance** für Optimierung

---

## 🚀 Nächste Schritte

1. ✅ Supabase-Projekt erstellt
2. ✅ Datenbank-Schema ausgeführt
3. ✅ Storage konfiguriert
4. ✅ Authentication aktiviert
5. → **API-Keys in Dashboard einbinden**
6. → **Login-Funktionen mit Supabase verbinden**
7. → **BWA-Historie speichern implementieren**
8. → **Stripe für Premium-Tier integrieren**

---

## 📞 Support

Bei Fragen zur Supabase-Integration:
- Supabase Docs: https://supabase.com/docs
- Discord Community: https://discord.supabase.com

---

**Erstellt für:** BWA Insights Dashboard  
**Letzte Aktualisierung:** Oktober 2025  
**Version:** 1.0
