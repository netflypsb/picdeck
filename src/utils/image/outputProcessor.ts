import sharp from 'sharp';

export interface OutputSettings {
  format: 'png' | 'jpeg' | 'webp';
  isLossless: boolean;
}

export async function processImageWithOutputSettings(
  imageBuffer: Buffer,
  settings: OutputSettings
): Promise<Buffer> {
  let pipeline = sharp(imageBuffer);
  
  switch (settings.format) {
    case 'png':
      pipeline = pipeline.png({
        quality: settings.isLossless ? 100 : 85,
        compressionLevel: settings.isLossless ? 0 : 6,
      });
      break;
    case 'jpeg':
      pipeline = pipeline.jpeg({
        quality: settings.isLossless ? 100 : 85,
        mozjpeg: true, // Use mozjpeg for better compression
      });
      break;
    case 'webp':
      pipeline = pipeline.webp({
        quality: settings.isLossless ? 100 : 85,
        lossless: settings.isLossless,
      });
      break;
  }

  return pipeline.toBuffer();
}