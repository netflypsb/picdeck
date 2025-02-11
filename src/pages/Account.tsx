import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { AlphaTestingBanner } from '@/components/AlphaTestingBanner';
import { SubscriptionCard } from '@/components/account/SubscriptionCard';
import { PasswordCard } from '@/components/account/PasswordCard';
import { SupportCard } from '@/components/account/SupportCard';
import { LogOut, ArrowLeft } from 'lucide-react';
import { useUserTier } from '@/hooks/use-user-tier';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Account() {
  const navigate = useNavigate();
  const { tier } = useUserTier();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
    }
  };

  const handleLogout = async () => {
    try {
      // First, clear any existing local storage data
      localStorage.clear(); // Clear all local storage data
      
      // Attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }

      // Always navigate to home page, even if there was an error
      navigate('/');
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, navigate to home
      navigate('/');
    }
  };

  const handleBackToDashboard = () => {
    switch (tier) {
      case 'platinum':
        navigate('/platinum-dashboard');
        break;
      case 'premium':
        navigate('/premium-dashboard');
        break;
      case 'pro':
        navigate('/pro-dashboard');
        break;
      default:
        navigate('/free-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AlphaTestingBanner />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Account Management</h1>
            <Button 
              variant="outline" 
              onClick={handleBackToDashboard}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <SubscriptionCard />
          <PasswordCard />
          <SupportCard />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                <AlertDialogDescription>
                  You will need to sign in again to access your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} PicDeck. All rights reserved.</p>
      </footer>
    </div>
  );
}