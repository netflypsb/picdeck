import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUserTier } from '@/hooks/use-user-tier';

export default function AlphaTesterDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tier } = useUserTier();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    if (tier !== 'alpha_tester') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only available for Alpha Testers.",
        variant: "destructive"
      });
      navigate('/free-dashboard');
      return;
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Alpha Tester Dashboard</h1>
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Alpha Tester
          </span>
        </div>

        <div className="bg-secondary/20 border border-primary/20 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, Alpha Tester!</h2>
          <p className="text-muted-foreground mb-4">
            You have exclusive access to test new features before they're released. Your feedback is valuable in shaping the future of our platform.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/premium-dashboard')} variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Premium Features
            </Button>
            <Button onClick={() => navigate('/contact')} variant="default" className="flex items-center gap-2">
              Provide Feedback
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Alpha features will be added here */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <div className="bg-secondary/10 border border-primary/10 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                New experimental features will appear here as they become available for testing.
                Stay tuned for updates!
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Alpha Tester Program • Confidential
          </p>
        </div>
      </footer>
    </div>
  );
}