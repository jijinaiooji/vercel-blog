'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Loader2, Sparkles } from 'lucide-react';
import { AuthProvider } from '@/contexts/AuthContext';

const ITEMS_PER_PAGE = 12;

function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

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
        }
      } catch (error) {
        console.error('Error loading news:', error);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail);
      setCurrentPage(1);
    };
    window.addEventListener('search', handleSearch);
    return () => window.removeEventListener('search', handleSearch);
  }, []);

  // Get all articles sorted by date
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }, [articles]);

  // Filter articles based on search
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return sortedArticles;
    const query = searchQuery.toLowerCase();
    return sortedArticles.filter(article => 
      article.title.toLowerCase().includes(query) ||
      article.description.toLowerCase().includes(query) ||
      article.source.toLowerCase().includes(query)
    );
  }, [sortedArticles, searchQuery]);

  // Paginate
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Group current page articles by date
  const groupedArticles = useMemo(() => {
    const groups = { today: [], yesterday: [], thisWeek: [], earlier: [] };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    paginatedArticles.forEach(article => {
      const pubDate = new Date(article.pubDate);
      if (pubDate >= today) groups.today.push(article);
      else if (pubDate >= yesterday) groups.yesterday.push(article);
      else if (pubDate >= weekAgo) groups.thisWeek.push(article);
      else groups.earlier.push(article);
    });

    return groups;
  }, [paginatedArticles]);

  const renderSection = (title, articles, colorClass) => {
    if (articles.length === 0) return null;
    
    return (
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <h2 className={`text-base font-bold ${colorClass}`}>{title}</h2>
          <span className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {articles.length}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      </section>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
        {/* Previous */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          Prev
        </button>
        
        {/* Page numbers - show all */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  currentPage === pageNum
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        {/* Next */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <>
      <Header />
      
      <main className="min-h-screen pt-16">
        <section className="py-12 sm:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-yellow-500 dark:text-yellow-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI News</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3">
              Latest <span className="text-blue-600">AI News</span>
            </h1>
          </div>
        </section>
        
        {searchQuery && (
          <div className="px-4 sm:px-6 mb-6">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">
                  {filteredArticles.length} result{filteredArticles.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
                <button onClick={clearSearch} className="text-sm text-blue-600 hover:underline">
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
        
        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
                <Loader2 className="w-6 h-6 animate-spin mb-3" />
                <p className="text-sm">Loading...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <>
                {renderSection('Today', groupedArticles.today, 'text-blue-600')}
                {renderSection('Yesterday', groupedArticles.yesterday, 'text-purple-600')}
                {renderSection('This Week', groupedArticles.thisWeek, 'text-orange-600')}
                {renderSection('Earlier', groupedArticles.earlier, 'text-zinc-600')}
                {renderPagination()}
              </>
            ) : (
              <div className="text-center py-16 text-zinc-500">
                No articles found
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
