import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { TickerEntry as TickerEntryType } from '../../types'

interface Props {
  entry: TickerEntryType
  isOwn: boolean
}

const EVENT_ICONS: Record<string, string> = {
  node_created: '➕',
  node_moved: '↔',
  node_label_changed: '✏️',
  node_deleted: '🗑',
  edge_created: '🔗',
  edge_deleted: '✂️',
  note_edited: '📝',
}

export default function TickerEntryRow({ entry, isOwn }: Props) {
  const icon = EVENT_ICONS[entry.eventType] ?? '•'
  const time = formatDistanceToNow(new Date(entry.occurredAt), { addSuffix: true })

  return (
    <div className={`px-3 py-2 border-b border-gray-100 ${isOwn ? 'bg-blue-50' : ''}`}>
      <div className="flex items-start gap-2">
        <span className="text-sm flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-700 leading-snug">{entry.summary}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[10px] font-medium ${isOwn ? 'text-blue-600' : 'text-purple-600'}`}>
              {entry.displayName}
            </span>
            <span className="text-[10px] text-gray-400">· {time}</span>
          </div>
          {entry.userNote && (
            <p className="text-[11px] text-gray-500 italic mt-1 pl-2 border-l-2 border-gray-300">
              {entry.userNote}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
