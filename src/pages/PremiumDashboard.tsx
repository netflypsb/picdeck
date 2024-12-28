import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Crown, Image, Upload, Settings } from 'lucide-react';
import { Header } from '@/components/Header';
import { premiumTemplates, adTemplates } from '@/utils/templates';
import { useToast } from '@/components/ui/use-toast';
import { PremiumUploadZone } from '@/components/premium/PremiumUploadZone';
import { FeatureCard } from '@/components/premium/FeatureCard';
import { Footer } from '@/components/premium/Footer';
import { useUserTier } from '@/hooks/use-user-tier';

export default function PremiumDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tier } = useUserTier();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    if (tier !== 'premium' && tier !== 'alpha_tester') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only available for Premium tier users.",
        variant: "destructive"
      });
      navigate('/free-dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Premium Dashboard</h1>
          <span className="bg-gradient-to-r from-primary to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Premium Version
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <PremiumUploadZone
            templates={premiumTemplates}
            title="Premium Upload"
            icon={Crown}
            downloadPrefix="premium"
          />
          <PremiumUploadZone
            templates={adTemplates}
            title="Ads Upload"
            icon={Image}
            downloadPrefix="ad"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FeatureCard
            icon={Upload}
            title="Batch Processing"
            description="Process up to 50 images simultaneously with premium templates"
          />
          <FeatureCard
            icon={Settings}
            title="Advanced Settings"
            description="Customize watermarks, quality settings, and more"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}