import React, { useState, useCallback } from 'react';
import { useThemeManager, useNotification } from '../../hooks/useTheme';
import Sidebar from './Sidebar';
import Header from './Header';
import { AnalyticsView } from '../views';
import Notification from '../ui/Notification';

const MainApp = ({ user, userData }) => {
  // State Management
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [activeClientPlan, setActiveClientPlan] = useState(null);
  const [logoUrl, setLogoUrl] = useState('https://i.imgur.com/6X5w42G.png');
  const [isMeetingMode, setIsMeetingMode] = useState(false);

  // Custom Hooks
  const { isDarkMode, setIsDarkMode, themeColor, setThemeColor } = useThemeManager();
  const { notification, showNotification, dismissNotification } = useNotification();

  // Derived State
  const isHighestAdmin = userData?.role === 'Admin 3' || userData?.role === 'Platform Administrator' || userData?.role === 'Platform Owner';

  // Callbacks
  const handleViewChange = useCallback((view) => {
    setActiveView(view);
  }, []);

  const handleClearActiveClient = useCallback(() => {
    setActiveClientPlan(null);
  }, []);

  const handleToggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => !prev);
  }, []);

  const handleToggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => !prev);
  }, []);

  // Render Views - for now just show a simple placeholder
  const renderActiveView = () => {
    const viewProps = {
      userData,
      isDemoMode,
      showNotification,
      activeClientPlan,
      setActiveClientPlan,
    };

    switch (activeView) {
      case 'dashboard':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Healthcare Dashboard</h1>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <p className="text-slate-600 dark:text-slate-400">
                Welcome to the modularized healthcare SaaS platform. 
                This is a clean, organized version with proper separation of concerns.
              </p>
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsView clientPlans={[]} />;
      case 'settings':
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <p className="text-slate-600 dark:text-slate-400">Settings panel placeholder</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Coming Soon</h1>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <p className="text-slate-600 dark:text-slate-400">This section is being developed</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 ${isMeetingMode ? 'meeting-mode' : ''}`}>
      <style>
        {`
          :root {
            --theme-color: ${themeColor};
          }
          .meeting-mode #sidebar, .meeting-mode #header {
            display: none;
          }
        `}
      </style>
      
      <Notification
        message={notification.message}
        type={notification.type}
        visible={notification.visible}
        onDismiss={dismissNotification}
      />

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        activeView={activeView}
        onViewChange={handleViewChange}
        onToggleSidebar={handleToggleSidebar}
        userData={userData}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          userData={userData}
          onToggleDarkMode={handleToggleDarkMode}
          isDarkMode={isDarkMode}
          logoUrl={logoUrl}
        />
        
        <main className="flex-1 overflow-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
};

export default MainApp;
