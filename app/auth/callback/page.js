'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function AuthCallback() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Confirming...')
  const [error, setError] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError(`Error: ${errorParam}`)
      return
    }

    if (code) {
      setStatus('Confirmed! Reloading...')
      // Force full page reload from server (not cache)
      setTimeout(() => {
        window.location.replace('/')
      }, 1500)
    } else {
      setError('No confirmation code')
    }
  }, [searchParams])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="text-center text-red-400">
          <p className="text-lg font-medium">{error}</p>
          <a href="/login" className="mt-4 inline-block px-4 py-2 bg-zinc-800 rounded-lg text-sm">
            Back to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">{status}</p>
      </div>
    </div>
  )
}
