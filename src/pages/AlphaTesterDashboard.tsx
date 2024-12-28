import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Beaker, Image, Upload, Wand2 } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Alpha Tester Dashboard</h1>
        <span className="bg-purple-500/20 text-purple-500 px-4 py-2 rounded-full text-sm font-medium">
          Alpha Tester Version
        </span>
      </div>

      <div className="mb-8">
        <UploadZone 
          className="border-2 border-purple-500/50 rounded-xl p-8 bg-secondary/20 backdrop-blur"
          maxFiles={100}
          onFilesSelected={(files) => {
            if (files.length > 100) {
              toast({
                title: "Too many files",
                description: "Alpha testers can upload up to 100 images at once.",
                variant: "destructive"
              });
              return;
            }
            // Handle file upload
          }}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-purple-500" />
              Experimental Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access to upcoming features and experimental tools
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-purple-500" />
              Enhanced Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Upload and process up to 100 images simultaneously
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-purple-500" />
              AI Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Early access to AI-powered image processing
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}