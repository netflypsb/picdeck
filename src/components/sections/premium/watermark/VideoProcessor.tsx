import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { loadFFmpeg, getWatermarkFilter } from '@/utils/ffmpeg-config';

interface VideoProcessorProps {
  video: File | null;
  watermarkImage: File | null;
  watermarkText: string;
  position: string;
  transparency: number[];
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

export function VideoProcessor({
  video,
  watermarkImage,
  watermarkText,
  position,
  transparency,
  isProcessing,
  setIsProcessing,
}: VideoProcessorProps) {
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

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
      setIsProcessing(true);
      setProgress(0);

      const ffmpeg = new FFmpeg();
      console.log('Loading FFmpeg...');
      await loadFFmpeg(ffmpeg);
      console.log('FFmpeg loaded successfully');

      // Set a lower frame rate for faster processing
      const fps = 15;
      await ffmpeg.writeFile('input.mp4', await fetchFile(video));
      console.log('Video file written successfully');

      let filterComplex = '';
      if (watermarkImage) {
        await ffmpeg.writeFile('watermark.png', await fetchFile(watermarkImage));
        filterComplex = `fps=${fps},scale=-2:1080,overlay=${position}:alpha=${transparency[0]/100}`;
      } else if (watermarkText) {
        const filter = getWatermarkFilter(position, transparency[0])
          .replace('%TEXT%', watermarkText);
        filterComplex = `fps=${fps},scale=-2:1080,${filter}`;
      }

      console.log('Starting FFmpeg processing with filter:', filterComplex);
      await ffmpeg.exec([
        '-i', 'input.mp4',
        '-vf', filterComplex,
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-crf', '28',
        '-c:a', 'copy',
        'output.mp4'
      ]);
      console.log('FFmpeg processing completed');

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
        description: error.message || "An error occurred while processing the video",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">Processing video...</p>
        </div>
      )}

      <Button
        className="w-full"
        onClick={processVideo}
        disabled={isProcessing || !video || (!watermarkImage && !watermarkText)}
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Apply Watermark
          </>
        )}
      </Button>
    </div>
  );
}