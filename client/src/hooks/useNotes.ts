import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotesStore } from '../store/notesStore'
import { fetchNotes } from '../api/notesApi'
import { getSocket } from '../api/socket'
import { PanelKey } from '../types'

export function useNotes() {
  const { token, user } = useAuth()
  const { setNotes, setPanel } = useNotesStore()
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  useEffect(() => {
    if (!token) return

    fetchNotes(token).then(setNotes).catch(console.error)

    const socket = getSocket()

    function onNoteChanged({ panelKey, content, userId }: { panelKey: PanelKey; content: string; userId: number }) {
      if (userId !== user?.id) {
        setPanel(panelKey, content)
      }
    }

    socket.on('note:changed', onNoteChanged)
    return () => { socket.off('note:changed', onNoteChanged) }
  }, [token, user?.id])

  function handleNoteChange(panelKey: PanelKey, content: string) {
    setPanel(panelKey, content)

    clearTimeout(debounceTimers.current[panelKey])
    debounceTimers.current[panelKey] = setTimeout(() => {
      if (!token) return
      const socket = getSocket()
      socket.emit('note:changed', { panelKey, content })
    }, 500)
  }

  return { handleNoteChange }
}
