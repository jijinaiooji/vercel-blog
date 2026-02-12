import { Analytics } from '@vercel/analytics/react';
import './globals.css';

export const metadata = {
  title: 'AI News - Latest Updates',
  description: 'Curated AI news from OpenAI, Google AI, MIT, Microsoft and more.',
  keywords: 'AI, Artificial Intelligence, Machine Learning, News, OpenAI, Google AI',
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
