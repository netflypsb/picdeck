export type UserRole = 'free' | 'pro' | 'premium' | 'alpha_tester';

export interface Profile {
  id: string;
  role: UserRole;
  subscription_status: 'active' | 'inactive';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface FeatureFlag {
  name: string;
  description: string;
  enabled_for: UserRole[];
}