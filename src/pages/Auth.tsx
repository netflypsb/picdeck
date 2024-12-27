import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useUserTier } from '@/hooks/use-user-tier'

export default function Auth() {
  const navigate = useNavigate()
  const { tier } = useUserTier()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          // Redirect based on user's tier
          switch (tier) {
            case 'pro':
              navigate('/pro-dashboard')
              break
            case 'premium':
              navigate('/premium-dashboard')
              break
            default:
              navigate('/free-dashboard')
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, tier])

  return (
    <div className="container max-w-lg mx-auto p-8">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
      />
    </div>
  )
}