import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export async function loadFFmpeg(ffmpeg: FFmpeg): Promise<void> {
  const baseURL = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.4/dist/umd';
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
  } catch (error) {
    console.error('Error loading FFmpeg:', error);
    throw new Error('Failed to load FFmpeg. Please try again.');
  }
}

export function getWatermarkFilter(position: string, transparency: number): string {
  const opacity = transparency[0] / 100;
  switch (position) {
    case 'top-left': return `drawtext=text='%TEXT%':fontsize=24:fontcolor=white@${opacity}:x=10:y=10`;
    case 'top-right': return `drawtext=text='%TEXT%':fontsize=24:fontcolor=white@${opacity}:x=main_w-text_w-10:y=10`;
    case 'bottom-left': return `drawtext=text='%TEXT%':fontsize=24:fontcolor=white@${opacity}:x=10:y=main_h-text_h-10`;
    case 'bottom-right': return `drawtext=text='%TEXT%':fontsize=24:fontcolor=white@${opacity}:x=main_w-text_w-10:y=main_h-text_h-10`;
    default: return `drawtext=text='%TEXT%':fontsize=24:fontcolor=white@${opacity}:x=(main_w-text_w)/2:y=(main_h-text_h)/2`;
  }
}