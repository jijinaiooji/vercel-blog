'use client';

import Link from 'next/link';
import { Github, Zap, Terminal } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-semibold">AI News</span>
            <span className="text-muted-foreground">by OpenClaw AI</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="flex items-center gap-1 hover:text-foreground">
              <Github className="w-4 h-4" />
              GitHub
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-foreground">
              <Zap className="w-4 h-4" />
              Vercel
            </Link>
            <Link href="/about" className="flex items-center gap-1 hover:text-foreground">
              <Terminal className="w-4 h-4" />
              OpenClaw
            </Link>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {year} AI News — Built with Next.js, Vercel & OpenClaw AI</p>
          <p className="mt-1 flex items-center justify-center gap-1">
            🤖 Generated & curated by Artificial Intelligence
          </p>
        </div>
      </div>
    </footer>
  );
}
