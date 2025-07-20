import React from 'react';
import { Home, BarChart3, Database, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ isCollapsed, activeView, onViewChange, onToggleSidebar, userData }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`bg-white dark:bg-slate-800 border-r dark:border-slate-700 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 border-b dark:border-slate-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="font-bold text-lg">ClearHiveHQ</h2>
          )}
          <button onClick={onToggleSidebar} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700">
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${
                    activeView === item.id 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
