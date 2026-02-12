const RSS_FEEDS = [
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', color: '#10a37f' },
  { name: 'MIT CSAIL', url: 'https://www.csail.mit.edu/rss/news/all.xml', color: '#a31f34' },
  { name: 'Google AI', url: 'https://b Gardner.googleblog.com/atom.xml', color: '#4285f4' },
  { name: 'AI News', url: 'https://artificialintelligence.news/feed/', color: '#ff6b35' },
  { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/', color: '#00a4ef' },
];

export async function fetchAINews() {
  const articles = [];
  
  for (const feed of RSS_FEEDS) {
    try {
      const response = await fetch(feed.url, {
        headers: { 'User-Agent': 'AI-News-Bot/1.0' },
        next: { revalidate: 43200 } // 12 hours
      });
      
      if (!response.ok) continue;
      
      const text = await response.text();
      const items = parseRSS(text);
      
      for (const item of items.slice(0, 5)) {
        articles.push({
          ...item,
          source: feed.name,
          sourceColor: feed.color,
          date: formatDate(item.pubDate),
        });
      }
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
    }
  }
  
  // Sort by date, newest first
  articles.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
  
  return articles.slice(0, 20);
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/;
  const dateRegex = /<pubDate>(.*?)<\/pubDate>/;
  
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const titleMatch = content.match(titleRegex);
    const linkMatch = content.match(linkRegex);
    const descMatch = content.match(descRegex);
    const dateMatch = content.match(dateRegex);
    
    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1] || titleMatch[2] || 'Untitled',
        link: linkMatch[1],
        description: (descMatch[1] || descMatch[2] || '')
          .replace(/<[^>]+>/g, '')
          .substring(0, 200) + '...',
        pubDate: dateMatch[1] || new Date().toISOString(),
        isoDate: dateMatch[1] || new Date().toISOString(),
      });
    }
  }
  
  return items;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
