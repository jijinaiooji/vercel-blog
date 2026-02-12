'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

function CallbackContent() {
  const [status, setStatus] = useState('Processing...')
  const [error, setError] = useState('')
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')

    if (errorParam) {
      setError(`Error: ${errorParam}`)
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
  }, [])

  if (error) {
    return (
      <div className="text-red-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <p className="text-lg font-medium">{error}</p>
        <a href="/login" className="mt-4 inline-block px-4 py-2 bg-zinc-800 rounded-lg text-sm">
          Back to Login
        </a>
      </div>
    )
  }

  return (
    <div className="text-white">
      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
      <p className="text-lg font-medium">{status}</p>
    </div>
  )
}

function Loading() {
  return (
    <div className="text-white">
      <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-lg font-medium">Loading...</p>
    </div>
  )
}

export default function AuthCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-zinc-900" />
          </div>
        </Link>
        <Suspense fallback={<Loading />}>
          <CallbackContent />
        </Suspense>
      </div>
    </div>
  )
}
