'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import NewsCard from './components/NewsCard';
import styles from './page.module.css';

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
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            Latest <span className={styles.highlight}>AI News</span>
          </h1>
          <p className={styles.subtitle}>
            Curated from the world's leading AI research labs and companies
          </p>
        </section>
        
        <section id="news" className={styles.grid}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Fetching latest AI news...</p>
            </div>
          ) : articles.length > 0 ? (
            articles.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))
          ) : (
            <div className={styles.empty}>
              <p>No articles available. Check back later.</p>
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </>
  );
}
