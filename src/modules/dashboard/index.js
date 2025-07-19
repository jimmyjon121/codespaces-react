// Dashboard Module - Main application dashboard and overview
// Provides overview metrics, quick actions, and navigation

// Components
export { default as DashboardHome } from './components/DashboardHome';
export { default as MetricsOverview } from './components/MetricsOverview';
export { default as QuickActions } from './components/QuickActions';
export { default as RecentActivity } from './components/RecentActivity';

// Services
export { default as dashboardService } from './services/dashboardService';
export { default as metricsService } from './services/metricsService';

// Hooks
export { useDashboard } from './hooks/useDashboard';
export { useMetrics } from './hooks/useMetrics';

// Configuration
export { dashboardConfig } from './config/dashboardConfig';

// Types
export * from './types/dashboardTypes';
