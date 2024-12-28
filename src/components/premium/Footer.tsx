import { useNavigate } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © 2024 PicDeck. All rights reserved.
        </p>
        <nav className="flex items-center space-x-4">
          <button onClick={() => navigate('/contact')} className="text-sm text-muted-foreground hover:text-primary">
            Contact
          </button>
          <button onClick={() => navigate('/privacy-policy')} className="text-sm text-muted-foreground hover:text-primary">
            Privacy
          </button>
          <button onClick={() => navigate('/terms-of-service')} className="text-sm text-muted-foreground hover:text-primary">
            Terms
          </button>
        </nav>
      </div>
    </footer>
  );
}