import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

export interface UploadZoneProps {
  onFilesSelected?: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
}

export function UploadZone({ onFilesSelected, className = '', maxFiles = 5 }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected?.(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted'
      } ${className}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold text-foreground">Drop your images here</h3>
      <p className="text-sm text-muted-foreground mt-2">
        or click to select files
      </p>
      <p className="text-xs text-muted-foreground mt-2">
        Supports: PNG, JPG, GIF (up to {maxFiles} files)
      </p>
    </div>
  );
}