import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import { User } from '../types'
import { initSocket, disconnectSocket } from '../api/socket'

interface AuthContextValue {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'ww_token'
const STORAGE_USER = 'ww_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY)
    const storedUser = localStorage.getItem(STORAGE_USER)
    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode<{ exp: number }>(storedToken)
        if (decoded.exp * 1000 > Date.now()) {
          const parsedUser = JSON.parse(storedUser) as User
          setToken(storedToken)
          setUser(parsedUser)
          initSocket(storedToken)
        } else {
          localStorage.removeItem(STORAGE_KEY)
          localStorage.removeItem(STORAGE_USER)
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(STORAGE_USER)
      }
    }
  }, [])

  function login(user: User, token: string) {
    localStorage.setItem(STORAGE_KEY, token)
    localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    setUser(user)
    setToken(token)
    initSocket(token)
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(STORAGE_USER)
    setUser(null)
    setToken(null)
    disconnectSocket()
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
