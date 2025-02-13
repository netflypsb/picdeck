
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserTier } from '@/hooks/use-user-tier';

export function SubscriptionCard() {
  const navigate = useNavigate();
  const { tier } = useUserTier();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p>Current Plan: {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier</p>
          <Button onClick={() => navigate('/pricing')}>
            Upgrade Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
