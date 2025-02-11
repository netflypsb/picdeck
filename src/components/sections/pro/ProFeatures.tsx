import { Shield, Image, Upload } from 'lucide-react';
import { ProFeatureCard } from './ProFeatureCard';

export function ProFeatures() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      <ProFeatureCard
        icon={Shield}
        title="No Watermarks"
        description="All your resized images come without any watermarks"
      />
      <ProFeatureCard
        icon={Upload}
        title="Batch Upload"
        description="Upload and process up to 20 images at once"
      />
      <ProFeatureCard
        icon={Image}
        title="Pro Templates"
        description="Access to all professional social media templates"
      />
    </div>
  );
}