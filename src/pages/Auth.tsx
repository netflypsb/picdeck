import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { useUserTier } from '@/hooks/use-user-tier'
import { useToast } from '@/hooks/use-toast'

export default function Auth() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { tier, isLoading, tierData } = useUserTier()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Wait for tier data to be loaded before redirecting
          if (!isLoading && tierData) {
            console.log('Auth - Current tier:', tierData.tier)
            console.log('Auth - User ID:', session.user.id)
            
            switch (tierData.tier) {
              case 'alpha_tester':
                navigate('/alpha-tester-dashboard')
                break
              case 'premium':
                navigate('/premium-dashboard')
                break
              case 'pro':
                navigate('/pro-dashboard')
                break
              case 'free':
                navigate('/free-dashboard')
                break
              default:
                console.error('Unknown tier:', tierData.tier)
                toast({
                  title: "Error",
                  description: "Unable to determine user tier",
                  variant: "destructive"
                })
                navigate('/free-dashboard')
            }
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, isLoading, tierData, toast])

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
        view="sign_in"
      />
    </div>
  )
}