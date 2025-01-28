import JSZip from 'jszip';
import { supabase } from '@/integrations/supabase/client';
import { Template } from './image/templates';

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
  watermarkSettings?: WatermarkSettings;
}

async function processImageWithEdgeFunction(
  file: File,
  template: Template,
): Promise<Blob> {
  console.log('Processing image with edge function:', { template });
  
  const formData = new FormData();
  formData.append('image', file);
  formData.append('width', template.width.toString());
  formData.append('height', template.height.toString());

  const { data, error } = await supabase.functions.invoke('process-image', {
    body: formData,
  });

  if (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }

  // Convert the response data to a Blob
  return new Blob([data], { type: 'image/jpeg' });
}

async function processImageLocally(file: File, template: Template): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = template.width;
      canvas.height = template.height;
      const ctx = canvas.getContext('2d')!;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const scale = Math.min(
        template.width / img.width,
        template.height / img.height
      );
      
      const x = (template.width - img.width * scale) / 2;
      const y = (template.height - img.height * scale) / 2;
      
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImage(
  file: File,
  template: Template,
  userTier: string = 'free'
): Promise<Blob> {
  try {
    if (userTier === 'premium' || userTier === 'platinum') {
      return await processImageWithEdgeFunction(file, template);
    } else {
      return await processImageLocally(file, template);
    }
  } catch (error) {
    console.error('Error in processImage:', error);
    throw error;
  }
}

export async function processImages(files: File[], options: ProcessingOptions): Promise<Blob> {
  const zip = new JSZip();
  const userTier = await getUserTier();
  
  for (const file of files) {
    const templates = options.customSize 
      ? [{ name: 'Custom Size', width: options.customSize.width, height: options.customSize.height }]
      : options.templates;

    for (const template of templates) {
      if (template.name === 'All Templates') continue;
      
      const processedImage = await processImage(file, template, userTier);
      const fileName = file.name.split('.')[0];
      const templateName = template.name.toLowerCase().replace(/\s+/g, '');
      const dimensions = `${template.width}x${template.height}`;
      const outputName = `${fileName}.${templateName}.${dimensions}.jpg`;
      
      zip.file(outputName, processedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

async function getUserTier(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'free';

  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single();

  return profile?.tier || 'free';
}