import React from 'react';
import { X } from 'lucide-react';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
  const [preview, setPreview] = React.useState<string>('');

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative group animate-fade-in">
      <img
        src={preview}
        alt={file.name}
        className="w-full h-32 object-cover rounded-lg"
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="absolute top-2 right-2 p-1 bg-background/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="mt-2 text-sm text-muted-foreground truncate">{file.name}</p>
    </div>
  );
}