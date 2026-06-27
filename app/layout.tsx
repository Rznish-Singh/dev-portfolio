import type { Metadata } from "next";
import "./globals.css";

import Navigation from "@/components/navigation";
import { USER } from "@/config/user";

export const metadata: Metadata = {
  title: `${USER.name} — ${USER.tagline}`,
  description: USER.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full font-body">
        {children}
        <Navigation />
      </body>
    </html>
  );
}
