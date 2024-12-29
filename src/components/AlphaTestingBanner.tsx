import { PartyPopper } from 'lucide-react';

export function AlphaTestingBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 py-2 text-center animate-fade-in">
      <div className="container flex items-center justify-center gap-2">
        <PartyPopper className="h-5 w-5 text-primary animate-float" />
        <p className="text-sm font-medium">
          Welcome to PicDeck Alpha! We're excited to have you testing our platform.
        </p>
      </div>
    </div>
  );
}