
import { useState, useEffect } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserTier } from '@/hooks/use-user-tier';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { StripePrice } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

const pricingFeatures = {
  platinum: [
    { platform: 'Instagram', sizes: ['IGTV Cover: 420 x 654', 'Reel Cover: 420 x 654'] },
    { platform: 'Facebook', sizes: ['Group Cover: 1640 x 856', 'Carousel Ad: 1080 x 1080', 'Story Ad: 1080 x 1920'] },
    { platform: 'TikTok', sizes: ['Store Product: 800 x 800', 'Store Header: 1200 x 628'] },
    { platform: 'Pinterest', sizes: ['Long Pin: 1000 x 2100'] },
    { platform: 'YouTube', sizes: ['Shorts: 1080 x 1920', 'Playlist: 1280 x 720'] },
    { platform: 'Telegram', sizes: ['Channel Banner: 1280 x 720'] }
  ]
};

export function PricingSection() {
  const [expandedCard, setExpandedCard] = useState<'platinum' | null>(null);
  const { tier } = useUserTier();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prices, setPrices] = useState<StripePrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data, error } = await supabase
        .from('prices')
        .select('*')
        .eq('active', true)
        .order('unit_amount', { ascending: true });

      if (error) {
        throw error;
      }

      setPrices(data as StripePrice[]);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription prices",
        variant: "destructive"
      });
    }
  };

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Create a checkout session
      const { data: { url }, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start subscription process",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriceString = (price: StripePrice) => {
    const amount = (price.unit_amount / 100).toFixed(2);
    return `$${amount}${price.interval ? `/${price.interval}` : ''}`;
  };

  return (
    <section id="pricing" className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground">Choose the plan that best fits your needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
        {/* Free Card */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Get started with the basics</CardDescription>
            <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Basic image resizing
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                5 templates
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Standard support
              </li>
            </ul>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button 
              className="w-full"
              variant="outline"
              disabled={tier === 'free'}
            >
              {tier === 'free' ? 'Current Plan' : 'Start Free'}
            </Button>
          </CardFooter>
        </Card>

        {/* Platinum Card */}
        <Card className="relative border-primary">
          <div className="absolute -top-3 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Best Value
          </div>
          <CardHeader>
            <CardTitle>Platinum</CardTitle>
            <CardDescription>For power users</CardDescription>
            <div className="text-3xl font-bold">
              {prices.length > 0 ? (
                getPriceString(prices[0])
              ) : (
                '$12.99/month'
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Everything in Free
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Custom watermarking
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                20+ templates
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Priority support
              </li>
            </ul>
            {expandedCard === 'platinum' && (
              <div className="space-y-4 animate-accordion-down">
                {pricingFeatures.platinum.map((platform) => (
                  <div key={platform.platform}>
                    <h4 className="font-semibold">{platform.platform}</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {platform.sizes.map((size) => (
                        <li key={size}>{size}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button 
              className="w-full"
              onClick={() => prices.length > 0 && handleSubscribe(prices[0].id)}
              disabled={tier === 'platinum' || isLoading}
            >
              {tier === 'platinum' ? 'Current Plan' : isLoading ? 'Loading...' : 'Get Started'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setExpandedCard(expandedCard === 'platinum' ? null : 'platinum')}
            >
              {expandedCard === 'platinum' ? (
                <>Hide Features <ChevronUp className="ml-2" /></>
              ) : (
                <>Show Features <ChevronDown className="ml-2" /></>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
