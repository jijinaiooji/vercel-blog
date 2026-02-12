'use client'

import { useState, useEffect } from 'react'
import { X, Bookmark, ExternalLink } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

export default function SavedDrawer({ isOpen, onClose, onRefresh }) {
  const [isDark, setIsDark] = useState(true)
  const [savedArticles, setSavedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const loadSaved = async () => {
      setLoading(true)
      setError(null)
      
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)

      if (!session?.user) {
        setSavedArticles([])
        setLoading(false)
        return
      }

      try {
        const { data: saved, error } = await supabase
          .from('saved_articles')
          .select('*')
          .eq('user_id', session.user.id)
          .order('saved_at', { ascending: false })

        if (error) {
          setError('Saved articles not set up yet')
          setSavedArticles([])
        } else {
          setSavedArticles(saved || [])
        }
      } catch (err) {
        setError('Unable to load saved articles')
        setSavedArticles([])
      } finally {
        setLoading(false)
      }
    }

    loadSaved()
  }, [isOpen])

  const handleRemove = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await supabase.from('saved_articles').delete().eq('id', id)
      setSavedArticles(savedArticles.filter(a => a.id !== id))
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Remove error:', err)
    }
  }

  const handleRead = (article) => {
    // Open original article in new tab
    window.open(article.article_url || article.url, '_blank')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className={`fixed top-0 left-0 h-full w-full max-w-sm z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
        isDark ? 'bg-zinc-900' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between px-4 py-3 border-b ${
          isDark ? 'border-zinc-800' : 'border-zinc-200'
        }`}>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-yellow-500" />
            <h2 className={`text-lg font-semibold ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              Saved
            </h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="h-[calc(100%-56px)] overflow-y-auto">
          {!user ? (
            <div className="p-6 text-center">
              <p className={`mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                Sign in to save articles for later
              </p>
              <Link href="/login" onClick={onClose} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium ${
                isDark ? 'bg-white text-zinc-900 hover:bg-zinc-200' : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}>
                Sign In
              </Link>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <Bookmark className={`w-12 h-12 mx-auto mb-4 ${
                isDark ? 'text-zinc-700' : 'text-zinc-300'
              }`} />
              <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                {error}
              </p>
              <p className={`text-sm mt-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Run the SQL in Supabase to enable this feature
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-600 rounded-full animate-spin" />
            </div>
          ) : savedArticles.length === 0 ? (
            <div className="p-6 text-center">
              <Bookmark className={`w-12 h-12 mx-auto mb-4 ${
                isDark ? 'text-zinc-700' : 'text-zinc-300'
              }`} />
              <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                No saved articles yet
              </p>
              <p className={`text-sm mt-2 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                Tap the bookmark on any article to save it
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {savedArticles.map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => handleRead(article)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    isDark ? 'bg-zinc-800 hover:bg-zinc-750' : 'bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${
                        isDark ? 'text-white' : 'text-zinc-900'
                      }`}>
                        {article.article_title}
                      </h3>
                      <div className={`flex items-center gap-2 mt-1 text-xs ${
                        isDark ? 'text-zinc-500' : 'text-zinc-500'
                      }`}>
                        <span>{article.article_source}</span>
                        <span>•</span>
                        <span>{new Date(article.saved_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleRemove(article.id, e)} 
                      className={`p-1.5 rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-700 transition-colors ${
                        isDark ? 'text-zinc-500' : 'text-zinc-400'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
