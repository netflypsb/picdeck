import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        checkSubscriptionAndRedirect(session?.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSubscriptionAndRedirect = async (userId: string | undefined) => {
    if (!userId) return;
    
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      navigate('/');
      return;
    }

    if (profile?.subscription_status === 'active') {
      if (profile.subscription_tier === 'premium') {
        navigate('/premium-dashboard');
      } else if (profile.subscription_tier === 'pro') {
        navigate('/pro-dashboard');
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <div className="container max-w-md mx-auto mt-20 p-6">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="dark"
        providers={[]}
      />
    </div>
  );
}