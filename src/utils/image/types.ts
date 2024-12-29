export type Template = {
  name: string;
  width: number;
  height: number;
};

export interface OutputSettings {
  format: 'png' | 'jpeg' | 'webp';
  isLossless: boolean;
}

export interface WatermarkSettings {
  type: 'image' | 'text';
  imageFile?: File;
  text?: string;
  font?: string;
  color?: string;
  transparency: number;
  scale: number;
  placement: 'top-left' | 'center' | 'bottom-right';
  tiling: boolean;
  spacing: number;
}

export interface ProcessingOptions {
  templates: Template[];
  customSize?: { width: number; height: number };
  preserveAspectRatio?: boolean;
  watermarkSettings?: WatermarkSettings;
  outputSettings?: OutputSettings;
}