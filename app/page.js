import Link from 'next/link';

const posts = [
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: '2026-02-12',
    excerpt: 'Welcome to my new blog! This is the first post.',
  },
  {
    slug: 'getting-started',
    title: 'Getting Started',
    date: '2026-02-13',
    excerpt: 'Learn how to add new posts to this blog.',
  },
];

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>My Blog</h1>
        <p style={{ color: '#666' }}>A simple blog built with Next.js & Vercel</p>
      </header>

      <main>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Latest Posts</h2>
        
        {posts.map((post) => (
          <article key={post.slug} style={{ marginBottom: '30px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <Link href={`/posts/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#333' }}>{post.title}</h3>
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#888', marginBottom: '10px' }}>{post.date}</p>
            <p style={{ lineHeight: '1.6' }}>{post.excerpt}</p>
            <Link href={`/posts/${post.slug}`} style={{ color: '#0070f3', textDecoration: 'none' }}>
              Read more →
            </Link>
          </article>
        ))}
      </main>

      <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#888' }}>
        <p>Built with Next.js & Vercel</p>
      </footer>
    </div>
  );
}
