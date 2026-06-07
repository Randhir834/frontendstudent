'use client';

import { useState, useEffect, useCallback } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  date_of_birth?: string;
  school?: string;
  grade?: string;
  parent_guardian_name?: string;
  phone?: string;
  location?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  return { user, loading, login, logout, isAuthenticated: !!user };
}
