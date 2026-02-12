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

  // Sort by date
  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  }, [articles]);

  // Filter
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
    setCurrentPage(Math.max(1, Math.min(page, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  // Group by date for display
  const groupedArticles = useMemo(() => {
    const groups = {};
    paginatedArticles.forEach(article => {
      const pubDate = new Date(article.pubDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let label;
      if (pubDate >= today) label = 'Today';
      else if (pubDate >= yesterday) label = 'Yesterday';
      else {
        const daysAgo = Math.floor((today - pubDate) / (1000 * 60 * 60 * 24));
        if (daysAgo <= 7) label = 'This Week';
        else if (daysAgo <= 14) label = 'Last Week';
        else label = 'Earlier';
      }
      
      if (!groups[label]) groups[label] = [];
      groups[label].push(article);
    });
    return groups;
  }, [paginatedArticles]);

  const renderSection = (title, articles, colorClass) => {
    if (!articles || articles.length === 0) return null;
    
    return (
      <section className="mb-8">
        <h2 className={`text-lg font-bold ${colorClass} mb-4`}>{title}</h2>
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
    
    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, 2);
        const start = Math.max(3, currentPage - 1);
        const end = Math.min(totalPages - 2, currentPage + 1);
        if (start > 3) pages.push(-1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 2) pages.push(-1);
        pages.push(totalPages - 1, totalPages);
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-10">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
        >
          Prev
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNum, idx) => {
            if (pageNum === -1) return <span key={`ellipsis-${idx}`} className="px-2 text-zinc-400">...</span>;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  currentPage === pageNum
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
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
                  {filteredArticles.length} results for "{searchQuery}"
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
                {renderSection('Today', groupedArticles['Today'], 'text-blue-600')}
                {renderSection('Yesterday', groupedArticles['Yesterday'], 'text-purple-600')}
                {renderSection('This Week', groupedArticles['This Week'], 'text-orange-600')}
                {renderSection('Last Week', groupedArticles['Last Week'], 'text-zinc-600')}
                {renderSection('Earlier', groupedArticles['Earlier'], 'text-zinc-500')}
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
