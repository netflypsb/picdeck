import { useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserTier } from '@/hooks/use-user-tier';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const pricingFeatures = {
  pro: [
    { platform: 'Instagram', sizes: ['Portrait Post: 1080 x 1350', 'Landscape Post: 1080 x 566', 'Story: 1080 x 1920'] },
    { platform: 'Facebook', sizes: ['Profile Picture: 170 x 170', 'Shared Image Post: 1200 x 630', 'Event Cover: 1920 x 1005'] },
    { platform: 'YouTube', sizes: ['Channel Banner: 2560 x 1440', 'Profile Picture: 800 x 800'] },
    { platform: 'WhatsApp', sizes: ['Status: 1080 x 1920'] },
    { platform: 'Telegram', sizes: ['Profile Picture: 512 x 512', 'Shared Image: 1280 x 1280'] }
  ],
  premium: [
    { platform: 'Instagram', sizes: ['IGTV Cover: 420 x 654', 'Reel Cover: 420 x 654'] },
    { platform: 'Facebook', sizes: ['Group Cover: 1640 x 856', 'Carousel Ad: 1080 x 1080', 'Story Ad: 1080 x 1920'] },
    { platform: 'TikTok', sizes: ['Store Product: 800 x 800', 'Store Header: 1200 x 628'] },
    { platform: 'Pinterest', sizes: ['Long Pin: 1000 x 2100'] },
    { platform: 'YouTube', sizes: ['Shorts: 1080 x 1920', 'Playlist: 1280 x 720'] },
    { platform: 'Telegram', sizes: ['Channel Banner: 1280 x 720'] }
  ]
};

export function PricingSection() {
  const [expandedCard, setExpandedCard] = useState<'pro' | 'premium' | null>(null);
  const { tier, assignTier } = useUserTier();
  const navigate = useNavigate();

  const handleGetStarted = async (selectedTier: 'pro' | 'premium') => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    // For now, assign the selected tier
    await assignTier(selectedTier);
    navigate(`/${selectedTier.toLowerCase()}-dashboard`);
  }

  return (
    <section id="pricing" className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground">Choose the plan that best fits your needs</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">
        {/* Pro Card */}
        <Card className="relative">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Perfect for professionals</CardDescription>
            <div className="text-3xl font-bold">$4.99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                No watermarks
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Batch upload (20 images)
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                10+ templates
              </li>
            </ul>
            {expandedCard === 'pro' && (
              <div className="space-y-4 animate-accordion-down">
                {pricingFeatures.pro.map((platform) => (
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
              onClick={() => handleGetStarted('pro')}
              disabled={tier === 'pro'}
            >
              {tier === 'pro' ? 'Current Plan' : 'Get Started'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setExpandedCard(expandedCard === 'pro' ? null : 'pro')}
            >
              {expandedCard === 'pro' ? (
                <>Hide Features <ChevronUp className="ml-2" /></>
              ) : (
                <>Show Features <ChevronDown className="ml-2" /></>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Card */}
        <Card className="relative border-primary">
          <div className="absolute -top-3 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm">
            Best Value
          </div>
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>For power users</CardDescription>
            <div className="text-3xl font-bold">$12.99<span className="text-lg font-normal text-muted-foreground">/month</span></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Everything in Pro
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Batch upload (50 images)
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                Custom watermarking
              </li>
              <li className="flex items-center gap-2">
                <Check className="text-green-500" />
                20+ templates
              </li>
            </ul>
            {expandedCard === 'premium' && (
              <div className="space-y-4 animate-accordion-down">
                {pricingFeatures.premium.map((platform) => (
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
              onClick={() => handleGetStarted('premium')}
              disabled={tier === 'premium'}
            >
              {tier === 'premium' ? 'Current Plan' : 'Get Started'}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setExpandedCard(expandedCard === 'premium' ? null : 'premium')}
            >
              {expandedCard === 'premium' ? (
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