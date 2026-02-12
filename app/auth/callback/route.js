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
    
    // Set the session with the code
    const { data, error } = await supabase.auth.setSession({
      exchange_code: code,
    })
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/login?error=auth_error`)
    }

    // Verify session was set
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session) {
      // Success - redirect to home
      return NextResponse.redirect(`${origin}/?auth_success=true`)
    } else {
      return NextResponse.redirect(`${origin}/login?error=no_session`)
    }
  } catch (err) {
    console.error('Auth callback exception:', err)
    return NextResponse.redirect(`${origin}/login?error=unknown_error`)
  }
}
