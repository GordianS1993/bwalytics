# Stripe Payment Integration Setup

Komplette Anleitung zur Einrichtung der Stripe-Zahlungsabwicklung für BWA Insights.

## 🎯 Übersicht

- **Premium-Preis**: €14.99/Monat
- **Abrechnungsintervall**: Monatlich, automatische Verlängerung
- **Zahlungsmethoden**: Kreditkarte, SEPA-Lastschrift (optional)
- **Steuer**: Automatische MwSt-Berechnung für EU
- **DSGVO**: Stripe ist DSGVO-konform, Server in EU verfügbar

## 📋 Voraussetzungen

- ✅ Supabase-Backend läuft
- ✅ User-Authentication funktioniert
- ✅ `user_subscriptions` Tabelle existiert
- 🔲 Stripe-Account (wird erstellt)
- 🔲 Firmendaten für Rechnungen

---

## 🚀 Teil 1: Stripe-Account erstellen

### 1.1 Account Registrierung

1. Gehe zu: https://dashboard.stripe.com/register
2. Registriere dich mit Email-Adresse
3. **Wichtig**: Wähle **Deutschland** als Land
4. Verifiziere Email-Adresse
5. **Test-Modus**: Standardmäßig im Test-Modus (erkennbar an orangem Banner)

### 1.2 Firmendaten hinterlegen

Für Live-Zahlungen später benötigt:

1. Dashboard → **Settings** → **Business settings**
2. Trage ein:
   - Firmenname
   - Adresse
   - Steuernummer
   - Bankverbindung (für Auszahlungen)

### 1.3 API-Keys abrufen

1. Dashboard → **Developers** → **API keys**
2. Zwei wichtige Keys:
   - **Publishable key** (pk_test_...): Für Frontend, öffentlich sichtbar
   - **Secret key** (sk_test_...): Für Backend, NIEMALS im Frontend verwenden!

**Wichtig**: Im Test-Modus haben Keys `_test_` im Namen.

---

## 🛍️ Teil 2: Produkt & Preis erstellen

### 2.1 Premium-Produkt anlegen

1. Dashboard → **Products** → **Add product**
2. Fülle aus:
   ```
   Name: BWA Insights Premium
   Description: Zugriff auf Analytics, Empfehlungen und erweiterte Features
   ```
3. **Pricing**:
   ```
   Price: 14.99 EUR
   Billing period: Monthly (recurring)
   ```
4. Klicke **Save product**

### 2.2 Price-ID notieren

Nach dem Speichern siehst du eine **Price ID**: `price_xxxxxxxxxxxxx`

**Diese ID brauchst du später im Code!**

---

## 🔗 Teil 3: Checkout-Session erstellen

Stripe bietet zwei Ansätze:

### Option A: Stripe Checkout (empfohlen für Start)

**Vorteile:**
- ✅ Fertige UI von Stripe gehostet
- ✅ PCI-Compliance automatisch
- ✅ Unterstützt viele Zahlungsmethoden
- ✅ Mobile-optimiert

**Ablauf:**
1. User klickt "Upgraden" Button
2. Redirect zu Stripe Checkout Seite
3. Zahlung auf Stripe
4. Redirect zurück zu deiner App

### Option B: Stripe Elements (für Custom UI)

**Später für volle Kontrolle über Design.**

---

## 🔐 Teil 4: Stripe Config-Datei anlegen

Erstelle `stripe-config.js`:

```javascript
// stripe-config.js - Stripe API Configuration
// ⚠️ WICHTIG: Diese Datei ist in .gitignore - NIEMALS committen!

const STRIPE_CONFIG = {
    // Publishable Key - Darf im Frontend verwendet werden
    publishableKey: 'pk_test_DEIN_KEY_HIER',
    
    // Price ID für Premium Subscription
    premiumPriceId: 'price_DEINE_PRICE_ID_HIER',
    
    // Einstellungen
    currency: 'eur',
    locale: 'de',
    
    // Success/Cancel URLs (nach Zahlung)
    successUrl: window.location.origin + '/bwa-upload-working.html?payment=success',
    cancelUrl: window.location.origin + '/bwa-upload-working.html?payment=cancelled'
};

// Stripe laden und initialisieren
let stripe = null;

async function initializeStripe() {
    if (!STRIPE_CONFIG.publishableKey || STRIPE_CONFIG.publishableKey.includes('DEIN_KEY')) {
        console.error('⚠️ Stripe nicht konfiguriert! Bitte stripe-config.js ausfüllen.');
        return null;
    }
    
    if (typeof Stripe === 'undefined') {
        console.error('⚠️ Stripe.js nicht geladen! Prüfe <script> Tag im HTML.');
        return null;
    }
    
    stripe = Stripe(STRIPE_CONFIG.publishableKey, {
        locale: STRIPE_CONFIG.locale
    });
    
    console.log('✅ Stripe initialisiert');
    return stripe;
}
```

---

## 🔧 Teil 5: Supabase Edge Function für Checkout

Stripe Checkout Sessions müssen serverseitig erstellt werden (aus Sicherheitsgründen).

### 5.1 Edge Function erstellen

```bash
# Supabase CLI installieren (falls noch nicht geschehen)
npm install -g supabase

# Edge Function erstellen
supabase functions new create-checkout-session
```

### 5.2 Function Code

Datei: `supabase/functions/create-checkout-session/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, userEmail, priceId } = await req.json()

    // Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId, // User-ID für Webhook
      success_url: `${req.headers.get('origin')}/bwa-upload-working.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/bwa-upload-working.html?payment=cancelled`,
      metadata: {
        supabase_user_id: userId,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
    })

    return new Response(
      JSON.stringify({ sessionId: session.id, url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
```

### 5.3 Secrets setzen

```bash
# Stripe Secret Key als Environment Variable
supabase secrets set STRIPE_SECRET_KEY=sk_test_DEIN_SECRET_KEY_HIER

# Function deployen
supabase functions deploy create-checkout-session --no-verify-jwt
```

**Wichtig**: `--no-verify-jwt` weil wir eigene Auth-Checks machen.

---

## 🪝 Teil 6: Webhook für Subscription-Updates

Webhooks informieren deine Datenbank über Zahlungs-Events.

### 6.1 Webhook-Endpoint erstellen

```bash
supabase functions new stripe-webhook
```

### 6.2 Webhook Code

Datei: `supabase/functions/stripe-webhook/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  let event: Stripe.Event

  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, signature!, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return new Response('Invalid signature', { status: 400 })
  }

  console.log('Webhook event:', event.type)

  // Subscription Events verarbeiten
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id || session.client_reference_id

      if (userId) {
        // User auf Premium upgraden
        await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            tier: 'premium',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })

        console.log(`✅ User ${userId} upgraded to Premium`)
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata.supabase_user_id

      if (userId) {
        await supabase
          .from('user_subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        console.log(`✅ Subscription updated for user ${userId}`)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const userId = subscription.metadata.supabase_user_id

      if (userId) {
        // Downgrade zu Basic
        await supabase
          .from('user_subscriptions')
          .update({
            tier: 'basic',
            status: 'cancelled',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        console.log(`✅ User ${userId} downgraded to Basic`)
      }
      break
    }

    case 'invoice.payment_failed': {
      // Payment failed - User benachrichtigen
      console.log('⚠️ Payment failed')
      break
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
```

### 6.3 Webhook in Stripe registrieren

1. Dashboard → **Developers** → **Webhooks**
2. Klicke **Add endpoint**
3. **Endpoint URL**: `https://DEIN_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Klicke **Add endpoint**

### 6.4 Webhook Secret setzen

Nach dem Erstellen siehst du einen **Signing secret**: `whsec_xxxxx`

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_DEIN_SECRET_HIER
supabase functions deploy stripe-webhook
```

---

## ✅ Teil 7: Testing

### 7.1 Test-Kreditkarten

Stripe stellt Test-Karten bereit:

```
✅ Erfolgreiche Zahlung:
   Nummer: 4242 4242 4242 4242
   Datum: Beliebiges zukünftiges Datum
   CVC: Beliebige 3 Ziffern

❌ Abgelehnte Zahlung:
   Nummer: 4000 0000 0000 0002

⏳ 3D Secure erforderlich:
   Nummer: 4000 0027 6000 3184
```

### 7.2 Test-Ablauf

1. Öffne Dashboard als nicht-eingeloggter User
2. Klicke auf "Jetzt anmelden" → Registriere dich
3. Navigiere zu Analytics → Sehe Premium-Overlay
4. Klicke "Jetzt upgraden auf Premium"
5. Werde zu Stripe Checkout weitergeleitet
6. Nutze Test-Karte `4242 4242 4242 4242`
7. Werde zurück zum Dashboard geleitet
8. Premium-Overlays sollten verschwunden sein ✨

### 7.3 Webhook Testing lokal

```bash
# Stripe CLI installieren
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Webhook lokal forwarden
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook

# In anderem Terminal: Event triggern
stripe trigger checkout.session.completed
```

---

## 🌍 Teil 8: Live-Modus aktivieren

**Erst nach gründlichem Testen!**

### 8.1 Stripe auf Live umstellen

1. Dashboard → **Toggle Test Mode** (oben rechts) → Ausschalten
2. Neue API-Keys abrufen (ohne `_test_`)
3. Premium-Produkt auch im Live-Modus erstellen
4. Neue Price-ID notieren

### 8.2 Config aktualisieren

```javascript
// stripe-config.js - LIVE KEYS
const STRIPE_CONFIG = {
    publishableKey: 'pk_live_XXXXXXXXX',  // Live Key!
    premiumPriceId: 'price_XXXXXXXXX',     // Live Price ID!
    // ... rest bleibt gleich
};
```

### 8.3 Secrets aktualisieren

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_XXXXXXXXX
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXX
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook
```

### 8.4 Webhook-URL aktualisieren

Erstelle neuen Webhook-Endpoint für Live-Modus in Stripe Dashboard.

---

## 🔒 Sicherheits-Checkliste

- [ ] Secret Key **niemals** im Frontend verwenden
- [ ] `stripe-config.js` in `.gitignore`
- [ ] Webhook-Signatur immer verifizieren
- [ ] User-ID aus Session/Token nehmen, nicht aus Request-Body
- [ ] Edge Functions mit RLS schützen
- [ ] HTTPS für alle Requests (in Production)
- [ ] Idempotency Keys für kritische Operationen
- [ ] Error-Handling für fehlgeschlagene Zahlungen
- [ ] User-Benachrichtigung bei Payment Failures

---

## 📊 Subscription-Verwaltung

### Kunden-Portal aktivieren

Stripe bietet ein fertiges Portal für Kunden:
- Rechnungen herunterladen
- Zahlungsmethode ändern
- Subscription kündigen

**Aktivierung:**
1. Dashboard → **Settings** → **Billing** → **Customer portal**
2. **Turn on** Customer portal
3. Konfiguriere: Kündigungsoptionen, Zahlungsmethoden
4. URL wird automatisch generiert

**Im Code verwenden:**

```javascript
// Stripe Portal öffnen
async function openCustomerPortal() {
    const response = await supabase.functions.invoke('create-portal-session', {
        body: { returnUrl: window.location.href }
    });
    
    if (response.data?.url) {
        window.location.href = response.data.url;
    }
}
```

---

## 📈 Analytics & Reporting

**Stripe Dashboard zeigt:**
- 💰 Umsatz (MRR - Monthly Recurring Revenue)
- 👥 Anzahl Subscriptions
- 📊 Churn Rate (Kündigungsrate)
- 💳 Erfolgreiche/Fehlgeschlagene Zahlungen
- 🌍 Geografische Verteilung

**Export:**
- Dashboard → **Reports** → Custom Reports erstellen
- CSV/Excel Export für Buchhaltung

---

## 🆘 Troubleshooting

### Problem: "Invalid API Key"
- ✅ Prüfe: Richtiger Key in `stripe-config.js`?
- ✅ Prüfe: Test-Key bei Test-Modus, Live-Key bei Live-Modus?

### Problem: Webhook wird nicht empfangen
- ✅ Prüfe: Webhook-URL richtig in Stripe eingetragen?
- ✅ Prüfe: Edge Function deployed? `supabase functions list`
- ✅ Prüfe: Webhook Secret gesetzt? `supabase secrets list`

### Problem: User wird nicht upgraded
- ✅ Prüfe: Webhook-Logs in Stripe Dashboard
- ✅ Prüfe: `user_subscriptions` Tabelle in Supabase
- ✅ Prüfe: User-ID wird korrekt übergeben in Metadata

### Problem: Redirect nach Zahlung funktioniert nicht
- ✅ Prüfe: `success_url` und `cancel_url` richtig gesetzt?
- ✅ Prüfe: URLs sind absolute Pfade (mit `https://`)?

---

## 📚 Weiterführende Links

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [PCI Compliance](https://stripe.com/docs/security/guide)

---

**Stand**: Oktober 2025
**Version**: 1.0
**Autor**: BWA Insights Team
