import { LogIn } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">PicDeck</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <button onClick={() => scrollToSection('features')} className="transition-colors hover:text-primary">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="transition-colors hover:text-primary">
              Pricing
            </button>
            <button onClick={() => scrollToSection('contact')} className="transition-colors hover:text-primary">
              Contact
            </button>
          </nav>
          <Button size="sm">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}