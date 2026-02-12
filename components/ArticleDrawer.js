'use client'

import { useState, useEffect } from 'react'
import { X, ExternalLink, Loader2, Globe } from 'lucide-react'

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
        setError('Connection failed. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [article])

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
          <div className="flex items-center gap-2 min-w-0">
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0`}
            >
              <X className="w-5 h-5" />
            </button>
            <span className={`text-sm font-medium truncate ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Reader
            </span>
          </div>
          <a 
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex-shrink-0`}
            title="Open original site"
          >
            <Globe className="w-5 h-5" />
          </a>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-56px)] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
              <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mb-4" />
              <p className="text-zinc-500 text-center px-4">
                Loading article...
              </p>
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
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
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
              {/* Title */}
              <h1 className={`text-xl font-bold leading-tight mb-4 ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}>
                {content.title || article.title}
              </h1>

              {/* Meta */}
              {(content.author || content.date) && (
                <div className={`flex items-center gap-3 mb-4 text-sm ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}>
                  {content.author && <span>By {content.author}</span>}
                  {content.author && content.date && <span>•</span>}
                  {content.date && <span>{content.date}</span>}
                </div>
              )}

              {/* Content */}
              <div className={`prose prose-sm max-w-none ${
                isDark ? 'prose-invert prose-zinc' : 'prose-zinc'
              }`}>
                {content.content.split('\n').map((paragraph, i) => {
                  paragraph = paragraph.trim()
                  if (!paragraph) return null
                  
                  // Headers
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={i} className="text-lg font-bold mt-4 mb-2">{paragraph.replace('### ', '')}</h3>
                  }
                  
                  // Images
                  if (paragraph.includes('[IMAGE:')) {
                    const match = paragraph.match(/\[IMAGE: ([^\]]+)\]/)
                    return (
                      <div key={i} className="my-4 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-center">
                        <p className="text-sm text-zinc-500">{match ? match[1] : 'Image'}</p>
                        <p className="text-xs text-zinc-400 mt-1">Tap "Read on original site" to view</p>
                      </div>
                    )
                  }
                  
                  // Blockquote
                  if (paragraph.startsWith('> ')) {
                    return <blockquote key={i} className="border-l-4 border-zinc-300 dark:border-zinc-600 pl-4 italic my-2">{paragraph.replace('> ', '')}</blockquote>
                  }
                  
                  // List items
                  if (paragraph.startsWith('• ')) {
                    return <p key={i} className="ml-4">• {paragraph.replace('• ', '')}</p>
                  }
                  
                  // Links
                  const linkMatch = paragraph.match(/\[([^\]]+)\]\(([^)]+)\)/)
                  if (linkMatch) {
                    return (
                      <p key={i} className="my-1">
                        {paragraph.replace(/\[([^\]]+)\]\(([^)]+)\)/, '<a href="$2" target="_blank" class="text-blue-500 hover:underline">$1</a>')}
                      </p>
                    )
                  }
                  
                  return <p key={i} className="my-2 leading-relaxed">{paragraph}</p>
                })}
              </div>

              {/* Footer */}
              <div className={`mt-8 pt-4 border-t ${
                isDark ? 'border-zinc-800' : 'border-zinc-200'
              }`}>
                <a 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 text-sm font-medium ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
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
