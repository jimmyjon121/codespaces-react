// Professional healthcare SaaS role hierarchy
export const PLATFORM_ROLES = {
  // Customer-facing roles
  'End User': { level: 1, description: 'Clinical staff member', customerVisible: true },
  'Supervisor': { level: 2, description: 'Department supervisor', customerVisible: true },
  'Administrator': { level: 3, description: 'Facility administrator', customerVisible: true },
  'Enterprise Admin': { level: 4, description: 'Multi-facility admin', customerVisible: true },
  
  // Platform-only roles (hidden from customers)
  'Implementation Specialist': { level: 90, description: 'Onboarding team', customerVisible: false },
  'Solutions Architect': { level: 95, description: 'Technical configuration', customerVisible: false },
  'Platform Administrator': { level: 99, description: 'ClearHive team only', customerVisible: false }
};

// Legacy role mapping for backwards compatibility
export const USER_ROLES = {
  'Clinical Coach': 1,
  'Admin': 2,
  'Admin 2': 3,
  'Admin 3': 4,
  'Platform Owner': 99  // Maps to Platform Administrator
};

// Feature flags system
export const FeatureFlags = {
  // Basic features (all tiers)
  'client-management': { minTier: 'basic', enabled: true },
  'program-search': { minTier: 'basic', enabled: true },
  'clinical-coaches': { minTier: 'basic', enabled: true },
  
  // Professional features
  'analytics-dashboard': { minTier: 'professional', enabled: true },
  'bulk-operations': { minTier: 'professional', enabled: true },
  'custom-reports': { minTier: 'professional', enabled: true },
  
  // Enterprise features
  'ai-recommendations': { minTier: 'enterprise', enabled: false },
  'api-access': { minTier: 'enterprise', enabled: true },
  'white-label': { minTier: 'enterprise', enabled: false },
  'advanced-analytics': { minTier: 'enterprise', enabled: true },
  
  // Platform-only features (never shown to customers)
  'billing-configuration': { requiredRole: 'Platform Administrator' },
  'infrastructure-settings': { requiredRole: 'Platform Administrator' },
  'customer-management': { requiredRole: 'Platform Administrator' },
  'ai-platform-config': { requiredRole: 'Platform Administrator' }
};

// Mock platform owner user
export const platformOwnerUser = {
  id: 'owner-001',
  email: 'owner@clearhivehq.com',
  name: 'Platform Administrator',
  role: 'Platform Administrator',
  organizationId: 'clearhive-platform'
};

// Feature check function
export const hasFeature = (featureName, user, organization) => {
  const feature = FeatureFlags[featureName];
  if (!feature) return false;
  
  // Platform admin always has access
  if (user.role === 'Platform Administrator' || user.role === 'Platform Owner') return true;
  
  // Check role requirement
  if (feature.requiredRole && 
      user.role !== feature.requiredRole && 
      user.role !== 'Platform Administrator') return false;
  
  // Check subscription tier
  if (feature.minTier) {
    const tierLevels = { basic: 1, professional: 2, enterprise: 3 };
    const orgTier = organization?.subscriptionTier || 'basic';
    return tierLevels[orgTier] >= tierLevels[feature.minTier];
  }
  
  return feature.enabled;
};

// Check if user is platform admin
export const isPlatformAdmin = (user) => {
  return user?.role === 'Platform Administrator' || user?.role === 'Platform Owner';
};

// Get visible roles for customer-facing interfaces
export const getCustomerVisibleRoles = () => {
  return Object.entries(PLATFORM_ROLES)
    .filter(([, config]) => config.customerVisible)
    .map(([role, config]) => ({ role, ...config }));
};
