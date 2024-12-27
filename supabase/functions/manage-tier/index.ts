import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, userId, tier, duration } = await req.json()

    switch (action) {
      case 'assign':
        const startDate = new Date()
        const endDate = tier === 'free' ? null : new Date(startDate.getTime() + duration * 86400000)

        const { error: assignError } = await supabase
          .from('user_tiers')
          .upsert({
            user_id: userId,
            tier,
            start_date: startDate.toISOString(),
            end_date: endDate?.toISOString(),
            stripe_subscription_id: tier === 'free' ? null : `placeholder-${Date.now()}`,
            stripe_status: tier === 'free' ? null : 'active'
          })

        if (assignError) throw assignError

        return new Response(
          JSON.stringify({ message: 'Tier assigned successfully' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'check':
        const { data: tierData, error: checkError } = await supabase
          .from('user_tiers')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (checkError) throw checkError

        return new Response(
          JSON.stringify(tierData),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      default:
        throw new Error('Invalid action')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})