import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

export interface UploadZoneProps {
  className?: string;
}

export function UploadZone({ className }: UploadZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Accepted files:', acceptedFiles);
    // Handle file upload logic here
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        // Do something with the file content
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed rounded-lg cursor-pointer bg-secondary/20 hover:bg-secondary/30 transition-colors",
        className
      )}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
}