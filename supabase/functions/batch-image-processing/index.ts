
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as ImageMagick from "https://deno.land/x/imagemagick_deno@0.0.19/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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
    const { userId, filePaths, templates, watermarkSettings, resizeMode } = await req.json();
    console.log('Processing request:', { userId, filePaths, templates, watermarkSettings, resizeMode });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Download original images
    const processedImages = [];
    for (const filePath of filePaths) {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('original-images')
        .download(filePath);

      if (downloadError) throw downloadError;

      const imageBuffer = await fileData.arrayBuffer();
      console.log('Downloaded image:', filePath);

      // Process each template
      for (const template of templates) {
        const { width, height } = template;
        
        // Process image with ImageMagick
        let processedBuffer = await ImageMagick.resize(
          new Uint8Array(imageBuffer),
          {
            width,
            height,
            fit: resizeMode === 'fit' ? 'inside' : 'cover',
          }
        );

        // Apply watermark if settings provided
        if (watermarkSettings) {
          const { type, text, transparency, scale, placement, tiling, spacing } = watermarkSettings;
          
          if (type === 'text' && text) {
            // Calculate font size based on image dimensions and scale
            const fontSize = Math.min(width, height) * (scale / 100);
            
            // Create watermark options based on placement
            let gravity;
            switch (placement) {
              case 'top-left': gravity = 'northwest'; break;
              case 'top-right': gravity = 'northeast'; break;
              case 'bottom-left': gravity = 'southwest'; break;
              case 'bottom-right': gravity = 'southeast'; break;
              default: gravity = 'center';
            }

            if (tiling) {
              // Apply tiled watermark
              processedBuffer = await ImageMagick.convert(
                processedBuffer,
                'jpg',
                [
                  '-size', `${width}x${height}`,
                  'tile:caption:' + text,
                  '-gravity', 'center',
                  '-pointsize', fontSize.toString(),
                  '-density', '72',
                  '-fill', `rgba(255,255,255,${transparency / 100})`,
                  '-tile',
                  '-draw', `text 0,0 "${text}"`,
                ]
              );
            } else {
              // Apply single watermark
              processedBuffer = await ImageMagick.convert(
                processedBuffer,
                'jpg',
                [
                  '-gravity', gravity,
                  '-pointsize', fontSize.toString(),
                  '-fill', `rgba(255,255,255,${transparency / 100})`,
                  '-annotate', '+10+10',
                  text
                ]
              );
            }
          }
        }

        // Upload processed image
        const processedFileName = `${userId}/${Date.now()}-${width}x${height}-${filePath.split('/').pop()}`;
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('processed-images')
          .upload(processedFileName, processedBuffer);

        if (uploadError) throw uploadError;

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('processed-images')
            .getPublicUrl(processedFileName);

          processedImages.push({
            originalPath: filePath,
            processedPath: processedFileName,
            url: publicUrl,
            width,
            height
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, processedImages }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
