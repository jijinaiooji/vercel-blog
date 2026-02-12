import Link from 'next/link';

// AI News RSS Feeds
const RSS_FEEDS = [
  'https://www.artificialintelligence-news.com/feed/',
  'https://openai.com/news/rss.xml',
  'https://news.mit.edu/rss/topic/artificial-intelligence2',
];

// Parse RSS date
const parseDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Parse RSS XML (simplified)
const parseRSS = (xml) => {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title>(.*?)<\/title>/)?.[1] || 'Untitled';
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const description = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/)?.[1] || itemXml.match(/<description>(.*?)<\/description>/)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    
    if (title && link) {
      items.push({
        title: title.trim(),
        link,
        description: description.substring(0, 200).replace(/<[^>]+>/g, '') + '...',
        date: parseDate(pubDate),
        source: link.includes('openai') ? 'OpenAI' : link.includes('mit') ? 'MIT' : 'AI News',
      });
    }
  }
  return items;
};

// Fetch all news
const fetchAllNews = async () => {
  try {
    const responses = await Promise.all(
      RSS_FEEDS.map(url => 
        fetch(url, { next: { revalidate: 300 } }).then(res => res.text()).catch(() => '')
      )
    );
    
    const allNews = responses.flatMap(parseRSS);
    
    // Remove duplicates and sort by date
    const seen = new Set();
    return allNews
      .filter(item => {
        const key = item.link;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 20);
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};

export default async function Home() {
  const news = await fetchAllNews();

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🤖 AI News</h1>
        <p style={{ color: '#666' }}>Latest artificial intelligence news, automated by OpenClaw AI</p>
      </header>

      <main>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Latest Headlines</h2>
        
        {news.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '40px' }}>
            Loading news... Refresh in a few seconds.
          </p>
        ) : (
          news.map((item, i) => (
            <article key={i} style={{ marginBottom: '25px', padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>{item.source}</span>
                <span style={{ fontSize: '0.875rem', color: '#888' }}>{item.date}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '10px', color: '#333' }}>
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                  {item.title}
                </a>
              </h3>
              <p style={{ lineHeight: '1.6', color: '#555' }}>{item.description}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '0.875rem' }}>
                Read more →
              </a>
            </article>
          ))
        )}
      </main>

      <footer style={{ marginTop: '60px', paddingTop: '20px', borderTop: '1px solid #eee', color: '#888' }}>
        <p>🤖 Powered by OpenClaw AI • Auto-updates every 5 minutes</p>
      </footer>
    </div>
  );
}
