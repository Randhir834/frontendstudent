import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          router.push('/login');
          return;
        }

        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
        setLoading(false);
      } catch (error) {
        console.error('[useAuth] Error checking authentication:', error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        router.push('/login');
      }
    };

    checkAuth();

    // Listen for logout events
    const handleLogout = () => {
      setIsAuthenticated(false);
      setUser(null);
      router.push('/login');
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [router]);

  return { user, loading, isAuthenticated };
}
