'use client';

import styles from './NewsCard.module.css';

export default function NewsCard({ article }) {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span 
          className={styles.source} 
          style={{ backgroundColor: article.sourceColor }}
        >
          {article.source}
        </span>
        <span className={styles.date}>{article.date}</span>
      </div>
      
      <h3 className={styles.title}>
        <a href={article.link} target="_blank" rel="noopener noreferrer">
          {article.title}
        </a>
      </h3>
      
      <p className={styles.description}>{article.description}</p>
      
      <a 
        href={article.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.readMore}
      >
        Read more →
      </a>
    </article>
  );
}
