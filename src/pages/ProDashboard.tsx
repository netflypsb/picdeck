import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Image, Download, Upload } from 'lucide-react';

export default function ProDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', session.user.id)
      .single();

    if (error || !profile || profile.subscription_tier !== 'pro' || profile.subscription_status !== 'active') {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Pro Dashboard</h1>
        <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium">
          Pro Version
        </span>
      </div>

      <div className="mb-8">
        <UploadZone className="border-2 border-primary/50 rounded-xl p-8 bg-secondary/20 backdrop-blur" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
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

        <Card>
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

        <Card>
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