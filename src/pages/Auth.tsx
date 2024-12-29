import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { AlphaTestingBanner } from '@/components/AlphaTestingBanner';
import { useToast } from '@/components/ui/use-toast';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          return;
        }
        
        if (session?.user) {
          console.log('Initial session found:', session.user.id);
          handleAuthenticatedUser(session);
        }
      } catch (error) {
        console.error('Error in checkInitialSession:', error);
      }
    };
    
    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session) {
          console.log('User signed in:', session.user.id);
          handleAuthenticatedUser(session);
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          navigate('/');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          console.log('Token refreshed for user:', session.user.id);
        } else if (event === 'USER_UPDATED' && !session) {
          toast({
            title: "Account Deleted",
            description: "Your account has been successfully deleted.",
            variant: "destructive"
          });
          navigate('/');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleAuthenticatedUser = async (session) => {
    try {
      console.log('Handling authenticated user:', session.user.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user tier:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user profile. Please try again.",
          variant: "destructive"
        });
        return;
      }

      if (!profile) {
        console.log('No profile found, redirecting to free dashboard');
        navigate('/free-dashboard');
        return;
      }

      console.log('User profile loaded:', profile);
      const userTier = profile.tier;
      
      const dashboardRoutes = {
        'platinum': '/platinum-dashboard',
        'premium': '/premium-dashboard',
        'pro': '/pro-dashboard',
        'free': '/free-dashboard'
      };

      const route = dashboardRoutes[userTier] || '/free-dashboard';
      console.log('Redirecting to:', route);
      navigate(route);
    } catch (error) {
      console.error('Error in handleAuthenticatedUser:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      navigate('/free-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AlphaTestingBanner />
      <div className="flex-1 container max-w-lg mx-auto p-8">
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
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PicDeck. All rights reserved.</p>
      </footer>
    </div>
  );
}