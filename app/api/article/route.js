export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'URL required' }, { status: 400 })
  }

  let articleUrl = url
  if (!articleUrl.startsWith('http')) {
    articleUrl = 'https://' + articleUrl
  }

  try {
    const response = await fetch(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      },
      signal: AbortSignal.timeout(8000)
    })

    if (!response.ok) {
      throw new Error('Failed to fetch')
    }

    const html = await response.text()

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    let title = titleMatch ? titleMatch[1].replace(/\|.*$/, '').trim() : 'Untitled'

    let author = ''
    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"/i)
    if (authorMatch) author = authorMatch[1].trim()

    let date = ''
    const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"/i)
    if (dateMatch) {
      try {
        date = new Date(dateMatch[1]).toLocaleDateString('en-GB')
      } catch (e) {}
    }

    let text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')
      .trim()

    const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                        html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    if (articleMatch) {
      let content = articleMatch[1]
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
        .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
        .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim()
      text = content
    }

    if (text.length > 10000) {
      text = text.substring(0, 10000) + '...'
    }

    return Response.json({ title, content: text, author, date, url: articleUrl })

  } catch (error) {
    console.error('Article fetch error:', error)
    return Response.json({
      title: 'Article',
      content: 'Unable to load article content. Please visit the original site.',
      author: '',
      date: '',
      url: articleUrl,
      error: true
    })
  }
}
