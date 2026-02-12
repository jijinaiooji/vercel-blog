import { fetchAINews } from '@/lib/news';

export const dynamic = 'force-dynamic';
export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const articles = await fetchAINews();
    return Response.json({ articles });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
}
