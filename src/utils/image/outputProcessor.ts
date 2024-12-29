import sharp from 'sharp';

export interface OutputSettings {
  format: 'png' | 'jpeg' | 'webp';
  isLossless: boolean;
}

export async function processOutputFormat(
  imageBuffer: Buffer,
  settings: OutputSettings
): Promise<Buffer> {
  let processor = sharp(imageBuffer);

  switch (settings.format) {
    case 'png':
      processor = processor.png({
        quality: settings.isLossless ? 100 : 85,
        compressionLevel: settings.isLossless ? 0 : 6,
      });
      break;
    case 'jpeg':
      processor = processor.jpeg({
        quality: settings.isLossless ? 100 : 85,
        mozjpeg: !settings.isLossless, // Use mozjpeg for better compression in standard mode
      });
      break;
    case 'webp':
      processor = processor.webp({
        quality: settings.isLossless ? 100 : 85,
        lossless: settings.isLossless,
        effort: settings.isLossless ? 0 : 4, // Lower effort for lossless, higher for lossy
      });
      break;
    default:
      processor = processor.png(); // Default to PNG
  }

  return processor.toBuffer();
}