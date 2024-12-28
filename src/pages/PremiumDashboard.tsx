import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Image, Upload, Settings } from 'lucide-react';
import { Header } from '@/components/Header';
import { TemplateSelector } from '@/components/TemplateSelector';
import { Template, premiumTemplates, adTemplates } from '@/utils/templates';
import { useToast } from '@/components/ui/use-toast';
import { WatermarkControls } from '@/components/WatermarkControls';
import { processImagesWithWatermark, WatermarkSettings } from '@/utils/imageProcessor';
import { Button } from '@/components/ui/button';

export default function PremiumDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPremiumTemplates, setSelectedPremiumTemplates] = useState<Template[]>([]);
  const [selectedAdTemplates, setSelectedAdTemplates] = useState<Template[]>([]);
  const [premiumFiles, setPremiumFiles] = useState<File[]>([]);
  const [adFiles, setAdFiles] = useState<File[]>([]);
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    text: 'Premium Watermark',
    position: 'bottom-right',
    opacity: 0.5,
    fontSize: 24
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data: userTier } = await supabase
      .from('user_tiers')
      .select('tier')
      .eq('user_id', session.user.id)
      .single();

    if (!userTier || userTier.tier !== 'premium') {
      toast({
        title: "Access Denied",
        description: "This dashboard is only available for Premium tier users.",
        variant: "destructive"
      });
      navigate('/free-dashboard');
    }
  };

  const handlePremiumTemplateToggle = (template: Template) => {
    setSelectedPremiumTemplates(prev => {
      const isSelected = prev.some(t => 
        t.name === template.name && t.platform === template.platform
      );
      
      if (isSelected) {
        return prev.filter(t => 
          t.name !== template.name || t.platform !== template.platform
        );
      } else {
        return [...prev, template];
      }
    });
  };

  const handleAdTemplateToggle = (template: Template) => {
    setSelectedAdTemplates(prev => {
      const isSelected = prev.some(t => 
        t.name === template.name && t.platform === template.platform
      );
      
      if (isSelected) {
        return prev.filter(t => 
          t.name !== template.name || t.platform !== template.platform
        );
      } else {
        return [...prev, template];
      }
    });
  };

  const handlePremiumProcess = async () => {
    if (premiumFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one image to process.",
        variant: "destructive"
      });
      return;
    }

    if (selectedPremiumTemplates.length === 0) {
      toast({
        title: "No templates selected",
        description: "Please select at least one template.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const zipBlob = await processImagesWithWatermark(
        premiumFiles,
        selectedPremiumTemplates,
        watermarkSettings
      );
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'premium_processed_images.zip';
      link.click();
      URL.revokeObjectURL(link.href);

      toast({
        title: "Success!",
        description: "Your images have been processed and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error processing images",
        description: error instanceof Error ? error.message : "An error occurred while processing your images.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdProcess = async () => {
    if (adFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one image to process.",
        variant: "destructive"
      });
      return;
    }

    if (selectedAdTemplates.length === 0) {
      toast({
        title: "No templates selected",
        description: "Please select at least one template.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const zipBlob = await processImagesWithWatermark(
        adFiles,
        selectedAdTemplates,
        watermarkSettings
      );
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'ad_processed_images.zip';
      link.click();
      URL.revokeObjectURL(link.href);

      toast({
        title: "Success!",
        description: "Your ad images have been processed and downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error processing images",
        description: error instanceof Error ? error.message : "An error occurred while processing your images.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
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
            <CardContent className="space-y-6">
              <UploadZone 
                onFilesSelected={(files) => {
                  if (files.length + premiumFiles.length > 50) {
                    toast({
                      title: "Too many files",
                      description: "Premium users can upload up to 50 images at once.",
                      variant: "destructive"
                    });
                    return;
                  }
                  setPremiumFiles(prev => [...prev, ...files]);
                  toast({
                    title: "Files added",
                    description: `${files.length} file(s) added successfully.`
                  });
                }}
                maxFiles={50}
                className="border-primary/50"
              />
              <WatermarkControls onChange={setWatermarkSettings} />
              <TemplateSelector
                templates={premiumTemplates}
                selectedTemplates={selectedPremiumTemplates}
                onTemplateToggle={handlePremiumTemplateToggle}
              />
              <Button 
                className="w-full"
                onClick={handlePremiumProcess}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Process Premium Images"}
              </Button>
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
            <CardContent className="space-y-6">
              <UploadZone 
                onFilesSelected={(files) => {
                  if (files.length + adFiles.length > 50) {
                    toast({
                      title: "Too many files",
                      description: "Premium users can upload up to 50 images at once.",
                      variant: "destructive"
                    });
                    return;
                  }
                  setAdFiles(prev => [...prev, ...files]);
                  toast({
                    title: "Files added",
                    description: `${files.length} file(s) added successfully.`
                  });
                }}
                maxFiles={50}
                className="border-primary/50"
              />
              <WatermarkControls onChange={setWatermarkSettings} />
              <TemplateSelector
                templates={adTemplates}
                selectedTemplates={selectedAdTemplates}
                onTemplateToggle={handleAdTemplateToggle}
              />
              <Button 
                className="w-full"
                onClick={handleAdProcess}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Process Ad Images"}
              </Button>
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