import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Sharp from 'https://esm.sh/sharp@0.33.2';
import { Buffer } from "https://deno.land/std@0.168.0/node/buffer.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing image request...');
    const formData = await req.formData();
    const imageFile = formData.get('image') as File;
    const width = parseInt(formData.get('width') as string);
    const height = parseInt(formData.get('height') as string);

    console.log('Received parameters:', { width, height });

    if (!imageFile || !width || !height) {
      console.error('Missing required parameters');
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Convert File to ArrayBuffer
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('Processing image with Sharp...');

    // Process image with Sharp
    const processedImageBuffer = await Sharp(buffer)
      .resize(width, height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .jpeg({ 
        quality: 90,
        progressive: true,
        force: false
      })
      .png({ 
        quality: 90,
        force: false
      })
      .webp({ 
        quality: 90,
        force: false
      })
      .toBuffer();

    console.log('Image processed successfully');

    return new Response(
      processedImageBuffer,
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="processed-${imageFile.name}"`,
        }
      }
    );
  } catch (error) {
    console.error('Error processing image:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process image', details: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});