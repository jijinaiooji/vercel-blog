'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock } from 'lucide-react';

export default function NewsCard({ article }) {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Badge 
            style={{ backgroundColor: article.sourceColor }}
            className="text-white"
          >
            {article.source}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Clock className="w-3 h-3" />
            {article.date}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          <a 
            href={article.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {article.title}
          </a>
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3">
          {article.description}
        </p>
        
        <a 
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Read more <ExternalLink className="w-3 h-3" />
        </a>
      </CardContent>
    </Card>
  );
}
