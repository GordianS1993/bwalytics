# OAuth Provider Setup Guide

Schritt-für-Schritt-Anleitung zur Konfiguration von Google und Microsoft OAuth für das BWA Dashboard.

---

## 📋 Voraussetzungen

- ✅ Supabase-Projekt erstellt
- ✅ Authentication aktiviert
- ✅ Domain bekannt (z.B. `https://ihreprojekt.supabase.co`)

---

## 🔵 1. Google OAuth Setup

### Schritt 1: Google Cloud Console öffnen

1. Gehe zu: **https://console.cloud.google.com/**
2. Erstelle ein neues Projekt oder wähle ein bestehendes aus
3. Name: `BWA Dashboard` (oder beliebig)

### Schritt 2: OAuth Consent Screen konfigurieren

1. Navigiere zu: **APIs & Services** → **OAuth consent screen**
2. Wähle **External** (für öffentliche App)
3. Fülle aus:
   - **App name**: `BWA Insights Dashboard`
   - **User support email**: Deine Email
   - **Developer contact email**: Deine Email
4. Klicke auf **Save and Continue**
5. **Scopes**: Überspringe diesen Schritt (keine zusätzlichen Scopes nötig)
6. **Test users**: Optional (für Testing Phase)
7. Klicke auf **Save and Continue**

### Schritt 3: OAuth 2.0 Client-ID erstellen

1. Navigiere zu: **APIs & Services** → **Credentials**
2. Klicke auf **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Wähle **Application type**: **Web application**
4. **Name**: `BWA Dashboard Web Client`
5. **Authorized JavaScript origins** hinzufügen:
   ```
   http://localhost:8000
   https://deine-domain.com
   ```
6. **Authorized redirect URIs** hinzufügen:
   ```
   http://localhost:8000
   https://ihreprojekt.supabase.co/auth/v1/callback
   ```
   ⚠️ **Wichtig**: Ersetze `ihreprojekt` mit deiner echten Supabase-URL!

7. Klicke auf **CREATE**
8. **Kopiere** die **Client-ID** und das **Client-Secret** (wir brauchen sie gleich!)

### Schritt 4: Supabase konfigurieren

1. Gehe zu deinem Supabase Dashboard: **https://supabase.com/dashboard**
2. Wähle dein Projekt aus
3. Navigiere zu: **Authentication** → **Providers**
4. Finde **Google** in der Liste und klicke auf **Enable**
5. Trage ein:
   - **Client ID**: Die kopierte Google Client-ID
   - **Client Secret**: Das kopierte Google Client-Secret
6. Klicke auf **Save**

---

## 🔷 2. Microsoft OAuth Setup

### Schritt 1: Azure Portal öffnen

1. Gehe zu: **https://portal.azure.com/**
2. Navigiere zu: **Microsoft Entra ID** (früher Azure Active Directory)
3. Klicke auf **App registrations** → **+ New registration**

### Schritt 2: App Registration erstellen

1. **Name**: `BWA Dashboard`
2. **Supported account types**: Wähle:
   - `Accounts in any organizational directory and personal Microsoft accounts`
   (Für öffentliche App mit persönlichen Microsoft-Konten)
3. **Redirect URI**:
   - Typ: **Web**
   - URI: `https://ihreprojekt.supabase.co/auth/v1/callback`
   ⚠️ **Wichtig**: Ersetze `ihreprojekt` mit deiner echten Supabase-URL!
4. Klicke auf **Register**

### Schritt 3: Client-ID und Secret generieren

1. Nach der Registrierung siehst du die **Overview** Seite
2. **Kopiere** die **Application (client) ID** – das ist deine Client-ID!

3. Navigiere zu: **Certificates & secrets** (linke Sidebar)
4. Klicke auf **+ New client secret**
5. **Description**: `BWA Dashboard Secret`
6. **Expires**: Wähle `24 months` (oder länger)
7. Klicke auf **Add**
8. **Kopiere sofort** den **Value** – das ist dein Client-Secret!
   ⚠️ **Wichtig**: Der Secret wird nur einmal angezeigt!

### Schritt 4: Redirect URIs hinzufügen (optional für localhost)

1. Navigiere zu: **Authentication** (linke Sidebar)
2. Unter **Platform configurations** → **Web**
3. Klicke auf **Add URI**
4. Füge hinzu: `http://localhost:8000` (für lokales Testing)
5. Klicke auf **Save**

### Schritt 5: API Permissions konfigurieren

1. Navigiere zu: **API permissions** (linke Sidebar)
2. Stelle sicher, dass folgende Permissions vorhanden sind:
   - `openid`
   - `profile`
   - `email`
3. Falls nicht vorhanden:
   - Klicke **+ Add a permission** → **Microsoft Graph** → **Delegated permissions**
   - Wähle: `openid`, `profile`, `email`
   - Klicke **Add permissions**

### Schritt 6: Supabase konfigurieren

1. Gehe zu deinem Supabase Dashboard: **https://supabase.com/dashboard**
2. Wähle dein Projekt aus
3. Navigiere zu: **Authentication** → **Providers**
4. Finde **Microsoft** in der Liste und klicke auf **Enable**
5. Trage ein:
   - **Client ID**: Die kopierte Application (client) ID
   - **Client Secret**: Das kopierte Client-Secret
6. Klicke auf **Save**

---

## 🧪 3. Login-Buttons testen

### HTML-Code ist bereits vorbereitet!

Die Login-Buttons sind bereits in `bwa-upload-working.html` implementiert:

```javascript
// Google Login
async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) console.error('Google Login Fehler:', error);
}

// Microsoft Login
async function loginWithMicrosoft() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
            redirectTo: window.location.origin
        }
    });
    if (error) console.error('Microsoft Login Fehler:', error);
}
```

### Test-Ablauf:

1. **Server starten** (falls nicht läuft):
   ```bash
   python3 -m http.server 8000
   ```

2. **Öffne**: http://localhost:8000/bwa-upload-working.html

3. **Klicke auf Google-Button**:
   - Du wirst zu Google weitergeleitet
   - Wähle einen Google-Account
   - Erteile Zugriff
   - Du wirst zurück zur App geleitet
   - Du solltest eingeloggt sein! ✅

4. **Klicke auf Microsoft-Button**:
   - Du wirst zu Microsoft weitergeleitet
   - Melde dich mit Microsoft-Konto an
   - Erteile Zugriff
   - Du wirst zurück zur App geleitet
   - Du solltest eingeloggt sein! ✅

5. **Überprüfe**:
   - User-Avatar sollte oben rechts erscheinen
   - Logout-Button sollte sichtbar sein
   - Historie-Funktion sollte verfügbar sein

---

## 🔐 4. Supabase Redirect URL abrufen

**Wichtig**: Du brauchst deine exakte Supabase Redirect URL!

### Wo findest du sie?

1. Gehe zu: **Supabase Dashboard** → **Settings** → **API**
2. Unter **Project URL** findest du: `https://ihreprojekt.supabase.co`
3. Die vollständige Redirect URL ist:
   ```
   https://ihreprojekt.supabase.co/auth/v1/callback
   ```

### Beispiele:

- ✅ `https://xyzabcdefgh.supabase.co/auth/v1/callback`
- ❌ `https://supabase.com/auth/v1/callback` (falsch!)
- ❌ `http://localhost:8000/auth/callback` (nicht für OAuth!)

---

## 📝 Zusammenfassung Redirect URLs

| Provider  | Redirect URL                                              |
|-----------|-----------------------------------------------------------|
| Google    | `https://DEIN-PROJEKT.supabase.co/auth/v1/callback`     |
| Microsoft | `https://DEIN-PROJEKT.supabase.co/auth/v1/callback`     |
| Localhost | `http://localhost:8000` (nur JavaScript Origins)         |

---

## ❓ Troubleshooting

### Problem: "Redirect URI mismatch"

**Lösung**:
- Überprüfe, ob die Redirect URI in Google/Microsoft **exakt** mit der Supabase URL übereinstimmt
- Achte auf `http` vs `https`
- Achte auf Trailing-Slashes (nicht verwenden!)

### Problem: "Invalid client"

**Lösung**:
- Überprüfe Client-ID und Secret in Supabase
- Stelle sicher, dass du keine Leerzeichen kopiert hast
- Generiere ein neues Secret falls nötig

### Problem: "Access denied"

**Lösung**:
- Überprüfe API Permissions in Azure
- Stelle sicher, dass `openid`, `profile`, `email` aktiviert sind
- Bei Google: Überprüfe OAuth Consent Screen Status

### Problem: "User wird nicht eingeloggt"

**Lösung**:
- Öffne Browser Console (F12)
- Suche nach Fehlermeldungen
- Überprüfe, ob `supabase.auth.getSession()` eine Session zurückgibt
- Teste mit `console.log(currentUser)` in der Konsole

---

## ✅ Checkliste

- [ ] Google Cloud Projekt erstellt
- [ ] Google OAuth Client-ID generiert
- [ ] Google Redirect URLs konfiguriert
- [ ] Google OAuth in Supabase aktiviert
- [ ] Azure App Registration erstellt
- [ ] Microsoft Client-ID und Secret generiert
- [ ] Microsoft Redirect URLs konfiguriert
- [ ] Microsoft OAuth in Supabase aktiviert
- [ ] Google Login getestet (funktioniert)
- [ ] Microsoft Login getestet (funktioniert)
- [ ] Session-Handling funktioniert
- [ ] User-Daten werden korrekt abgerufen

---

## 🎯 Nächste Schritte nach OAuth-Setup

1. **Produktions-URLs hinzufügen**:
   - Sobald du eine echte Domain hast, füge sie zu Google/Microsoft hinzu
   - Beispiel: `https://bwa-insights.de`

2. **OAuth Consent Screen veröffentlichen**:
   - Google: Von "Testing" zu "In Production" wechseln
   - Microsoft: App aus "Testing" Phase nehmen

3. **Branding anpassen**:
   - Logo hochladen in OAuth Consent Screen
   - Privacy Policy URL hinzufügen
   - Terms of Service URL hinzufügen

---

## 📚 Weitere Ressourcen

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft Identity Platform](https://learn.microsoft.com/en-us/azure/active-directory/develop/)

---

**Stand**: 19. Oktober 2025  
**Version**: 1.0  
**Autor**: BWA Dashboard Team
