import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginScreen from './components/auth/LoginScreen'
import CanvasPane from './components/canvas/CanvasPane'
import NotesSection from './components/notes/NotesSection'
import ActivityTicker from './components/ticker/ActivityTicker'
import NotePromptModal from './components/NotePromptModal'

function HorizontalHandle() {
  return (
    <PanelResizeHandle className="group relative h-1 bg-navy-200 hover:bg-gold-400 data-[resize-handle-state=drag]:bg-gold-500 transition-colors">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-1 w-8 rounded bg-navy-300 group-hover:bg-gold-500" />
    </PanelResizeHandle>
  )
}

function VerticalHandle() {
  return (
    <PanelResizeHandle className="group relative w-1 bg-navy-200 hover:bg-gold-400 data-[resize-handle-state=drag]:bg-gold-500 transition-colors">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-8 rounded bg-navy-300 group-hover:bg-gold-500" />
    </PanelResizeHandle>
  )
}

function AppShell() {
  const { user, logout } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="h-screen w-screen overflow-hidden bg-navy-50 relative">
      <PanelGroup direction="horizontal" autoSaveId="wire-work-horizontal">
        <Panel id="main" order={1} defaultSize={75} minSize={10} collapsible collapsedSize={0}>
          <PanelGroup direction="vertical" autoSaveId="wire-work-vertical">
            <Panel id="canvas" order={1} defaultSize={50} minSize={10} collapsible collapsedSize={0}>
              <div className="h-full w-full overflow-hidden">
                <ReactFlowProvider>
                  <CanvasPane />
                </ReactFlowProvider>
              </div>
            </Panel>
            <HorizontalHandle />
            <Panel id="notes" order={2} defaultSize={50} minSize={10} collapsible collapsedSize={0}>
              <div className="h-full w-full overflow-hidden bg-white">
                <NotesSection />
              </div>
            </Panel>
          </PanelGroup>
        </Panel>
        <VerticalHandle />
        <Panel id="ticker" order={2} defaultSize={25} minSize={5} collapsible collapsedSize={0}>
          <div className="h-full w-full overflow-hidden">
            <ActivityTicker />
          </div>
        </Panel>
      </PanelGroup>

      <NotePromptModal />

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
