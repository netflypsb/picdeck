import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Image, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUserTier } from '@/hooks/use-user-tier';

export default function ProDashboard() {
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

    if (tier !== 'pro' && tier !== 'premium') {
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Pro Dashboard</h1>
        <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
          Pro Version
        </span>
      </div>

      <div className="mb-8">
        <UploadZone 
          className="border-2 border-primary/50 rounded-xl p-8 bg-secondary/20 backdrop-blur"
          maxFiles={20}
          onFilesSelected={(files) => {
            if (files.length > 20) {
              toast({
                title: "Too many files",
                description: "Pro users can upload up to 20 images at once.",
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
              <Shield className="h-5 w-5 text-primary" />
              No Watermarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All your resized images come without any watermarks
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Batch Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Upload and process up to 20 images at once
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              Pro Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access to all professional social media templates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}