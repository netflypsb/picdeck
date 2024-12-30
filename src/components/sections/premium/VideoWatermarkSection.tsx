import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function VideoWatermarkSection() {
  const { toast } = useToast();
  const [video, setVideo] = useState<File | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [position, setPosition] = useState('top-right');
  const [transparency, setTransparency] = useState([50]);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Video size must be under 100 MB",
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

  const handleSubmit = () => {
    if (!video) {
      toast({
        title: "No video selected",
        description: "Please upload a video first",
        variant: "destructive"
      });
      return;
    }

    if (!watermarkImage && !watermarkText) {
      toast({
        title: "No watermark",
        description: "Please add either an image or text watermark",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Coming Soon",
      description: "Video watermarking feature will be available soon!",
      variant: "default"
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
          <Label htmlFor="video">Upload Video (Max 100MB, MP4 or MOV)</Label>
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

        <div className="space-y-2">
          <Label>Position</Label>
          <Select value={position} onValueChange={setPosition}>
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="top-left">Top Left</SelectItem>
              <SelectItem value="top-right">Top Right</SelectItem>
              <SelectItem value="bottom-left">Bottom Left</SelectItem>
              <SelectItem value="bottom-right">Bottom Right</SelectItem>
              <SelectItem value="center">Center</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Transparency ({transparency}%)</Label>
          <Slider
            value={transparency}
            onValueChange={setTransparency}
            min={0}
            max={100}
            step={1}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={!video || (!watermarkImage && !watermarkText)}
        >
          <Upload className="mr-2 h-4 w-4" />
          Apply Watermark
        </Button>
      </CardContent>
    </Card>
  );
}