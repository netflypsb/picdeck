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

  const assignTier = async (userId: string, newTier: UserTierData['tier']) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ tier: newTier })
        .eq('id', userId);

      if (error) throw error;

      setTierData(prev => ({ ...prev, tier: newTier }));
      return { error: null };
    } catch (error) {
      console.error('Error assigning tier:', error);
      return { error };
    }
  };

  useEffect(() => {
    const fetchUserTier = async () => {
      try {
        // Clear any cached session data
        await supabase.auth.refreshSession();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, setting tier to free');
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

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state changed:', event);
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
    assignTier,
  };
};