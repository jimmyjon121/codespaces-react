import { useState, useEffect } from 'react';

export const useThemeManager = (initialDarkMode = false, initialThemeColor = '#4f46e5') => {
  const [isDarkMode, setIsDarkMode] = useState(initialDarkMode);
  const [themeColor, setThemeColor] = useState(initialThemeColor);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--theme-color', themeColor);
  }, [themeColor]);

  return { isDarkMode, setIsDarkMode, themeColor, setThemeColor };
};

export const useNotification = (timeout = 5000) => {
  const [notification, setNotification] = useState({ 
    message: '', 
    type: '', 
    visible: false 
  });

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '', visible: false });
      }, timeout);
      return () => clearTimeout(timer);
    }
  }, [notification.visible, timeout]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, visible: true });
  };

  const dismissNotification = () => {
    setNotification({ message: '', type: '', visible: false });
  };

  return { notification, showNotification, dismissNotification };
};
