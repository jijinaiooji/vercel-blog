'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ResetPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()

      if (res.ok) {
        setSuccess('Password updated! Redirecting...')
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } else {
        setError(data.error || 'Failed to update password')
      }
    } catch (err) {
      setError('Network error. Please try again.')
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
            Reset Password
          </h1>
          <p className={`mt-2 text-sm ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            Enter your new password below.
          </p>
        </div>

        {/* Card */}
        <Card className={`border-0 shadow-2xl ${
          isDark ? 'bg-zinc-900' : 'bg-white'
        }`}>
          <CardContent className="pt-8 pb-6">
            {error && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                isDark ? 'bg-red-900/20 text-red-400 border border-red-900/30' : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}
            {success && (
              <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 text-sm ${
                isDark ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
              }`}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                {success}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <label className={`text-sm font-medium ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  New Password
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

              <div className="space-y-2">
                <label className={`text-sm font-medium ${
                  isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`} />
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Update Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Link 
          href="/login" 
          className={`block mt-8 text-center text-sm hover:underline transition-colors ${
            isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  )
}
