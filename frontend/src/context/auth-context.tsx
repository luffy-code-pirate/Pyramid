'use client';
// Marks this as a Client Component — required because it uses
// React hooks (useState, useEffect, useContext) and browser APIs.
// Next.js's App Router defaults everything to Server Components,
// which CAN'T use hooks or interactivity, so this opt-in is required.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { User } from '@/lib/types';

// The shape of data and functions this context provides to
// any component that consumes it.
interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  loginAsGuest: (name: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  // Lets any component update the locally-held user object
  // (e.g. after a theme change) without a full page refetch.
  setUser: (user: User | null) => void;
}

// createContext needs a default value for TypeScript, but it's
// never actually used at runtime — AuthProvider always wraps
// the app and supplies the real value.
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, ask the backend "am I already logged in?"
  // via our /auth/me endpoint. This is what makes a session
  // survive a page refresh — the httpOnly cookie is already
  // sitting in the browser, we just need to ask who it belongs to.
  useEffect(() => {
    async function restoreSession() {
      try {
        const data = await api.get<{ user: User | null }>('/auth/me');
        setUser(data.user);
      } catch {
        // A 401 here just means "not logged in" — not a real error.
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function loginAsGuest(name: string) {
    const data = await api.post<{ user: User }>('/auth/guest', { name });
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    const data = await api.post<{ user: User }>('/auth/register', {
      name,
      email,
      password,
    });
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    const data = await api.post<{ user: User }>('/auth/login', {
      email,
      password,
    });
    setUser(data.user);
  }

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, loginAsGuest, register, login, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming this context. Throws a clear error
// if used outside the provider, instead of a confusing
// "undefined is not an object" error later.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}