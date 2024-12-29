import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Template, processImages } from '@/utils/imageProcessor';
import { TemplateSelector } from './TemplateSelector';
import { CustomSizeInput } from './CustomSizeInput';
import { UploadZone } from '@/components/UploadZone';
import { UploadHeader } from './upload/UploadHeader';
import { ProcessingButton } from './upload/ProcessingButton';
import { UploadedImages } from './upload/UploadedImages';

interface MainUploadSectionProps {
  onProcessStart?: () => any;
  onProcessComplete?: () => void;
}

export function MainUploadSection({ 
  onProcessStart, 
  onProcessComplete
}: MainUploadSectionProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedTemplates, setSelectedTemplates] = useState<Template[]>([]);
  const [useCustomSize, setUseCustomSize] = useState(false);
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1080);
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
      const watermarkSettings = onProcessStart?.();
      console.log('Processing with watermark settings:', watermarkSettings);

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
      
      onProcessComplete?.();
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
      <UploadHeader />
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
        
        <UploadedImages
          files={files}
          onRemove={removeFile}
          isProcessing={isProcessing}
          progress={progress}
        />

        {files && files.length > 0 && (
          <ProcessingButton
            isProcessing={isProcessing}
            canProcess={canProcess}
            onClick={handleProcessImages}
          />
        )}
      </CardContent>
    </Card>
  );
}