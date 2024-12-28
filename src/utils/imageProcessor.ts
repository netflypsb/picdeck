import JSZip from 'jszip';

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export type WatermarkSettings = {
  text: string;
  position: WatermarkPosition;
  opacity: number;
  fontSize: number;
};

export type Template = {
  name: string;
  width: number;
  height: number;
  platform: string;
};

// Export templates that were previously imported from templates.ts
export const TEMPLATES = [
  // Social Media Templates
  { name: 'Facebook Post', width: 1200, height: 630, platform: 'Facebook' },
  { name: 'Facebook Story', width: 1080, height: 1920, platform: 'Facebook' },
  { name: 'Instagram Post', width: 1080, height: 1080, platform: 'Instagram' },
  { name: 'Instagram Story', width: 1080, height: 1920, platform: 'Instagram' },
  { name: 'Twitter Post', width: 1200, height: 675, platform: 'Twitter' },
  { name: 'LinkedIn Post', width: 1200, height: 627, platform: 'LinkedIn' },
  { name: 'Pinterest Pin', width: 1000, height: 1500, platform: 'Pinterest' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, platform: 'YouTube' },
];

export async function processImages(files: File[]): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    const resizedImage = await processImage(file);
    zip.file(file.name, resizedImage);
  }

  return await zip.generateAsync({ type: 'blob' });
}

async function processImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImagesWithWatermark(
  files: File[],
  templates: Template[],
  watermarkSettings?: WatermarkSettings
): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    for (const template of templates) {
      const resizedImage = await processImageWithWatermark(
        file,
        template.width,
        template.height,
        watermarkSettings
      );
      
      // Create a filename that includes the template info
      const fileName = file.name.replace(
        /(\.[\w\d_-]+)$/i,
        `_${template.platform}_${template.width}x${template.height}$1`
      );
      
      zip.file(fileName, resizedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export async function processImageWithWatermark(
  file: File,
  width: number,
  height: number,
  watermarkSettings?: WatermarkSettings
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      
      // Calculate scaling to maintain aspect ratio
      const scale = Math.max(width / img.width, height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      
      // Center the image
      const x = (width - scaledWidth) / 2;
      const y = (height - scaledHeight) / 2;
      
      // Draw resized image
      ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      // Add watermark if settings provided
      if (watermarkSettings) {
        const { text, position, opacity, fontSize } = watermarkSettings;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'white';
        
        const metrics = ctx.measureText(text);
        const padding = 20;
        let textX = 0;
        let textY = 0;
        
        switch (position) {
          case 'top-left':
            textX = padding;
            textY = padding + fontSize;
            break;
          case 'top-right':
            textX = width - metrics.width - padding;
            textY = padding + fontSize;
            break;
          case 'bottom-left':
            textX = padding;
            textY = height - padding;
            break;
          case 'bottom-right':
            textX = width - metrics.width - padding;
            textY = height - padding;
            break;
          case 'center':
            textX = (width - metrics.width) / 2;
            textY = height / 2;
            break;
        }
        
        // Add text shadow for better visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(text, textX, textY);
        ctx.restore();
      }
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(file);
  });
}