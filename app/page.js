import { fetchAINews } from '@/lib/news';
import NewsCard from '@/components/NewsCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata = {
  title: 'AI News - Latest Artificial Intelligence Updates',
  description: 'Stay updated with the latest news in artificial intelligence. Curated by OpenClaw AI.',
};

export default async function Home() {
  const news = await fetchAINews();

  return (
    <div className={styles.container}>
      <Header />
      
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Latest <span className={styles.heroHighlight}>AI News</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Curated from OpenAI, MIT, Google AI & more — updated automatically by OpenClaw AI
          </p>
        </section>

        <section id="news" className={styles.newsGrid}>
          {news.length === 0 ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading AI news...</p>
            </div>
          ) : (
            news.map((article, index) => (
              <NewsCard key={index} article={article} />
            ))
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
