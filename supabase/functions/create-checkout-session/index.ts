// Supabase Edge Function: Create Stripe Checkout Session
// 
// Diese Function erstellt eine Stripe Checkout Session für Premium-Upgrades
// Sie läuft serverseitig (sicher) und nutzt den Stripe Secret Key

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS Headers für Browser-Requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Stripe Client initialisieren
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

serve(async (req) => {
  // CORS Preflight Request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Request-Body parsen
    const { userId, userEmail, priceId } = await req.json()

    // Validierung
    if (!userId || !userEmail || !priceId) {
      return new Response(
        JSON.stringify({ error: 'userId, userEmail und priceId sind erforderlich' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Prüfe ob User bereits Premium ist
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('tier, status')
      .eq('user_id', userId)
      .single()

    if (subscription?.tier === 'premium' && subscription?.status === 'active') {
      return new Response(
        JSON.stringify({ error: 'User ist bereits Premium-Mitglied' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Origin für Redirect-URLs
    const origin = req.headers.get('origin') || 'http://localhost:8000'

    // Stripe Checkout Session erstellen
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
      client_reference_id: userId, // Wichtig für Webhook
      success_url: `${origin}/bwa-upload-working.html?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/bwa-upload-working.html?payment=cancelled`,
      
      // Metadata für Webhook (User-ID wird benötigt)
      metadata: {
        supabase_user_id: userId,
      },
      
      // Subscription Metadata
      subscription_data: {
        metadata: {
          supabase_user_id: userId,
        },
      },
      
      // Automatische Steuerberechnung für EU
      automatic_tax: {
        enabled: true,
      },
      
      // Promo-Codes erlauben
      allow_promotion_codes: true,
      
      // Rechnungs-Collection
      billing_address_collection: 'required',
      
      // Locale
      locale: 'de',
    })

    console.log(`✅ Checkout Session erstellt für User ${userId}`)

    return new Response(
      JSON.stringify({ 
        sessionId: session.id, 
        url: session.url 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Checkout Session Fehler:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Interner Server-Fehler' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
