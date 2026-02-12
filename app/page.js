'use client';

import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalArticles, setTotalArticles] = useState(0);

  // Force refresh after auth callback
  useEffect(() => {
    if (typeof window !== 'undefined' && (new URLSearchParams(window.location.search).get('auth_success') || new URLSearchParams(window.location.search).get('refresh'))) {
      window.location.href = '/'
    }
  }, [])

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news?t=' + Date.now());
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles || []);
          setTotalArticles(data.articles?.length || 0);
        }
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Listen for search events
  useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail);
      setCurrentPage(1);
    };
    window.addEventListener('search', handleSearch);
    return () => window.removeEventListener('search', handleSearch);
  }, []);

  // Group articles by date
  const groupedArticles = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      earlier: []
    };
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    articles.forEach(article => {
      const pubDate = new Date(article.pubDate);
      
      if (pubDate >= today) {
        groups.today.push(article);
      } else if (pubDate >= yesterday) {
        groups.yesterday.push(article);
      } else if (pubDate >= weekAgo) {
        groups.thisWeek.push(article);
      } else {
        groups.earlier.push(article);
      }
    });

    return groups;
  }, [articles]);

  // Filter articles based on search
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;
    
    const query = searchQuery.toLowerCase();
    return articles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query)
    );
  }, [articles, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Render section helper
  const renderSection = (title, articles, showDate = true) => {
    if (articles.length === 0) return null;
    
    return (
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <h2 className={`text-xl font-bold ${
            showDate ? (title === 'Today' ? 'text-blue-600' : 
                        title === 'Yesterday' ? 'text-purple-600' : 
                        title === 'This Week' ? 'text-orange-600' : 
                        'text-zinc-600 dark:text-zinc-400') : ''
          }`}>
            {title}
          </h2>
          {showDate && (
            <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
              {articles.length} article{articles.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-16">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-yellow-500 dark:text-yellow-400 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered News Aggregator</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tight mb-4">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">AI News</span>
            </h1>
            
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Curated from OpenAI, Google AI, MIT, Microsoft, and more. 
              Updated automatically every 12 hours.
            </p>
          </div>
        </section>
        
        {/* Search Results */}
        {searchQuery && (
          <div className="px-4 sm:px-6 mb-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Found <span className="font-semibold text-zinc-900 dark:text-white">{filteredArticles.length}</span> results for "{searchQuery}"
                </p>
                <button onClick={clearSearch} className="text-sm text-primary hover:underline">
                  Clear search
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* News Sections */}
        {!searchQuery ? (
          <section className="px-4 sm:px-6 pb-16 sm:pb-24">
            <div className="max-w-6xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-zinc-500 dark:text-zinc-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-sm">Fetching latest AI news...</p>
                </div>
              ) : (
                <>
                  {renderSection('Today', groupedArticles.today)}
                  {renderSection('Yesterday', groupedArticles.yesterday)}
                  {renderSection('This Week', groupedArticles.thisWeek)}
                  {renderSection('Earlier', groupedArticles.earlier)}
                  
                  {articles.length === 0 && (
                    <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
                      <p>No articles found</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        ) : (
          // Search results view
          <section className="px-4 sm:px-6 pb-16 sm:pb-24">
            <div className="max-w-6xl mx-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-zinc-500 dark:text-zinc-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-4" />
                  <p className="text-sm">Searching...</p>
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredArticles.map((article, index) => (
                    <NewsCard key={index} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">
                  <p>No articles found. Try a different search term.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </>
  );
}
