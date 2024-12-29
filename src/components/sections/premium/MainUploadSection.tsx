import { useState, useRef } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Template, processImages } from '@/utils/imageProcessor';
import { TemplateSelector } from './TemplateSelector';
import { CustomSizeInput } from './CustomSizeInput';
import { WatermarkSection } from './WatermarkSection';

export function MainUploadSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
  const { toast } = useToast();
  const MAX_FILES = 50;
  const watermarkRef = useRef<{ getWatermarkSettings: () => any }>(null);

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

  const handleTemplateToggle = (template: Template) => {
    setSelectedTemplates(prev => {
      const exists = prev.some(t => t.name === template.name);
      if (exists) {
        return prev.filter(t => t.name !== template.name);
      } else {
        return [...prev, template];
      }
    });
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

    if (!selectedTemplates.length && !useCustomSize) {
      toast({
        title: "No output format selected",
        description: "Please select at least one template or enable custom size.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const watermarkSettings = watermarkRef.current?.getWatermarkSettings();
      console.log('Watermark settings:', watermarkSettings);
      
      const processedZip = await processImages(files, {
        templates: useCustomSize ? [] : selectedTemplates,
        customSize: useCustomSize ? { width: customWidth, height: customHeight } : undefined,
        preserveAspectRatio: true,
        watermarkSettings
      });

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
      console.error('Processing error:', error);
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

  const canProcess = files?.length > 0 && (selectedTemplates.length > 0 || useCustomSize);

  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Upload Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TemplateSelector
          selectedTemplates={selectedTemplates}
          onTemplateToggle={handleTemplateToggle}
        />

        <CustomSizeInput
          useCustomSize={useCustomSize}
          customWidth={customWidth}
          customHeight={customHeight}
          onCustomSizeChange={setUseCustomSize}
          onWidthChange={setCustomWidth}
          onHeightChange={setCustomHeight}
        />

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
                disabled={isProcessing || !canProcess}
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
