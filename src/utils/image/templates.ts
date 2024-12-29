export const FREE_TEMPLATES = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'WhatsApp Profile', width: 500, height: 500 },
  { name: 'TikTok Profile', width: 200, height: 200 },
  { name: 'TikTok Post', width: 1080, height: 1920 },
  { name: 'YouTube Post', width: 1280, height: 720 },
] as const;

export type Template = {
  name: string;
  width: number;
  height: number;
};