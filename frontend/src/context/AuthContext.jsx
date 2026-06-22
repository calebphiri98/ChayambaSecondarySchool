import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until session is checked

  // On app load, restore session from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('chayamba_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem('chayamba_user');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('chayamba_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('chayamba_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — import this anywhere you need auth
export function useAuth() {
  return useContext(AuthContext);
}