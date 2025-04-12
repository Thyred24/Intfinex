'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserData {
  isSuccess: boolean;
  token?: string;
  userId?: string;
  message?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde userData kontrolü yap
    const userDataCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('userData='));
    setIsAuthenticated(!!userDataCookie);
  }, []);

  const login = (userData: UserData) => {
    // Production için domain ayarı ekle
    const domain = process.env.NEXT_PUBLIC_VERCEL_URL 
      ? '; domain=.vercel.app'  // Vercel domain
      : '';

    // Cookie'yi güvenli şekilde ayarla
    document.cookie = `userData=${JSON.stringify(userData)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax${domain}`;
    setIsAuthenticated(true);
    router.push('/dashboard');
  };

  const logout = () => {
    const domain = process.env.NEXT_PUBLIC_VERCEL_URL
      ? '; domain=.vercel.app'  // Vercel domain
      : '';

    // Cookie'leri temizle
    document.cookie = `userData=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${domain}`;
    document.cookie = `userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax${domain}`;
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
