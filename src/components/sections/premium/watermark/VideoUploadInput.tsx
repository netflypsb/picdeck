import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface VideoUploadInputProps {
  onVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoRemove: () => void;
  video: File | null;
  isProcessing: boolean;
}

export function VideoUploadInput({ 
  onVideoUpload, 
  onVideoRemove, 
  video, 
  isProcessing 
}: VideoUploadInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="video">Upload Video (Max 50MB, MP4 only)</Label>
      <div className="relative">
        <Input
          id="video"
          type="file"
          accept="video/mp4"
          onChange={onVideoUpload}
          disabled={isProcessing}
        />
        {video && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={onVideoRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {video && (
        <p className="text-sm text-muted-foreground">
          Selected: {video.name}
        </p>
      )}
    </div>
  );
}