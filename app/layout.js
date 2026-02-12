import { Metadata } from 'next'
import './globals.css'
 
export const metadata = {
  title: 'AI News - Latest Artificial Intelligence News & Updates',
  description: 'Curated AI news from OpenAI, Google AI, Anthropic, Meta AI, Microsoft, DeepMind, and more. Daily updates on artificial intelligence, machine learning, and LLMs.',
  keywords: ['AI', 'Artificial Intelligence', 'Machine Learning', 'ChatGPT', 'OpenAI', 'LLM', 'AI News', 'Tech News'],
  metadataBase: new URL('https://vercel-blog-beige-five.vercel.app'),
  openGraph: {
    title: 'AI News - Latest Artificial Intelligence News',
    description: 'Curated AI news from top labs. Updated daily.',
    url: 'https://vercel-blog-beige-five.vercel.app',
    siteName: 'AI News',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI News (@ai_news)',
    description: 'Curated AI news from OpenAI, Google, Anthropic & more',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#18181b" />
      </head>
      <body className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white antialiased">
        {children}
      </body>
    </html>
  )
}
