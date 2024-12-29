import JSZip from 'jszip';

export const SOCIAL_TEMPLATES = {
  ALL: { name: 'All Templates', width: 0, height: 0 },
  FACEBOOK_CAROUSEL: { name: 'Facebook Carousel Ad', width: 1080, height: 1080 },
  FACEBOOK_COVER: { name: 'Facebook Cover', width: 820, height: 312 },
  FACEBOOK_EVENT: { name: 'Facebook Event Cover Photo', width: 1920, height: 1005 },
  FACEBOOK_GROUP: { name: 'Facebook Group Cover Photo', width: 1640, height: 856 },
  FACEBOOK_PROFILE: { name: 'Facebook Profile Picture', width: 170, height: 170 },
  FACEBOOK_SHARED: { name: 'Facebook Shared Image Post', width: 1200, height: 630 },
  FACEBOOK_STORY_AD: { name: 'Facebook Story Ad', width: 1080, height: 1920 },
  GOOGLE_ADS: { name: 'Google Ads', width: 1200, height: 628 },
  INSTAGRAM_IGTV: { name: 'Instagram IGTV Cover', width: 420, height: 654 },
  INSTAGRAM_LANDSCAPE: { name: 'Instagram Landscape Post', width: 1080, height: 566 },
  INSTAGRAM_PORTRAIT: { name: 'Instagram Portrait Post', width: 1080, height: 1350 },
  INSTAGRAM_POST: { name: 'Instagram Post', width: 1080, height: 1080 },
  INSTAGRAM_STORY: { name: 'Instagram Story', width: 1080, height: 1920 },
  INSTAGRAM_STORY_AD: { name: 'Instagram Story Ad', width: 1080, height: 1920 },
  LINKEDIN_GROUP: { name: 'LinkedIn Group Banner', width: 1400, height: 425 },
  PINTEREST_LONG: { name: 'Pinterest Long Pin', width: 1000, height: 2100 },
  TELEGRAM_BANNER: { name: 'Telegram Channel Banner', width: 1280, height: 720 },
  TELEGRAM_PROFILE: { name: 'Telegram Profile Picture', width: 512, height: 512 },
  TELEGRAM_SHARED: { name: 'Telegram Shared Image', width: 1280, height: 1280 },
  TIKTOK_POST: { name: 'TikTok Post', width: 1080, height: 1920 },
  TIKTOK_PROFILE: { name: 'TikTok Profile', width: 200, height: 200 },
  TIKTOK_STORE_HEADER: { name: 'TikTok Store Product Header', width: 1200, height: 628 },
  TIKTOK_STORE_THUMB: { name: 'TikTok Store Product Thumbnail', width: 800, height: 800 },
  TWITTER_FLEET: { name: 'Twitter Fleet', width: 1080, height: 1920 },
  WHATSAPP_PROFILE: { name: 'WhatsApp Profile', width: 500, height: 500 },
  WHATSAPP_STATUS: { name: 'WhatsApp Status', width: 1080, height: 1920 },
  YOUTUBE_BANNER: { name: 'YouTube Channel Banner', width: 2560, height: 1440 },
  YOUTUBE_PLAYLIST: { name: 'YouTube Playlist Thumbnail', width: 1280, height: 720 },
  YOUTUBE_POST: { name: 'YouTube Post', width: 1280, height: 720 },
  YOUTUBE_SHORTS: { name: 'YouTube Shorts Thumbnail', width: 1080, height: 1920 }
};

export type Template = {
  name: string;
  width: number;
  height: number;
};

interface WatermarkSettings {
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
  outputFormat?: string;
  watermarkSettings?: WatermarkSettings;
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
    const templates = options.customSize 
      ? [{ name: 'Custom Size', width: options.customSize.width, height: options.customSize.height }]
      : options.templates;

    for (const template of templates) {
      if (template.name === 'All Templates') continue;
      
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
