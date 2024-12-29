export type Template = {
  name: string;
  width: number;
  height: number;
};

export interface WatermarkSettings {
  type: 'image' | 'text';
  imageFile?: File;
  text?: string;
  font?: string;
  color?: string;
  transparency: number;
  scale: number;
  placement: string;
  tiling: boolean;
  spacing: number;
}

export interface ProcessingOptions {
  templates: Template[];
  customSize?: { width: number; height: number };
  preserveAspectRatio?: boolean;
  outputFormat?: string;
  watermarkSettings?: WatermarkSettings;
}