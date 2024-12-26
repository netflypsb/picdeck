import { Header } from '@/components/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { UploadSection } from '@/components/sections/UploadSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { UserGuideSection } from '@/components/sections/UserGuideSection';
import { FutureSection } from '@/components/sections/FutureSection';

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 space-y-16 py-8">
          <HeroSection />
          <UploadSection />
          <FeaturesSection />
          <PricingSection />
          <UserGuideSection />
          <FutureSection />
        </div>
      </main>
      <footer id="contact" className="border-t">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">© 2024 PicDeck. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <a href="mailto:support@picdeck.com" className="text-sm hover:text-primary">Contact</a>
            <a href="#" className="text-sm hover:text-primary">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}