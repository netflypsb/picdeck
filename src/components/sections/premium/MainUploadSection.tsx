import { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { TEMPLATES, Template, processImages } from '@/utils/imageProcessor';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    if (template.name === 'All Templates') {
      if (selectedTemplates.some(t => t.name === 'All Templates')) {
        setSelectedTemplates([]);
      } else {
        setSelectedTemplates([template]);
      }
      return;
    }

    setSelectedTemplates(prev => {
      // Remove 'All Templates' if it was selected
      const filtered = prev.filter(t => t.name !== 'All Templates');
      
      const exists = filtered.some(t => t.name === template.name);
      if (exists) {
        return filtered.filter(t => t.name !== template.name);
      } else {
        return [...filtered, template];
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
        title: "No templates selected",
        description: "Please select at least one template or enable custom size.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      const processedZip = await processImages(files, {
        templates: selectedTemplates,
        customSize: useCustomSize ? { width: customWidth, height: customHeight } : undefined,
        preserveAspectRatio: true
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
            <Label>Templates</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border rounded-md">
              {Object.values(TEMPLATES).map((template) => (
                <div key={template.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={template.name}
                    checked={selectedTemplates.some(t => t.name === template.name)}
                    onCheckedChange={() => handleTemplateToggle(template)}
                  />
                  <label
                    htmlFor={template.name}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {template.name}
                    {template.name !== 'All Templates' && (
                      <span className="text-xs text-muted-foreground ml-1">
                        ({template.width}x{template.height})
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="custom-size"
                checked={useCustomSize}
                onCheckedChange={(checked) => setUseCustomSize(checked === true)}
              />
              <Label htmlFor="custom-size">Custom Size</Label>
            </div>

            {useCustomSize && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    min={1}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>
            )}
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