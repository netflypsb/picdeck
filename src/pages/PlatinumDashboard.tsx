import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Wand2, Upload, Settings } from 'lucide-react';
import { useUserTier } from '@/hooks/use-user-tier';
import { useToast } from '@/components/ui/use-toast';

export default function PlatinumDashboard() {
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

      // Only check tier and redirect if we have loaded the tier data
      if (!isLoading && tier !== 'platinum') {
        toast({
          title: "Access Denied",
          description: "This dashboard is only available for Platinum tier users.",
          variant: "destructive"
        });
        navigate('/free-dashboard');
      }
    };

    checkAuth();
  }, [tier, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Platinum Dashboard</h1>
        <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-medium">
          Platinum Version
        </span>
      </div>

      <div className="mb-8">
        <UploadZone className="border-2 border-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-8 bg-secondary/20 backdrop-blur shadow-lg" />
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              Platinum Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access to all platinum templates and features
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-yellow-400" />
              Extended Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Process up to 100 images simultaneously
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-yellow-400" />
              Custom Watermarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Add your own custom watermarks to images
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-yellow-400" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Fine-tune every aspect of your image processing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}