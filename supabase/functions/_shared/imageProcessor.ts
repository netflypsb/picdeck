export async function processImage(
  file: File,
  template: { width: number; height: number }
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      
      canvas.width = template.width
      canvas.height = template.height
      
      // Fill background with white
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(
        template.width / img.width,
        template.height / img.height
      )
      
      // Center the image
      const x = (template.width - img.width * scale) / 2
      const y = (template.height - img.height * scale) / 2
      
      // Draw resized image
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      
      canvas.toBlob((blob) => {
        resolve(blob!)
      }, 'image/png', 1.0) // Use maximum quality for Pro tier
    }
    img.src = URL.createObjectURL(file)
  })
}