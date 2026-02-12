import { fetchAINews } from '@/lib/news';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable cache completely

export async function GET() {
  try {
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
