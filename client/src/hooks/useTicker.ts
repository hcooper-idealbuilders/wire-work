import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTickerStore } from '../store/tickerStore'
import { fetchTicker } from '../api/tickerApi'
import { getSocket } from '../api/socket'
import { TickerEntry } from '../types'

export function useTicker() {
  const { token } = useAuth()
  const { setEntries, prependEntry, updateEntry } = useTickerStore()

  useEffect(() => {
    if (!token) return

    fetchTicker(token).then(setEntries).catch(console.error)

    const socket = getSocket()

    function onNewEntry({ entry }: { entry: TickerEntry }) {
      prependEntry(entry)
    }

    function onEntryUpdated({ entry }: { entry: TickerEntry }) {
      updateEntry(entry)
    }

    socket.on('ticker:new_entry', onNewEntry)
    socket.on('ticker:entry_updated', onEntryUpdated)

    return () => {
      socket.off('ticker:new_entry', onNewEntry)
      socket.off('ticker:entry_updated', onEntryUpdated)
    }
  }, [token])
}
