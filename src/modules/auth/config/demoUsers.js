// Demo users for testing role-based access
export const demoUsers = {
  // Platform Administrator (you) - sees everything
  platformAdmin: {
    id: 'owner-001',
    email: 'owner@clearhivehq.com',
    name: 'Platform Administrator',
    role: 'Platform Administrator',
    organizationId: 'clearhive-platform'
  },
  
  // Regular customer admin - sees standard features only
  customerAdmin: {
    id: 'admin-001', 
    email: 'admin@customerorg.com',
    name: 'Facility Administrator',
    role: 'Administrator',
    organizationId: 'customer-123'
  },
  
  // Clinical staff - basic access
  clinicalUser: {
    id: 'clinical-001',
    email: 'nurse@customerorg.com', 
    name: 'Clinical Coordinator',
    role: 'End User',
    organizationId: 'customer-123'
  }
};

// Demo organizations with different subscription tiers
export const demoOrganizations = {
  'clearhive-platform': {
    id: 'clearhive-platform',
    name: 'ClearHive Platform',
    subscriptionTier: 'enterprise',
    isPlatformOrg: true
  },
  'customer-123': {
    id: 'customer-123', 
    name: 'Regional Medical Center',
    subscriptionTier: 'professional',
    isPlatformOrg: false
  }
};
