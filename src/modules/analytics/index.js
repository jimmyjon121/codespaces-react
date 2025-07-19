// Analytics Module - Data analysis and reporting
// Handles metrics, charts, reports, and data visualization

// Components
export { default as AnalyticsDashboard } from './components/AnalyticsDashboard';
export { default as ClientMetrics } from './components/ClientMetrics';
export { default as ProgramEffectiveness } from './components/ProgramEffectiveness';
export { default as CoachPerformance } from './components/CoachPerformance';
export { default as ReportGenerator } from './components/ReportGenerator';

// Services
export { default as analyticsService } from './services/analyticsService';
export { default as reportingService } from './services/reportingService';

// Hooks
export { useAnalytics } from './hooks/useAnalytics';
export { useReporting } from './hooks/useReporting';

// Configuration
export { analyticsConfig } from './config/analyticsConfig';

// Types
export * from './types/analyticsTypes';
