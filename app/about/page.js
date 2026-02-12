import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './about.module.css';

export const metadata = {
  title: 'About - AI News',
  description: 'Learn how this project is managed entirely through Telegram by OpenClaw AI.',
};

export default function About() {
  return (
    <>
      <Header />
      
      <main className={styles.main}>
        <article className={styles.content}>
          <h1 className={styles.title}>
            🤖 Built by <span className={styles.highlight}>OpenClaw AI</span>
          </h1>
          
          <section className={styles.section}>
            <h2>What is OpenClaw?</h2>
            <p>
              <strong>OpenClaw</strong> is an open-source AI assistant that lives in your terminal, 
              cloud machines, and now — your messaging apps. It can read files, write code, 
              run commands, and manage your infrastructure.
            </p>
            <p>
              This blog? <strong>It was built and deployed entirely through Telegram.</strong> 
              No terminal. No GitHub web interface. Just messages.
            </p>
          </section>
          
          <section className={styles.section}>
            <h2>🔄 How It Works</h2>
            <ol className={styles.steps}>
              <li>
                <strong>User sends a message on Telegram</strong>
                <p>"Create a Next.js blog for AI news"</p>
              </li>
              <li>
                <strong>OpenClaw receives the message</strong>
                <p>Routes through the Gateway, parsed as a system event</p>
              </li>
              <li>
                <strong>OpenClaw thinks and plans</strong>
                <p>Generates code, creates files, commits to git</p>
              </li>
              <li>
                <strong>GitHub Actions triggers</strong>
                <p>Builds the Next.js app, deploys to Vercel</p>
              </li>
              <li>
                <strong>User gets the Vercel URL</strong>
                <p>Directly in Telegram, no context switching</p>
              </li>
            </ol>
          </section>
          
          <section className={styles.section}>
            <h2>🛠️ Tech Stack</h2>
            <ul className={styles.stack}>
              <li><strong>Next.js 14</strong> — React framework</li>
              <li><strong>Vercel</strong> — Hosting & serverless functions</li>
              <li><strong>GitHub Actions</strong> — CI/CD automation</li>
              <li><strong>OpenClaw</strong> — AI-powered automation layer</li>
              <li><strong>Telegram</strong> — Human-AI interface</li>
              <li><strong>RSS Feeds</strong> — AI news aggregation</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>🎯 Key Features</h2>
            <ul className={styles.features}>
              <li>✅ <strong>Zero manual deployment</strong> — Push to GitHub triggers Vercel</li>
              <li>✅ <strong>Auto-updating news</strong> — RSS feeds refresh every 12 hours</li>
              <li>✅ <strong>Serverless API</strong> — News fetched on-demand, cached at edge</li>
              <li>✅ <strong>Analytics built-in</strong> — Vercel Analytics track visitors</li>
              <li>✅ <strong>Fully open-source</strong> — Code on GitHub, free to fork</li>
            </ul>
          </section>
          
          <section className={styles.section}>
            <h2>🔗 Links</h2>
            <div className={styles.links}>
              <a href="https://github.com/jijinaiooji/vercel-blog" className={styles.link}>
                📦 View Source Code
              </a>
              <a href="https://vercel.com" className={styles.link}>
                ▲ Deploy Your Own
              </a>
              <a href="https://github.com/openclaw/openclaw" className={styles.link}>
                🤖 Get OpenClaw
              </a>
            </div>
          </section>
          
          <section className={styles.cta}>
            <h2>Want one?</h2>
            <p>
              OpenClaw can build anything — not just blogs. Websites, apps, 
              infrastructure, automation scripts — just ask on Telegram.
            </p>
            <p className={styles.note}>
              <strong>Status:</strong> This project was entirely written, committed, 
              and deployed through AI conversation. No human touched a terminal or code.
            </p>
          </section>
        </article>
      </main>
      
      <Footer />
    </>
  );
}
