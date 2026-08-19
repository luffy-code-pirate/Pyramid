import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";

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
        {/* AuthProvider wraps the ENTIRE app here, at the root
            layout level. This means every single page and
            component anywhere in the app can call useAuth()
            and get the current user, without needing to be
            individually wrapped or passed props manually. */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}