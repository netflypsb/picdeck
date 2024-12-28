export interface Profile {
  id: string;
  subscription_tier: 'free' | 'pro' | 'premium';
  subscription_status: 'active' | 'inactive';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}