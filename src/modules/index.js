// Main Modules Index - Central export point for all application modules
// This file provides a clean interface for importing any module component or service

// Admin Module - Administrative functions and settings
export * as Admin from './admin';

// AI Module - Artificial Intelligence and machine learning features
export * as AI from './ai';

// Authentication Module - User authentication and authorization
export * as Auth from './auth';

// Clients Module - Patient/client management
export * as Clients from './clients';

// Dashboard Module - Main application dashboard
export * as Dashboard from './dashboard';

// Analytics Module - Data analysis and reporting
export * as Analytics from './analytics';

// Programs Module - Treatment programs and care plans
export * as Programs from './programs';

// Note: Type definitions would be available in TypeScript versions
// For JavaScript projects, types are documented via JSDoc comments

// Module metadata for development tools
export const moduleInfo = {
  admin: {
    description: 'Administrative functions, settings, and configuration',
    lead: 'TBD',
    components: ['AdminSettings', 'UserManagement', 'SystemConfig']
  },
  ai: {
    description: 'AI features, recommendations, and HIPAA-compliant processing',
    lead: 'TBD',
    components: ['RecommendationEngine', 'OnPremisesAI', 'HIPAACompliantRecommendations']
  },
  auth: {
    description: 'Authentication, authorization, and session management',
    lead: 'TBD',
    components: ['LoginForm', 'RegisterForm', 'ProtectedRoute']
  },
  clients: {
    description: 'Client management, profiles, and clinical coach assignments',
    lead: 'TBD',
    components: ['ClientList', 'ClientProfile', 'ClinicalCoachAssignment']
  },
  dashboard: {
    description: 'Main dashboard, metrics overview, and quick actions',
    lead: 'TBD',
    components: ['DashboardHome', 'MetricsOverview', 'QuickActions']
  },
  analytics: {
    description: 'Data analysis, reporting, and performance metrics',
    lead: 'TBD',
    components: ['AnalyticsDashboard', 'ClientMetrics', 'ReportGenerator']
  },
  programs: {
    description: 'Treatment programs, care protocols, and program templates',
    lead: 'TBD',
    components: ['ProgramList', 'ProgramBuilder', 'CareProtocols']
  }
};
