import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Customer Traffic Dashboard',
  description: 'Dashboard for customer traffic live and history data',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen font-sans">{children}</body>
    </html>
  );
}
