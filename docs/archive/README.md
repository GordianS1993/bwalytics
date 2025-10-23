# Archive - Future Features (Server-Based)

Dieses Verzeichnis enthält **Setup-Guides für zukünftige Server-basierte Features**, die aktuell **NICHT in BWAlytics implementiert** sind.

BWAlytics ist derzeit eine **100% Client-Side App** ohne Backend/Server.

---

## 📂 Archivierte Dateien

### **STRIPE_SETUP.md**
Setup-Guide für Stripe-Integration (Premium-Features, Bezahlung).

**Status:** ❌ Nicht implementiert  
**Grund:** BWAlytics ist kostenlos und browser-only  
**Zukunft:** Eventuell für v3.0+ mit optionalen Premium-Features

---

### **SUPABASE_SETUP.md**
Setup-Guide für Supabase-Backend (Multi-Device-Sync, Cloud-Backup).

**Status:** ❌ Nicht implementiert  
**Grund:** Privacy-First-Ansatz → Keine Cloud-Speicherung  
**Zukunft:** Eventuell für v2.1+ als **optionale** Collaboration-Feature (Ende-zu-Ende-verschlüsselt)

---

### **OAUTH_SETUP.md**
Setup-Guide für OAuth-Authentifizierung (Google/GitHub Login).

**Status:** ❌ Nicht implementiert  
**Grund:** Keine User-Accounts notwendig (browser-only)  
**Zukunft:** Eventuell für v2.1+ Team-Collaboration

---

## 🚀 **Aktuelle Architektur (v1.0)**

```
┌─────────────────────────────────┐
│   Browser (Client-Side Only)   │
├─────────────────────────────────┤
│ • Vanilla JavaScript            │
│ • PDF.js für BWA-Parsing        │
│ • CryptoJS für Verschlüsselung  │
│ • localStorage (encrypted)      │
│ • Keine Server-Kommunikation    │
└─────────────────────────────────┘
```

**Keine Datenbank. Keine Cloud. Keine User-Accounts.**

---

## 🔮 **Mögliche Zukunfts-Architektur (v2.0+)**

Falls wir jemals Server-Features hinzufügen (optional!):

```
┌─────────────────────────────────┐
│   Client (Browser)              │
│   • Bleibt 100% funktionsfähig  │
│   • Lokale Verschlüsselung      │
└─────────────────────────────────┘
              │
              ▼ (optional)
┌─────────────────────────────────┐
│   Server (Supabase/Custom)      │
│   • Ende-zu-Ende-verschlüsselt  │
│   • Multi-Device-Sync           │
│   • Team-Collaboration          │
│   • Premium-Features (Stripe)   │
└─────────────────────────────────┘
```

**Wichtig:** Server-Features werden IMMER optional sein!  
Grundfunktionalität bleibt kostenlos & client-side.

---

## 📋 **Roadmap-Zuordnung**

| Feature | Version | Braucht Server? | Status |
|---------|---------|-----------------|--------|
| Dashboard & Visualisierung | v1.1 | ❌ Nein | In Entwicklung |
| Cashflow-Runway | v1.2 | ❌ Nein | Geplant |
| Liquiditäts-Frühwarnsystem | v1.2 | ❌ Nein | Geplant |
| Profitabilitäts-Hebel | v1.3 | ❌ Nein | Geplant |
| Multi-Monats-Trend | v1.4 | ❌ Nein | Geplant |
| Plugin-System | v2.0 | ❌ Nein | Geplant |
| **Team-Collaboration** | v2.1 | ⚠️ Optional | Eventuell |
| **Multi-Device-Sync** | v2.1 | ⚠️ Optional | Eventuell |
| **Premium-Features** | v3.0 | ⚠️ Optional | Eventuell |

---

## 🛠️ **Wenn du Server-Features entwickeln willst:**

### **Voraussetzungen:**
1. Diskussion in [GitHub Discussions](https://github.com/GordianS1993/bwalytics/discussions)
2. Community-Feedback einholen
3. Privacy-Impact-Assessment
4. Opt-In-Konzept (niemals Pflicht!)

### **Setup-Guides nutzen:**
1. Lies die archivierten Setup-Guides in diesem Ordner
2. Teste lokal mit Supabase/Stripe-Sandbox
3. Erstelle Feature-Branch: `feature/server-sync`
4. Pull Request mit ausführlicher Dokumentation

### **Prinzipien:**
- ✅ Ende-zu-Ende-Verschlüsselung (Server sieht nur encrypted Blobs)
- ✅ Opt-In (User muss explizit zustimmen)
- ✅ Fallback (App funktioniert ohne Server weiter)
- ✅ Open Source (kein Vendor-Lock-In)

---

**Fragen?** Erstelle ein Issue: https://github.com/GordianS1993/bwalytics/issues
