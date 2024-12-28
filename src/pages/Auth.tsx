import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/integrations/supabase/client'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

export default function Auth() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already authenticated
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        handleAuthenticatedUser(session)
      }
    }
    
    checkInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (event === 'SIGNED_IN' && session) {
          handleAuthenticatedUser(session)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleAuthenticatedUser = async (session) => {
    try {
      console.log('Handling authenticated user:', session.user.id)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', session.user.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user tier:', error)
        return
      }

      if (!profile) {
        console.log('No profile found, redirecting to free dashboard')
        navigate('/free-dashboard')
        return
      }

      console.log('User profile loaded:', profile)
      const userTier = profile.tier
      
      const dashboardRoutes = {
        'platinum': '/platinum-dashboard',
        'premium': '/premium-dashboard',
        'pro': '/pro-dashboard',
        'free': '/free-dashboard'
      }

      const route = dashboardRoutes[userTier] || '/free-dashboard'
      console.log('Redirecting to:', route)
      navigate(route)
    } catch (error) {
      console.error('Error in handleAuthenticatedUser:', error)
      navigate('/free-dashboard')
    }
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
    </div>
  )
}