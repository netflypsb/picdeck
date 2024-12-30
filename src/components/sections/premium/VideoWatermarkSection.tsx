import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VideoProcessor } from './watermark/VideoProcessor';
import { VideoUploadInput } from './watermark/VideoUploadInput';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RESOLUTION = 1080;

export function VideoWatermarkSection() {
  const { toast } = useToast();
  const [video, setVideo] = useState<File | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [position, setPosition] = useState('top-right');
  const [transparency, setTransparency] = useState([50]);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateVideo = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        const isValidResolution = video.videoHeight <= MAX_RESOLUTION && 
                                video.videoWidth <= MAX_RESOLUTION;
        
        if (!isValidResolution) {
          toast({
            title: "Invalid resolution",
            description: `Video resolution must not exceed ${MAX_RESOLUTION}p`,
            variant: "destructive"
          });
        }
        resolve(isValidResolution);
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Video size must be under 50 MB",
        variant: "destructive"
      });
      return;
    }

    if (file.type !== 'video/mp4') {
      toast({
        title: "Invalid file type",
        description: "Only MP4 files are supported",
        variant: "destructive"
      });
      return;
    }

    const isValidResolution = await validateVideo(file);
    if (!isValidResolution) return;

    setVideo(file);
    toast({
      title: "Video uploaded",
      description: "Your video has been selected successfully"
    });
  };

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setWatermarkImage(file);
    setWatermarkText(''); // Clear text watermark when image is selected
    toast({
      title: "Watermark image uploaded",
      description: "Your watermark image has been selected successfully"
    });
  };

  const handleWatermarkTextChange = (text: string) => {
    setWatermarkText(text);
    if (text) {
      setWatermarkImage(null); // Clear image watermark when text is entered
    }
  };

  const removeVideo = () => {
    setVideo(null);
    toast({
      title: "Video removed",
      description: "The video has been removed"
    });
  };

  const removeWatermarkImage = () => {
    setWatermarkImage(null);
    toast({
      title: "Watermark image removed",
      description: "The watermark image has been removed"
    });
  };

  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          Video Watermarking Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <VideoUploadInput
          onVideoUpload={handleVideoUpload}
          onVideoRemove={removeVideo}
          video={video}
          isProcessing={isProcessing}
        />

        <div className="space-y-2">
          <Label htmlFor="watermark-image">Watermark Image (Optional)</Label>
          <div className="relative">
            <Input
              id="watermark-image"
              type="file"
              accept="image/*"
              onChange={handleWatermarkImageUpload}
              disabled={!!watermarkText || isProcessing}
            />
            {watermarkImage && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={removeWatermarkImage}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="watermark-text">Watermark Text (Optional)</Label>
          <Input
            id="watermark-text"
            type="text"
            value={watermarkText}
            onChange={(e) => handleWatermarkTextChange(e.target.value)}
            placeholder="Enter watermark text"
            disabled={!!watermarkImage || isProcessing}
          />
        </div>

        <VideoProcessor
          video={video}
          watermarkImage={watermarkImage}
          watermarkText={watermarkText}
          position={position}
          transparency={transparency}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </CardContent>
    </Card>
  );
}