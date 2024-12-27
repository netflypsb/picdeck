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
  const { tier } = useUserTier()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
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
              password_input: showPassword ? 'text' : 'password',
            },
            sign_up: {
              password_input: showPassword ? 'text' : 'password',
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