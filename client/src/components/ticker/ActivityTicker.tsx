import React, { useEffect, useRef } from 'react'
import { useTickerStore } from '../../store/tickerStore'
import { useAuth } from '../../context/AuthContext'
import { useTicker } from '../../hooks/useTicker'
import TickerEntryRow from './TickerEntry'

export default function ActivityTicker() {
  useTicker()
  const { entries } = useTickerStore()
  const { user } = useAuth()
  const topRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to top when new entries arrive (newest first)
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries.length])

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      <div className="px-3 py-2 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Activity</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div ref={topRef} />
        {entries.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-6 px-3">
            Changes will appear here as you and your collaborator work.
          </p>
        )}
        {entries.map((entry) => (
          <TickerEntryRow key={entry.id} entry={entry} isOwn={entry.userId === user?.id} />
        ))}
      </div>
    </div>
  )
}
