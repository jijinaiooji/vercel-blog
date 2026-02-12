'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
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
  
  return (
    <>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            Latest <span className="text-primary">AI News</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Curated from the world's leading AI research labs and companies
          </p>
        </section>
        
        <section id="news" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-3" />
              <p>Fetching latest AI news...</p>
            </div>
          ) : articles.length > 0 ? (
            articles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              <p>No articles available. Check back later.</p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </>
  );
}
