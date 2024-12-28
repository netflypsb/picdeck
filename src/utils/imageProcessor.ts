import JSZip from 'jszip';

export const TEMPLATES = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'WhatsApp Profile', width: 500, height: 500 },
  { name: 'TikTok Profile', width: 200, height: 200 },
  { name: 'TikTok Post', width: 1080, height: 1920 },
  { name: 'YouTube Post', width: 1280, height: 720 },
] as const;

export async function processImage(file: File, width: number, height: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Add watermark
      ctx.font = `${Math.max(width, height) * 0.02}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Made with PicDeck', width - 10, height - 10);
      
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/jpeg', 0.9);
    };
    img.src = URL.createObjectURL(file);
  });
}

export async function processImages(files: File[]): Promise<Blob> {
  if (files.length > 5) {
    throw new Error('Maximum of 5 images allowed per batch.');
  }

  const zip = new JSZip();
  
  for (const file of files) {
    for (const template of TEMPLATES) {
      const resizedImage = await processImage(file, template.width, template.height);
      const fileName = file.name.replace(
        /(\.[\w\d_-]+)$/i,
        `_${template.name.replace(/\s+/g, '')}_${template.width}x${template.height}$1`
      );
      zip.file(fileName, resizedImage);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}