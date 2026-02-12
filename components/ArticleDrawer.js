'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Loader2, Globe, Bookmark, Check, Image } from 'lucide-react'
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

  const articleImage = article?.image || article?.thumbnail || ''

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  // Check if saved
  useEffect(() => {
    if (!article?.url && !article?.link) return
    
    const checkSaved = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setSaved(false)
        return
      }
      
      const articleUrl = article.url || article.link
      const { data: savedArticle } = await supabase
        .from('saved_articles')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('article_url', articleUrl)
        .single()
      
      setSaved(!!savedArticle)
    }
    
    checkSaved()
  }, [article])

  // Fetch content
  useEffect(() => {
    if (!article?.url && !article?.link) return

    const timer = setTimeout(() => {
      if (loading) {
        setError('Taking too long. Tap to open original site.')
      }
    }, 6000)

    const fetchContent = async () => {
      try {
        const articleUrl = article.url || article.link
        const res = await fetch(`/api/article?url=${encodeURIComponent(articleUrl)}`)
        const data = await res.json()
        if (res.ok && (data.content || data.error)) {
          setContent(data)
          if (data.error) setError(data.content || 'Could not load')
        } else {
          setError('Unable to load article')
        }
      } catch (err) {
        setError('Connection failed')
      } finally {
        setLoading(false)
        clearTimeout(timer)
      }
    }

    fetchContent()
    return () => clearTimeout(timer)
  }, [article])

  // Save/unsave
  const handleSave = async () => {
    setSaving(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        alert('Please sign in to save')
        setSaving(false)
        return
      }

      const articleUrl = article.url || article.link
      if (!articleUrl) {
        setSaving(false)
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
      setSaving(false)
    }
  }

  // Parse content into paragraphs
  const renderContent = (text) => {
    if (!text) return null
    
    const lines = text.split('\n\n')
    return lines.map((line, i) => {
      line = line.trim()
      if (!line) return null

      // Bold text
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{line.replace(/\*\*/g, '')}</p>
      }

      // Heading
      if (line.startsWith('### ')) {
        return <h3 key={i} className={`text-lg font-bold mt-5 mb-2 ${isDark ? 'text-white' : 'text-zinc-900'}`}>{line.replace('### ', '')}</h3>
      }

      // Quote
      if (line.startsWith('> ')) {
        return <blockquote key={i} className={`border-l-4 border-yellow-500 pl-4 my-4 italic ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{line.replace('> ', '')}</blockquote>
      }

      // Regular paragraph
      return <p key={i} className={`mb-3 leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{line}</p>
    })
  }

  if (!article) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl z-50 shadow-2xl overflow-hidden flex flex-col ${
        isDark ? 'bg-zinc-950' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b flex-shrink-0 ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <button onClick={handleSave} disabled={saving} className={`p-2 rounded-lg ${
              saved ? 'text-yellow-500' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}>
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                saved ? <Bookmark className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <a href={article.url || article.link} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
              <p className="text-zinc-500">Loading...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <p className={`mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{error}</p>
              <a href={article.url || article.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg ${
                isDark ? 'bg-white text-zinc-900' : 'bg-zinc-900 text-white'
              }`}>
                <ExternalLink className="w-4 h-4" />
                Read on original site
              </a>
            </div>
          ) : content ? (
            <div className="p-5">
              {/* Article Image from RSS */}
              {articleImage && (
                <div className="mb-4 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <img 
                    src={articleImage} 
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}

              <h1 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                {content.title || article.title}
              </h1>
              
              {(content.author || content.date) && (
                <div className={`flex gap-3 mb-6 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  {content.author && <span>By {content.author}</span>}
                  {content.author && content.date && <span>•</span>}
                  {content.date && <span>{content.date}</span>}
                </div>
              )}

              {/* Formatted Content */}
              <div className="prose prose-sm max-w-none">
                {renderContent(content.content)}
              </div>

              {/* Saved indicator */}
              {saved && (
                <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                  <Check className="w-4 h-4" />
                  <span className="text-sm font-medium">Saved</span>
                </div>
              )}

              {/* Read original */}
              <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <a href={article.url || article.link} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 text-sm ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}>
                  <ExternalLink className="w-4 h-4" />
                  Continue reading on original site
                </a>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
