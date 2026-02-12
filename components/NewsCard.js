'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Bookmark, Share2, Twitter, Facebook, Linkedin } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

// Simple Mastodon SVG icon
function MastodonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-6.151.309C3.355.703.903 2.734.553 5.312c-.143.992-.118 2.012.046 2.987-.126.563-.196 1.17-.196 1.79 0 3.41 2.575 6.286 6.326 6.286 2.857 0 5.373-1.556 6.26-3.906.34.118.686.196 1.05.196 2.38 0 4.566-1.93 4.566-4.437 0-1.08-.38-2.06-1.005-2.837.26-.58.405-1.216.405-1.893 0-1.33-.566-2.494-1.425-3.315zm-6.292 14.83H9.808v-8.088c-1.45-1.734-3.635-2.51-5.254-2.51-1.597 0-3.178.776-3.635 2.292-.69 2.28-.27 4.633 1.054 5.992v1.378c0 .656.03 1.268.09 1.932h3.953v-.378c-.54-.69-.81-1.487-.81-2.366 0-1.78 1.18-2.688 2.95-2.688 1.78 0 2.94.908 2.94 2.688 0 .878-.27 1.675-.81 2.366v.378h3.79l-.04-1.84zm8.07-10.97c-.55.55-1.37.78-2.45.78-1.05 0-1.94-.24-2.45-.75-.55-.55-.78-1.37-.78-2.45 0-1.08.23-1.94.75-2.45.55-.55 1.4-.78 2.45-.78 1.08 0 1.94.23 2.5.75.55.51.78 1.37.78 2.45 0 1.08-.23 1.94-.78 2.45z"/>
    </svg>
  );
}

function formatTwitterDate(dateStr) {
  if (!dateStr) return 'Just now';
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
  const rawDate = article.pubDate || article.date || article.isoDate;
  const displayDate = rawDate ? formatTwitterDate(rawDate) : 'Just now';
  const displayFullDate = rawDate ? formatDateFull(rawDate) : 'Today';
  
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showShare, setShowShare] = useState(false);
  
  const articleUrl = article.url || article.link;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Check if saved
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user || !articleUrl) {
          setSaved(false)
          return
        }
        
        const { data } = await supabase
          .from('saved_articles')
          .select('id')
          .eq('user_id', session.user.id)
          .eq('article_url', articleUrl)
          .maybeSingle()
        
        setSaved(!!data)
      } catch (e) {
        setSaved(false)
      }
    }
    
    if (articleUrl) checkSaved()
  }, [articleUrl])

  // Handle save/unsave
  const handleSave = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!articleUrl) return
    
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        window.location.href = '/login'
        return
      }

      if (saved) {
        await supabase.from('saved_articles').delete().eq('user_id', session.user.id).eq('article_url', articleUrl)
        setSaved(false)
      } else {
        await supabase.from('saved_articles').insert({
          user_id: session.user.id,
          article_url: articleUrl,
          article_title: article.title,
          article_source: article.source,
          article_date: article.pubDate,
          saved_at: new Date().toISOString()
        })
        setSaved(true)
      }
    } catch (err) {
      console.error('Save error:', err)
    } finally {
      setLoading(false)
    }
  };

  // Share functions
  const shareTwitter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const text = `${article.title}`
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}`, '_blank')
    setShowShare(false)
  }

  const shareFacebook = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank')
    setShowShare(false)
  }

  const shareLinkedIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`, '_blank')
    setShowShare(false)
  }

  const shareMastodon = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const text = `${article.title}`
    window.open(`https://mastodon.social/share?text=${encodeURIComponent(text)}&url=${encodeURIComponent(articleUrl)}`, '_blank')
    setShowShare(false)
  }

  const copyLink = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    await navigator.clipboard.writeText(articleUrl)
    setShowShare(false)
  }

  const hasImage = !!article.image;

  return (
    <a 
      href={articleUrl || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <Card className="h-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300 overflow-hidden group relative">
        
        {/* Image */}
        {hasImage && (
          <div className="relative h-40 bg-zinc-100 dark:bg-zinc-800">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => e.target.parentElement.style.display = 'none'}
            />
          </div>
        )}
        
        {/* Actions */}
        <div className="absolute top-3 right-3 z-10 flex gap-1">
          {/* Share Button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowShare(!showShare); }}
            className={`p-2 rounded-full bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:text-blue-500 shadow-md transition-all ${showShare ? 'text-blue-500' : ''}`}
          >
            <Share2 className="w-4 h-4" />
          </button>
          
          {/* Share Options */}
          {showShare && (
            <div className="flex gap-1 animate-in fade-in slide-in-from-right-2 duration-200" onClick={(e) => e.preventDefault()}>
              <button onClick={shareTwitter} className="p-2 rounded-full bg-white dark:bg-zinc-900 shadow-md text-blue-400 hover:bg-blue-50">
                <Twitter className="w-4 h-4" />
              </button>
              <button onClick={shareFacebook} className="p-2 rounded-full bg-white dark:bg-zinc-900 shadow-md text-blue-600 hover:bg-blue-50">
                <Facebook className="w-4 h-4" />
              </button>
              <button onClick={shareLinkedIn} className="p-2 rounded-full bg-white dark:bg-zinc-900 shadow-md text-blue-700 hover:bg-blue-50">
                <Linkedin className="w-4 h-4" />
              </button>
              <button onClick={shareMastodon} className="p-2 rounded-full bg-white dark:bg-zinc-900 shadow-md text-purple-600 hover:bg-purple-50">
                <MastodonIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Bookmark Button */}
        <button
          onClick={handleSave}
          className={`absolute z-10 p-2 rounded-full transition-all ${
            hasImage ? 'top-3 left-3' : 'top-3 left-3'
          } ${
            saved 
              ? 'bg-yellow-500 text-white' 
              : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-600 dark:text-zinc-400 hover:bg-yellow-500 hover:text-white shadow-md'
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          )}
        </button>
        
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <Badge 
              style={{ backgroundColor: article.sourceColor }}
              className="text-white text-xs font-medium"
            >
              {article.source}
            </Badge>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-medium">{displayDate}</span>
              <span>•</span>
              <span>{displayFullDate}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-zinc-900 dark:text-white leading-snug text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {article.description}
          </p>

          {/* Footer */}
          <div className="pt-2 flex items-center gap-2 text-xs text-zinc-400">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{article.source}</span>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}
