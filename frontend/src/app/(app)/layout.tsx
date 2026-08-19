'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Sidebar } from '@/components/Sidebar';

// This layout wraps EVERY page inside the (app) route group —
// tasks, task detail, settings, etc. — with the same sidebar
// and an authentication check, without repeating that code
// on every individual page.
export default function AppLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If we've finished checking auth status and there's no user,
  // redirect back to login. This protects every page in this
  // group automatically — no need to repeat this check per-page.
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [isLoading, user, router]);

  // While we're still checking "is there a valid session?", show
  // a minimal loading state instead of flashing the wrong UI.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    );
  }

  // If loading finished but there's genuinely no user, render
  // nothing — the useEffect above is already redirecting away.
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}