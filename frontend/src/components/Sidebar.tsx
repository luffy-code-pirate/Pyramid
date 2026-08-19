'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/context/theme-context';
import { ColorMode, ThemePreference } from '@/lib/types';

const COLOR_OPTIONS: { value: ColorMode; label: string; swatch: string }[] = [
  { value: 'amber', label: 'Amber', swatch: '#f59e0b' },
  { value: 'blue', label: 'Blue', swatch: '#3b82f6' },
  { value: 'pink', label: 'Pink', swatch: '#ec4899' },
  { value: 'rose', label: 'Rose', swatch: '#f43f5e' },
  { value: 'emerald', label: 'Emerald', swatch: '#10b981' },
  { value: 'black', label: 'Black', swatch: '#171717' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, colorMode, setTheme, setColorMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleThemeToggle(newTheme: ThemePreference) {
    await setTheme(newTheme);
  }

  return (
    <aside className="w-60 border-r border-border bg-surface flex flex-col shrink-0">
      {/* User menu at top */}
      <div className="relative p-4 border-b border-border">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 w-full text-left"
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <span className="text-sm font-medium text-foreground truncate">
            {user?.name}
          </span>
        </button>

        {menuOpen && (
          <div className="absolute left-4 right-4 top-full mt-1 bg-background border border-border rounded-lg shadow-lg z-10 py-1">
            <div className="px-3 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              {user?.email && (
                <p className="text-xs text-muted truncate">{user.email}</p>
              )}
            </div>

            {/* Theme (light/dark) toggle */}
            <div className="px-3 py-2">
              <p className="text-xs text-muted mb-1.5">Theme</p>
              <div className="flex gap-1">
                <button
                  onClick={() => handleThemeToggle('light')}
                  className={`flex-1 text-xs py-1.5 rounded ${
                    theme === 'light'
                      ? 'bg-foreground text-background'
                      : 'bg-surface text-foreground'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeToggle('dark')}
                  className={`flex-1 text-xs py-1.5 rounded ${
                    theme === 'dark'
                      ? 'bg-foreground text-background'
                      : 'bg-surface text-foreground'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Color mode swatches */}
            <div className="px-3 py-2">
              <p className="text-xs text-muted mb-1.5">Color Mode</p>
              <div className="flex gap-1.5 flex-wrap">
                {COLOR_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setColorMode(opt.value)}
                    title={opt.label}
                    className={`w-5 h-5 rounded-full ${
                      colorMode === opt.value
                        ? 'ring-2 ring-offset-2 ring-foreground ring-offset-background'
                        : ''
                    }`}
                    style={{ backgroundColor: opt.swatch }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-surface border-t border-border"
            >
              Log out
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3">
        <p className="text-xs text-muted px-2 mb-1">Workspace</p>
        <Link
          href="/tasks"
          className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-background"
        >
          Tasks
        </Link>
      </nav>
    </aside>
  );
}