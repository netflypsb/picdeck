import { UploadZone } from '@/components/UploadZone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface UploadSectionProps {
  title: string;
  maxFiles: number;
  onFilesSelected: (files: File[]) => void;
  onProcess: () => void;
  isProcessing: boolean;
}

export function UploadSection({ 
  title, 
  maxFiles, 
  onFilesSelected, 
  onProcess,
  isProcessing 
}: UploadSectionProps) {
  const { toast } = useToast();

  return (
    <Card className="bg-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <UploadZone 
          onFilesSelected={(files) => {
            if (files.length > maxFiles) {
              toast({
                title: "Too many files",
                description: `You can upload up to ${maxFiles} images at once.`,
                variant: "destructive"
              });
              return;
            }
            onFilesSelected(files);
          }}
          maxFiles={maxFiles}
          className="border-primary/50"
        />
        <Button 
          className="w-full"
          onClick={onProcess}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : `Process ${title}`}
        </Button>
      </CardContent>
    </Card>
  );
}