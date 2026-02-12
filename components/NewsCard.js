'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

function formatTwitterDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
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
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  return `${String(date.getUTCDate()).padStart(2, '0')} ${String(date.getUTCMonth() + 1).padStart(2, '0')} ${date.getUTCFullYear()}`;
}

export default function NewsCard({ article }) {
  // Handle different date formats from API
  const dateValue = article.pubDate || article.date || article.isoDate;
  const displayDate = article.date || (dateValue ? formatTwitterDate(dateValue) : 'Just now');
  const displayFullDate = article.formattedDate || (dateValue ? formatDateFull(dateValue) : 'Today');
  
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

        {/* Title */}
        <h3 className="font-semibold text-zinc-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="line-clamp-2"
          >
            {article.title}
          </a>
        </h3>
        
        {/* Description */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
          {article.description}
        </p>

        {/* Read more link */}
        <div className="pt-2">
          <a 
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            Read more
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
