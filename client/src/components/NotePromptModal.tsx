import React, { useState, useEffect, useRef } from 'react'
import { useTickerStore } from '../store/tickerStore'
import { getSocket } from '../api/socket'

const AUTO_DISMISS_MS = 10_000

export default function NotePromptModal() {
  const { prompt, closePrompt } = useTickerStore()
  const [note, setNote] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!prompt.open) {
      setNote('')
      return
    }
    inputRef.current?.focus()
    timerRef.current = setTimeout(closePrompt, AUTO_DISMISS_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [prompt.open, closePrompt])

  if (!prompt.open || prompt.entryId === null) return null

  function handleSave() {
    if (!note.trim() || prompt.entryId === null) {
      closePrompt()
      return
    }
    const socket = getSocket()
    socket.emit('ticker:note_added', { entryId: prompt.entryId, userNote: note.trim() })
    closePrompt()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') closePrompt()
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm">
      <div className="bg-navy-800 border border-navy-600 rounded-xl shadow-2xl p-4">
        <p className="text-xs text-navy-200 mb-2">Add a note to this change? <span className="text-navy-400">(optional)</span></p>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Added per client request..."
            className="flex-1 bg-navy-900 border border-navy-500 rounded-lg px-3 py-1.5 text-sm text-white placeholder-navy-400 focus:outline-none focus:border-gold-400"
          />
          <button
            onClick={handleSave}
            className="bg-gold-400 hover:bg-gold-500 text-navy-900 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            Save
          </button>
          <button
            onClick={closePrompt}
            className="text-navy-300 hover:text-white text-sm px-2 py-1.5 rounded-lg transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
