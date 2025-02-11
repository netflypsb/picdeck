
import JSZip from 'jszip';
import { FREE_TEMPLATES, type Template } from './templates';
import { applyWatermark } from './watermarkProcessor';
import { supabase } from '@/integrations/supabase/client';

interface WatermarkSettings {
  type: 'image' | 'text';
  text?: string;
  imageUrl?: string;
  transparency: number;
  scale: number;
  placement: string;
  tiling: boolean;
  spacing: number;
}

interface ProcessingOptions {
  templates: Template[];
  customSize?: { width: number; height: number };
  preserveAspectRatio?: boolean;
  watermarkSettings?: WatermarkSettings;
  resizeMode?: 'fit' | 'fill';
}

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

export async function processImages(files: File[], options: ProcessingOptions): Promise<Blob> {
  if (files.length > 50) {
    throw new Error('Maximum of 50 images allowed per batch.');
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No authenticated session found');
    }

    const userId = session.user.id;
    const filePaths = [];

    // Upload original images
    for (const file of files) {
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError, data } = await supabase.storage
        .from('original-images')
        .upload(`${userId}/${fileName}`, file);

      if (uploadError) throw uploadError;
      filePaths.push(data.path);
    }

    // Process images using the edge function
    const { data: processedData, error: processError } = await supabase.functions.invoke(
      'batch-image-processing',
      {
        body: {
          userId,
          filePaths,
          templates: options.templates,
          watermarkSettings: options.watermarkSettings,
          resizeMode: options.resizeMode || 'fill',
        },
      }
    );

    if (processError) throw processError;

    // Download and package the processed images
    const zip = new JSZip();

    for (const image of processedData.processedImages) {
      const response = await fetch(image.url);
      const blob = await response.blob();
      zip.file(`${image.template}/${image.path.split('/').pop()}`, blob);
    }

    return await zip.generateAsync({ type: 'blob' });
  } catch (error) {
    console.error('Error in processImages:', error);
    throw error;
  }
}
