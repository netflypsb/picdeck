import JSZip from 'jszip';
import { Template } from './templates';

export type WatermarkPosition = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';

export interface WatermarkSettings {
  text: string;
  position: WatermarkPosition;
  opacity: number;
  fontSize: number;
}

const createImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const addWatermark = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  settings: WatermarkSettings
) => {
  const { text, position, opacity, fontSize } = settings;
  
  // Save context state
  ctx.save();
  
  // Set watermark style
  ctx.globalAlpha = opacity;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = fontSize / 25;
  
  // Calculate text metrics
  const metrics = ctx.measureText(text);
  const textWidth = metrics.width;
  const textHeight = fontSize;
  
  // Calculate position
  let x = 0;
  let y = 0;
  const padding = fontSize;
  
  switch (position) {
    case 'top-left':
      x = padding;
      y = padding + textHeight;
      break;
    case 'top-right':
      x = canvas.width - textWidth - padding;
      y = padding + textHeight;
      break;
    case 'center':
      x = (canvas.width - textWidth) / 2;
      y = (canvas.height + textHeight) / 2;
      break;
    case 'bottom-left':
      x = padding;
      y = canvas.height - padding;
      break;
    case 'bottom-right':
      x = canvas.width - textWidth - padding;
      y = canvas.height - padding;
      break;
  }
  
  // Add stroke to make text readable on any background
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  
  // Restore context state
  ctx.restore();
};

const resizeAndWatermark = async (
  file: File,
  template: Template,
  watermarkSettings: WatermarkSettings
): Promise<Blob> => {
  const img = await createImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Calculate scaling to maintain aspect ratio
  const scale = Math.min(
    template.width / img.width,
    template.height / img.height
  );
  const scaledWidth = img.width * scale;
  const scaledHeight = img.height * scale;

  // Center the image
  const x = (template.width - scaledWidth) / 2;
  const y = (template.height - scaledHeight) / 2;

  // Clear canvas and draw image
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, template.width, template.height);
  ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

  // Add watermark
  addWatermark(canvas, ctx, watermarkSettings);

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

export const processImagesWithWatermark = async (
  files: File[],
  templates: Template[],
  watermarkSettings: WatermarkSettings
): Promise<Blob> => {
  try {
    const zip = new JSZip();
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const results = await Promise.all(
          templates.map(async (template) => {
            const processed = await resizeAndWatermark(file, template, watermarkSettings);
            return {
              name: `${file.name.split('.')[0]}_${template.name.toLowerCase().replace(/\s+/g, '_')}.jpg`,
              blob: processed
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