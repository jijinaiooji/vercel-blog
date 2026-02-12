'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing...')
  const [error, setError] = useState('')
  const [reloaded, setReloaded] = useState(false)

  useEffect(() => {
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    if (error) {
      setError(`Error: ${error}`)
      return
    }

    if (code) {
      const exchangeCode = async () => {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          setError(error.message)
        } else {
          setStatus('Confirmed! Refreshing...')
          setTimeout(() => {
            window.location.href = '/'
          }, 1500)
        }
      }

      exchangeCode()
    } else {
      setError('No confirmation code')
    }
  }, [searchParams])

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        'bg-zinc-950'
      }`}>
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-zinc-900" />
            </div>
          </Link>
          <div className="text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
            <a href="/login" className="mt-4 inline-block px-4 py-2 bg-zinc-800 rounded-lg text-sm">
              Back to Login
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      'bg-zinc-950'
    }`}>
      <div className="text-center text-white">
        <Link href="/" className="inline-flex items-center gap-2 group mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-zinc-900" />
          </div>
        </Link>
        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
        <p className="text-lg font-medium">{status}</p>
      </div>
    </div>
  )
}
