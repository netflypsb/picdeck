import { ImagePreview } from "@/components/ImagePreview";
import { Progress } from "@/components/ui/progress";

interface UploadedImagesProps {
  files: File[];
  onRemove: (index: number) => void;
  isProcessing: boolean;
  progress: number;
}

export function UploadedImages({ files, onRemove, isProcessing, progress }: UploadedImagesProps) {
  if (!files.length) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file, index) => (
          <ImagePreview
            key={index}
            file={file}
            onRemove={() => onRemove(index)}
          />
        ))}
      </div>

      {isProcessing && (
        <Progress value={progress} className="w-full" />
      )}
    </div>
  );
}