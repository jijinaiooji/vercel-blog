'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, CheckCircle, AlertCircle } from 'lucide-react'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Processing...')
  const [error, setError] = useState('')

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        setError(`Authentication failed: ${error}`)
        return
      }

      if (!code) {
        setError('No confirmation code received.')
        return
      }

      // Small delay then redirect
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }

    handleCallback()
  }, [router, searchParams])

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
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium">Account confirmed!</p>
            <p className="text-sm text-zinc-400 mt-2">Redirecting...</p>
          </div>
        )}
      </div>
    </div>
  )
}
