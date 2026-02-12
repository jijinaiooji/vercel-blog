export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'URL required' }, { status: 400 })
  }

  let articleUrl = url.startsWith('http') ? url : 'https://' + url

  try {
    const res = await fetch(articleUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(5000)
    })

    if (!res.ok) throw new Error('Failed')

    const html = await res.text()

    // Get title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].split('|')[0].split('-')[0].trim() : 'Article'

    // Get author
    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"/i)
    const author = authorMatch ? authorMatch[1] : ''

    // Get date
    const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"/i)
    let date = ''
    if (dateMatch) {
      try { date = new Date(dateMatch[1]).toLocaleDateString() } catch (e) {}
    }

    // Get main content - keep paragraphs
    let content = html
    content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    content = content.replace(/<!--[\s\S]*?-->/g, '')
    
    // Find article or main tag
    const articleTag = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    const mainTag = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    content = articleTag ? articleTag[1] : (mainTag ? mainTag[1] : content)

    // Convert to readable text
    content = content
      .replace(/<h[1-6][^>]*>/gi, '\n\n### ')
      .replace(/<\/h[1-6]>/gi, '\n\n')
      .replace(/<p[^>]*>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<li[^>]*>/gi, '\n• ')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim()

    // Clean up
    content = content.replace(/###\s+/g, '### ')
    content = content.replace(/\n\s*\n\s*/g, '\n\n')
    content = content.trim()

    // Truncate if too long
    if (content.length > 8000) {
      content = content.substring(0, 8000) + '\n\n...'
    }

    return Response.json({ title, content, author, date, url: articleUrl })

  } catch (err) {
    console.error('Article error:', err)
    return Response.json({
      title: 'Unable to Load',
      content: 'Could not load this article. Please visit the original site to read it.',
      author: '',
      date: '',
      url: articleUrl,
      error: true
    })
  }
}
