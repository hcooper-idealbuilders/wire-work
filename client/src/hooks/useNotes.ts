import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotesStore } from '../store/notesStore'
import { fetchNotes, patchNote } from '../api/notesApi'
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
      // Only apply remote changes
      if (userId !== user?.id) {
        setPanel(panelKey, content)
      }
    }

    socket.on('note:changed', onNoteChanged)
    return () => { socket.off('note:changed', onNoteChanged) }
  }, [token])

  function handleNoteChange(panelKey: PanelKey, content: string, onSaved?: (entryId: number) => void) {
    setPanel(panelKey, content)

    clearTimeout(debounceTimers.current[panelKey])
    debounceTimers.current[panelKey] = setTimeout(async () => {
      if (!token) return
      try {
        await patchNote(token, panelKey, content)
        const socket = getSocket()
        socket.emit('note:changed', { panelKey, content })
        // Ticker entry ID comes back via ticker:new_entry event
      } catch (err) {
        console.error('Failed to save note', err)
      }
    }, 500)
  }

  return { handleNoteChange }
}
