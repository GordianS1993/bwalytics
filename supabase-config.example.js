/**
 * ============================================
 * SUPABASE KONFIGURATION
 * ============================================
 * 
 * Nach dem Erstellen Ihres Supabase-Projekts:
 * 1. Kopieren Sie diese Datei zu: supabase-config.js
 * 2. Tragen Sie Ihre Supabase-Credentials ein
 * 3. Binden Sie die Datei in bwa-upload-working.html ein
 * 
 * WICHTIG: Fügen Sie supabase-config.js zu .gitignore hinzu!
 */

const SUPABASE_CONFIG = {
    // Ihre Supabase Project URL (zu finden unter: Project Settings → API)
    url: 'https://ihr-projekt.supabase.co',
    
    // Ihr Supabase anon/public Key (zu finden unter: Project Settings → API)
    // Dieser Key ist sicher für Frontend-Nutzung
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    
    // Optional: Service Role Key (NUR für Server-seitige Operationen!)
    // Niemals im Frontend verwenden!
    // serviceRoleKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    
    // Regionale Einstellungen
    options: {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
};

// Supabase Client initialisieren (wird in bwa-upload-working.html verwendet)
let supabase = null;

function initializeSupabase() {
    try {
        supabase = window.supabase.createClient(
            SUPABASE_CONFIG.url, 
            SUPABASE_CONFIG.anonKey,
            SUPABASE_CONFIG.options
        );
        console.log('✅ Supabase Client erfolgreich initialisiert');
        console.log('📍 Region:', SUPABASE_CONFIG.url.includes('eu-central') ? 'EU (Frankfurt)' : 'Andere Region');
        return true;
    } catch (error) {
        console.error('❌ Fehler beim Initialisieren von Supabase:', error);
        return false;
    }
}

// Export für Verwendung im Dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, initializeSupabase };
}
