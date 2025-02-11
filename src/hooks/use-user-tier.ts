
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserTierData {
  tier: 'free' | 'platinum';
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
    let mounted = true;

    const fetchUserTier = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('No session found, setting tier to free');
          if (mounted) {
            setTierData({ tier: 'free', isLoading: false });
          }
          return;
        }

        console.log('Fetching tier for user:', session.user.id);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user tier:', error);
          if (mounted) {
            setTierData({ tier: 'free', isLoading: false });
          }
          return;
        }

        if (!profile) {
          console.log('No profile found, setting tier to free');
          if (mounted) {
            setTierData({ tier: 'free', isLoading: false });
          }
          return;
        }

        // If tier is pro or premium, set it to free
        const newTier = profile.tier === 'platinum' ? 'platinum' : 'free';
        
        console.log('User profile data:', profile);
        if (mounted) {
          setTierData({ 
            tier: newTier, 
            isLoading: false 
          });
        }
      } catch (error) {
        console.error('Error in useUserTier:', error);
        if (mounted) {
          setTierData({ tier: 'free', isLoading: false });
        }
      }
    };

    fetchUserTier();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      console.log('Auth state changed:', event);
      if (mounted) {
        fetchUserTier();
      }
    });

    return () => {
      mounted = false;
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
