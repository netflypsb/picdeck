
export interface Profile {
  id: string;
  tier: 'free' | 'pro' | 'premium' | 'platinum';
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
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
  product_id: string | null;
  active: boolean | null;
  currency: string | null;
  type: string | null;
  unit_amount: number | null;
  interval?: string | null;
  interval_count?: number | null;
  trial_period_days?: number | null;
  metadata?: Record<string, string> | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  status: string | null;
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  created_at: string;
  current_period_start: string | null;
  current_period_end: string | null;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  metadata: Record<string, any> | null;
}
