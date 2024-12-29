import JSZip from 'jszip';
import { FREE_TEMPLATES, type Template } from './templates';
import { applyWatermark } from './watermarkProcessor';

export async function processImage(file: File, template: Template): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = template.width;
      canvas.height = template.height;
      const ctx = canvas.getContext('2d')!;
      
      // Fill background with white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(
        template.width / img.width,
        template.height / img.height
      );
      
      // Center the image
      const x = (template.width - img.width * scale) / 2;
      const y = (template.height - img.height * scale) / 2;
      
      // Draw resized image
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      // Add watermark
      applyWatermark(ctx, template.width, template.height);
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImages(files: File[]): Promise<Blob> {
  if (files.length > 5) {
    throw new Error('Maximum of 5 images allowed per batch.');
  }

  const zip = new JSZip();
  
  for (const file of files) {
    for (const template of FREE_TEMPLATES) {
      const processedImage = await processImage(file, template);
      const fileName = file.name.replace(
        /(\.[\w\d_-]+)$/i,
        `_${template.name.replace(/\s+/g, '')}_${template.width}x${template.height}$1`
      );
      zip.file(fileName, processedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

// Export templates for convenience
export { FREE_TEMPLATES };