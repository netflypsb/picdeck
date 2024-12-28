import JSZip from 'jszip';

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

export type WatermarkSettings = {
  text: string;
  position: WatermarkPosition;
  opacity: number;
  fontSize: number;
};

export async function processImageWithWatermark(
  file: File,
  width: number,
  height: number,
  watermarkSettings?: WatermarkSettings
): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Add watermark if settings provided
      if (watermarkSettings) {
        const { text, position, opacity, fontSize } = watermarkSettings;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = 'white';
        
        const metrics = ctx.measureText(text);
        const padding = 20;
        let x = 0;
        let y = 0;
        
        switch (position) {
          case 'top-left':
            x = padding;
            y = padding + fontSize;
            break;
          case 'top-right':
            x = width - metrics.width - padding;
            y = padding + fontSize;
            break;
          case 'bottom-left':
            x = padding;
            y = height - padding;
            break;
          case 'bottom-right':
            x = width - metrics.width - padding;
            y = height - padding;
            break;
          case 'center':
            x = (width - metrics.width) / 2;
            y = height / 2;
            break;
        }
        
        ctx.fillText(text, x, y);
        ctx.restore();
      }
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImagesWithWatermark(
  files: File[],
  templates: { name: string; width: number; height: number }[],
  watermarkSettings?: WatermarkSettings
): Promise<Blob> {
  const zip = new JSZip();
  
  for (const file of files) {
    for (const template of templates) {
      const resizedImage = await processImageWithWatermark(
        file,
        template.width,
        template.height,
        watermarkSettings
      );
      const fileName = file.name.replace(
        /(\.[\w\d_-]+)$/i,
        `_${template.name.replace(/\s+/g, '')}_${template.width}x${template.height}$1`
      );
      zip.file(fileName, resizedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}