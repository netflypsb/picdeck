import { Upload, Image, Download } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: "Batch Upload",
    description: "Upload multiple images at once for quick processing"
  },
  {
    icon: Image,
    title: "Multiple Templates",
    description: "Resize for Instagram, Facebook, WhatsApp, and more"
  },
  {
    icon: Download,
    title: "Zip Download",
    description: "Get all your resized images in one convenient zip file"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-12 space-y-8">
      <h2 className="text-3xl font-bold text-center">Features</h2>
      <div className="grid md:grid-cols-3 gap-8 px-4">
        {features.map((feature, index) => (
          <div 
            key={feature.title}
            className="p-6 rounded-lg bg-secondary/50 backdrop-blur-sm space-y-4 hover:bg-secondary/70 transition-colors"
          >
            <feature.icon className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold text-center">{feature.title}</h3>
            <p className="text-muted-foreground text-center">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}