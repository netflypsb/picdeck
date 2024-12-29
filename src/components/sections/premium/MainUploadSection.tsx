import { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  SOCIAL_TEMPLATES, 
  AD_TEMPLATES, 
  processImages,
  Template 
} from '@/utils/imageProcessor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function MainUploadSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(SOCIAL_TEMPLATES.INSTAGRAM_POST);
  const { toast } = useToast();
  const MAX_FILES = 50;

  const handleFilesSelected = (newFiles: File[]) => {
    if (files && files.length + newFiles.length > MAX_FILES) {
      toast({
        title: "Too many files",
        description: `Maximum of ${MAX_FILES} images allowed per batch.`,
        variant: "destructive"
      });
      return;
    }
    setFiles(prev => prev ? [...prev, ...newFiles] : newFiles);
    toast({
      title: "Files added",
      description: `${newFiles.length} files added successfully.`
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev?.filter((_, i) => i !== index));
  };

  const handleProcessImages = async () => {
    if (!files?.length) {
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
      const processedZip = await processImages(files, {
        template: selectedTemplate,
        outputFormat: 'jpeg',
        preserveAspectRatio: true,
        watermark: {
          text: 'Processed with PicDeck',
          position: 'bottom-right',
          opacity: 0.5
        }
      });

      // Create download link
      const url = URL.createObjectURL(processedZip);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'processed_images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Images processed and downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while processing images.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Template</label>
            <Select
              value={selectedTemplate.name}
              onValueChange={(value) => {
                const template = Object.values({ ...SOCIAL_TEMPLATES, ...AD_TEMPLATES })
                  .find(t => t.name === value);
                if (template) setSelectedTemplate(template);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custom">Custom Size</SelectItem>
                {Object.values(SOCIAL_TEMPLATES).map((template) => (
                  <SelectItem key={template.name} value={template.name}>
                    {template.name} ({template.width}x{template.height})
                  </SelectItem>
                ))}
                {Object.values(AD_TEMPLATES).map((template) => (
                  <SelectItem key={template.name} value={template.name}>
                    {template.name} ({template.width}x{template.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <UploadZone 
          onFilesSelected={handleFilesSelected}
          maxFiles={MAX_FILES}
          className="border-primary/20"
        />
        
        {files && files.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {files.map((file, index) => (
                <ImagePreview
                  key={index}
                  file={file}
                  onRemove={() => removeFile(index)}
                />
              ))}
            </div>

            {isProcessing && (
              <Progress value={progress} className="w-full" />
            )}

            <div className="flex justify-center">
              <Button
                onClick={handleProcessImages}
                disabled={isProcessing}
                className="w-full md:w-auto"
              >
                <Download className="mr-2 h-4 w-4" />
                {isProcessing ? 'Processing...' : 'Process & Download'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}