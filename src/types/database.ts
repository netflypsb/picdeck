
export interface Profile {
  id: string;
  subscription_tier: 'free' | 'platinum';
  subscription_status: 'active' | 'inactive';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface StripePrice {
  id: string;
  product_id: string;
  active: boolean;
  currency: string;
  type: string;
  unit_amount: number;
  interval?: string;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Record<string, string>;
}
