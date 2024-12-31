import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { processImage } from '../_shared/imageProcessor.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PRO_TEMPLATES = [
  { name: 'Facebook Profile Picture', width: 170, height: 170 },
  { name: 'Facebook Shared Image Post', width: 1200, height: 630 },
  { name: 'Facebook Event Cover Photo', width: 1920, height: 1005 },
  { name: 'Instagram Portrait Post', width: 1080, height: 1350 },
  { name: 'Instagram Landscape Post', width: 1080, height: 566 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'YouTube Channel Banner', width: 2560, height: 1440 },
  { name: 'YouTube Profile Picture', width: 800, height: 800 },
  { name: 'WhatsApp Status', width: 1080, height: 1920 },
  { name: 'Telegram Profile Picture', width: 512, height: 512 },
  { name: 'Telegram Shared Image', width: 1280, height: 1280 },
]

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header from the request
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Verify the user's JWT and get their data
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    // Check if user has pro tier access
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: 'Could not verify user tier' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    if (!['pro', 'premium', 'platinum'].includes(profile.tier)) {
      return new Response(
        JSON.stringify({ error: 'Pro tier access required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      )
    }

    // Get the form data from the request
    const formData = await req.formData()
    const files = formData.getAll('files') as File[]

    if (files.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No files uploaded' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    if (files.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Maximum 20 files allowed for Pro tier' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Process each image with all templates
    const processedImages = await Promise.all(
      files.map(async (file) => {
        const results = await Promise.all(
          PRO_TEMPLATES.map(async (template) => {
            const processedImage = await processImage(file, template)
            const fileName = `${file.name.split('.')[0]}_${template.name.toLowerCase().replace(/\s+/g, '_')}.png`
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('pro-uploads')
              .upload(`${user.id}/${fileName}`, processedImage, {
                contentType: 'image/png',
                upsert: true
              })

            if (uploadError) {
              console.error(`Error uploading ${fileName}:`, uploadError)
              return null
            }

            const { data: { publicUrl } } = supabase.storage
              .from('pro-uploads')
              .getPublicUrl(`${user.id}/${fileName}`)

            return {
              template: template.name,
              url: publicUrl
            }
          })
        )

        return {
          originalName: file.name,
          processed: results.filter(Boolean)
        }
      })
    )

    return new Response(
      JSON.stringify({ 
        message: 'Images processed successfully',
        results: processedImages
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Processing error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process images' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})