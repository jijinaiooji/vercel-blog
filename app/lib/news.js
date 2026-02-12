function formatTwitterDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return `${diffSeconds}s`;
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }
  if (diffHours < 24) {
    return `${diffHours}h`;
  }
  if (diffDays < 365) {
    return `${diffDays}d`;
  }
  
  return formatDateFull(date);
}

function formatDateFull(date) {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

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
        next: { revalidate: 0 }
      });
      
      if (!response.ok) continue;
      
      const text = await response.text();
      const items = parseRSS(text);
      
      for (const item of items.slice(0, 5)) {
        articles.push({
          ...item,
          source: feed.name,
          sourceColor: feed.color,
          date: formatTwitterDate(item.pubDate),
          formattedDate: formatDateFull(new Date(item.pubDate)),
          pubDate: item.pubDate,
        });
      }
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
    }
  }
  
  articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
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
      });
    }
  }
  
  return items;
}
