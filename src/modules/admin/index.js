// Admin Module - Feature configuration and subscription management
export { default as AdminSettings } from './components/AdminSettings';
export * from './config/adminConfig';

// Admin module configuration
export const ADMIN_MODULE_CONFIG = {
  name: 'Admin & Configuration',
  description: 'Organization settings, feature toggles, and subscription management',
  routes: ['/admin', '/settings'],
  permissions: ['admin', 'organization_owner'],
  dependencies: ['ui', 'layout']
};

// Default exports for easy importing
export default {
  AdminSettings: () => import('./components/AdminSettings'),
  adminConfig: () => import('./config/adminConfig')
};
