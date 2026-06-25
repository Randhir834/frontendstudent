'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Set auth session if user is already logged in
        sessionStorage.setItem('auth_session', 'active');
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.removeItem('auth_session');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User, token: string, sessionToken?: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    if (sessionToken) {
      localStorage.setItem('sessionToken', sessionToken);
    }
    // Set auth session to prevent redirect loops
    sessionStorage.setItem('auth_session', 'active');
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionToken');
    sessionStorage.removeItem('auth_session');
    setUser(null);
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    const currentUser = user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  }, [user]);

  return { user, loading, login, logout, updateUser, isAuthenticated: !!user };
}
