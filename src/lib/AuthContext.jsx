import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();

    // Listen for changes to Supabase authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setIsAuthenticated(!!session?.user);
      setIsLoadingAuth(false);
      setAuthChecked(true);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);
      
      // Since Supabase doesn't use custom public settings endpoints by default, 
      // we check the user session directly.
      await checkUserAuth();
      
    } catch (error) {
      console.error('Unexpected error during app state check:', error);
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsLoadingPublicSettings(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (e) {
      console.error("User auth check failed:", e.message);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error("Logout failed:", e.message);
    }
  };

  const navigateToLogin = () => {
    // Redirect cleanly to your login page path
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};