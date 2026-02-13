import { fetchAINews } from '@/lib/news';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getCachedNews() {
  const publicDir = join(process.cwd(), 'public');
  const newsPath = join(publicDir, 'news.json');
  
  if (existsSync(newsPath)) {
    try {
      const data = await readFile(newsPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading cached news:', e);
    }
  }
  return null;
}

export async function GET() {
  try {
    // Try cached version first (from cron job)
    const cached = await getCachedNews();
    
    if (cached && cached.articles) {
      return new Response(JSON.stringify({ 
        articles: cached.articles,
        cached: true,
        updatedAt: cached.updatedAt
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300'
        }
      });
    }
    
    // Fallback: fetch live if no cache
    console.log('No cache, fetching live news...');
    const articles = await fetchAINews();
    return new Response(JSON.stringify({ articles }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
