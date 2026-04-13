import React, { useState, useCallback, useRef } from 'react'
import { NodeProps, Handle, Position } from 'reactflow'
import { CanvasNodeData } from '../../types'
import { useAutosizeTextarea } from '../../hooks/useAutosizeTextarea'

const DOT = {
  width: 10,
  height: 10,
  background: '#0d527e',
  border: '2px solid white',
  borderRadius: '50%',
}

export default function StickyNode({ id, data, selected }: NodeProps<CanvasNodeData>) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(data.label)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  useAutosizeTextarea(inputRef, editing ? draft : data.label)

  const handleDoubleClick = useCallback(() => {
    setDraft(data.label)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }, [data.label])

  const handleBlur = useCallback(() => {
    setEditing(false)
    if (draft.trim() !== data.label) {
      window.dispatchEvent(new CustomEvent('ww:node_label_change', { detail: { id, label: draft.trim() || 'Note' } }))
    }
  }, [draft, data.label, id])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setDraft(data.label)
      setEditing(false)
    }
  }, [data.label])

  const bgColor = data.color || '#fef9c3'

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{ backgroundColor: bgColor }}
      className={`
        w-[180px] min-h-[120px] overflow-hidden
        shadow-md rounded
        flex flex-col px-3 py-2
        cursor-default select-none
        border
        ${selected ? 'border-gold-400 shadow-lg' : 'border-navy-200'}
        transition-all
      `}
    >
      <Handle type="source" id="top" position={Position.Top} style={DOT} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={DOT} />
      <Handle type="source" id="left" position={Position.Left} style={DOT} />
      <Handle type="source" id="right" position={Position.Right} style={DOT} />

      {editing ? (
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={1}
          className="w-full flex-1 text-sm text-gray-800 bg-transparent border-none outline-none resize-none overflow-hidden whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
        />
      ) : (
        <span className="w-full text-sm text-gray-800 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {data.label || 'Double-click to add notes…'}
        </span>
      )}
    </div>
  )
}
