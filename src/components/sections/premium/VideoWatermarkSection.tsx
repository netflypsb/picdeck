import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { VideoProcessor } from './watermark/VideoProcessor';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RESOLUTION = 1080;

export function VideoWatermarkSection() {
  const { toast } = useToast();
  const [video, setVideo] = useState<File | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [position, setPosition] = useState('top-right');
  const [transparency, setTransparency] = useState([50]);

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

    if (!['video/mp4', 'video/quicktime'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only .mp4 and .mov files are supported",
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
    toast({
      title: "Watermark image uploaded",
      description: "Your watermark image has been selected successfully"
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
        <div className="space-y-2">
          <Label htmlFor="video">Upload Video (Max 50MB, MP4 or MOV)</Label>
          <Input
            id="video"
            type="file"
            accept="video/mp4,video/quicktime"
            onChange={handleVideoUpload}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="watermark-image">Watermark Image (Optional)</Label>
          <Input
            id="watermark-image"
            type="file"
            accept="image/*"
            onChange={handleWatermarkImageUpload}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="watermark-text">Watermark Text (Optional)</Label>
          <Input
            id="watermark-text"
            type="text"
            value={watermarkText}
            onChange={(e) => setWatermarkText(e.target.value)}
            placeholder="Enter watermark text"
          />
        </div>

        <VideoProcessor
          video={video}
          watermarkImage={watermarkImage}
          watermarkText={watermarkText}
          position={position}
          transparency={transparency}
        />
      </CardContent>
    </Card>
  );
}