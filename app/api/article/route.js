export const dynamic = 'force-dynamic'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return Response.json({ error: 'URL required' }, { status: 400 })
  }

  try {
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

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].replace(/\|.*$/, '').replace(/[-–] .*$/, '').trim() : 'Untitled Article'

    // Extract meta description
    let description = ''
    const descPatterns = [
      /<meta[^>]*name="description"[^>]*content="([^"]*)"/i,
      /<meta[^>]*content="([^"]*)"[^>]*name="description"/i,
      /<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i,
    ]
    for (const pattern of descPatterns) {
      const match = html.match(pattern)
      if (match) {
        description = match[1].trim()
        break
      }
    }

    // Find article content
    let content = ''
    
    // Try JSON-LD first
    const jsonLdMatch = html.match(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i)
    if (jsonLdMatch) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1])
        if (jsonLd.articleBody || jsonLd.description) {
          content = jsonLd.articleBody || jsonLd.description
        }
      } catch (e) {}
    }

    // Try article tag
    if (!content) {
      const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
      if (articleMatch) {
        content = articleMatch[1]
      }
    }

    // Try main content
    if (!content) {
      const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
      if (mainMatch) {
        content = mainMatch[1]
      }
    }

    // If still no content, get body
    if (!content) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
      content = bodyMatch ? bodyMatch[1] : html
    }

    // Clean content
    content = content
      // Remove scripts and styles
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
      .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
      .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<ins[^>]*>[\s\S]*?<\/ins>/g, '')
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '')
      .replace(/<advertisement[^>]*>[\s\S]*?<\/advertisement>/gi, '')
      .replace(/<ad[^>]*>[\s\S]*?<\/ad>/gi, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
      .replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
      .replace(/<select[^>]*>[\s\S]*?<\/select>/gi, '')

    // Process images
    content = content.replace(/<img([^>]*)src=["']([^"']*)["']([^>]*)>/gi, (match, before, src, after) => {
      if (!src || src.startsWith('data:') || src.includes('ad') || src.includes('track') || src.includes('pixel')) {
        return ''
      }
      // Fix relative URLs
      const fullSrc = src.startsWith('http') ? src : (src.startsWith('/') ? new URL(url).origin + src : new URL(src, url).href)
      return `<img src="${fullSrc}" alt="${title}" style="max-width:100%;height:auto;border-radius:8px;margin:16px auto;display:block;" loading="lazy" />`
    })

    // Fix links
    content = content.replace(/<a([^>]*)href=["']([^"']*)["']([^>]*)>/gi, (match, before, href, after) => {
      if (!href || href.startsWith('javascript:') || href.startsWith('#')) {
        return `<span${before}>`
      }
      const fullHref = href.startsWith('http') ? href : (href.startsWith('/') ? new URL(url).origin + href : new URL(href, url).href)
      return `<a href="${fullHref}" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:underline;"${before}>`
    })

    // Clean and format text
    content = content
      // Replace block elements with proper spacing
      .replace(/<\/p>/gi, '</p>\n\n')
      .replace(/<\/h[1-6]>/gi, '</h3>\n\n')
      .replace(/<\/li>/gi, '</li>\n')
      .replace(/<\/div>/gi, '</div>\n')
      .replace(/<\/section>/gi, '</section>\n')
      .replace(/<\/article>/gi, '</article>\n')

    // Convert remaining HTML to readable text with basic formatting
    const tempDiv = document ? document.createElement('div') : { innerHTML: content }
    // For server-side, we'll return raw HTML and let client handle it
    
    // Extract author
    let author = ''
    const authorPatterns = [
      /<meta[^>]*name="author"[^>]*content="([^"]*)"/i,
      /<meta[^>]*property="article:author"[^>]*content="([^"]*)"/i,
      /by\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
    ]
    for (const pattern of authorPatterns) {
      const match = html.match(pattern)
      if (match) {
        author = match[1].trim()
        break
      }
    }

    // Extract published date
    let date = ''
    const datePatterns = [
      /<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"/i,
      /<time[^>]*datetime="([^"]*)"/i,
    ]
    for (const pattern of datePatterns) {
      const match = html.match(pattern)
      if (match) {
        date = new Date(match[1]).toLocaleDateString()
        break
      }
    }

    // Limit content size
    if (content.length > 50000) {
      content = content.substring(0, 50000) + '\n\n<p>... (article truncated)</p>'
    }

    return Response.json({
      title: title.trim(),
      description,
      content,
      author,
      date,
      url,
      originalUrl: url
    })

  } catch (error) {
    console.error('Article parse error:', error)
    return Response.json({ error: 'Failed to parse article' }, { status: 500 })
  }
}
