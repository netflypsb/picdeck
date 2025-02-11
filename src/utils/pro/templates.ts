export const PRO_TEMPLATES = [
  { name: 'Facebook Profile Picture', width: 170, height: 170 },
  { name: 'Facebook Shared Image Post', width: 1200, height: 630 },
  { name: 'Facebook Event Cover Photo', width: 1920, height: 1005 },
  { name: 'Instagram Portrait Post', width: 1080, height: 1350 },
  { name: 'Instagram Landscape Post', width: 1080, height: 566 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'YouTube Channel Banner', width: 2560, height: 1440 },
  { name: 'YouTube Profile Picture', width: 800, height: 800 },
  { name: 'WhatsApp Status', width: 1080, height: 1920 },
  { name: 'Telegram Profile Picture', width: 512, height: 512 },
  { name: 'Telegram Shared Image', width: 1280, height: 1280 },
  // Adding the new templates
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'WhatsApp Profile', width: 500, height: 500 },
  { name: 'TikTok Profile', width: 200, height: 200 },
  { name: 'TikTok Post', width: 1080, height: 1920 },
  { name: 'YouTube Post', width: 1280, height: 720 }
] as const;

export type ProTemplate = typeof PRO_TEMPLATES[number];