import React, { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Image as ImageIcon } from 'lucide-react';
import { TEMPLATES, processImages } from '@/utils/imageProcessor';

export default function Index() {
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
      const zipBlob = await processImages(files);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'resized_images.zip';
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
    <div className="min-h-screen p-6 flex flex-col gap-8 max-w-5xl mx-auto">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          PicDeck
        </h1>
        <p className="text-xl text-muted-foreground">
          Batch resize your images for social media in seconds
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-8 text-center">
        {TEMPLATES.map((template) => (
          <div
            key={template.name}
            className="p-6 rounded-lg bg-secondary/50 backdrop-blur-sm"
          >
            <ImageIcon className="w-8 h-8 mx-auto mb-4 text-primary" />
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-muted-foreground">
              {template.width} x {template.height}px
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
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
    </div>
  );
}