import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Upload, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUserTier } from '@/hooks/use-user-tier';
import { UserRole } from '@/types/database';

export default function FreeDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tier, isLoading, tierData } = useUserTier();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }
        
        console.log('User session:', session.user.id);
        setIsAuthChecking(false);
      } catch (error) {
        console.error('Auth check error:', error);
        toast({
          title: "Authentication Error",
          description: "Please try signing in again",
          variant: "destructive"
        });
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, toast]);

  useEffect(() => {
    if (!isLoading && !isAuthChecking && tierData?.tier) {
      console.log('Current tier:', tierData.tier);
      
      if (tierData.tier !== 'free') {
        const dashboardRoutes: Record<UserRole, string> = {
          'alpha_tester': '/alpha-tester-dashboard',
          'premium': '/premium-dashboard',
          'pro': '/pro-dashboard',
          'free': '/free-dashboard'
        };

        const targetRoute = dashboardRoutes[tierData.tier];
        if (targetRoute) {
          console.log(`Redirecting ${tierData.tier} user to ${targetRoute}`);
          navigate(targetRoute, { replace: true });
          return;
        }
      }
    }
  }, [tier, isLoading, isAuthChecking, tierData, navigate]);

  if (isLoading || isAuthChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  // Only render the dashboard if the user is actually a free tier user
  if (tierData?.tier && tierData.tier !== 'free') {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Free Dashboard</h1>
        <Button onClick={() => navigate('/account')} variant="outline">
          Manage Account
        </Button>
      </div>

      <div className="bg-secondary/20 border border-primary/20 rounded-lg p-4 mb-8 flex items-center justify-between">
        <p className="text-muted-foreground">
          Free Tier - Includes "Made with PicDeck" watermark
        </p>
        <Button onClick={() => navigate('/pricing')} variant="default">
          Upgrade Now
        </Button>
      </div>

      <div className="mb-8">
        <UploadZone 
          onFilesSelected={(files) => {
            if (files.length > 5) {
              toast({
                title: "Upload limit exceeded",
                description: "Free tier allows up to 5 images per batch",
                variant: "destructive"
              });
              return;
            }
            // Handle file upload
          }}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-muted-foreground" />
              Basic Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Upgrade to Pro for higher quality processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-muted-foreground" />
              Limited Batch Upload
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Maximum 5 images per batch in Free tier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-muted-foreground" />
              Basic Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Access to standard social media templates
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}