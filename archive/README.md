# Archive - Alte Versionen & Development-Tools

Dieses Verzeichnis enthält **alte Versionen** und **Development-Tools**, die nicht mehr aktiv verwendet werden.

---

## 📂 Inhalt

### **Alte Versionen (Version 1-7.1)**
Historische Entwicklungsversionen der BWAlytics-App:

| Datei | Version | Datum | Beschreibung |
|-------|---------|-------|--------------|
| `Version 1.html` | v1.0 | - | Erste Version |
| `Version 2.html` | v2.0 | - | - |
| `Version 3.html` | v3.0 | - | - |
| `Version 5.html` | v5.0 | - | Premium-Overlays, Branchen-Benchmark |
| `Version 6.html` | v6.0 | - | BWA-Validierung |
| `Version 7.html` | v7.0 | - | AES-256 Verschlüsselung |
| `Version 7.1.html` | v7.1 | - | Verschlüsselung vollständig integriert |

**Aktuelle Version:** `bwa-upload-working.html` (im Root)

---

### **Backups**
Automatische Backups während Entwicklung:

| Datei | Datum | Zweck |
|-------|-------|-------|
| `bwa-upload-VERSION-1.html` | - | Backup vor Major-Changes |
| `bwa-upload-production.html` | - | Alte Production-Version |
| `bwa-upload-working-backup-*.html` | 20.10.2025 | Backup vor Cleanup |
| `bwa-upload-BACKUP-*.html` | 22.10.2025 | Backup während Extraktion-Refactor |

---

### **Development-Tools**
Tools die während Entwicklung genutzt wurden:

| Tool | Zweck |
|------|-------|
| `bwa-dashboard-demo.html` | Demo-Dashboard-Prototyp |
| `debug-bwa-text.html` | PDF-Text-Extraktion testen |
| `export-logs.html` | Console-Logs exportieren |
| `reset-page.html` | localStorage-Reset-Tool |
| `reset-password.html` | Passwort-Reset-Utility |
| `test-bwa-extraction.html` | BWA-Extraktion testen |
| `test-supabase.html` | Supabase-Connection-Test |
| `cleanup-extraction.py` | Python-Script für Code-Cleanup |

---

## 🗂️ **Warum archiviert?**

### **Alte Versionen:**
- ✅ Git-History enthält alle Änderungen
- ✅ Reduziert Clutter im Root-Verzeichnis
- ✅ Fokus auf aktuelle Production-Version

### **Development-Tools:**
- ✅ Nicht für Production notwendig
- ✅ Können bei Bedarf wiederverwendet werden
- ✅ Dokumentieren Entwicklungsprozess

---

## 🔄 **Wiederherstellung**

Falls du eine alte Version oder ein Tool brauchst:

```bash
# Datei aus Archive wiederherstellen
cp archive/Version-7.1.html .

# Oder komplette Git-Historie durchsuchen
git log --all --full-history -- "Version 7.1.html"
```

---

## 🧹 **Aufräum-Regeln**

### **Archive behalten:**
- Alle Versionen (für History)
- Development-Tools (für zukünftige Entwicklung)

### **Archive löschen (optional):**
```bash
# Wenn Archive zu groß wird (>50 MB)
# → Älteste Versionen löschen, Git-History bleibt

rm archive/Version-1.html
rm archive/Version-2.html
# etc.
```

---

## 📚 **Siehe auch**

- **CHANGELOG.md** - Vollständige Version-History
- **VERSIONS.md** - Version-Dokumentation
- **Git-History** - `git log --all --oneline`

---

**Letzte Archivierung:** 23. Oktober 2025
