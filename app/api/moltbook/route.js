import { createBrowserClient } from '@supabase/ssr'

export async function POST(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const title = searchParams.get('title')
  const apiKey = searchParams.get('apiKey')

  if (!url || !apiKey) {
    return Response.json({ error: 'URL and API key required' }, { status: 400 })
  }

  try {
    // Register as agent on Moltbook
    // This is a placeholder - Moltbook API integration
    const moltbookResponse = await fetch('https://www.moltbook.com/api/v1/bookmarks', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        title: title,
        source: 'AI News Aggregator',
        tags: ['ai', 'news', 'artificial-intelligence']
      })
    })

    if (moltbookResponse.ok) {
      const data = await moltbookResponse.json()
      return Response.json({ success: true, moltbookUrl: data.url })
    } else {
      return Response.json({ error: 'Failed to save to Moltbook' }, { status: 400 })
    }
  } catch (error) {
    console.error('Moltbook error:', error)
    return Response.json({ error: 'Moltbook API error' }, { status: 500 })
  }
}

// Get Moltbook agent registration info
export async function GET() {
  return Response.json({
    info: 'To register as a Moltbook agent:',
    steps: [
      '1. Go to https://www.moltbook.com/',
      '2. Create an account or login',
      '3. Get your API key from settings',
      '4. Add MOLTBOOK_API_KEY to your .env file',
      '5. The API will then save articles to your Moltbook'
    ],
    apiEndpoint: '/api/moltbook?url=...&title=...&apiKey=...'
  })
}
