#!/bin/bash

# ==================================================================
# Stripe Setup Script für BWA Insights
# ==================================================================
# Führt durch den kompletten Stripe-Setup Prozess
# Erstellt stripe-config.js mit echten API-Keys
# ==================================================================

set -e  # Bei Fehler abbrechen

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        🎨 BWA Insights - Stripe Payment Setup             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==================================================================
# SCHRITT 1: Prüfen ob stripe-config.js bereits existiert
# ==================================================================

if [ -f "stripe-config.js" ]; then
    echo -e "${YELLOW}⚠️  stripe-config.js existiert bereits!${NC}"
    echo ""
    read -p "Möchten Sie die Konfiguration überschreiben? (j/n): " overwrite
    if [[ ! "$overwrite" =~ ^[jJ]$ ]]; then
        echo "Setup abgebrochen."
        exit 0
    fi
    rm stripe-config.js
fi

# ==================================================================
# SCHRITT 2: Stripe Account Status
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📋 Schritt 1: Stripe Account${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Haben Sie bereits einen Stripe-Account?"
echo "Falls nein: Registrieren Sie sich auf https://dashboard.stripe.com/register"
echo ""
read -p "Haben Sie einen Stripe-Account? (j/n): " has_account

if [[ ! "$has_account" =~ ^[jJ]$ ]]; then
    echo ""
    echo -e "${YELLOW}📝 Bitte erstellen Sie zuerst einen Account:${NC}"
    echo "   1. Gehen Sie zu: https://dashboard.stripe.com/register"
    echo "   2. Registrieren Sie sich mit Ihrer Email"
    echo "   3. Wählen Sie 'Deutschland' als Land"
    echo "   4. Bestätigen Sie Ihre Email-Adresse"
    echo ""
    echo "Starten Sie dieses Script erneut, wenn Sie fertig sind."
    exit 0
fi

# ==================================================================
# SCHRITT 3: Test vs. Live Mode
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🔧 Schritt 2: Modus wählen${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Welchen Modus möchten Sie einrichten?"
echo ""
echo "  [1] Test-Modus (empfohlen für Entwicklung)"
echo "      - Keine echten Zahlungen"
echo "      - Test-Kreditkarten verwenden"
echo "      - Ideal zum Testen"
echo ""
echo "  [2] Live-Modus (nur für Produktiv-Umgebung)"
echo "      - Echte Zahlungen"
echo "      - Firmendaten müssen bei Stripe hinterlegt sein"
echo ""
read -p "Auswahl (1 oder 2): " mode_choice

if [ "$mode_choice" == "1" ]; then
    MODE="test"
    echo -e "${GREEN}✅ Test-Modus gewählt${NC}"
elif [ "$mode_choice" == "2" ]; then
    MODE="live"
    echo -e "${YELLOW}⚠️  Live-Modus gewählt - Echte Zahlungen werden verarbeitet!${NC}"
else
    echo -e "${RED}❌ Ungültige Auswahl${NC}"
    exit 1
fi

# ==================================================================
# SCHRITT 4: Premium-Produkt erstellen
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📦 Schritt 3: Premium-Produkt erstellen${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Bitte erstellen Sie jetzt das Premium-Produkt in Stripe:"
echo ""
echo "1. Öffnen Sie: https://dashboard.stripe.com/products"

if [ "$MODE" == "test" ]; then
    echo "2. Stellen Sie sicher, dass 'Test-Modus' AKTIV ist (oranges Banner oben)"
else
    echo "2. Stellen Sie sicher, dass 'Test-Modus' DEAKTIVIERT ist"
fi

echo "3. Klicken Sie auf '+ Add product'"
echo "4. Füllen Sie aus:"
echo "   - Name: BWA Insights Premium"
echo "   - Description: Zugriff auf Analytics, Empfehlungen und erweiterte Features"
echo "   - Price: 14.99 EUR"
echo "   - Billing period: Monthly (recurring)"
echo "5. Klicken Sie 'Save product'"
echo ""
read -p "Haben Sie das Produkt erstellt? (j): " product_created

if [[ ! "$product_created" =~ ^[jJ]$ ]]; then
    echo "Setup abgebrochen."
    exit 0
fi

# ==================================================================
# SCHRITT 5: API-Keys eingeben
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🔑 Schritt 4: API-Keys eingeben${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Bitte holen Sie Ihre API-Keys:"
echo "1. Öffnen Sie: https://dashboard.stripe.com/apikeys"

if [ "$MODE" == "test" ]; then
    echo "2. Stellen Sie sicher, dass 'Test-Modus' AKTIV ist"
    echo "3. Kopieren Sie den 'Publishable key' (beginnt mit pk_test_)"
else
    echo "2. Stellen Sie sicher, dass 'Test-Modus' DEAKTIVIERT ist"
    echo "3. Kopieren Sie den 'Publishable key' (beginnt mit pk_live_)"
fi

echo ""
read -p "Publishable Key: " PUBLISHABLE_KEY

if [ "$MODE" == "test" ]; then
    if [[ ! "$PUBLISHABLE_KEY" =~ ^pk_test_ ]]; then
        echo -e "${RED}❌ Fehler: Key sollte mit 'pk_test_' beginnen${NC}"
        exit 1
    fi
else
    if [[ ! "$PUBLISHABLE_KEY" =~ ^pk_live_ ]]; then
        echo -e "${RED}❌ Fehler: Key sollte mit 'pk_live_' beginnen${NC}"
        exit 1
    fi
fi

# ==================================================================
# SCHRITT 6: Price-ID eingeben
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}💰 Schritt 5: Price-ID eingeben${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Jetzt benötigen wir die Price-ID des Premium-Produkts:"
echo "1. Gehen Sie zu: https://dashboard.stripe.com/products"
echo "2. Klicken Sie auf 'BWA Insights Premium'"
echo "3. Unter 'Pricing' sehen Sie die Price-ID (z.B. price_xxxxxxxxxxxxx)"
echo ""
read -p "Price ID: " PRICE_ID

if [[ ! "$PRICE_ID" =~ ^price_ ]]; then
    echo -e "${RED}❌ Fehler: Price-ID sollte mit 'price_' beginnen${NC}"
    exit 1
fi

# ==================================================================
# SCHRITT 7: stripe-config.js erstellen
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📝 Schritt 6: Konfiguration erstellen${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > stripe-config.js << EOL
// stripe-config.js - Stripe API Configuration
// Automatisch generiert von setup-stripe.sh
// ⚠️ NIEMALS diese Datei committen! (ist in .gitignore)

const STRIPE_CONFIG = {
    // Publishable Key - Darf im Frontend verwendet werden
    publishableKey: '${PUBLISHABLE_KEY}',
    
    // Price ID für Premium Subscription
    premiumPriceId: '${PRICE_ID}',
    
    // Einstellungen
    currency: 'eur',
    locale: 'de',
    
    // Redirect URLs
    successUrl: window.location.origin + '/bwa-upload-working.html?payment=success',
    cancelUrl: window.location.origin + '/bwa-upload-working.html?payment=cancelled',
    
    // Zahlungsmethoden
    paymentMethods: ['card', 'sepa_debit'],
    
    // Automatische Steuerberechnung
    automaticTax: true,
    
    // Rechnungs-Email senden
    invoiceAutoSend: true,
    
    // Trial-Periode (Tage)
    trialPeriodDays: 0,
    
    // Promo-Codes erlauben
    allowPromotionCodes: true
};

// Stripe initialisieren
let stripe = null;

async function initializeStripe() {
    if (!STRIPE_CONFIG.publishableKey || STRIPE_CONFIG.publishableKey.includes('DEIN_KEY')) {
        console.error('❌ Stripe nicht konfiguriert!');
        return null;
    }
    
    if (typeof Stripe === 'undefined') {
        console.error('❌ Stripe.js nicht geladen!');
        return null;
    }
    
    try {
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

function isStripeConfigured() {
    return STRIPE_CONFIG.publishableKey && 
           !STRIPE_CONFIG.publishableKey.includes('DEIN_KEY') &&
           STRIPE_CONFIG.premiumPriceId &&
           !STRIPE_CONFIG.premiumPriceId.includes('DEINE_PRICE');
}

function getStripeConfig() {
    return {
        currency: STRIPE_CONFIG.currency,
        locale: STRIPE_CONFIG.locale,
        isConfigured: isStripeConfigured(),
        isTestMode: STRIPE_CONFIG.publishableKey.includes('test'),
        trialPeriodDays: STRIPE_CONFIG.trialPeriodDays
    };
}
EOL

echo -e "${GREEN}✅ stripe-config.js erstellt${NC}"

# ==================================================================
# SCHRITT 8: Edge Functions deployen
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🚀 Schritt 7: Edge Functions deployen${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Möchten Sie die Supabase Edge Functions jetzt deployen?"
echo "(Benötigt Supabase CLI: npm install -g supabase)"
echo ""
read -p "Edge Functions deployen? (j/n): " deploy_functions

if [[ "$deploy_functions" =~ ^[jJ]$ ]]; then
    echo ""
    echo "Für das Deployment benötigen Sie:"
    echo ""
    echo "1. Ihren Stripe Secret Key:"
    echo "   Zu finden: https://dashboard.stripe.com/apikeys"
    if [ "$MODE" == "test" ]; then
        echo "   (Key beginnt mit sk_test_)"
    else
        echo "   (Key beginnt mit sk_live_)"
    fi
    echo ""
    read -sp "Secret Key: " SECRET_KEY
    echo ""
    
    echo ""
    echo "Setze Supabase Secrets..."
    supabase secrets set STRIPE_SECRET_KEY="$SECRET_KEY" || echo "⚠️  Fehler beim Setzen des Secrets"
    
    echo ""
    echo "Deploye Edge Functions..."
    supabase functions deploy create-checkout-session --no-verify-jwt || echo "⚠️  Fehler beim Deployen"
    supabase functions deploy stripe-webhook || echo "⚠️  Fehler beim Deployen"
    supabase functions deploy create-portal-session || echo "⚠️  Fehler beim Deployen"
    
    echo ""
    echo -e "${GREEN}✅ Edge Functions deployed${NC}"
fi

# ==================================================================
# SCHRITT 9: Webhook einrichten
# ==================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}🪝 Schritt 8: Webhook einrichten${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Bitte richten Sie jetzt den Webhook in Stripe ein:"
echo ""
echo "1. Öffnen Sie: https://dashboard.stripe.com/webhooks"
echo "2. Klicken Sie auf '+ Add endpoint'"
echo "3. Endpoint URL eingeben:"
read -p "   Was ist Ihre Supabase Project URL? (z.B. abcdef.supabase.co): " SUPABASE_URL
echo ""
echo "   Verwenden Sie: https://${SUPABASE_URL}/functions/v1/stripe-webhook"
echo ""
echo "4. Events to send auswählen:"
echo "   ✓ checkout.session.completed"
echo "   ✓ customer.subscription.updated"
echo "   ✓ customer.subscription.deleted"
echo "   ✓ invoice.payment_failed"
echo "   ✓ invoice.payment_succeeded"
echo ""
echo "5. Klicken Sie 'Add endpoint'"
echo "6. Kopieren Sie den 'Signing secret' (whsec_xxxxx)"
echo ""
read -sp "Webhook Signing Secret: " WEBHOOK_SECRET
echo ""

if [[ "$WEBHOOK_SECRET" =~ ^whsec_ ]]; then
    echo ""
    echo "Setze Webhook Secret..."
    supabase secrets set STRIPE_WEBHOOK_SECRET="$WEBHOOK_SECRET" || echo "⚠️  Fehler beim Setzen"
    echo -e "${GREEN}✅ Webhook Secret gesetzt${NC}"
else
    echo -e "${YELLOW}⚠️  Secret sollte mit 'whsec_' beginnen${NC}"
fi

# ==================================================================
# FERTIG!
# ==================================================================

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅  Setup erfolgreich abgeschlossen!          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}Stripe Payment-Integration ist jetzt aktiv!${NC}"
echo ""
echo "📝 Nächste Schritte:"
echo ""
echo "1. Öffnen Sie die App im Browser"
echo "2. Melden Sie sich an (oder registrieren Sie sich)"
echo "3. Klicken Sie auf 'Jetzt upgraden'"
echo "4. Testen Sie mit Test-Kreditkarte:"
if [ "$MODE" == "test" ]; then
    echo "   - Nummer: 4242 4242 4242 4242"
    echo "   - Datum: Beliebig (Zukunft)"
    echo "   - CVC: Beliebig (3 Ziffern)"
else
    echo "   ⚠️  Sie sind im LIVE-MODUS - echte Kreditkarte verwenden!"
fi
echo ""
echo "📖 Weitere Infos: Siehe STRIPE_SETUP.md"
echo ""
