import { LogIn, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserTier } from '@/hooks/use-user-tier';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { tier } = useUserTier();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const getDashboardRoute = () => {
    switch (tier) {
      case 'platinum':
        return '/platinum-dashboard';
      case 'premium':
        return '/premium-dashboard';
      case 'pro':
        return '/pro-dashboard';
      default:
        return '/free-dashboard';
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        <a href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            PicDeck
          </span>
        </a>

        <nav className={`${
          isMenuOpen ? 'absolute top-14 left-0 right-0 bg-background border-b p-4' : 'hidden'
        } md:flex md:flex-1 md:justify-center`}>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
            <button
              onClick={() => scrollToSection('features')}
              className="transition-colors hover:text-primary text-left"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="transition-colors hover:text-primary text-left"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="transition-colors hover:text-primary text-left"
            >
              Contact
            </button>
          </div>
        </nav>

        <div className="flex items-center">
          {isAuthenticated ? (
            <Button size="sm" onClick={() => navigate(getDashboardRoute())}>
              Dashboard
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate('/auth')}>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}