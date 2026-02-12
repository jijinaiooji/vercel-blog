import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`)
  }

  try {
    const supabase = createClient()
    
    // Get the current session first
    const { data: { session }, error: getError } = await supabase.auth.getSession()

    if (getError) {
      console.error('Get session error:', getError)
    }

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Exchange code error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_error`)
    }

    // Success - redirect to home
    return NextResponse.redirect(`${origin}/?confirmed=true`)
  } catch (err) {
    console.error('Auth callback exception:', err)
    return NextResponse.redirect(`${origin}/login?error=unknown_error`)
  }
}
