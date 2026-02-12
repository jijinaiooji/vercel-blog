'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Share2, Loader2, ChevronRight } from 'lucide-react'

export default function ArticleDrawer({ article, onClose }) {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    if (!article?.url) return

    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/article?url=${encodeURIComponent(article.url)}`)
        if (!res.ok) throw new Error('Failed to load')
        const data = await res.json()
        setContent(data)
      } catch (err) {
        setError('Unable to load article')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [article])

  const handleShare = async () => {
    if (navigator.share && content) {
      try {
        await navigator.share({
          title: content.title,
          url: article.url
        })
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (!article) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-2xl z-50 shadow-2xl transform transition-transform duration-300 ${
        isDark ? 'bg-zinc-950' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
            <span className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Reader
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleShare}
              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <a 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-56px)] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
              <p className="text-zinc-500">Loading article...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <p className={`text-center mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {error}
              </p>
              <a 
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium"
              >
                Read on original site
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="p-6">
              {/* Title */}
              <h1 className={`text-2xl font-bold leading-tight mb-4 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>
                {content?.title || article.title}
              </h1>

              {/* Meta */}
              {(content?.author || content?.date) && (
                <div className={`flex items-center gap-4 mb-6 text-sm ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  {content?.author && <span>By {content.author}</span>}
                  {content?.date && <span>{content.date}</span>}
                </div>
              )}

              {/* Description */}
              {content?.description && (
                <p className={`text-lg mb-6 ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  {content.description}
                </p>
              )}

              {/* Content */}
              <div 
                className={`prose prose-lg max-w-none ${
                  isDark ? 'prose-invert prose-zinc' : 'prose-zinc'
                }`}
                dangerouslySetInnerHTML={{ __html: content?.content || '' }}
                style={{
                  '--tw-prose-body': isDark ? '#a1a1aa' : '#52525b',
                  '--tw-prose-headings': isDark ? '#e4e4e7' : '#18181b',
                  '--tw-prose-links': isDark ? '#60a5fa' : '#2563eb',
                  '--tw-prose-bold': isDark ? '#f4f4f5' : '#27272a',
                  '--tw-prose-quotes': isDark ? '#d4d4d8' : '#3f3f46',
                }}
              />

              {/* Footer */}
              <div className={`mt-8 pt-4 border-t ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              }`}>
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600"
                >
                  Continue reading on original site
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
