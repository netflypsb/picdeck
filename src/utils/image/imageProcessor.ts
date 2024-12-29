import JSZip from 'jszip';
import sharp from 'sharp';
import { Template, ProcessingOptions } from './types';
import { applyWatermark } from './watermarkProcessor';

export async function processImage(
  file: File,
  template: Template,
  options: ProcessingOptions
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

      if (options.watermarkSettings) {
        await applyWatermark(ctx, canvas, options.watermarkSettings);
      }

      // Convert canvas to buffer for sharp processing
      const imageBuffer = await new Promise<Buffer>((resolve) => {
        canvas.toBlob(async (blob) => {
          const arrayBuffer = await blob!.arrayBuffer();
          resolve(Buffer.from(arrayBuffer));
        }, 'image/png');
      });

      // Always use PNG with lossless quality
      const processedBuffer = await sharp(imageBuffer)
        .png({
          quality: 100,
          compressionLevel: 0
        })
        .toBuffer();

      resolve(new Blob([processedBuffer], { type: 'image/png' }));
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImages(files: File[], options: ProcessingOptions): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    const templates = options.customSize 
      ? [{ name: 'Custom Size', width: options.customSize.width, height: options.customSize.height }]
      : options.templates;

    for (const template of templates) {
      if (template.name === 'All Templates') continue;
      
      const processedImage = await processImage(file, template, options);
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