import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserTierData {
  tier: 'free' | 'pro' | 'premium' | 'platinum';
  isLoading: boolean;
}

export const useUserTier = () => {
  const [tierData, setTierData] = useState<UserTierData>({
    tier: 'free',
    isLoading: true,
  });

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setTierData({ tier: 'free', isLoading: false });
          return;
        }

        console.log('Fetching tier for user:', session.user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user tier:', error);
          setTierData({ tier: 'free', isLoading: false });
          return;
        }

        console.log('User profile data:', profile);
        setTierData({ 
          tier: profile.tier as UserTierData['tier'], 
          isLoading: false 
        });
      } catch (error) {
        console.error('Error in useUserTier:', error);
        setTierData({ tier: 'free', isLoading: false });
      }
    };

    fetchUserTier();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      fetchUserTier();
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return {
    tier: tierData.tier,
    isLoading: tierData.isLoading,
    tierData,
  };
};