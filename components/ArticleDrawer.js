'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Loader2, Globe, Bookmark, Check } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function ArticleDrawer({ article, onClose }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(true)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  // Check if already saved
  useEffect(() => {
    if (!article?.url) return
    
    const checkSaved = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setSaved(false)
        return
      }
      
      const { data: savedArticle } = await supabase
        .from('saved_articles')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('article_url', article.url)
        .single()
      
      setSaved(!!savedArticle)
    }
    
    checkSaved()
  }, [article])

  // Fetch article content
  useEffect(() => {
    if (!article?.url) return

    const fetchContent = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`/api/article?url=${encodeURIComponent(article.url)}`)
        const data = await res.json()
        if (res.ok && data.content) {
          setContent(data)
        } else {
          setError(data.message || 'Unable to load article')
        }
      } catch (err) {
        setError('Connection failed')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [article])

  // Save to Supabase
  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        alert('Please sign in to save articles')
        return
      }

      if (saved) {
        // Remove from saved
        await supabase
          .from('saved_articles')
          .delete()
          .eq('user_id', session.user.id)
          .eq('article_url', article.url)
        setSaved(false)
      } else {
        // Add to saved
        await supabase
          .from('saved_articles')
          .insert({
            user_id: session.user.id,
            article_url: article.url,
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
      setSaving(false)
    }
  }

  if (!article) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
        isDark ? 'bg-zinc-950' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            {/* Save/Pin Button */}
            <button 
              onClick={handleSave}
              disabled={saving}
              className={`p-2 rounded-lg transition-colors ${
                saved 
                  ? 'text-yellow-500' 
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
              title={saved ? 'Remove from saved' : 'Save for later'}
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : saved ? (
                <Bookmark className="w-5 h-5 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            
            <a 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
              title="Open original site"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-56px)] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
              <p className="text-zinc-500 text-center px-4">Loading article...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] px-4 text-center">
              <p className={`mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {error}
              </p>
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium ${
                  isDark 
                    ? 'bg-white text-zinc-900 hover:bg-zinc-200' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                <ExternalLink className="w-4 h-4" />
                Read on original site
              </a>
            </div>
          ) : content ? (
            <div className="p-5">
              <h1 className={`text-xl font-bold leading-tight mb-4 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>
                {content.title || article.title}
              </h1>

              {(content.author || content.date) && (
                <div className={`flex items-center gap-3 mb-4 text-sm ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  {content.author && <span>By {content.author}</span>}
                  {content.author && content.date && <span>•</span>}
                  {content.date && <span>{content.date}</span>}
                </div>
              )}

              <div className={`prose prose-sm max-w-none ${
                isDark ? 'prose-invert prose-zinc' : 'prose-zinc'
              }`}>
                {content.content.split('\n').map((paragraph, i) => {
                  paragraph = paragraph.trim()
                  if (!paragraph) return null
                  
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>
                  }
                  
                  if (paragraph.startsWith('• ')) {
                    return <p key={i} className="ml-4 my-1">• {paragraph.replace('• ', '')}</p>
                  }
                  
                  if (paragraph.startsWith('> ')) {
                    return <blockquote key={i} className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-2">{paragraph.replace('> ', '')}</blockquote>
                  }
                  
                  return <p key={i} className="my-2 leading-relaxed">{paragraph}</p>
                })}
              </div>

              {/* Saved indicator */}
              {saved && (
                <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Saved for later</span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
