import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useUserTier } from '@/hooks/use-user-tier'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function Auth() {
  const navigate = useNavigate()
  const { tier, isLoading } = useUserTier()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in, waiting for tier data...')
          
          // Wait for tier data to be loaded
          const waitForTier = () => {
            if (!isLoading) {
              console.log('Routing user with tier:', tier)
              
              // Map tier to dashboard route
              const dashboardRoutes = {
                'platinum': '/platinum-dashboard',
                'premium': '/premium-dashboard',
                'pro': '/pro-dashboard',
                'free': '/free-dashboard'
              }
              
              const route = dashboardRoutes[tier] || '/free-dashboard'
              console.log('Navigating to:', route)
              navigate(route)
            } else {
              console.log('Tier data still loading, retrying...')
              setTimeout(waitForTier, 100)
            }
          }

          waitForTier()
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, tier, isLoading])

  if (isLoading) {
    return (
      <div className="container max-w-lg mx-auto p-8 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container max-w-lg mx-auto p-8">
      <SupabaseAuth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          style: {
            input: {
              color: 'white',
              backgroundColor: 'hsl(var(--secondary))',
            },
            button: {
              backgroundColor: 'hsl(var(--primary))',
              color: 'white',
            },
            anchor: {
              color: 'hsl(var(--primary))',
            },
          },
          variables: {
            default: {
              colors: {
                brand: 'hsl(var(--primary))',
                brandAccent: 'hsl(var(--primary))',
              },
            },
          },
        }}
        providers={['google']}
        localization={{
          variables: {
            sign_in: {
              email_label: 'Email address',
              password_label: 'Password',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              button_label: 'Sign in',
              loading_button_label: 'Signing in ...',
              social_provider_text: 'Sign in with {{provider}}',
              link_text: 'Already have an account? Sign in',
            },
            sign_up: {
              email_label: 'Email address',
              password_label: 'Create a Password',
              email_input_placeholder: 'Your email address',
              password_input_placeholder: 'Your password',
              button_label: 'Sign up',
              loading_button_label: 'Signing up ...',
              social_provider_text: 'Sign up with {{provider}}',
              link_text: "Don't have an account? Sign up",
              confirmation_text: 'Check your email for the confirmation link',
            },
          },
        }}
      />
      <div className="mt-4 flex items-center space-x-2">
        <Checkbox
          id="showPassword"
          checked={showPassword}
          onCheckedChange={(checked) => setShowPassword(checked as boolean)}
        />
        <Label htmlFor="showPassword" className="text-foreground">Show password</Label>
      </div>
    </div>
  )
}