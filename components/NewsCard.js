'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

function formatTwitterDate(dateStr) {
  if (!dateStr) return 'Just now';
  // If already formatted (like "5m", "2h"), return as-is
  if (!dateStr.includes('T') && /^\d+[smhd]$/.test(dateStr)) return dateStr;
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Unknown';
  
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds}s`;
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 365) return `${diffDays}d`;
  
  return `${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCMonth() + 1).padStart(2, '0')} ${date.getUTCFullYear()}`;
}

function formatDateFull(dateStr) {
  if (!dateStr) return 'Today';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Today';
  return `${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCMonth() + 1).padStart(2, '0')} ${date.getUTCFullYear()}`;
}

export default function NewsCard({ article }) {
  // Handle ISO date strings (caching fallback)
  const rawDate = article.pubDate || article.date || article.isoDate;
  const displayDate = rawDate ? formatTwitterDate(rawDate) : 'Just now';
  const displayFullDate = rawDate ? formatDateFull(rawDate) : 'Today';
  
  return (
    <Card className="h-full group bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
      <CardContent className="p-5 space-y-4">
        {/* Header: Source badge and date */}
        <div className="flex items-center justify-between gap-3">
          <Badge 
            style={{ backgroundColor: article.sourceColor }}
            className="text-white text-xs font-medium"
          >
            {article.source}
          </Badge>
          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-medium">{displayDate}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span>{displayFullDate}</span>
          </div>
        </div>

        {/* Title - links to in-app reader */}
        <h3 className="font-semibold text-zinc-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <Link
            href={`/article/reader?url=${encodeURIComponent(article.link)}&title=${encodeURIComponent(article.title)}`}
            className="line-clamp-2"
          >
            {article.title}
          </Link>
        </h3>
        
        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {article.description}
        </p>

        {/* Read more link */}
        <div className="pt-2 flex items-center gap-4">
          <Link
            href={`/article/reader?url=${encodeURIComponent(article.link)}&title=${encodeURIComponent(article.title)}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Read in app
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a 
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Original
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
