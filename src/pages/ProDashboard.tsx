import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserTier } from '@/hooks/use-user-tier';
import { ProHeader } from '@/components/sections/pro/ProHeader';
import { ProUploadSection } from '@/components/sections/pro/ProUploadSection';
import { ProFeatures } from '@/components/sections/pro/ProFeatures';

export default function ProDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tier } = useUserTier();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    if (import.meta.env.DEV) {
      setIsLoading(false);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    if (tier !== 'pro' && tier !== 'premium' && tier !== 'platinum') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only available for Pro tier users.",
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
    <div className="container mx-auto px-4 py-8">
      <ProHeader />
      <ProUploadSection />
      <ProFeatures />
    </div>
  );
}