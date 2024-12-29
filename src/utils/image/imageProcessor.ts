import JSZip from 'jszip';
import { Template } from './types';
import { applyWatermark, WatermarkSettings } from './watermarkProcessor';
import { processImageWithOutputSettings, OutputSettings } from './outputProcessor';

export async function processImage(
  file: File,
  template: Template,
  watermarkSettings?: WatermarkSettings,
  outputSettings?: OutputSettings
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = template.width;
      canvas.height = template.height;
      
      const scale = Math.min(
        template.width / img.width,
        template.height / img.height
      );
      const x = (template.width - img.width * scale) / 2;
      const y = (template.height - img.height * scale) / 2;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      if (watermarkSettings) {
        await applyWatermark(ctx, canvas, watermarkSettings);
      }

      // Convert canvas to buffer for sharp processing
      const imageBuffer = await new Promise<Buffer>((resolve) => {
        canvas.toBlob(async (blob) => {
          const arrayBuffer = await blob!.arrayBuffer();
          resolve(Buffer.from(arrayBuffer));
        }, 'image/png');
      });

      // Apply output settings if provided, otherwise use default PNG
      const processedBuffer = outputSettings 
        ? await processImageWithOutputSettings(imageBuffer, outputSettings)
        : imageBuffer;

      resolve(new Blob([processedBuffer], { type: `image/${outputSettings?.format || 'png'}` }));
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
    outputSettings?: OutputSettings;
  }
): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    const templates = options.customSize 
      ? [{ name: 'Custom Size', width: options.customSize.width, height: options.customSize.height }]
      : options.templates;

    for (const template of templates) {
      if (template.name === 'All Templates') continue;
      
      const processedImage = await processImage(
        file, 
        template, 
        options.watermarkSettings,
        options.outputSettings
      );
      
      const fileName = file.name.split('.')[0];
      const templateName = template.name.toLowerCase().replace(/\s+/g, '');
      const dimensions = `${template.width}x${template.height}`;
      const extension = options.outputSettings?.format || 'png';
      const outputName = `${fileName}.${templateName}.${dimensions}.${extension}`;
      
      zip.file(outputName, processedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export * from './types';
export * from './templates';