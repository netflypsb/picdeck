import JSZip from 'jszip';
import { Template, ProcessingOptions } from './types';
import { applyWatermark } from './watermarkProcessor';

export async function processImage(
  file: File,
  template: Template,
  watermarkSettings?: any
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

      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/png',
        1.0
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImages(files: File[], options: ProcessingOptions): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    // If custom size is selected and no templates are selected, only process custom size
    const templates = options.customSize && (!options.templates || options.templates.length === 0)
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