import React from 'react';
import { Sun, Moon, User } from 'lucide-react';

const Header = ({ userData, onToggleDarkMode, isDarkMode, logoUrl }) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img src={logoUrl} alt="Logo" className="h-8 w-8 rounded" />
          <h1 className="text-xl font-semibold">Healthcare Management</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{userData?.name || userData?.email}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
