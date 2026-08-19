'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsGuest } = useAuth();

  // Local state for the guest name input and any error/loading
  // feedback — this page's own concern, doesn't belong in
  // AuthContext since it's specific to this form.
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleGuestLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a name to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await loginAsGuest(name.trim());
      // Once logged in, send them to the main task view.
      router.push('/tasks');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Wordmark, matching the Figma's centered logo + name */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-6 h-6 rounded-full bg-foreground" />
          <span className="font-semibold text-foreground">Pyramid</span>
        </div>

        <form
          onSubmit={handleGuestLogin}
          className="border border-border rounded-xl p-6 bg-surface"
        >
          <h1 className="text-xl font-semibold text-foreground text-center">
            Let&apos;s get back on track
          </h1>
          <p className="text-sm text-muted text-center mt-1 mb-6">
            Enter your name below to continue as a guest.
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted mb-3 outline-none focus:ring-2 focus:ring-accent"
          />

          {error && (
            <p className="text-sm text-red-500 mb-3" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full mb-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Continuing...' : 'Continue as Guest'}
          </Button>

          {/* Visually present, matching the Figma, but intentionally
              non-functional — real Google OAuth is out of scope for
              this assessment (documented in the README). */}
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled
            title="Google login is not implemented in this assessment build"
          >
            Login with Google
          </Button>

          <p className="text-xs text-muted text-center mt-4">
            By clicking continue, you agree to our Terms of Service and
            Privacy Policy.
          </p>
        </form>
      </div>
    </div>
  );
}