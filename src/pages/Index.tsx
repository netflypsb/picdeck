import { Header } from '@/components/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { TierComparisonSection } from '@/components/sections/TierComparisonSection';
import { UserGuideSection } from '@/components/sections/UserGuideSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { Mail, Shield, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 space-y-16 py-8">
          <HeroSection />
          <UserGuideSection />
          <FeaturesSection />
          <TierComparisonSection />
          <PricingSection />
          <FAQSection />
        </div>
      </main>
      <footer id="contact" className="border-t">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">© 2024 PicDeck. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link to="/contact" className="text-sm hover:text-primary inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </Link>
            <Link to="/privacy-policy" className="text-sm hover:text-primary inline-flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="text-sm hover:text-primary inline-flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}