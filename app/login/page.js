'use client'

import { useState, useEffect, createElement } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
    
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push('/')
      }
    })
  }, [router, supabase])

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Account created! Check your email for confirmation.')
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSuccess('Check your email for reset link.')
    }
    setLoading(false)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-500 ${
      isDark ? 'bg-zinc-950' : 'bg-zinc-50'
    }`}>
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
              isDark ? 'bg-white' : 'bg-zinc-900'
            }`}>
              <Zap className={`w-7 h-7 ${isDark ? 'text-zinc-900' : 'text-white'}`} />
            </div>
          </Link>
          <h1 className={`mt-6 text-3xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-zinc-900'
          }`}>
            AI News
          </h1>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            {mode === 'login' && 'Welcome back. Sign in to continue.'}
            {mode === 'signup' && 'Create your account to get started.'}
            {mode === 'forgot' && 'Enter your email to reset password.'}
          </p>
        </div>

        {/* Card */}
        <Card className={`border-0 shadow-2xl ${
          isDark ? 'bg-zinc-900' : 'bg-white'
        }`}>
          <CardContent className="pt-8 pb-6">
            {/* Error/Success */}
            {error && (
              <div className={`mb-4 p-4 rounded-xl ${
                isDark ? 'bg-red-900/20 text-red-400 border border-red-900/30' : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  {error}
                </div>
              </div>
            )}
            {success && (
              <div className={`mb-4 p-4 rounded-xl ${
                isDark ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{success}</p>
                    <p className="mt-2 text-xs opacity-75">
                      💡 Tip: Check spam folder if email doesn't arrive.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleForgot} className="space-y-5">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`} />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className={`pl-11 h-12 rounded-xl ${
                      isDark 
                        ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600' 
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300'
                    }`}
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-2">
                  <label className={`text-sm font-medium ${
                    isDark ? 'text-zinc-300' : 'text-zinc-700'
                  }`}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? 'text-zinc-500' : 'text-zinc-400'
                    }`} />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className={`pl-11 h-12 rounded-xl ${
                        isDark 
                          ? 'bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-600' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-300'
                      }`}
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-12 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  isDark 
                    ? 'bg-white text-zinc-900 hover:bg-zinc-200' 
                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Mode Switch */}
            <div className={`mt-8 text-center text-sm ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              {mode === 'login' && (
                <>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
                    className={`font-medium hover:underline ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    Sign up
                  </button>
                  <br />
                  <button 
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                    className="hover:underline mt-3 inline-block"
                  >
                    Forgot password?
                  </button>
                </>
              )}
              {mode === 'signup' && (
                <>
                  Already have an account?{' '}
                  <button 
                    onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                    className={`font-medium hover:underline ${
                      isDark ? 'text-white' : 'text-zinc-900'
                    }`}
                  >
                    Sign in
                  </button>
                </>
              )}
              {mode === 'forgot' && (
                <button 
                  onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
                  className="hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Back */}
        <Link 
          href="/" 
          className={`block mt-8 text-center text-sm hover:underline transition-colors ${
            isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          ← Back to AI News
        </Link>
      </div>
    </div>
  )
}
