import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';

export const SOCIAL_TEMPLATES = {
  INSTAGRAM_POST: { name: 'Instagram Post', width: 1080, height: 1080 },
  FACEBOOK_COVER: { name: 'Facebook Cover', width: 820, height: 312 },
  WHATSAPP_PROFILE: { name: 'WhatsApp Profile', width: 500, height: 500 },
  TIKTOK_PROFILE: { name: 'TikTok Profile', width: 200, height: 200 },
  TIKTOK_POST: { name: 'TikTok Post', width: 1080, height: 1920 },
  YOUTUBE_POST: { name: 'YouTube Post', width: 1280, height: 720 },
} as const;

export type Template = typeof SOCIAL_TEMPLATES[keyof typeof SOCIAL_TEMPLATES];

export interface ProcessingOptions {
  templates: Template[];
  customSize?: { width: number; height: number };
  preserveAspectRatio?: boolean;
  watermarkSettings?: any;
}

export async function processImages(files: File[], options: ProcessingOptions): Promise<Blob> {
  if (files.length > 5) {
    throw new Error('Maximum of 5 images allowed per batch.');
  }

  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const { data, error } = await supabase.functions.invoke('process-images', {
    body: formData,
  });

  if (error) {
    console.error('Error processing images:', error);
    throw new Error('Failed to process images');
  }

  return new Blob([data], { type: 'application/zip' });
}