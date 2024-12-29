import JSZip from 'jszip';

// Define social media templates
export const SOCIAL_TEMPLATES = {
  INSTAGRAM_POST: { name: 'Instagram Post', width: 1080, height: 1080 },
  FACEBOOK_COVER: { name: 'Facebook Cover', width: 820, height: 312 },
  WHATSAPP_PROFILE: { name: 'WhatsApp Profile', width: 500, height: 500 },
  TIKTOK_PROFILE: { name: 'TikTok Profile', width: 200, height: 200 },
  TIKTOK_POST: { name: 'TikTok Post', width: 1080, height: 1920 },
  YOUTUBE_POST: { name: 'YouTube Post', width: 1280, height: 720 },
  INSTAGRAM_STORY: { name: 'Instagram Story', width: 1080, height: 1920 },
  PINTEREST_PIN: { name: 'Pinterest Pin', width: 1000, height: 2100 },
} as const;

// Define ad templates
export const AD_TEMPLATES = {
  FACEBOOK_CAROUSEL: { name: 'Facebook Carousel', width: 1080, height: 1080 },
  FACEBOOK_STORY_AD: { name: 'Facebook Story Ad', width: 1080, height: 1920 },
  INSTAGRAM_STORY_AD: { name: 'Instagram Story Ad', width: 1080, height: 1920 },
  TIKTOK_PRODUCT: { name: 'TikTok Product', width: 800, height: 800 },
  GOOGLE_DISPLAY: { name: 'Google Display', width: 1200, height: 628 },
} as const;

export type Template = typeof SOCIAL_TEMPLATES[keyof typeof SOCIAL_TEMPLATES] | typeof AD_TEMPLATES[keyof typeof AD_TEMPLATES];

interface ProcessingOptions {
  template?: Template;
  customSize?: { width: number; height: number };
  watermark?: {
    text?: string;
    image?: File;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity: number;
  };
  outputFormat: 'png' | 'jpeg' | 'webp';
  preserveAspectRatio?: boolean;
}

export async function processImage(file: File, options: ProcessingOptions): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Set dimensions based on template or custom size
      const dimensions = options.template || options.customSize;
      if (!dimensions) throw new Error('No dimensions specified');
      
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      
      // Draw image with aspect ratio preservation if needed
      if (options.preserveAspectRatio) {
        const scale = Math.min(
          dimensions.width / img.width,
          dimensions.height / img.height
        );
        const x = (dimensions.width - img.width * scale) / 2;
        const y = (dimensions.height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      }
      
      // Add watermark if specified
      if (options.watermark?.text) {
        ctx.font = `${Math.max(dimensions.width, dimensions.height) * 0.02}px Arial`;
        ctx.fillStyle = `rgba(255, 255, 255, ${options.watermark.opacity})`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(options.watermark.text, dimensions.width - 10, dimensions.height - 10);
      }
      
      // Convert to specified format
      canvas.toBlob(
        (blob) => resolve(blob!),
        `image/${options.outputFormat}`,
        options.outputFormat === 'jpeg' ? 0.9 : undefined
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImages(files: File[], options: ProcessingOptions): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    const processedImage = await processImage(file, options);
    const fileName = file.name.replace(
      /(\.[\w\d_-]+)$/i,
      `_${options.template?.name || 'custom'}_${options.outputFormat}`
    );
    zip.file(fileName, processedImage);
  }

  return await zip.generateAsync({ type: 'blob' });
}