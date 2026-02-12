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
    
    // Exchange code for session - this sets cookies automatically
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_error`)
    }

    // Success - force full page reload by redirecting with a hash that triggers reload
    return NextResponse.redirect(`${origin}${next}#logged_in`)
  } catch (err) {
    console.error('Auth exception:', err)
    return NextResponse.redirect(`${origin}/login?error=unknown_error`)
  }
}
