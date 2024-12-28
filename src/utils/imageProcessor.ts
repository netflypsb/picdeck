import JSZip from 'jszip';

export interface Template {
  name: string;
  width: number;
  height: number;
  description?: string;
}

export const TEMPLATES: Template[] = [
  {
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    description: 'Square format for Instagram feed posts'
  },
  {
    name: 'Facebook Cover',
    width: 851,
    height: 315,
    description: 'Facebook page cover image'
  },
  {
    name: 'Twitter Post',
    width: 1200,
    height: 675,
    description: 'Standard Twitter post image'
  },
  {
    name: 'LinkedIn Banner',
    width: 1584,
    height: 396,
    description: 'Professional LinkedIn profile banner'
  },
  {
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    description: 'YouTube video thumbnail'
  }
];

const createImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const resizeImage = async (
  file: File,
  targetWidth: number,
  targetHeight: number
): Promise<Blob> => {
  const img = await createImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Calculate scaling to maintain aspect ratio
  const scale = Math.min(
    targetWidth / img.width,
    targetHeight / img.height
  );
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  // Center the image
  const x = (targetWidth - scaledWidth) / 2;
  const y = (targetHeight - scaledHeight) / 2;

  // Clear canvas and draw image
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

  // Clean up
  URL.revokeObjectURL(img.src);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        throw new Error('Could not create image blob');
      }
    }, 'image/jpeg', 0.9);
  });
};

export const processImages = async (files: File[]): Promise<Blob> => {
  try {
    const zip = new JSZip();
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const results = await Promise.all(
          TEMPLATES.map(async (template) => {
            const resized = await resizeImage(file, template.width, template.height);
            return {
              name: `${file.name.split('.')[0]}_${template.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
              blob: resized
            };
          })
        );
        return results;
      })
    );

    // Add all processed images to the zip file
    processedFiles.flat().forEach(({ name, blob }) => {
      zip.file(name, blob);
    });

    // Generate the zip file
    return await zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error processing images:', error);
    throw error;
  }
};