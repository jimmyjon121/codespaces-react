// Admin Configuration - Feature Toggles for Different Organizations
// This demonstrates early monetization/customization strategy

export const DEFAULT_FEATURE_CONFIG = {
  // Clinical Team Features
  clinical: {
    showSpecialties: false,          // Toggle therapist specialties display
    showExperienceYears: false,      // Toggle experience details
    showClinicalCoaches: true,       // Toggle clinical coach assignments
    showCaseloadLimits: true,        // Toggle max caseload display
    enableTeamCollaboration: true,   // Toggle team-wide visibility
  },
  
  // Analytics & Reporting
  analytics: {
    showDetailedMetrics: true,       // Toggle advanced analytics
    enableCustomReports: false,     // Premium feature
    showComparativeData: true,       // Toggle program comparisons
    enableDataExport: false,         // Premium feature
  },
  
  // Client Management
  clientManagement: {
    showProgressBars: true,          // Toggle progress visualization
    enableRiskAlerts: true,          // Toggle at-risk indicators
    showDischargeEstimates: true,    // Toggle discharge planning
    enableClientNotes: false,        // Premium feature
  },
  
  // User Interface
  interface: {
    enableDarkMode: true,            // Toggle theme options
    showContactInfo: true,           // Toggle staff contact display
    enableCollapsibleSections: true, // Toggle UI organization
    showProgramLogos: false,         // Premium branding feature
  },
  
  // Administrative
  admin: {
    enableUserManagement: false,     // Admin-only feature
    showAuditLogs: false,           // Premium compliance feature
    enableDataBackup: false,        // Premium feature
    allowCustomBranding: false,     // Premium feature
  },

  // AI & Machine Learning (Future Enterprise Features)
  ai: {
    enableSmartRecommendations: false,  // On-premises AI matching
    enableRiskPrediction: false,        // Clinical risk assessment
    enableDocumentProcessing: false,    // NLP for intake forms
    aiDeploymentMode: 'disabled',       // 'disabled', 'edge-device', 'private-cloud'
    enableFederatedLearning: false,     // Cross-facility insights (anonymized)
  }
};

// Subscription Tiers for Monetization
const BASIC_FEATURES = [
  'clinical.showClinicalCoaches',
  'clinical.showCaseloadLimits',
  'analytics.showDetailedMetrics',
  'clientManagement.showProgressBars',
  'clientManagement.enableRiskAlerts',
  'interface.enableDarkMode',
  'interface.showContactInfo'
];

const PROFESSIONAL_FEATURES = [
  ...BASIC_FEATURES,
  'clinical.showSpecialties',
  'clinical.enableTeamCollaboration',
  'analytics.enableCustomReports',
  'analytics.showComparativeData',
  'clientManagement.enableClientNotes',
  'interface.enableCollapsibleSections'
];

const ENTERPRISE_FEATURES = [
  ...PROFESSIONAL_FEATURES,
  'analytics.enableDataExport',
  'admin.enableUserManagement',
  'admin.showAuditLogs',
  'admin.enableDataBackup',
  'admin.allowCustomBranding',
  'interface.showProgramLogos'
];

const AI_ENTERPRISE_FEATURES = [
  ...ENTERPRISE_FEATURES,
  'ai.enableSmartRecommendations',
  'ai.enableRiskPrediction',
  'ai.enableDocumentProcessing'
];

export const SUBSCRIPTION_TIERS = {
  basic: {
    name: 'Basic',
    price: '$29/month',
    features: BASIC_FEATURES
  },
  
  professional: {
    name: 'Professional', 
    price: '$79/month',
    features: PROFESSIONAL_FEATURES
  },
  
  enterprise: {
    name: 'Enterprise',
    price: '$199/month',
    features: ENTERPRISE_FEATURES
  },

  aiEnterprise: {
    name: 'AI Enterprise',
    price: '$499/month + hardware',
    description: 'On-premises AI with complete data privacy',
    features: AI_ENTERPRISE_FEATURES,
    requirements: {
      hardware: 'On-premises AI appliance ($50k-100k)',
      network: 'Dedicated secure infrastructure',
      support: '24/7 white-glove AI operations'
    }
  }
};

// Helper function to check if a feature is enabled
export const isFeatureEnabled = (featurePath, userConfig = DEFAULT_FEATURE_CONFIG) => {
  const keys = featurePath.split('.');
  let current = userConfig;
  
  for (const key of keys) {
    if (current[key] === undefined) return false;
    current = current[key];
  }
  
  return current;
};

// Example organization configs
export const ORGANIZATION_CONFIGS = {
  // Your current setup - full collaboration
  'demo-org': {
    ...DEFAULT_FEATURE_CONFIG,
    clinical: {
      ...DEFAULT_FEATURE_CONFIG.clinical,
      enableTeamCollaboration: true,
      showSpecialties: false, // As you mentioned, not needed for daily ops
    }
  },
  
  // Conservative healthcare org
  'conservative-org': {
    ...DEFAULT_FEATURE_CONFIG,
    clinical: {
      ...DEFAULT_FEATURE_CONFIG.clinical,
      enableTeamCollaboration: false,
      showClinicalCoaches: false,
      showSpecialties: true,
    },
    interface: {
      ...DEFAULT_FEATURE_CONFIG.interface,
      showContactInfo: false, // Prefer formal communication channels
    }
  }
};
