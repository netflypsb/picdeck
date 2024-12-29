import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthStateChange = (handleAuthenticatedUser: (session: Session) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clear any existing sessions that might be corrupted
    const clearExistingSession = async () => {
      try {
        await supabase.auth.signOut();
        localStorage.removeItem('supabase.auth.token');
        console.log('Cleared existing session');
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    };

    const checkAndCleanSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          await clearExistingSession();
          return;
        }
        
        if (session?.user) {
          console.log('Valid session found:', session.user.id);
          handleAuthenticatedUser(session);
        }
      } catch (error) {
        console.error('Error in checkAndCleanSession:', error);
        await clearExistingSession();
      }
    };
    
    // Run initial session check
    checkAndCleanSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        switch (event) {
          case 'SIGNED_IN':
            if (session) {
              console.log('User signed in:', session.user.id);
              handleAuthenticatedUser(session);
            }
            break;
          
          case 'SIGNED_OUT':
            console.log('User signed out');
            navigate('/');
            break;
          
          case 'TOKEN_REFRESHED':
            if (session) {
              console.log('Token refreshed for user:', session.user.id);
              handleAuthenticatedUser(session);
            }
            break;
          
          case 'USER_UPDATED':
            if (!session) {
              toast({
                title: "Session Expired",
                description: "Please sign in again.",
                variant: "destructive"
              });
              await clearExistingSession();
              navigate('/');
            }
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, handleAuthenticatedUser]);
};