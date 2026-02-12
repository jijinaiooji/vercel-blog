import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span>
        <span className={styles.logoText}>AI News</span>
      </div>
      <nav className={styles.nav}>
        <a href="/" className={styles.navLink}>Latest</a>
        <a href="#news" className={styles.navLink}>News</a>
        <a href="/about" className={styles.navLink}>About</a>
      </nav>
      <div className={styles.status}>
        <span className={styles.statusDot}></span>
        <span>Auto-updating</span>
      </div>
    </header>
  );
}
