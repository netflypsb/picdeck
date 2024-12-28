import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Image, Upload, Settings } from 'lucide-react';
import { Header } from '@/components/Header';

export default function PremiumDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
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
          {/* Premium Upload Zone */}
          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Premium Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UploadZone 
                onFilesSelected={(files) => console.log('Premium files:', files)}
                maxFiles={50}
                className="border-primary/50"
              />
              <p className="text-sm text-muted-foreground mt-4">
                Upload up to 50 images for premium templates including social media, banners, and thumbnails
              </p>
            </CardContent>
          </Card>

          {/* Ads Upload Zone */}
          <Card className="bg-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Ads Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UploadZone 
                onFilesSelected={(files) => console.log('Ads files:', files)}
                maxFiles={50}
                className="border-primary/50"
              />
              <p className="text-sm text-muted-foreground mt-4">
                Upload images for ad-specific templates including Google Ads, Meta Ads, and more
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-secondary/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Batch Processing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Process up to 50 images simultaneously with premium templates
              </p>
            </CardContent>
          </Card>

          <Card className="bg-secondary/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Customize watermarks, quality settings, and more
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2024 PicDeck. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4">
            <button onClick={() => navigate('/contact')} className="text-sm text-muted-foreground hover:text-primary">
              Contact
            </button>
            <button onClick={() => navigate('/privacy-policy')} className="text-sm text-muted-foreground hover:text-primary">
              Privacy
            </button>
            <button onClick={() => navigate('/terms-of-service')} className="text-sm text-muted-foreground hover:text-primary">
              Terms
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}