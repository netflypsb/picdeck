import { Sparkles } from 'lucide-react';

const futureFeatures = [
  "More sizing options",
  "Custom size support",
  "Lossless image quality",
  "Higher batch numbers",
  "Additional formats",
  "Smart cropping"
];

export function FutureSection() {
  return (
    <section className="py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Coming Soon</h2>
        <p className="text-muted-foreground">We're constantly improving PicDeck with new features</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 px-4">
        {futureFeatures.map((feature) => (
          <div 
            key={feature}
            className="p-4 rounded-lg bg-secondary/30 backdrop-blur-sm flex items-center gap-3"
          >
            <Sparkles className="w-5 h-5 text-primary shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </section>
  );
}