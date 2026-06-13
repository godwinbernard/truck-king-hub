import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

// Warm up the scheduler on first server render
if (typeof window === 'undefined') {
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/api/init`).catch(() => {});
}

export const metadata: Metadata = {
  title: 'Truck King Hub',
  description: 'Truck King Hub is a trucking publication with news, blogs, reviews, logistics insights, and a WordPress-style CMS backend.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
