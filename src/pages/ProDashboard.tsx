import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Image, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserTier } from '@/hooks/use-user-tier';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function ProDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { tier } = useUserTier();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
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

  const handleFilesSelected = (newFiles: File[]) => {
    if (files.length + newFiles.length > 20) {
      toast({
        title: "Too many files",
        description: "Pro users can upload up to 20 images at once.",
        variant: "destructive"
      });
      return;
    }
    setFiles(prev => [...prev, ...newFiles]);
    toast({
      title: "Files added",
      description: `${newFiles.length} files added successfully.`
    });
  };

  const handleProcessImages = async () => {
    if (!files.length) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to process.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const { data, error } = await supabase.functions.invoke('process-pro-images', {
        body: formData,
      });

      if (error) throw error;

      // Create download links for processed images
      data.results.forEach((result: any) => {
        result.processed.forEach((processed: any) => {
          const link = document.createElement('a');
          link.href = processed.url;
          link.download = `${result.originalName}_${processed.template}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      });

      toast({
        title: "Success",
        description: "Your images have been processed and downloaded.",
      });
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Error",
        description: "Failed to process images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
      setFiles([]);
    }
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
          onFilesSelected={handleFilesSelected}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
          
          <Button
            className="w-full"
            onClick={handleProcessImages}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Process Images'}
          </Button>

          {isProcessing && (
            <Progress value={progress} className="w-full" />
          )}
        </div>
      )}

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