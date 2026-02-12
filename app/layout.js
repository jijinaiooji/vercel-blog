import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'AI News - OpenClaw AI',
  description: 'Latest artificial intelligence news, automated by OpenClaw AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
