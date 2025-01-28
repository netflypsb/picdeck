import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';

export type Template = {
  name: string;
  width: number;
  height: number;
};

export interface WatermarkSettings {
  type: 'image' | 'text';
  imageFile?: File;
  text?: string;
  font?: string;
  color?: string;
  transparency: number;
  scale: number;
  placement: 'top-left' | 'center' | 'bottom-right';
  tiling: boolean;
  spacing: number;
}

interface ProcessingOptions {
  templates: Template[];
  customSize?: { width: number; height: number };
  preserveAspectRatio?: boolean;
  watermarkSettings?: WatermarkSettings;
  userTier?: 'free' | 'pro' | 'premium' | 'platinum';
}

function calculatePosition(
  canvas: HTMLCanvasElement,
  watermarkWidth: number,
  watermarkHeight: number,
  placement: string
): { x: number; y: number } {
  let x = 0, y = 0;
  
  switch (placement) {
    case 'top-left':
      x = 10;
      y = 10;
      break;
    case 'center':
      x = (canvas.width - watermarkWidth) / 2;
      y = (canvas.height - watermarkHeight) / 2;
      break;
    case 'bottom-right':
      x = canvas.width - watermarkWidth - 10;
      y = canvas.height - watermarkHeight - 10;
      break;
  }
  
  return { x, y };
}

function generateTilingPositions(
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  spacing: number
): Array<{ x: number; y: number }> {
  const positions = [];
  for (let y = 0; y < canvasHeight; y += watermarkHeight + spacing) {
    for (let x = 0; x < canvasWidth; x += watermarkWidth + spacing) {
      positions.push({ x, y });
    }
  }
  return positions;
}

async function applyWatermark(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  settings: WatermarkSettings
): Promise<void> {
  ctx.save();
  ctx.globalAlpha = settings.transparency / 100;

  if (settings.type === 'image' && settings.imageFile) {
    const watermarkImg = await createImageBitmap(settings.imageFile);
    const scaledWidth = canvas.width * (settings.scale / 100);
    const scaledHeight = (watermarkImg.height / watermarkImg.width) * scaledWidth;

    if (settings.tiling) {
      const positions = generateTilingPositions(
        canvas.width,
        canvas.height,
        scaledWidth,
        scaledHeight,
        settings.spacing
      );
      positions.forEach(({ x, y }) => {
        ctx.drawImage(watermarkImg, x, y, scaledWidth, scaledHeight);
      });
    } else {
      const { x, y } = calculatePosition(canvas, scaledWidth, scaledHeight, settings.placement);
      ctx.drawImage(watermarkImg, x, y, scaledWidth, scaledHeight);
    }
  } else if (settings.type === 'text' && settings.text) {
    const fontSize = Math.floor(canvas.width * (settings.scale / 100));
    ctx.font = `${fontSize}px ${settings.font || 'Arial'}`;
    ctx.fillStyle = settings.color || '#000000';
    
    const metrics = ctx.measureText(settings.text);
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    if (settings.tiling) {
      const positions = generateTilingPositions(
        canvas.width,
        canvas.height,
        metrics.width,
        textHeight,
        settings.spacing
      );
      positions.forEach(({ x, y }) => {
        ctx.fillText(settings.text!, x, y + textHeight);
      });
    } else {
      const { x, y } = calculatePosition(canvas, metrics.width, textHeight, settings.placement);
      ctx.fillText(settings.text, x, y + textHeight);
    }
  }

  ctx.restore();
}

async function processImageWithEdgeFunction(file: File, template: Template): Promise<Blob> {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('width', template.width.toString());
  formData.append('height', template.height.toString());

  const { data, error } = await supabase.functions.invoke('process-image', {
    body: formData,
  });

  if (error) {
    console.error('Edge function error:', error);
    throw new Error('Failed to process image with edge function');
  }

  return new Blob([data], { type: 'image/png' });
}

async function processImageLocally(file: File, template: Template, watermarkSettings?: WatermarkSettings): Promise<Blob> {
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

export async function processImage(
  file: File,
  template: Template,
  options: { watermarkSettings?: WatermarkSettings; userTier?: string } = {}
): Promise<Blob> {
  const { watermarkSettings, userTier } = options;

  if (userTier === 'platinum') {
    try {
      return await processImageWithEdgeFunction(file, template);
    } catch (error) {
      console.warn('Edge function failed, falling back to local processing:', error);
      return processImageLocally(file, template, watermarkSettings);
    }
  }

  return processImageLocally(file, template, watermarkSettings);
}

export async function processImages(files: File[], options: ProcessingOptions): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    const templates = options.customSize 
      ? [{ name: 'Custom Size', width: options.customSize.width, height: options.customSize.height }]
      : options.templates;

    for (const template of templates) {
      const processedImage = await processImage(file, template, {
        watermarkSettings: options.watermarkSettings,
        userTier: options.userTier
      });
      
      const fileName = file.name.split('.')[0];
      const templateName = template.name.toLowerCase().replace(/\s+/g, '');
      const dimensions = `${template.width}x${template.height}`;
      const outputName = `${fileName}.${templateName}.${dimensions}.png`;
      
      zip.file(outputName, processedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}
