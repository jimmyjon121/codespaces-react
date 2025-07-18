import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { useNotification } from '../hooks/useNotification';
import { useThemeManager } from '../hooks/useThemeManager';

// Initial state
const initialState = {
  user: null,
  userData: null,
  loading: false,
  activeView: 'dashboard',
  activeClientPlan: null,
  isDemoMode: true,
  isSidebarCollapsed: false,
  isMeetingMode: false,
  logoUrl: 'https://i.imgur.com/6X5w42G.png',
};

// Action types
const actionTypes = {
  SET_USER: 'SET_USER',
  SET_USER_DATA: 'SET_USER_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  SET_ACTIVE_CLIENT_PLAN: 'SET_ACTIVE_CLIENT_PLAN',
  TOGGLE_DEMO_MODE: 'TOGGLE_DEMO_MODE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_MEETING_MODE: 'TOGGLE_MEETING_MODE',
  SET_LOGO_URL: 'SET_LOGO_URL',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return { ...state, user: action.payload };
    case actionTypes.SET_USER_DATA:
      return { ...state, userData: action.payload };
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_ACTIVE_VIEW:
      return { ...state, activeView: action.payload };
    case actionTypes.SET_ACTIVE_CLIENT_PLAN:
      return { ...state, activeClientPlan: action.payload };
    case actionTypes.TOGGLE_DEMO_MODE:
      return { ...state, isDemoMode: !state.isDemoMode };
    case actionTypes.TOGGLE_SIDEBAR:
      return { ...state, isSidebarCollapsed: !state.isSidebarCollapsed };
    case actionTypes.TOGGLE_MEETING_MODE:
      return { ...state, isMeetingMode: !state.isMeetingMode };
    case actionTypes.SET_LOGO_URL:
      return { ...state, logoUrl: action.payload };
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const notification = useNotification();
  const theme = useThemeManager();

  // Action creators
  const setUser = useCallback((user) => {
    dispatch({ type: actionTypes.SET_USER, payload: user });
  }, []);

  const setUserData = useCallback((userData) => {
    dispatch({ type: actionTypes.SET_USER_DATA, payload: userData });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setActiveView = useCallback((view) => {
    dispatch({ type: actionTypes.SET_ACTIVE_VIEW, payload: view });
  }, []);

  const setActiveClientPlan = useCallback((plan) => {
    dispatch({ type: actionTypes.SET_ACTIVE_CLIENT_PLAN, payload: plan });
  }, []);

  const toggleDemoMode = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_DEMO_MODE });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_SIDEBAR });
  }, []);

  const toggleMeetingMode = useCallback(() => {
    dispatch({ type: actionTypes.TOGGLE_MEETING_MODE });
  }, []);

  const setLogoUrl = useCallback((url) => {
    dispatch({ type: actionTypes.SET_LOGO_URL, payload: url });
  }, []);

  // Computed values
  const isHighestAdmin = state.userData?.role === 'Admin 3';

  const value = {
    // State
    ...state,
    isHighestAdmin,
    
    // Actions
    setUser,
    setUserData,
    setLoading,
    setActiveView,
    setActiveClientPlan,
    toggleDemoMode,
    toggleSidebar,
    toggleMeetingMode,
    setLogoUrl,
    
    // Additional hooks
    ...notification,
    ...theme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
