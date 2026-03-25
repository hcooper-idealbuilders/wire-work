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

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [entries.length])

  return (
    <div className="flex flex-col h-full bg-white border-l border-navy-200">
      <div className="px-3 py-2 border-b border-navy-200 bg-navy-600 flex-shrink-0">
        <h3 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Activity</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div ref={topRef} />
        {entries.length === 0 && (
          <p className="text-xs text-navy-300 text-center py-6 px-3">
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
