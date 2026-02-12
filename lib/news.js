// Modern RSS fetcher with caching
const RSS_FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/news/rss.xml', color: '#10a37f' },
  { name: 'MIT AI', url: 'https://news.mit.edu/rss/topic/artificial-intelligence2', color: '#a31f71' },
  { name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', color: '#2d5bff' },
  { name: 'Google AI', url: 'http://googleaiblog.blogspot.com/atom.xml', color: '#4285f4' },
];

const parseRSS = (xml, sourceName, sourceColor) => {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];
    const title = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/)?.[1] || itemXml.match(/<title>(.*?)<\/title>/)?.[1] || 'Untitled';
    const link = itemXml.match(/<link>(.*?)<\/link>/)?.[1] || '';
    const description = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/)?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    
    if (title && link) {
      items.push({
        title: title.trim(),
        link,
        description: description.replace(/<[^>]+>/g, '').substring(0, 180).trim() + '...',
        date: new Date(pubDate),
        source: sourceName,
        sourceColor,
      });
    }
  }
  return items;
};

export async function fetchAINews() {
  const allNews = [];
  
  await Promise.all(
    RSS_FEEDS.map(async (feed) => {
      try {
        const res = await fetch(feed.url, { next: { revalidate: 300 } });
        const text = await res.text();
        allNews.push(...parseRSS(text, feed.name, feed.color));
      } catch (e) {
        console.error(`Error fetching ${feed.name}:`, e);
      }
    })
  );
  
  // Remove duplicates and sort
  const seen = new Set();
  return allNews
    .filter(item => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .sort((a, b) => b.date - a.date);
}

export function formatDate(date) {
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
