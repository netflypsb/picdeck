import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthStateChange = (handleAuthenticatedUser: (session: Session) => void) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAndCleanSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          await supabase.auth.signOut();
          return;
        }
        
        if (session?.user) {
          console.log('Valid session found:', session.user.id);
          handleAuthenticatedUser(session);
        }
      } catch (error) {
        console.error('Error in checkAndCleanSession:', error);
        await supabase.auth.signOut();
      }
    };
    
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
            }
            break;
          
          case 'USER_UPDATED':
            if (!session) {
              toast({
                title: "Account Deleted",
                description: "Your account has been successfully deleted.",
                variant: "destructive"
              });
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