import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    uploadSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="text-center space-y-6 py-12 animate-fade-in">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
        Welcome to PicDeck
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
        Your Ultimate Image Resizing Tool – Resize your pictures effortlessly for all your favorite platforms in seconds.
      </p>
      <Button onClick={scrollToUpload} size="lg" className="animate-float">
        Create a FREE Account <ArrowRight className="ml-2" />
      </Button>
    </section>
  );
}
