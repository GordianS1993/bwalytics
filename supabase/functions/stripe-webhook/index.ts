// Supabase Edge Function: Stripe Webhook Handler
// 
// Verarbeitet Stripe Webhook Events und aktualisiert die Datenbank
// WICHTIG: Diese Function wird direkt von Stripe aufgerufen

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@14.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Stripe Client
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

// Supabase Client (Service Role für direkte DB-Zugriffe)
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET nicht gesetzt')
    return new Response('Webhook secret not configured', { status: 500 })
  }

  let event: Stripe.Event

  try {
    // Webhook-Signatur verifizieren (Sicherheit!)
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('❌ Webhook Signature Verification Failed:', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  console.log(`📨 Webhook Event empfangen: ${event.type}`)

  // Event-Type verarbeiten
  try {
    switch (event.type) {
      // ========================================
      // CHECKOUT ABGESCHLOSSEN
      // ========================================
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.supabase_user_id || session.client_reference_id

        if (!userId) {
          console.error('❌ Keine User-ID in Checkout Session gefunden')
          break
        }

        console.log(`💳 Checkout abgeschlossen für User: ${userId}`)

        // User auf Premium upgraden
        const { error } = await supabase
          .from('user_subscriptions')
          .upsert({
            user_id: userId,
            tier: 'premium',
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            status: 'active',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })

        if (error) {
          console.error('❌ Fehler beim Upgrade:', error)
        } else {
          console.log(`✅ User ${userId} erfolgreich auf Premium upgraded`)
        }

        break
      }

      // ========================================
      // SUBSCRIPTION AKTUALISIERT
      // ========================================
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (!userId) {
          console.error('❌ Keine User-ID in Subscription gefunden')
          break
        }

        console.log(`🔄 Subscription aktualisiert für User: ${userId}`)

        // Status aktualisieren
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (error) {
          console.error('❌ Fehler beim Update:', error)
        } else {
          console.log(`✅ Subscription Status aktualisiert: ${subscription.status}`)
        }

        break
      }

      // ========================================
      // SUBSCRIPTION GELÖSCHT/GEKÜNDIGT
      // ========================================
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata.supabase_user_id

        if (!userId) {
          console.error('❌ Keine User-ID in Subscription gefunden')
          break
        }

        console.log(`🚫 Subscription gekündigt für User: ${userId}`)

        // Downgrade zu Basic
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            tier: 'basic',
            status: 'cancelled',
            cancel_at_period_end: false,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)

        if (error) {
          console.error('❌ Fehler beim Downgrade:', error)
        } else {
          console.log(`✅ User ${userId} auf Basic downgraded`)
        }

        break
      }

      // ========================================
      // ZAHLUNG FEHLGESCHLAGEN
      // ========================================
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        console.log(`⚠️ Zahlung fehlgeschlagen für Customer: ${customerId}`)

        // Finde User anhand Stripe Customer ID
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (subscription) {
          // Status auf "past_due" setzen
          await supabase
            .from('user_subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', subscription.user_id)

          console.log(`⚠️ User ${subscription.user_id} auf "past_due" gesetzt`)
          
          // TODO: Email-Benachrichtigung an User senden
        }

        break
      }

      // ========================================
      // ZAHLUNG ERFOLGREICH
      // ========================================
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        console.log(`✅ Zahlung erfolgreich für Customer: ${customerId}`)

        // Finde User und setze Status zurück auf "active"
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (subscription) {
          await supabase
            .from('user_subscriptions')
            .update({
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('user_id', subscription.user_id)

          console.log(`✅ User ${subscription.user_id} Status: active`)
        }

        break
      }

      // ========================================
      // UNBEKANNTES EVENT
      // ========================================
      default:
        console.log(`ℹ️ Unbehandeltes Event: ${event.type}`)
    }

    return new Response(
      JSON.stringify({ received: true, type: event.type }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Event Processing Fehler:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
