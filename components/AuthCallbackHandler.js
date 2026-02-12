'use client'

import { useEffect } from 'react'

export default function AuthCallbackHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('auth_callback') === 'true') {
      // Clear the parameter and reload
      window.history.replaceState({}, '', '/')
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }
  }, [])

  return null
}
