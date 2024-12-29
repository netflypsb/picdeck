import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createCanvas, loadImage } from "https://deno.land/x/canvas@v1.4.1/mod.ts";
import JSZip from "https://esm.sh/jszip@3.10.1";

const TEMPLATES = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'WhatsApp Profile', width: 500, height: 500 },
  { name: 'TikTok Profile', width: 200, height: 200 },
  { name: 'TikTok Post', width: 1080, height: 1920 },
  { name: 'YouTube Post', width: 1280, height: 720 },
] as const;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function processImage(imageData: ArrayBuffer, width: number, height: number): Promise<Uint8Array> {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Load and draw the image
  const img = await loadImage(imageData);
  ctx.drawImage(img, 0, 0, width, height);
  
  // Add watermark
  const fontSize = Math.max(width, height) * 0.02;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.fillText('Made with PicDeck', width - 10, height - 10);
  
  // Convert to PNG buffer
  return canvas.toBuffer();
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (files.length > 5) {
      return new Response(
        JSON.stringify({ error: 'Maximum of 5 images allowed per batch' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const zip = new JSZip();

    for (const file of files) {
      if (!(file instanceof File)) {
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();

      for (const template of TEMPLATES) {
        console.log(`Processing ${file.name} for template ${template.name}`);
        
        const processedImage = await processImage(
          arrayBuffer,
          template.width,
          template.height
        );

        const fileName = file.name.replace(
          /(\.[\w\d_-]+)$/i,
          `_${template.name.replace(/\s+/g, '')}_${template.width}x${template.height}.png`
        );

        zip.file(fileName, processedImage);
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipBuffer = await zipBlob.arrayBuffer();

    return new Response(
      zipBuffer,
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename=processed_images.zip'
        }
      }
    );

  } catch (error) {
    console.error('Error processing images:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process images', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})