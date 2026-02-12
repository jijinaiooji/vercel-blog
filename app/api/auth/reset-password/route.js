import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST(request) {
  try {
    const { password, code } = await request.json()

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    if (!code) {
      return NextResponse.json(
        { error: 'Missing reset code' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Exchange the code for a session and update password
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      // If exchange fails, try updating directly
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })
      
      if (updateError) {
        return NextResponse.json(
          { error: 'Invalid or expired reset link. Please request a new password reset.' },
          { status: 400 }
        )
      }
    } else {
      // Code was valid, update password
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })
      
      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
