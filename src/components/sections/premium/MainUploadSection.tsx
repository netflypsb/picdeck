import { useState } from 'react';
import { UploadZone } from '@/components/UploadZone';
import { ImagePreview } from '@/components/ImagePreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function MainUploadSection() {
  const [files, setFiles] = useState<File[]>();
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
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev?.filter((_, i) => i !== index));
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
        <UploadZone 
          onFilesSelected={handleFilesSelected}
          maxFiles={MAX_FILES}
          className="border-primary/20"
        />
        
        {files && files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {files.map((file, index) => (
              <ImagePreview
                key={index}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}