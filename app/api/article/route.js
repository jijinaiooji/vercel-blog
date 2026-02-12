export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  let url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    // Add https if no protocol
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch article' }, { status: 400 })
    }

    const html = await response.text()

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].replace(/\|.*$/, '').replace(/[-–] .*$/, '').trim() : 'Untitled Article'

    // Extract description
    let description = ''
    const descMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i) ||
                    html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)
    if (descMatch) description = descMatch[1].trim()

    // Extract text content only
    let content = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<ins[^>]*>[\s\S]*?<\/ins>/g, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/g, '')
      .replace(/<form[^>]*>[\s\S]*?<\/form>/g, '')

    // Get body or article
    const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i) ||
                        content.match(/<main[^>]*>([\s\S]*?)<\/main>/i) ||
                        content.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    content = articleMatch ? articleMatch[1] : content

    // Convert to plain text with basic formatting
    content = content
      .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '\n\n### $1\n\n')
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n• $1')
      .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1')
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '\n[IMAGE: $2]\n')
      .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '\n[IMAGE]\n')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '') // Remove remaining tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/\[\s¶]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/^\n+/, '')
      .replace(/\n+$/, '')
      .trim()

    // Limit size
    if (content.length > 15000) {
      content = content.substring(0, 15000) + '\n\n...'
    }

    // Extract author
    let author = ''
    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"/i) ||
                       html.match(/<meta[^>]*property="article:author"[^>]*content="([^"]*)"/i)
    if (authorMatch) author = authorMatch[1].trim()

    // Extract date
    let date = ''
    const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"/i) ||
                     html.match(/<time[^>]*datetime="([^"]*)"/i)
    if (dateMatch) {
      try {
        date = new Date(dateMatch[1]).toLocaleDateString()
      } catch (e) {}
    }

    return Response.json({
      title: title,
      description: description,
      content: content,
      author: author,
      date: date,
      url: url,
      originalUrl: url
    })

  } catch (error) {
    console.error('Article parse error:', error)
    return Response.json({ 
      error: error.message || 'Failed to load article',
      message: 'The article could not be loaded. Tap "Read on original site" below.'
    }, { status: 500 })
  }
}
