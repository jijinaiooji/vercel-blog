function formatTwitterDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds}s`;
  if (diffMinutes < 60) return `${diffMinutes}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 365) return `${diffDays}d`;
  
  return formatDateFull(date);
}

function formatDateFull(date) {
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

const RSS_FEEDS = [
  // Major Labs
  { name: 'OpenAI', url: 'https://openai.com/blog/rss.xml', color: '#10a37f' },
  { name: 'Anthropic', url: 'https://www.anthropic.com/rss.xml', color: '#d4a574' },
  { name: 'Google AI', url: 'https://b Gardner.googleblog.com/atom.xml', color: '#4285f4' },
  { name: 'Meta AI', url: 'https://ai.meta.com/blog/rss.xml', color: '#0668E1' },
  { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/', color: '#00a4ef' },
  { name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml', color: '#4285f4' },
  { name: 'Stability AI', url: 'https://stability.ai/rss.xml', color: '#0066cc' },
  
  // Research & News
  { name: 'MIT CSAIL', url: 'https://www.csail.mit.edu/rss/news/all.xml', color: '#a31f34' },
  { name: 'AI News', url: 'https://artificialintelligence.news/feed/', color: '#ff6b35' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed', color: '#000000' },
  { name: 'The Gradient', url: 'https://thegradient.pub/feed', color: '#5c6bc0' },
  { name: 'Last Week in AI', url: 'https://lastweekin.ai/feed', color: '#26a69a' },
  
  // Newsletters & Blogs
  { name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', color: '#ffd700' },
  { name: 'NVIDIA', url: 'https://blogs.nvidia.com/blog/category/deep-learning/feed/', color: '#76b900' },
  { name: 'AssemblyAI', url: 'https://www.assemblyai.com/blog/rss.xml', color: '#6366f1' },
  { name: 'Cohere', url: 'https://cohere.com/blog/rss.xml', color: '#0f9d58' },
  { name: 'LangChain', url: 'https://blog.langchain.dev/rss/', color: '#0066cc' },
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
  
  return articles.slice(0, 30);
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/;
  const dateRegex = /<pubDate>(.*?)<\/pubDate>/;
  // Extract media:content or media:thumbnail
  const mediaRegex = /<media:(content|thumbnail)[^>]*url="([^"]*)"[^>]*>|<media:content[^>]*>([\s\S]*?)<\/media:content>/i;
  // Extract enclosure
  const enclosureRegex = /<enclosure[^>]*url="([^"]*)"[^>]*type="image\/[^"]*"[^>]*\/>/i;
  // Extract from content:encoded
  const contentImgRegex = /<content:encoded>[\s\S]*?<img[^>]*src="([^"]*)"[^>]*>[\s\S]*<\/content:encoded>/i;
  
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const titleMatch = content.match(titleRegex);
    const linkMatch = content.match(linkRegex);
    const descMatch = content.match(descRegex);
    const dateMatch = content.match(dateRegex);
    
    // Try to extract image
    let image = '';
    const mediaMatch = content.match(mediaRegex);
    if (mediaMatch) {
      image = mediaMatch[2] || mediaMatch[3] || '';
    }
    if (!image) {
      const enclosureMatch = content.match(enclosureRegex);
      if (enclosureMatch) image = enclosureMatch[1];
    }
    if (!image) {
      const contentImgMatch = content.match(contentImgRegex);
      if (contentImgMatch) image = contentImgMatch[1];
    }
    
    // Clean description
    let description = (descMatch[1] || descMatch[2] || '');
    if (description.includes('[')) {
      description = description.replace(/\[[^\]]*\]/g, '');
    }
    description = description
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 200);
    if (description.length === 200) description += '...';
    
    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1] || titleMatch[2] || 'Untitled',
        link: linkMatch[1],
        description: description,
        pubDate: dateMatch[1] || new Date().toISOString(),
        image: image,
      });
    }
  }
  
  return items;
}
