import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { decode, encode } from 'https://deno.land/x/imagescript@1.2.15/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const imageFile = formData.get('image') as File
    const width = parseInt(formData.get('width') as string)
    const height = parseInt(formData.get('height') as string)

    if (!imageFile || !width || !height) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Processing image: ${imageFile.name} to ${width}x${height}`);

    const arrayBuffer = await imageFile.arrayBuffer()
    const sourceImage = await decode(new Uint8Array(arrayBuffer));
    
    // Calculate scaling to maintain aspect ratio
    const aspectRatio = sourceImage.width / sourceImage.height;
    const targetAspectRatio = width / height;
    
    let scaledWidth = width;
    let scaledHeight = height;
    let offsetX = 0;
    let offsetY = 0;

    if (aspectRatio > targetAspectRatio) {
      // Image is wider than target
      scaledHeight = Math.round(width / aspectRatio);
      offsetY = Math.round((height - scaledHeight) / 2);
    } else {
      // Image is taller than target
      scaledWidth = Math.round(height * aspectRatio);
      offsetX = Math.round((width - scaledWidth) / 2);
    }

    // Create a white background
    const resizedImage = new ImageScript.Image(width, height);
    resizedImage.fill([255, 255, 255, 255]);

    // Resize the source image
    const scaled = sourceImage.resize(scaledWidth, scaledHeight);
    
    // Composite the scaled image onto the white background
    resizedImage.composite(scaled, offsetX, offsetY);

    // Encode the final image
    const processedImage = await encode(resizedImage, 'png');

    console.log('Image processing completed successfully');

    return new Response(
      processedImage,
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename="processed.png"'
        }
      }
    )
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process image' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})