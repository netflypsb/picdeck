import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { UserGuideSection } from '@/components/sections/UserGuideSection';
import { FutureSection } from '@/components/sections/FutureSection';
import { UploadSection } from '@/components/sections/UploadSection';

export default function Index() {
  return (
    <div className="min-h-screen p-6 flex flex-col gap-8 max-w-5xl mx-auto">
      <HeroSection />
      <UploadSection />
      <FeaturesSection />
      <UserGuideSection />
      <FutureSection />
    </div>
  );
}