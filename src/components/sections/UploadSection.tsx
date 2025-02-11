
import { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download } from 'lucide-react';
import { processImages } from '@/utils/image/imageProcessor';

export function UploadSection() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFilesSelected = (newFiles: File[]) => {
    if (files.length + newFiles.length > 5) {
      toast({
        title: "Too many files",
        description: "Maximum of 5 images allowed per batch.",
        variant: "destructive"
      });
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
    toast({
      title: "Images added",
      description: `${newFiles.length} image${newFiles.length > 1 ? 's' : ''} added successfully.`
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcessImages = async () => {
    if (files.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one image to process.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const zipBlob = await processImages(files, {
        templates: [], // Use default templates for free tier
        resizeMode: 'fill' // Default to fill mode for free tier
      });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'processed_images.zip';
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
    <section id="upload-section" className="space-y-6">
      <UploadZone onFilesSelected={handleFilesSelected} />
      
      {files.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <ImagePreview
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleProcessImages}
              disabled={isProcessing}
            >
              {isProcessing ? (
                "Processing..."
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Process and Download
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
