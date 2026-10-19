import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Portfolio } from '../types/portfolio.ts';
import { api, TokenStorage } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  portfolio: Portfolio | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: { login: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  updateLocalPortfolio: (portfolio: Portfolio) => void;
  updateLocalUser: (user: Partial<User>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [token, setToken] = useState<string | null>(TokenStorage.get());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    const currentToken = TokenStorage.get();
    if (!currentToken) {
      setUser(null);
      setPortfolio(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.me();
      if (res.success && res.data) {
        setUser(res.data.user);
        setPortfolio(res.data.portfolio);
      } else {
        TokenStorage.clear();
        setToken(null);
        setUser(null);
        setPortfolio(null);
      }
    } catch (err) {
      console.warn('Session expired or invalid:', err);
      TokenStorage.clear();
      setToken(null);
      setUser(null);
      setPortfolio(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (credentials: { login: string; password: string }) => {
    const res = await api.auth.login(credentials);
    if (res.success && res.data) {
      TokenStorage.set(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setPortfolio(res.data.portfolio);
    } else {
      throw new Error(res.message || 'Login failed');
    }
  };

  const register = async (data: { username: string; email: string; password: string }) => {
    const res = await api.auth.register(data);
    if (res.success && res.data) {
      TokenStorage.set(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setPortfolio(res.data.portfolio);
    } else {
      throw new Error(res.message || 'Registration failed');
    }
  };

  const logout = () => {
    TokenStorage.clear();
    setToken(null);
    setUser(null);
    setPortfolio(null);
  };

  const updateLocalPortfolio = (updated: Portfolio) => {
    setPortfolio(updated);
  };

  const updateLocalUser = (updatedUser: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...updatedUser } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        portfolio,
        token,
        isLoading,
        login,
        register,
        logout,
        updateLocalPortfolio,
        updateLocalUser,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
