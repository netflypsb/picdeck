import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Wand2, Upload, Settings } from 'lucide-react';

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Premium Dashboard</h1>
        <span className="bg-gradient-to-r from-primary to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
          Premium Version
        </span>
      </div>

      <div className="mb-8">
        <UploadZone className="border-2 border-gradient-to-r from-primary to-purple-500 rounded-xl p-8 bg-secondary/20 backdrop-blur shadow-lg" />
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Premium Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access to all premium templates and features
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Extended Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Process up to 50 images simultaneously
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
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
              <Settings className="h-5 w-5 text-primary" />
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