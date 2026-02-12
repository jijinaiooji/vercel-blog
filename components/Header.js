'use client';

import { Button } from '@/components/ui/button';
import { Zap, Rss } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl">AI News</span>
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Latest
          </Link>
          <Link href="/#news" className="text-sm font-medium hover:text-primary">
            News
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Rss className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Auto-updating</span>
        </div>
      </div>
    </header>
  );
}
