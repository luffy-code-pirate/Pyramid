import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";

export const metadata: Metadata = {
  title: "Pyramid — Task Management",
  description: "A task management system built for the AbleSpace assessment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Order matters here: ThemeProvider reads user.theme and
            user.colorMode from AuthContext (via useAuth()), so
            AuthProvider MUST wrap ThemeProvider — not the other
            way around. If reversed, useAuth() inside ThemeProvider
            would fail since there'd be no AuthContext above it. */}
        <AuthProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}