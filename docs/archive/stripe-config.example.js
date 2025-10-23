// stripe-config.example.js - Stripe API Configuration Template
// 
// ANLEITUNG:
// 1. Kopiere diese Datei zu "stripe-config.js"
// 2. Fülle deine echten API-Keys ein
// 3. NIEMALS die echte stripe-config.js committen!
//
// Siehe STRIPE_SETUP.md für detaillierte Anleitung

const STRIPE_CONFIG = {
    // ========================================
    // STRIPE API KEYS
    // ========================================
    
    // Publishable Key - Darf im Frontend verwendet werden
    // Test-Modus: pk_test_xxxxx
    // Live-Modus: pk_live_xxxxx
    // Zu finden: Stripe Dashboard → Developers → API keys
    publishableKey: 'pk_test_DEIN_KEY_HIER',
    
    // ========================================
    // PRODUKT & PREISE
    // ========================================
    
    // Price ID für Premium Subscription (€14.99/Monat)
    // Test-Modus: price_xxxxx (von Test-Produkt)
    // Live-Modus: price_xxxxx (von Live-Produkt)
    // Zu finden: Stripe Dashboard → Products → BWA Insights Premium → Pricing
    premiumPriceId: 'price_DEINE_PRICE_ID_HIER',
    
    // ========================================
    // EINSTELLUNGEN
    // ========================================
    
    // Währung (ISO 4217)
    currency: 'eur',
    
    // Sprache für Stripe Checkout UI
    locale: 'de',
    
    // ========================================
    // REDIRECT URLs
    // ========================================
    
    // URL nach erfolgreicher Zahlung
    // {CHECKOUT_SESSION_ID} wird von Stripe ersetzt
    successUrl: window.location.origin + '/bwa-upload-working.html?payment=success',
    
    // URL wenn Zahlung abgebrochen wurde
    cancelUrl: window.location.origin + '/bwa-upload-working.html?payment=cancelled',
    
    // ========================================
    // OPTIONAL: ERWEITERTE EINSTELLUNGEN
    // ========================================
    
    // Zahlungsmethoden aktivieren
    paymentMethods: ['card', 'sepa_debit'], // Kreditkarte & SEPA-Lastschrift
    
    // Automatische Steuerberechnung für EU
    automaticTax: true,
    
    // Rechnungs-Email automatisch senden
    invoiceAutoSend: true,
    
    // Trial-Periode (in Tagen) - 0 = keine Trial
    trialPeriodDays: 0,
    
    // Promo-Codes erlauben im Checkout
    allowPromotionCodes: true
};

// ========================================
// STRIPE INITIALISIERUNG
// ========================================

let stripe = null;

/**
 * Initialisiert die Stripe.js Bibliothek
 * Muss aufgerufen werden bevor Stripe verwendet wird
 * @returns {Promise<Stripe|null>} Stripe-Instanz oder null bei Fehler
 */
async function initializeStripe() {
    // Config-Validierung
    if (!STRIPE_CONFIG.publishableKey || STRIPE_CONFIG.publishableKey.includes('DEIN_KEY')) {
        console.error('❌ Stripe nicht konfiguriert!');
        console.error('📝 Bitte stripe-config.js erstellen und ausfüllen.');
        console.error('📖 Siehe STRIPE_SETUP.md für Anleitung');
        return null;
    }
    
    // Stripe.js geladen?
    if (typeof Stripe === 'undefined') {
        console.error('❌ Stripe.js nicht geladen!');
        console.error('📝 Prüfe ob <script src="https://js.stripe.com/v3/"></script> im HTML vorhanden ist');
        return null;
    }
    
    try {
        // Stripe initialisieren
        stripe = Stripe(STRIPE_CONFIG.publishableKey, {
            locale: STRIPE_CONFIG.locale
        });
        
        console.log('✅ Stripe erfolgreich initialisiert');
        console.log('🔧 Modus:', STRIPE_CONFIG.publishableKey.includes('test') ? 'TEST' : 'LIVE');
        
        return stripe;
    } catch (error) {
        console.error('❌ Stripe Initialisierung fehlgeschlagen:', error);
        return null;
    }
}

/**
 * Prüft ob Stripe korrekt konfiguriert ist
 * @returns {boolean} true wenn konfiguriert
 */
function isStripeConfigured() {
    return STRIPE_CONFIG.publishableKey && 
           !STRIPE_CONFIG.publishableKey.includes('DEIN_KEY') &&
           STRIPE_CONFIG.premiumPriceId &&
           !STRIPE_CONFIG.premiumPriceId.includes('DEINE_PRICE');
}

/**
 * Gibt aktuelle Stripe-Konfiguration zurück (ohne Keys)
 * @returns {Object} Config-Objekt
 */
function getStripeConfig() {
    return {
        currency: STRIPE_CONFIG.currency,
        locale: STRIPE_CONFIG.locale,
        isConfigured: isStripeConfigured(),
        isTestMode: STRIPE_CONFIG.publishableKey.includes('test'),
        trialPeriodDays: STRIPE_CONFIG.trialPeriodDays
    };
}
