import JSZip from 'jszip';
import { Template } from './types';
import { applyWatermark, WatermarkSettings } from './watermarkProcessor';

export async function processImage(
  file: File,
  template: Template,
  watermarkSettings?: WatermarkSettings
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Set canvas dimensions to template size
      canvas.width = template.width;
      canvas.height = template.height;
      
      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(
        template.width / img.width,
        template.height / img.height
      );
      const x = (template.width - img.width * scale) / 2;
      const y = (template.height - img.height * scale) / 2;
      
      // Fill background with white
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the scaled image
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Apply watermark if settings are provided
      if (watermarkSettings) {
        console.log('Applying watermark for template:', template.name);
        await applyWatermark(ctx, canvas, watermarkSettings);
      }

      // Convert to blob
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/png',
        1.0
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImages(
  files: File[], 
  options: {
    templates: Template[];
    customSize?: { width: number; height: number };
    watermarkSettings?: WatermarkSettings;
  }
): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    // Use custom size if specified, otherwise use templates
    const templates = options.customSize 
      ? [{ name: 'Custom Size', width: options.customSize.width, height: options.customSize.height }]
      : options.templates;

    for (const template of templates) {
      if (template.name === 'All Templates') continue;
      
      console.log('Processing template:', template.name, 'with watermark settings:', options.watermarkSettings);
      
      const processedImage = await processImage(file, template, options.watermarkSettings);
      const fileName = file.name.split('.')[0];
      const templateName = template.name.toLowerCase().replace(/\s+/g, '');
      const dimensions = `${template.width}x${template.height}`;
      const outputName = `${fileName}.${templateName}.${dimensions}.png`;
      
      zip.file(outputName, processedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export * from './types';
export * from './templates';