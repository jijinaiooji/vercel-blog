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
      signal: AbortSignal.timeout(6000)
    })

    if (!res.ok) throw new Error('Failed')

    const html = await res.text()

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].split('|')[0].split('-')[0].trim() : 'Article'

    // Extract author
    const authorMatch = html.match(/<meta[^>]*name="author"[^>]*content="([^"]*)"/i)
    const author = authorMatch ? authorMatch[1] : ''

    // Extract date
    const dateMatch = html.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]*)"/i)
    let date = ''
    if (dateMatch) {
      try { date = new Date(dateMatch[1]).toLocaleDateString('en-GB') } catch (e) {}
    }

    // Get main content
    let content = html
    content = content.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    content = content.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    content = content.replace(/<!--[\s\S]*?-->/g, '')
    content = content.replace(/<ins[^>]*>[\s\S]*?<\/ins>/g, '')
    content = content.replace(/<aside[^>]*>[\s\S]*?<\/aside>/g, '')
    content = content.replace(/<script[^>]*\/>/g, '')
    content = content.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/g, '')

    // Get article or main
    const articleMatch = content.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
    const mainMatch = content.match(/<main[^>]*>([\s\S]*?)<\/main>/i)
    content = articleMatch ? articleMatch[1] : (mainMatch ? mainMatch[1] : content)

    // Extract paragraphs with their content
    let paragraphs = []
    
    // Get h1-h3 headings
    const headings = []
    let hMatch
    const hRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h[1-6]>/gi
    while ((hMatch = hRegex.exec(content)) !== null) {
      headings.push({ level: parseInt(hMatch[1]), text: cleanText(hMatch[2]) })
    }

    // Get paragraphs
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi
    while ((hMatch = pRegex.exec(content)) !== null) {
      const text = cleanText(hMatch[1])
      if (text.length > 20) {
        paragraphs.push({ type: 'p', text })
      }
    }

    // Get list items
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi
    const lists = []
    let liMatch
    let currentList = []
    while ((liMatch = liRegex.exec(content)) !== null) {
      const text = cleanText(liMatch[1])
      if (text) currentList.push(text)
    }
    if (currentList.length > 0) {
      paragraphs.push({ type: 'ul', items: currentList })
    }

    // Get blockquotes
    const bqRegex = /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi
    while ((hMatch = bqRegex.exec(content)) !== null) {
      const text = cleanText(hMatch[1])
      if (text) {
        paragraphs.push({ type: 'quote', text })
      }
    }

    // Combine headings and paragraphs in order
    let formattedContent = []
    let hIndex = 0
    let pIndex = 0
    
    // Merge headings and paragraphs
    const allContent = []
    const hRegex2 = /<h([1-6])[^>]*>([\s\S]*?)<\/h[1-6]>/gi
    const tempContent = content
    let lastIndex = 0
    let match
    
    while ((match = hRegex2.exec(tempContent)) !== null) {
      // Add any text between last match and this one
      const between = tempContent.substring(lastIndex, match.index)
      if (between.trim()) {
        const pText = cleanText(between)
        if (pText.length > 20) {
          allContent.push({ type: 'p', text: pText })
        }
      }
      allContent.push({ type: 'h', level: parseInt(match[1]), text: cleanText(match[2]) })
      lastIndex = hRegex2.lastIndex
    }
    
    // Add remaining content
    const remaining = tempContent.substring(lastIndex)
    if (remaining.trim()) {
      const pText = cleanText(remaining)
      if (pText.length > 20) {
        allContent.push({ type: 'p', text: pText })
      }
    }

    // Build formatted output
    let output = []
    for (const item of allContent) {
      if (item.type === 'h') {
        if (item.level <= 3) {
          output.push(`\n\n### ${item.text}\n\n`)
        }
      } else if (item.type === 'p') {
        output.push(item.text + '\n\n')
      }
    }

    let finalContent = output.join('').trim()
    
    // Clean up
    finalContent = finalContent
      .replace(/\n{4,}/g, '\n\n\n')
      .replace(/###\s+/g, '\n\n**')
      .replace(/([^\n])\*\*/g, '$1\n\n**')
      .replace(/\*\*([^\n]+)\*\*/g, '**$1**')
      .trim()

    // Truncate
    if (finalContent.length > 6000) {
      finalContent = finalContent.substring(0, 6000) + '\n\n...'
    }

    return Response.json({ title, content: finalContent, author, date, url: articleUrl })

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

function cleanText(text) {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}
