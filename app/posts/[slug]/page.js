import Link from 'next/link';

const posts = {
  'hello-world': {
    title: 'Hello World',
    date: '2026-02-12',
    content: `Welcome to my new blog!

This is the first post on my blog built with Next.js and deployed on Vercel.

Stay tuned for more updates!`,
  },
  'getting-started': {
    title: 'Getting Started',
    date: '2026-02-13',
    content: `Here's how to add new posts to this blog:

1. Open \`app/page.js\`
2. Add a new entry to the \`posts\` array
3. Push to GitHub
4. Vercel auto-deploys!

It's that simple!`,
  },
};

export default function Post({ params }) {
  const post = posts[params.slug];

  if (!post) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
        <h1>Post not found</h1>
        <Link href="/" style={{ color: '#0070f3' }}>← Back to home</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
        ← Back to home
      </Link>
      
      <article>
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>{post.title}</h1>
        <p style={{ color: '#888', marginBottom: '30px' }}>{post.date}</p>
        <div style={{ lineHeight: '1.8' }}>
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i} style={{ marginBottom: '15px' }}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}
