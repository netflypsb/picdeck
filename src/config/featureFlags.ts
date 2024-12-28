import { FeatureFlag, UserRole } from '@/types/database';

export const FEATURES: FeatureFlag[] = [
  {
    name: 'basicTemplates',
    description: 'Access to basic social media templates',
    enabled_for: ['free', 'pro', 'premium', 'alpha_tester']
  },
  {
    name: 'advancedTemplates',
    description: 'Access to advanced templates and formats',
    enabled_for: ['pro', 'premium', 'alpha_tester']
  },
  {
    name: 'customWatermarks',
    description: 'Ability to customize watermarks',
    enabled_for: ['premium', 'alpha_tester']
  },
  {
    name: 'experimentalFeatures',
    description: 'Access to experimental features',
    enabled_for: ['alpha_tester']
  }
];

export const getFeatureFlags = (role: UserRole): string[] => {
  return FEATURES
    .filter(feature => feature.enabled_for.includes(role))
    .map(feature => feature.name);
};

export const hasFeature = (role: UserRole, featureName: string): boolean => {
  const feature = FEATURES.find(f => f.name === featureName);
  return feature ? feature.enabled_for.includes(role) : false;
};