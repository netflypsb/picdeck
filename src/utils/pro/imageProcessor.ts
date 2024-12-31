import JSZip from 'jszip';
import { ProTemplate } from './templates';

export async function processImage(file: File, template: ProTemplate): Promise<Blob> {
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
      
      // Convert to high-quality PNG for lossless output
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png', 1.0);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImages(files: File[], selectedTemplates: ProTemplate[]): Promise<Blob> {
  if (files.length > 20) {
    throw new Error('Maximum of 20 images allowed per batch for Pro tier.');
  }

  const zip = new JSZip();
  
  for (const file of files) {
    for (const template of selectedTemplates) {
      const processedImage = await processImage(file, template);
      const fileName = file.name.replace(
        /(\.[\w\d_-]+)$/i,
        `_${template.name.replace(/\s+/g, '')}_${template.width}x${template.height}.png`
      );
      zip.file(fileName, processedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}