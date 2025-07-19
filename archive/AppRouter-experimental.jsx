import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import AuthComponent from './Auth';

// Layout Components
import Navigation from './Navigation';
import ErrorBoundary from './ErrorBoundary';

// Page Components (these will be extracted from your monolithic App.jsx)
import Dashboard from './views/Dashboard';
// import ClientManagement from '../pages/ClientManagement';
// import ProgramDirectory from '../pages/ProgramDirectory';
// import Analytics from '../pages/Analytics';
// import AdminPanel from '../pages/AdminPanel';
// import Settings from '../pages/Settings';

// Temporary placeholder components (until we extract from App.jsx)
const ClientManagement = () => <div className="p-6"><h1 className="text-2xl font-bold">Client Management</h1><p>This will be extracted from your App.jsx</p></div>;
const ProgramDirectory = () => <div className="p-6"><h1 className="text-2xl font-bold">Program Directory</h1><p>This will be extracted from your App.jsx</p></div>;
const Analytics = () => <div className="p-6"><h1 className="text-2xl font-bold">Analytics</h1><p>This will be extracted from your App.jsx</p></div>;
const AdminPanel = () => <div className="p-6"><h1 className="text-2xl font-bold">Admin Panel</h1><p>This will be extracted from your App.jsx</p></div>;
const Settings = () => <div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p>This will be extracted from your App.jsx</p></div>;

const AppRouter = () => {
  const { user, userData, darkMode } = useApp();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''} transition-colors duration-200`}>
      <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
        <Navigation />
        
        <main className="md:ml-64 transition-all duration-300">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard userData={userData} isDemoMode={true} />} />
              <Route path="/clients" element={<ClientManagement />} />
              <Route path="/programs" element={<ProgramDirectory />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

const AppWithRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthComponent />} />
        <Route path="/*" element={<AppRouter />} />
      </Routes>
    </Router>
  );
};

export default AppWithRouter;
