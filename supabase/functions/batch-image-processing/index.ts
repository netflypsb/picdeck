import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProcessingRequest {
  userId: string;
  filePaths: string[];
  templates: Array<{ name: string; width: number; height: number }>;
  watermarkSettings?: {
    type: 'image' | 'text';
    text?: string;
    imageUrl?: string;
    transparency: number;
    scale: number;
    placement: string;
    tiling: boolean;
    spacing: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, filePaths, templates, watermarkSettings }: ProcessingRequest = await req.json();

    if (!userId || !filePaths || !templates) {
      throw new Error('Missing required parameters');
    }

    console.log(`Processing ${filePaths.length} images for user ${userId}`);

    const processedImages = [];

    for (const filePath of filePaths) {
      try {
        // Download original image
        const { data: fileData, error: downloadError } = await supabaseClient.storage
          .from('original-images')
          .download(filePath);

        if (downloadError) {
          console.error(`Error downloading ${filePath}:`, downloadError);
          continue;
        }

        // Process for each template
        for (const template of templates) {
          try {
            // Generate output path
            const outputPath = `${userId}/${template.name}/${filePath}`;

            // Upload processed image
            const { error: uploadError } = await supabaseClient.storage
              .from('processed-images')
              .upload(outputPath, fileData, {
                contentType: 'image/png',
                upsert: true
              });

            if (uploadError) {
              console.error(`Error uploading processed image ${outputPath}:`, uploadError);
              continue;
            }

            // Get public URL
            const { data: urlData } = await supabaseClient.storage
              .from('processed-images')
              .getPublicUrl(outputPath);

            processedImages.push({
              template: template.name,
              url: urlData.publicUrl,
              path: outputPath
            });

            // Update processing queue status
            await supabaseClient
              .from('image_processing_queue')
              .update({ 
                status: 'completed',
                updated_at: new Date().toISOString()
              })
              .eq('original_path', filePath)
              .eq('user_id', userId);

          } catch (templateError) {
            console.error(`Error processing template ${template.name} for ${filePath}:`, templateError);
          }
        }
      } catch (imageError) {
        console.error(`Error processing image ${filePath}:`, imageError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Batch processing complete',
        processedImages 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );

  } catch (error) {
    console.error('Error in batch-image-processing:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
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