import React from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import AuthComponent from './components/Auth';
import MainApp from './components/MainAppNew';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';

// Main App Router Component
const AppRouter = () => {
  const { user, loading } = useApp();

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  return user ? <MainApp /> : <AuthComponent />;
};

// Root App Component
const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
