import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { SkeletonLoader } from './components/ui/CommonComponents';

// Lazy load main components for better performance
const AuthComponent = lazy(() => import('./components/Auth'));
const MainApp = lazy(() => import('./components/MainApp'));

// Loading component
const AppLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-400">Loading Healthcare Platform...</p>
    </div>
  </div>
);

// Main App Container
const AppContainer = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Suspense fallback={<AppLoader />}>
        <MainApp />
      </Suspense>
    </div>
  );
};

// Root App Component
function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContainer />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
