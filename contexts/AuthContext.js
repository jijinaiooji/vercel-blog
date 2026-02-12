'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { supabase, onAuthStateChange, getUser, signOut } from '@/lib/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Force reload when hash changes (after auth callback)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#logged_in') {
        window.location.reload()
      }
    }
    
    // Check on load
    if (window.location.hash === '#logged_in') {
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    console.log('AuthContext: Initializing...')
    
    // Check initial session
    getUser().then((userData) => {
      console.log('AuthContext: getUser result:', userData)
      setUser(userData)
      setLoading(false)
    }).catch((err) => {
      console.error('AuthContext: getUser error:', err)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('AuthContext: onAuthStateChange:', event, session?.user?.email)
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
