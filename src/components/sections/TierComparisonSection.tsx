import { Check, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TierComparisonSection() {
  const tiers = [
    {
      name: 'Free',
      description: 'Perfect for getting started',
      features: {
        'Batch Upload Limit': '5 images',
        'Watermark': 'Yes',
        'Templates': 'Basic',
        'Image Quality': 'Compressed',
        'Custom Watermark': false
      }
    },
    {
      name: 'Pro',
      description: 'For professionals and creators',
      popular: true,
      features: {
        'Batch Upload Limit': '20 images',
        'Watermark': 'No',
        'Templates': 'Pro Templates',
        'Image Quality': 'Lossless',
        'Custom Watermark': false
      }
    },
    {
      name: 'Premium',
      description: 'Ultimate power and flexibility',
      features: {
        'Batch Upload Limit': '50 images',
        'Watermark': 'Customizable',
        'Templates': 'Advanced Ads/Banners',
        'Image Quality': 'AI-Enhanced',
        'Custom Watermark': true
      }
    }
  ]

  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Perfect Plan</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative ${tier.popular ? 'border-primary' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <p className="text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {Object.entries(tier.features).map(([feature, value], i) => (
                    <li key={i} className="flex items-center gap-2">
                      {typeof value === 'boolean' ? (
                        value ? (
                          <Check className="h-5 w-5 text-primary" />
                        ) : (
                          <Minus className="h-5 w-5 text-muted-foreground" />
                        )
                      ) : (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                      <span className="flex-1">{feature}</span>
                      <span className="text-muted-foreground">{typeof value === 'boolean' ? '' : value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}