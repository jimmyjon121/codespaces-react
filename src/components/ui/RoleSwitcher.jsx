import React from 'react';
import { User, ChevronDown } from 'lucide-react';

const RoleSwitcher = ({ currentUser, onUserChange, availableUsers = [] }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Ensure availableUsers is always an array
  const users = Array.isArray(availableUsers) ? availableUsers : [];

  const handleUserSelect = (user) => {
    onUserChange(user);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">
          {currentUser?.name || 'Select User'}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2 py-1 mb-1">
              Switch User Role
            </div>
            {users.length === 0 ? (
              <div className="text-xs text-slate-400 dark:text-slate-500 px-2 py-2">No users available</div>
            ) : (
              users.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handleUserSelect(user)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    currentUser?.name === user.name
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {user.role} • {user.organization}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default RoleSwitcher;
