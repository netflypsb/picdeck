export type Template = {
  name: string;
  width: number;
  height: number;
};

export interface ProcessingOptions {
  templates: Template[];
  customSize?: { width: number; height: number };
  preserveAspectRatio?: boolean;
  outputFormat?: string;
  watermarkSettings?: any;
}