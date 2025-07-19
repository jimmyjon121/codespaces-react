// AI Module - Machine learning and recommendation services
export * from './services/HIPAACompliantRecommendations';
export * from './services/OnPremisesAI';

// AI module configuration
export const AI_MODULE_CONFIG = {
  name: 'AI & Machine Learning',
  description: 'HIPAA-compliant AI recommendations and analytics',
  routes: ['/ai', '/recommendations'],
  permissions: ['ai_access', 'enterprise'],
  dependencies: ['clients', 'programs'],
  hardwareRequirements: {
    edge: '$15k-100k',
    cloud: '$500k+'
  }
};

// Lazy-loaded components for performance
export default {
  HIPAARecommendationEngine: () => import('./services/HIPAACompliantRecommendations'),
  OnPremisesAI: () => import('./services/OnPremisesAI')
};
