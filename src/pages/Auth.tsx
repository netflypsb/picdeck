import { useNavigate } from 'react-router-dom';
import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { AlphaTestingBanner } from '@/components/AlphaTestingBanner';
import { useToast } from '@/hooks/use-toast';
import { useAuthStateChange } from '@/hooks/useAuthStateChange';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useState, useEffect } from 'react';

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuthenticatedUser = async (session: Session) => {
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

  useAuthStateChange(handleAuthenticatedUser);

  // Move error handling to useEffect to monitor auth state
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleAuthenticatedUser(session);
      } else if (event === 'USER_DELETED') {
        toast({
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
        });
        navigate('/');
      } else if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Password Reset",
          description: "Please check your email to reset your password.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Handle auth state errors
  useEffect(() => {
    const handleAuthError = (error: AuthError) => {
      let message = "An error occurred during authentication.";

      if (error.message.includes("Email already registered")) {
        message = "This email is already associated with an account. Please sign in instead.";
      } else if (error.message.includes("Invalid login credentials")) {
        message = "The email or password you entered is incorrect. Please try again.";
      }

      setAuthError(message);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, error) => {
      if (error) {
        handleAuthError(error);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AlphaTestingBanner />
      <div className="flex-1 container max-w-lg mx-auto p-8">
        {authError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}
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