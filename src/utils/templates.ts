export type Template = {
  name: string;
  width: number;
  height: number;
  category: string;
  platform: string;
};

export const premiumTemplates: Template[] = [
  // Social Media Ads
  { name: 'Facebook Carousel Ad', width: 1080, height: 1080, category: 'Social Media Ads', platform: 'Facebook' },
  { name: 'Facebook Story Ad', width: 1080, height: 1920, category: 'Social Media Ads', platform: 'Facebook' },
  { name: 'Instagram Story Ad', width: 1080, height: 1920, category: 'Social Media Ads', platform: 'Instagram' },
  { name: 'TikTok Store Product', width: 800, height: 800, category: 'Social Media Ads', platform: 'TikTok' },
  { name: 'TikTok Store Header', width: 1200, height: 628, category: 'Social Media Ads', platform: 'TikTok' },
  
  // Banners
  { name: 'Facebook Group Cover', width: 1640, height: 856, category: 'Banners', platform: 'Facebook' },
  { name: 'LinkedIn Group Banner', width: 1400, height: 425, category: 'Banners', platform: 'LinkedIn' },
  
  // Video Platform Thumbnails
  { name: 'IGTV Cover', width: 420, height: 654, category: 'Video Thumbnails', platform: 'Instagram' },
  { name: 'YouTube Shorts', width: 1080, height: 1920, category: 'Video Thumbnails', platform: 'YouTube' },
  { name: 'YouTube Playlist', width: 1280, height: 720, category: 'Video Thumbnails', platform: 'YouTube' },
  
  // Other Sizes
  { name: 'Pinterest Long Pin', width: 1000, height: 2100, category: 'Other', platform: 'Pinterest' },
  { name: 'Twitter Fleet', width: 1080, height: 1920, category: 'Other', platform: 'Twitter' },
  { name: 'Telegram Channel Banner', width: 1280, height: 720, category: 'Other', platform: 'Telegram' }
];

export const adTemplates: Template[] = [
  // Google Ads
  { name: 'Medium Rectangle', width: 300, height: 250, category: 'Display Ads', platform: 'Google Ads' },
  { name: 'Large Rectangle', width: 336, height: 280, category: 'Display Ads', platform: 'Google Ads' },
  { name: 'Leaderboard', width: 728, height: 90, category: 'Display Ads', platform: 'Google Ads' },
  { name: 'Half Page', width: 300, height: 600, category: 'Display Ads', platform: 'Google Ads' },
  { name: 'Skyscraper', width: 120, height: 600, category: 'Display Ads', platform: 'Google Ads' },
  
  // Meta Ads
  { name: 'Square Image Ad', width: 1080, height: 1080, category: 'Social Ads', platform: 'Meta Ads' },
  { name: 'Landscape Image Ad', width: 1200, height: 628, category: 'Social Ads', platform: 'Meta Ads' },
  { name: 'Portrait Image Ad', width: 1080, height: 1350, category: 'Social Ads', platform: 'Meta Ads' },
  { name: 'Stories Ad', width: 1080, height: 1920, category: 'Social Ads', platform: 'Meta Ads' },
  
  // LinkedIn Ads
  { name: 'Single Image Ad', width: 1200, height: 627, category: 'Social Ads', platform: 'LinkedIn Ads' },
  { name: 'Carousel Square', width: 1080, height: 1080, category: 'Social Ads', platform: 'LinkedIn Ads' },
  
  // Twitter Ads
  { name: 'Landscape Ad', width: 800, height: 418, category: 'Social Ads', platform: 'Twitter Ads' },
  { name: 'Square Ad', width: 800, height: 800, category: 'Social Ads', platform: 'Twitter Ads' },
  
  // TikTok Ads
  { name: 'In-Feed Ad', width: 1080, height: 1920, category: 'Social Ads', platform: 'TikTok Ads' },
  { name: 'App Bundle Ad', width: 1200, height: 628, category: 'Social Ads', platform: 'TikTok Ads' }
];
