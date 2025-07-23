import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authService } from '../services/authService'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; company_name?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    authService.getSession().then((session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = authService.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { user, session } = await authService.signUp(email, password, fullName)
    setUser(user)
    setSession(session)
  }

  const signIn = async (email: string, password: string) => {
    const { user, session } = await authService.signIn(email, password)
    setUser(user)
    setSession(session)
  }

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle()
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setSession(null)
  }

  const updateProfile = async (updates: { full_name?: string; company_name?: string }) => {
    await authService.updateProfile(updates)
    // Refresh user data
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}