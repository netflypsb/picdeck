export type Template = {
  name: string;
  width: number;
  height: number;
};

export interface OutputSettings {
  format: 'png' | 'jpeg' | 'webp';
  isLossless: boolean;
}

export interface ProcessingOptions {
  templates: Template[];
  customSize?: { width: number; height: number };
  preserveAspectRatio?: boolean;
  outputFormat?: string;
  watermarkSettings?: any;
  outputSettings?: OutputSettings;
}