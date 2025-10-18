#!/bin/bash

# ============================================
# SUPABASE SETUP SCRIPT
# ============================================
# Dieses Script führt Sie durch die Supabase-Einrichtung

echo "🚀 BWA Insights - Supabase Setup"
echo "=================================="
echo ""

# Schritt 1: Supabase Account erstellen
echo "📋 Schritt 1: Supabase Account erstellen"
echo ""
echo "1. Öffnen Sie: https://supabase.com"
echo "2. Klicken Sie auf 'Start your project'"
echo "3. Registrieren Sie sich mit GitHub oder Email"
echo ""
read -p "✅ Account erstellt? (j/n): " account_created

if [ "$account_created" != "j" ]; then
    echo "❌ Bitte erstellen Sie zuerst einen Supabase-Account."
    exit 1
fi

# Schritt 2: Projekt erstellen
echo ""
echo "📋 Schritt 2: Neues Projekt erstellen"
echo ""
echo "Projekteinstellungen:"
echo "  - Name: BWA-Dashboard-Production"
echo "  - Datenbank-Passwort: [Generieren Sie ein sicheres Passwort]"
echo "  - Region: Europe (Frankfurt) - eu-central-1"
echo "  - Pricing Plan: Free"
echo ""
read -p "✅ Projekt erstellt? (j/n): " project_created

if [ "$project_created" != "j" ]; then
    echo "❌ Bitte erstellen Sie zuerst ein Supabase-Projekt."
    exit 1
fi

# Schritt 3: SQL Schema ausführen
echo ""
echo "📋 Schritt 3: Datenbank-Schema einrichten"
echo ""
echo "1. Öffnen Sie Ihr Supabase-Projekt"
echo "2. Gehen Sie zu: SQL Editor"
echo "3. Öffnen Sie die Datei: SUPABASE_SETUP.md"
echo "4. Kopieren Sie das komplette SQL-Schema"
echo "5. Fügen Sie es in den SQL Editor ein"
echo "6. Klicken Sie auf 'Run'"
echo ""
read -p "✅ SQL-Schema ausgeführt? (j/n): " schema_created

if [ "$schema_created" != "j" ]; then
    echo "❌ Bitte führen Sie das SQL-Schema aus."
    exit 1
fi

# Schritt 4: Storage Bucket erstellen
echo ""
echo "📋 Schritt 4: Storage für BWA-PDFs einrichten"
echo ""
echo "1. Gehen Sie zu: Storage → Create a new bucket"
echo "2. Name: bwa-pdfs"
echo "3. Public access: OFF (privat)"
echo "4. Allowed MIME types: application/pdf"
echo "5. File size limit: 10 MB"
echo "6. Fügen Sie die Storage Policies aus SUPABASE_SETUP.md hinzu"
echo ""
read -p "✅ Storage Bucket erstellt? (j/n): " storage_created

if [ "$storage_created" != "j" ]; then
    echo "❌ Bitte erstellen Sie den Storage Bucket."
    exit 1
fi

# Schritt 5: Authentication konfigurieren
echo ""
echo "📋 Schritt 5: Authentication aktivieren"
echo ""
echo "1. Gehen Sie zu: Authentication → Providers"
echo "2. Aktivieren Sie: Email (mit Email-Bestätigung)"
echo "3. Aktivieren Sie: Google OAuth"
echo "4. Aktivieren Sie: Microsoft OAuth (optional)"
echo ""
read -p "✅ Authentication konfiguriert? (j/n): " auth_configured

if [ "$auth_configured" != "j" ]; then
    echo "❌ Bitte konfigurieren Sie die Authentication."
    exit 1
fi

# Schritt 6: API Keys kopieren
echo ""
echo "📋 Schritt 6: API-Keys kopieren"
echo ""
echo "1. Gehen Sie zu: Project Settings → API"
echo "2. Kopieren Sie:"
echo "   - Project URL"
echo "   - anon (public) key"
echo ""

read -p "Project URL: " project_url
read -p "Anon Key: " anon_key

# Konfigurationsdatei erstellen
echo ""
echo "📝 Erstelle Konfigurationsdatei..."

cat > supabase-config.js << EOF
/**
 * SUPABASE KONFIGURATION
 * Automatisch generiert am $(date)
 */

const SUPABASE_CONFIG = {
    url: '$project_url',
    anonKey: '$anon_key',
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
};

let supabase = null;

function initializeSupabase() {
    try {
        supabase = window.supabase.createClient(
            SUPABASE_CONFIG.url, 
            SUPABASE_CONFIG.anonKey,
            SUPABASE_CONFIG.options
        );
        console.log('✅ Supabase Client erfolgreich initialisiert');
        return true;
    } catch (error) {
        console.error('❌ Fehler beim Initialisieren von Supabase:', error);
        return false;
    }
}
EOF

echo ""
echo "✅ Konfigurationsdatei erstellt: supabase-config.js"
echo ""

# Schritt 7: Integration prüfen
echo "📋 Schritt 7: Integration ins Dashboard"
echo ""
echo "Fügen Sie in bwa-upload-working.html im <head> ein:"
echo ""
echo '<script src="supabase-config.js"></script>'
echo ""
echo "Und nach dem <body>-Tag:"
echo ""
echo '<script>'
echo '  // Supabase initialisieren'
echo '  initializeSupabase();'
echo '</script>'
echo ""

read -p "✅ Integration abgeschlossen? (j/n): " integration_done

if [ "$integration_done" != "j" ]; then
    echo "⚠️  Bitte fügen Sie die Integration hinzu."
fi

# Zusammenfassung
echo ""
echo "🎉 SETUP ABGESCHLOSSEN!"
echo "=================================="
echo ""
echo "✅ Supabase-Account erstellt"
echo "✅ Projekt konfiguriert (EU-Frankfurt)"
echo "✅ Datenbank-Schema eingericht"
echo "✅ Storage für PDFs konfiguriert"
echo "✅ Authentication aktiviert"
echo "✅ API-Keys konfiguriert"
echo ""
echo "📄 Nächste Schritte:"
echo "  1. Öffnen Sie das Dashboard: bwa-upload-working.html"
echo "  2. Testen Sie den Login"
echo "  3. Laden Sie eine Test-BWA hoch"
echo ""
echo "📚 Dokumentation: SUPABASE_SETUP.md"
echo ""
echo "🔒 Sicherheitshinweis:"
echo "  Die Datei 'supabase-config.js' ist in .gitignore eingetragen"
echo "  und wird NICHT ins Git-Repository committed."
echo ""
