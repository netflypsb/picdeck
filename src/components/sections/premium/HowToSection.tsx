import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const steps = [
  {
    title: "Select a Template",
    description: "Choose from predefined templates or set a custom size for your images"
  },
  {
    title: "Upload Photos",
    description: "Upload up to 50 images (PNG, JPG, and WebP supported)"
  },
  {
    title: "Add Watermark (Optional)",
    description: "Customize your images with text or image watermarks"
  },
  {
    title: "Process & Download",
    description: "Click the process button to convert your images to high-quality PNG format"
  }
];

export function HowToSection() {
  return (
    <Card className="bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          How to Use Your Platinum Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                {index + 1}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium leading-none">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}