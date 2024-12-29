import { ImagePreview } from "@/components/ImagePreview";

interface WatermarkImagePreviewProps {
  imageFile: File;
  onRemove: () => void;
}

export function WatermarkImagePreview({ imageFile, onRemove }: WatermarkImagePreviewProps) {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Watermark Preview</h4>
      <div className="w-32">
        <ImagePreview
          file={imageFile}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}