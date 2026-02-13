import { fetchAINews } from '@/lib/news';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('[Cron] Fetching AI news...');
    const articles = await fetchAINews();
    
    // Save to public folder for static serving
    const publicDir = join(process.cwd(), 'public');
    await writeFile(
      join(publicDir, 'news.json'),
      JSON.stringify({ articles, updatedAt: new Date().toISOString() }, null, 2)
    );
    
    console.log(`[Cron] Saved ${articles.length} articles to news.json`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      articlesCount: articles.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('[Cron] Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch news' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
