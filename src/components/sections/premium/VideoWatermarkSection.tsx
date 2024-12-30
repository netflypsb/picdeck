import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, Upload, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RESOLUTION = 1080;

export function VideoWatermarkSection() {
  const { toast } = useToast();
  const [video, setVideo] = useState<File | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('');
  const [position, setPosition] = useState('top-right');
  const [transparency, setTransparency] = useState([50]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const ffmpegRef = useRef(new FFmpeg());
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd';
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    setLoaded(true);
  };

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

  const getPositionFilter = (pos: string) => {
    const opacity = transparency[0] / 100;
    switch (pos) {
      case 'top-left': return `overlay=10:10:alpha=${opacity}`;
      case 'top-right': return `overlay=main_w-overlay_w-10:10:alpha=${opacity}`;
      case 'bottom-left': return `overlay=10:main_h-overlay_h-10:alpha=${opacity}`;
      case 'bottom-right': return `overlay=main_w-overlay_w-10:main_h-overlay_h-10:alpha=${opacity}`;
      default: return `overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:alpha=${opacity}`;
    }
  };

  const processVideo = async () => {
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

    try {
      setProcessing(true);
      setProgress(0);

      if (!loaded) {
        await load();
      }

      const ffmpeg = ffmpegRef.current;
      await ffmpeg.writeFile('input.mp4', await fetchFile(video));

      if (watermarkImage) {
        await ffmpeg.writeFile('watermark.png', await fetchFile(watermarkImage));
        
        await ffmpeg.exec([
          '-i', 'input.mp4',
          '-i', 'watermark.png',
          '-filter_complex', getPositionFilter(position),
          '-c:a', 'copy',
          'output.mp4'
        ]);
      } else if (watermarkText) {
        await ffmpeg.exec([
          '-i', 'input.mp4',
          '-vf', `drawtext=text='${watermarkText}':fontsize=24:fontcolor=white@${transparency[0]/100}:${getPositionFilter(position)}`,
          '-c:a', 'copy',
          'output.mp4'
        ]);
      }

      const data = await ffmpeg.readFile('output.mp4');
      const blob = new Blob([data], { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'watermarked_video.mp4';
      a.click();
      
      URL.revokeObjectURL(url);
      setProgress(100);
      
      toast({
        title: "Success",
        description: "Video has been processed and downloaded",
      });
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the video",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
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
            disabled={processing}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="watermark-image">Watermark Image (Optional)</Label>
          <Input
            id="watermark-image"
            type="file"
            accept="image/*"
            onChange={handleWatermarkImageUpload}
            disabled={processing}
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
            disabled={processing}
          />
        </div>

        <div className="space-y-2">
          <Label>Position</Label>
          <Select value={position} onValueChange={setPosition} disabled={processing}>
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
            disabled={processing}
          />
        </div>

        {processing && (
          <div className="space-y-2">
            <Label>Processing video...</Label>
            <Progress value={progress} />
          </div>
        )}

        <Button
          className="w-full"
          onClick={processVideo}
          disabled={processing || !video || (!watermarkImage && !watermarkText)}
        >
          {processing ? (
            <>Processing...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Apply Watermark
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}