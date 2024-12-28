import { useState } from 'react';
import { Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadZone } from '@/components/UploadZone';
import { WatermarkControls } from '@/components/WatermarkControls';
import { TemplateSelector } from '@/components/TemplateSelector';
import { Template } from '@/utils/templates';
import { WatermarkSettings, processImagesWithWatermark } from '@/utils/imageProcessor';
import { useToast } from '@/components/ui/use-toast';

interface PremiumUploadZoneProps {
  templates: Template[];
  title: string;
  icon: typeof Crown;
  downloadPrefix: string;
}

export function PremiumUploadZone({ templates, title, icon: Icon, downloadPrefix }: PremiumUploadZoneProps) {
  const { toast } = useToast();
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkSettings, setWatermarkSettings] = useState<WatermarkSettings>({
    text: 'Premium Watermark',
    position: 'bottom-right',
    opacity: 0.5,
    fontSize: 24
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTemplateToggle = (template: Template) => {
    setSelectedTemplates(prev => {
      const isSelected = prev.some(t => 
        t.name === template.name && t.platform === template.platform
      );
      return isSelected
        ? prev.filter(t => t.name !== template.name || t.platform !== template.platform)
        : [...prev, template];
    });
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one image to process.",
        variant: "destructive"
      });
      return;
    }

    if (selectedTemplates.length === 0) {
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
        files,
        selectedTemplates,
        watermarkSettings
      );
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${downloadPrefix}_processed_images.zip`;
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

  return (
    <Card className="bg-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <UploadZone 
          onFilesSelected={(newFiles) => {
            if (newFiles.length + files.length > 50) {
              toast({
                title: "Too many files",
                description: "Premium users can upload up to 50 images at once.",
                variant: "destructive"
              });
              return;
            }
            setFiles(prev => [...prev, ...newFiles]);
            toast({
              title: "Files added",
              description: `${newFiles.length} file(s) added successfully.`
            });
          }}
          maxFiles={50}
          className="border-primary/50"
        />
        <WatermarkControls onChange={setWatermarkSettings} />
        <TemplateSelector
          templates={templates}
          selectedTemplates={selectedTemplates}
          onTemplateToggle={handleTemplateToggle}
        />
        <Button 
          className="w-full"
          onClick={handleProcess}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Process ${title}`}
        </Button>
      </CardContent>
    </Card>
  );
}