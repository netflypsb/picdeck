import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { processImages } from '@/utils/pro/imageProcessor';
import { PRO_TEMPLATES } from '@/utils/pro/templates';

export function ProUploadSection() {
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
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
      const processedZip = await processImages(files, [...PRO_TEMPLATES]);

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

  return (
    <div className="mb-8">
      <UploadZone 
        className="border-2 border-primary/50 rounded-xl p-8 bg-secondary/20 backdrop-blur"
        maxFiles={20}
        onFilesSelected={handleFilesSelected}
      />

      {files.length > 0 && (
        <div className="space-y-6 mt-6">
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
    </div>
  );
}