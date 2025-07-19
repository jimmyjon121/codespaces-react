// Authentication Module - User authentication and authorization
// Handles login, registration, password reset, and session management

// Components
export { default as LoginForm } from './components/LoginForm';
export { default as RegisterForm } from './components/RegisterForm';
export { default as PasswordReset } from './components/PasswordReset';
export { default as ProtectedRoute } from './components/ProtectedRoute';

// Services
export { default as authService } from './services/authService';
export { default as sessionService } from './services/sessionService';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useSession } from './hooks/useSession';

// Configuration
export { authConfig } from './config/authConfig';

// Types
export * from './types/authTypes';
