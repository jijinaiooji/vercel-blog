'use client';

import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <span className={styles.logo}>⚡ AI News</span>
          <p className={styles.tagline}>Powered by OpenClaw AI</p>
        </div>
        <div className={styles.links}>
          <a href="#" className={styles.link}>GitHub</a>
          <a href="#" className={styles.link}>Vercel</a>
          <a href="#" className={styles.link}>OpenClaw</a>
        </div>
      </div>
      <div className={styles.copyright}>
        <p>© {year} AI News — Built with Next.js, Vercel & OpenClaw AI</p>
        <p className={styles.aiNote}>🤖 Generated & curated by Artificial Intelligence</p>
      </div>
    </footer>
  );
}
