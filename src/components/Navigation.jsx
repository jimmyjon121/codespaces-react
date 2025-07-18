import React from 'react';
import { 
  Briefcase, BarChart2, Users, Database, ShieldCheck, Settings, 
  LogOut, ChevronLeft, ChevronRight, Menu, X 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const Navigation = () => {
  const {
    activeView,
    setActiveView,
    isSidebarCollapsed,
    toggleSidebar,
    isHighestAdmin,
    userData,
    logoUrl,
    showNotification
  } = useApp();

  const navigationItems = [
    { view: 'dashboard', icon: Briefcase, text: 'Dashboard' },
    { view: 'analytics', icon: BarChart2, text: 'Analytics' },
    { view: 'outreach', icon: Users, text: 'Program Outreach' },
    { view: 'database', icon: Database, text: 'Program Directory' },
    ...(isHighestAdmin ? [{ view: 'admin', icon: ShieldCheck, text: 'Admin Panel' }] : []),
    { view: 'settings', icon: Settings, text: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      showNotification({
        type: 'success',
        title: 'Signed out',
        message: 'You have been successfully signed out.'
      });
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Sign out failed',
        message: error.message
      });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg"
      >
        {isSidebarCollapsed ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-800 border-r dark:border-slate-700 transition-all duration-300 z-40 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } ${isSidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-3">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/32x32/3b82f6/ffffff?text=HP';
                }}
              />
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white">HealthcarePM</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Professional Platform</p>
              </div>
            </div>
          )}
          
          <button
            onClick={toggleSidebar}
            className="hidden md:block p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* User Info */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-b dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {userData?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white truncate">
                  {userData?.name || 'User'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                  {userData?.role || 'User'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.view}>
                <button
                  onClick={() => setActiveView(item.view)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeView === item.view
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isSidebarCollapsed ? item.text : ''}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="font-medium">{item.text}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t dark:border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all"
            title={isSidebarCollapsed ? 'Sign Out' : ''}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <span className="font-medium">Sign Out</span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {!isSidebarCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navigation;
