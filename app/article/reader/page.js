'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Share2, Loader2, Zap } from 'lucide-react'

function ReaderContent() {
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const title = searchParams.get('title')
  
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
    
    if (!url) {
      setError('No article URL provided')
      setLoading(false)
      return
    }

    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/article?url=${encodeURIComponent(url)}`)
        if (!res.ok) {
          throw new Error('Failed to fetch article')
        }
        const data = await res.json()
        setArticle(data)
      } catch (err) {
        setError('Unable to load article. Please try the original site.')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [url])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title || title,
          url: url
        })
      } catch (err) {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied!')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-400 mb-4" />
        <p className="text-zinc-500">Loading article...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4">
        <Card className={`max-w-md w-full ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`}>
          <CardContent className="p-8 text-center">
            <p className={`text-lg mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {error}
            </p>
            <div className="flex gap-3 justify-center">
              <Button asChild>
                <a href={url} target="_blank" rel="noopener">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Read on original site
                </a>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to news
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleShare}>
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        
        <h1 className={`text-3xl md:text-4xl font-bold leading-tight mb-4 ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          {article?.title || title}
        </h1>
        
        {article?.description && (
          <p className={`text-lg ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            {article.description}
          </p>
        )}
      </header>

      {/* Actions */}
      <div className="flex items-center gap-4 py-4 border-y mb-8">
        <Button asChild variant="outline">
          <a href={url} target="_blank" rel="noopener">
            <ExternalLink className="w-4 h-4 mr-2" />
            Original Article
          </a>
        </Button>
        <Button variant="ghost" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>

      {/* Content */}
      <div 
        className={`prose prose-lg max-w-none ${
          isDark ? 'prose-invert prose-zinc' : 'prose-zinc'
        }`}
        dangerouslySetInnerHTML={{ __html: article?.content || '' }}
        style={{
          '--tw-prose-body': isDark ? '#a1a1aa' : '#52525b',
          '--tw-prose-headings': isDark ? '#e4e4e7' : '#18181b',
          '--tw-prose-links': isDark ? '#e4e4e7' : '#18181b',
          '--tw-prose-bold': isDark ? '#f4f4f5' : '#27272a',
          '--tw-prose-counters': isDark ? '#a1a1aa' : '#71717a',
          '--tw-prose-bullets': isDark ? '#71717a' : '#a1a1aa',
          '--tw-prose-hr': isDark ? '#3f3f46' : '#e4e4e7',
          '--tw-prose-quotes': isDark ? '#d4d4d8' : '#3f3f46',
          '--tw-prose-quote-borders': isDark ? '#3f3f46' : '#e4e4e7',
          '--tw-prose-code': isDark ? '#f4f4f5' : '#27272a',
          '--tw-prose-pre-code': isDark ? '#e4e4e7' : '#f4f4f5',
          '--tw-prose-pre-bg': isDark ? '#27272a' : '#f4f4f5',
          '--tw-prose-th-borders': isDark ? '#3f3f46' : '#e4e4e7',
          '--tw-prose-td-borders': isDark ? '#27272a' : '#f4f4f5',
        }}
      />

      {/* Footer */}
      <footer className="mt-12 pt-8 border-t">
        <div className="flex items-center justify-between">
          <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Powered by AI News Reader
          </p>
          <Button asChild variant="link">
            <a href={url} target="_blank" rel="noopener">
              Report issue
            </a>
          </Button>
        </div>
      </footer>
    </article>
  )
}

function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <Loader2 className="w-10 h-10 animate-spin text-zinc-400 mb-4" />
      <p className="text-zinc-500">Loading...</p>
    </div>
  )
}

export default function ReaderPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-20">
        <Suspense fallback={<Loading />}>
          <ReaderContent />
        </Suspense>
      </main>
    </>
  )
}
