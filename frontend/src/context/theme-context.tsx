'use client';

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { api } from '@/lib/api';
import { useAuth } from './auth-context';
import { ThemePreference, ColorMode } from '@/lib/types';

interface ThemeContextValue {
  theme: ThemePreference;
  colorMode: ColorMode;
  setTheme: (theme: ThemePreference) => Promise<void>;
  setColorMode: (colorMode: ColorMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Theme lives on the User object (server-side persisted), so we
  // read it FROM AuthContext rather than duplicating state here.
  // This is the actual mechanism that satisfies "theme persists
  // across refresh" — it's stored on the user, not just locally.
  const { user, setUser } = useAuth();

  // Fall back to sensible defaults if there's no user yet
  // (e.g. still loading, or not logged in).
  const theme = user?.theme ?? 'light';
  const colorMode = user?.colorMode ?? 'blue';

  // Whenever theme or colorMode changes, apply it to the <html>
  // element via data attributes — this is what our CSS in
  // globals.css actually reads to pick the right variables.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color', colorMode);
  }, [theme, colorMode]);

  async function setTheme(newTheme: ThemePreference) {
    // Optimistic update: change the UI immediately, don't wait
    // for the network request — feels instant to the user.
    if (user) setUser({ ...user, theme: newTheme });

    // Then persist it server-side so it survives refresh/logout.
    const data = await api.patch<{ user: typeof user }>('/users/me/theme', {
      theme: newTheme,
    });
    if (data.user) setUser(data.user);
  }

  async function setColorMode(newColorMode: ColorMode) {
    if (user) setUser({ ...user, colorMode: newColorMode });

    const data = await api.patch<{ user: typeof user }>('/users/me/theme', {
      colorMode: newColorMode,
    });
    if (data.user) setUser(data.user);
  }

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}