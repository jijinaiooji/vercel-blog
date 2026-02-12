'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Confirming...')
  const [error, setError] = useState('')

  useEffect(() => {
    const hash = window.location.hash
    const error = new URLSearchParams(window.location.search).get('error')

    if (error) {
      setError(`Error: ${error}`)
      return
    }

    if (hash === '#logged_in') {
      setStatus('Confirmed! Refreshing...')
      // Small delay then reload
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-zinc-900" />
          </div>
        </Link>

        {error ? (
          <div className="text-red-400">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-medium">{error}</p>
            <Link href="/login" className="mt-4 inline-block px-4 py-2 bg-zinc-800 rounded-lg text-sm">
              Back to Login
            </Link>
          </div>
        ) : (
          <div className="text-white">
            <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium">{status}</p>
          </div>
        )}
      </div>
    </div>
  )
}
