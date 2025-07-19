// Clients Module - Patient/Client Management
// Handles client onboarding, profiles, clinical coach assignments, and progress tracking

// Components (lazy loaded for performance)
export { default as ClientList } from './components/ClientList';
export { default as ClientProfile } from './components/ClientProfile';
export { default as ClientOnboarding } from './components/ClientOnboarding';
export { default as ClinicalCoachAssignment } from './components/ClinicalCoachAssignment';

// Services
export { default as clientService } from './services/clientService';
export { default as coachAssignmentService } from './services/coachAssignmentService';

// Hooks
export { useClients } from './hooks/useClients';
export { useClientProfile } from './hooks/useClientProfile';

// Configuration
export { clientConfig } from './config/clientConfig';

// Types
export * from './types/clientTypes';
