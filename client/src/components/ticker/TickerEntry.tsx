import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { TickerEntry as TickerEntryType } from '../../types'

interface Props {
  entry: TickerEntryType
  isOwn: boolean
}

const EVENT_ICONS: Record<string, string> = {
  node_created: '+',
  node_moved: '~',
  node_label_changed: '*',
  node_color_changed: '#',
  node_deleted: 'x',
  edge_created: '>',
  edge_deleted: '-',
  note_edited: '...',
}

export default function TickerEntryRow({ entry, isOwn }: Props) {
  const icon = EVENT_ICONS[entry.eventType] ?? '.'
  const time = formatDistanceToNow(new Date(entry.occurredAt), { addSuffix: true })

  return (
    <div className={`px-3 py-2 border-b border-navy-50 ${isOwn ? 'bg-gold-50' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="text-xs font-mono text-navy-400 flex-shrink-0 mt-0.5 w-4 text-center">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-navy-700 leading-snug">{entry.summary}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[10px] font-medium ${isOwn ? 'text-gold-600' : 'text-navy-500'}`}>
              {entry.displayName}
            </span>
            <span className="text-[10px] text-navy-300">· {time}</span>
          </div>
          {entry.userNote && (
            <p className="text-[11px] text-navy-400 italic mt-1 pl-2 border-l-2 border-gold-300">
              {entry.userNote}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
