import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { DEV_MODE } from '../config/constants';
import { useApp } from '../context/AppContext';
import AuthComponent from './Auth';
import Dashboard from './views/Dashboard';
import Navigation from './Navigation';

// Mock user data for development
const mockUserData = {
  role: 'Admin 3',
  name: 'Demo User',
  email: 'demo@example.com',
  permissions: ['read', 'write', 'admin'],
  createdAt: new Date(),
  lastLogin: new Date()
};

const MainApp = () => {
  const { 
    user, 
    setUser, 
    setUserData, 
    loading, 
    setLoading,
    activeView,
    isSidebarCollapsed,
    isMeetingMode
  } = useApp();

  // Authentication effect
  useEffect(() => {
    if (DEV_MODE) {
      setUser({ uid: 'dev-user-01' });
      setUserData(mockUserData);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such user document!");
          }
          setUser(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserData, setLoading]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Show auth component if not logged in
  if (!user) {
    return <AuthComponent />;
  }

  // Main application layout
  return (
    <div className={`flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 ${isMeetingMode ? 'meeting-mode' : ''}`}>
      <Navigation />
      
      <main className={`flex-1 overflow-hidden transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      } md:ml-0`}>
        <div className="h-full overflow-y-auto">
          <Dashboard />
        </div>
      </main>
    </div>
  );
};

export default MainApp;
