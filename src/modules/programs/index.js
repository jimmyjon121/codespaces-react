// Programs Module - Treatment programs and care plans
// Manages care programs, templates, and treatment protocols

// Components
export { default as ProgramList } from './components/ProgramList';
export { default as ProgramBuilder } from './components/ProgramBuilder';
export { default as CareProtocols } from './components/CareProtocols';
export { default as ProgramTemplates } from './components/ProgramTemplates';

// Services
export { default as programService } from './services/programService';
export { default as protocolService } from './services/protocolService';

// Hooks
export { usePrograms } from './hooks/usePrograms';
export { useCareProtocols } from './hooks/useCareProtocols';

// Configuration
export { programConfig } from './config/programConfig';

// Types
export * from './types/programTypes';
