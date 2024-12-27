import { Zap, Image, Crown, Sparkles, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function FeaturesSection() {
  const features = [
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Batch Resizing Made Simple",
      description: "Resize multiple images simultaneously, saving hours of manual work."
    },
    {
      icon: <Image className="h-8 w-8 text-primary" />,
      title: "Pro-Quality Templates",
      description: "Access predefined templates optimized for every major social media and professional platform."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Lossless Quality Outputs",
      description: "Produce resized images without compromising quality, even with significant size changes."
    },
    {
      icon: <Crown className="h-8 w-8 text-primary" />,
      title: "Custom Watermarking",
      description: "Add your branding with custom watermarks for professional use. (Premium)"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "AI-Powered Enhancements",
      description: "Resize smartly with advanced algorithms that maintain composition and visual appeal."
    }
  ];

  return (
    <section id="features" className="py-16 bg-secondary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Why PicDeck is Your Ultimate Image Resizing Solution
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your image workflow with powerful features designed for professionals and creators alike.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card text-card-foreground hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}