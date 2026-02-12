export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'URL required' }, { status: 400 })
  }

  try {
    // Fetch the article HTML
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AI-News-Reader/1.0)'
      },
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      return Response.json({ error: 'Failed to fetch article' }, { status: 400 })
    }

    const html = await response.text()

    // Simple HTML parser and content extractor (Mozilla Readability-like)
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].replace(/\|.*$/, '').trim() : 'Untitled Article'

    // Extract meta description
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) ||
                     html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i)
    const description = descMatch ? descMatch[1].trim() : ''

    // Extract main content using simple heuristics
    const contentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    let content = contentMatch ? contentMatch[1] : ''

    // If no article tag, try to find main content
    if (!content) {
      const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
      content = mainMatch ? mainMatch[1] : html
    }

    // Clean up content - remove scripts, styles, nav, footer, comments
    content = content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<ins[^>]*>[\s\S]*?<\/ins>/g, '')
      .replace(/<ads[^>]*>[\s\S]*?<\/ads>/g, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/g, '')
      .replace(/<form[^>]*>[\s\S]*?<\/form>/g, '')
      .replace(/<button[^>]*>[\s\S]*?<\/button>/g, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')

    // Extract images and clean tags
    content = content.replace(/<img([^>]*)src="([^"]*)"([^>]*)>/gi, (match, before, src, after) => {
      // Only keep images with reasonable src
      if (src && !src.startsWith('data:') && !src.includes('ad') && !src.includes('track')) {
        return `<img${before}src="${src}"${after} style="max-width:100%;height:auto;border-radius:8px;margin:16px 0;" loading="lazy" />`
      }
      return ''
    })

    // Clean HTML tags but keep basic formatting
    content = content
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '<p>$1</p>')
      .replace(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi, '<h3>$1</h3>')
      .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '<span class="link" data-url="$1">$2</span>')
      .replace(/<br\s*\/?>/gi, '<br />')
      .replace(/<hr\s*\/?>/gi, '<hr />')

    // Truncate if too long (first 15KB)
    if (content.length > 15000) {
      content = content.substring(0, 15000) + '...'
    }

    return Response.json({
      title,
      description,
      content,
      url,
      originalUrl: url
    })

  } catch (error) {
    console.error('Article parse error:', error)
    return Response.json({ error: 'Failed to parse article' }, { status: 500 })
  }
}
