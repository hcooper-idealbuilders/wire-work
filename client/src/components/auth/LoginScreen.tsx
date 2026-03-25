import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { login as apiLogin } from '../../api/authApi'

export default function LoginScreen() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token, user } = await apiLogin(username, password)
      login(user, token)
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center">
      <div className="bg-navy-800 border border-navy-600 rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <h1 className="text-2xl font-bold text-gold-400 mb-1">Wire Work</h1>
        <p className="text-navy-200 text-sm mb-6">Ideal Builders — Workflow Development</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-navy-900 border border-navy-500 rounded-lg px-3 py-2 text-white placeholder-navy-400 focus:outline-none focus:border-gold-400"
              placeholder="Enter username"
              autoFocus
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-200 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-navy-900 border border-navy-500 rounded-lg px-3 py-2 text-white placeholder-navy-400 focus:outline-none focus:border-gold-400"
              placeholder="Enter password"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-50 text-navy-900 font-semibold py-2 rounded-lg transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
