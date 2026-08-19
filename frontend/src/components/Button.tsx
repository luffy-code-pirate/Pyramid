import { ButtonHTMLAttributes, ReactNode } from 'react';

// Extends all normal <button> props (onClick, type, disabled, etc.)
// so this component behaves exactly like a native button, just styled.
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

// One shared button component used everywhere in the app.
// Changing button styling later means editing ONE file, not
// hunting through every page that has a button.
export function Button({
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Solid black/foreground button — matches the Figma's
    // "Continue as Guest" button style.
    primary: 'bg-foreground text-background hover:opacity-90',
    // Bordered, transparent background — matches "Login with Google".
    secondary: 'border border-border bg-background text-foreground hover:bg-surface',
    // No border, no background — for subtle/tertiary actions.
    ghost: 'text-foreground hover:bg-surface',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}