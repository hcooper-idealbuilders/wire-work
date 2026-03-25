import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginScreen from './components/auth/LoginScreen'
import CanvasPane from './components/canvas/CanvasPane'
import NotesSection from './components/notes/NotesSection'
import ActivityTicker from './components/ticker/ActivityTicker'
import NotePromptModal from './components/NotePromptModal'

function AppShell() {
  const { user, logout } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  return (
    <div
      className="h-screen w-screen overflow-hidden bg-navy-50"
      style={{
        display: 'grid',
        gridTemplateAreas: '"canvas ticker" "notes ticker"',
        gridTemplateColumns: '1fr 280px',
        gridTemplateRows: '50vh 50vh',
      }}
    >
      {/* Canvas */}
      <div style={{ gridArea: 'canvas' }} className="overflow-hidden border-b border-navy-200">
        <ReactFlowProvider>
          <CanvasPane />
        </ReactFlowProvider>
      </div>

      {/* Notes */}
      <div style={{ gridArea: 'notes' }} className="overflow-hidden bg-white">
        <NotesSection />
      </div>

      {/* Ticker */}
      <div style={{ gridArea: 'ticker' }} className="overflow-hidden">
        <ActivityTicker />
      </div>

      {/* Ticker note prompt */}
      <NotePromptModal />

      {/* User info — tucked into ticker area */}
      <div className="fixed top-1 right-[8px] z-20 flex items-center gap-2">
        <span className="text-[10px] text-navy-400">{user.displayName}</span>
        <button
          onClick={logout}
          className="text-[10px] text-navy-300 hover:text-gold-500 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginOrRedirect />} />
          <Route path="/" element={<AppShell />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

function LoginOrRedirect() {
  const { user } = useAuth()
  if (user) return <Navigate to="/" replace />
  return <LoginScreen />
}
