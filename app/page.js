'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, createElement } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Loader2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { AuthProvider } from '@/contexts/AuthContext';

const ITEMS_PER_PAGE = 9;

function HomeContent() {
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

  const groupedArticles = useMemo(() => {
    const groups = { today: [], yesterday: [], thisWeek: [], earlier: [] };
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    articles.forEach(article => {
      const pubDate = new Date(article.pubDate);
      if (pubDate >= today) groups.today.push(article);
      else if (pubDate >= yesterday) groups.yesterday.push(article);
      else if (pubDate >= weekAgo) groups.thisWeek.push(article);
      else groups.earlier.push(article);
    });

    return groups;
  }, [articles]);

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

  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSection = (title, articles, colorClass) => {
    if (articles.length === 0) return null;
    
    return createElement('section', { className: 'mb-10' },
      createElement('div', { className: 'flex items-center gap-3 mb-5' },
        createElement('h2', { className: `text-lg font-bold ${colorClass}` }, title),
        createElement('span', { className: 'text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full' }, articles.length)
      ),
      createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5' },
        articles.map((article, index) => createElement(NewsCard, { key: index, article }))
      )
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    for (let i = 1; i <= Math.min(5, totalPages); i++) {
      let pageNum;
      if (totalPages <= 5) pageNum = i;
      else if (currentPage <= 3) pageNum = i;
      else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
      else pageNum = currentPage - 2 + i;
      
      pages.push(createElement('button', {
        key: pageNum,
        onClick: () => goToPage(pageNum),
        className: `w-10 h-10 rounded-lg text-sm font-medium ${currentPage === pageNum ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'}`
      }, pageNum));
    }

    return createElement('div', { className: 'flex items-center justify-center gap-2 mt-12' },
      createElement('button', {
        onClick: () => goToPage(currentPage - 1),
        disabled: currentPage === 1,
        className: 'p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50'
      }, createElement(ChevronLeft, { className: 'w-4 h-4' })),
      pages,
      createElement('button', {
        onClick: () => goToPage(currentPage + 1),
        disabled: currentPage === totalPages,
        className: 'p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50'
      }, createElement(ChevronRight, { className: 'w-4 h-4' }))
    );
  };

  if (loading) {
    return createElement('main', { className: 'min-h-screen pt-16' },
      createElement('div', { className: 'flex flex-col items-center justify-center py-20 text-zinc-500 dark:text-zinc-400' },
        createElement(Loader2, { className: 'w-8 h-8 animate-spin mb-4' }),
        createElement('p', { className: 'text-sm' }, 'Loading...')
      )
    );
  }

  return createElement('main', { className: 'min-h-screen pt-16' },
    createElement('section', { className: 'py-14 sm:py-20 px-4 sm:px-6' },
      createElement('div', { className: 'max-w-5xl mx-auto text-center' },
        createElement('div', { className: 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-yellow-500 dark:text-yellow-400 mb-5' },
          createElement(Sparkles, { className: 'w-3.5 h-3.5' }),
          'AI-Powered News Aggregator'
        ),
        createElement('h1', { className: 'text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-3' },
          'Latest ',
          createElement('span', { className: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600' }, 'AI News')
        ),
        createElement('p', { className: 'text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto' },
          'Curated from OpenAI, Google AI, Anthropic, Meta & more.'
        )
      )
    ),
    searchQuery && createElement('div', { className: 'px-4 sm:px-6 mb-8' },
      createElement('div', { className: 'max-w-5xl mx-auto' },
        createElement('div', { className: 'flex items-center justify-between' },
          createElement('p', { className: 'text-sm text-zinc-500 dark:text-zinc-400' },
            filteredArticles.length, ' results for "', searchQuery, '"'
          ),
          createElement('button', { onClick: clearSearch, className: 'text-sm text-primary hover:underline' }, 'Clear search')
        )
      )
    ),
    !searchQuery ? createElement('section', { className: 'px-4 sm:px-6 pb-16 sm:pb-20' },
      createElement('div', { className: 'max-w-5xl mx-auto' },
        renderSection('Today', groupedArticles.today, 'text-blue-600'),
        renderSection('Yesterday', groupedArticles.yesterday, 'text-purple-600'),
        renderSection('This Week', groupedArticles.thisWeek, 'text-orange-600'),
        renderSection('Earlier', groupedArticles.earlier, 'text-zinc-600 dark:text-zinc-400'),
        articles.length === 0 && createElement('div', { className: 'text-center py-16 text-zinc-500' }, 'No articles found'),
        renderPagination()
      )
    ) : createElement('section', { className: 'px-4 sm:px-6 pb-16' },
      createElement('div', { className: 'max-w-5xl mx-auto' },
        paginatedArticles.length > 0 ? createElement(createElement('fragment', null,
          createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-12' },
            paginatedArticles.map((article, index) => createElement(NewsCard, { key: index, article }))
          ),
          renderPagination()
        )) : createElement('div', { className: 'text-center py-12 text-zinc-500' }, 'No results found')
      )
    )
  );
}

export default function Home() {
  return createElement(AuthProvider, null, createElement(HomeContent));
}
