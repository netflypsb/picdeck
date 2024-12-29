import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/Header';
import { MainUploadSection } from '@/components/sections/premium/MainUploadSection';
import { OutputSection } from '@/components/sections/premium/OutputSection';
import { WatermarkSection } from '@/components/sections/premium/WatermarkSection';
import { Button } from '@/components/ui/button';
import { Settings, User } from 'lucide-react';
import { useUserTier } from '@/hooks/use-user-tier';
import { useToast } from '@/components/ui/use-toast';

export default function PremiumDashboard() {
  const navigate = useNavigate();
  const { tier, isLoading } = useUserTier();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      if (!isLoading && tier !== 'premium') {
        toast({
          title: "Access Denied",
          description: "This dashboard is only available for Premium tier users.",
          variant: "destructive"
        });
        navigate('/free-dashboard');
      }
    };

    checkAuth();
  }, [tier, isLoading, navigate, toast]);

  const handleFormatChange = (format: string) => {
    console.log('Format changed:', format);
    // Add any additional format change handling logic here
  };

  const handleQualityChange = (isLossless: boolean) => {
    console.log('Quality changed:', isLossless);
    // Add any additional quality change handling logic here
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
          <h1 className="text-3xl font-bold">Premium Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/account')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Account
            </Button>
          </div>
        </div>

        <div className="space-y-8">
          <MainUploadSection />
          <OutputSection 
            onFormatChange={handleFormatChange}
            onQualityChange={handleQualityChange}
          />
          <WatermarkSection />
        </div>
      </main>
    </div>
  );
}