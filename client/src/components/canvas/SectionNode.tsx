import React, { useState, useCallback, useRef } from 'react'
import { NodeProps, Handle, Position } from 'reactflow'
import { CanvasNodeData } from '../../types'

const DOT = {
  width: 10,
  height: 10,
  background: '#0d527e',
  border: '2px solid white',
  borderRadius: '50%',
}

export default function SectionNode({ id, data, selected }: NodeProps<CanvasNodeData>) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(data.label)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDoubleClick = useCallback(() => {
    setDraft(data.label)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }, [data.label])

  const handleBlur = useCallback(() => {
    setEditing(false)
    if (draft.trim() !== data.label) {
      window.dispatchEvent(new CustomEvent('ww:node_label_change', { detail: { id, label: draft.trim() || 'Section' } }))
    }
  }, [draft, data.label, id])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur()
    }
    if (e.key === 'Escape') {
      setDraft(data.label)
      setEditing(false)
    }
  }, [data.label])

  const bgColor = data.color || '#f3f4f6'

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{ backgroundColor: bgColor, borderColor: bgColor === '#f3f4f6' ? '#d1d5db' : bgColor }}
      className={`
        w-[280px] min-h-[160px]
        border-2 border-dashed rounded-xl
        flex flex-col px-4 pt-2 pb-4
        cursor-default select-none
        ${selected ? 'ring-2 ring-gold-400 ring-offset-2' : ''}
        transition-all opacity-80
      `}
    >
      <Handle type="source" id="top" position={Position.Top} style={DOT} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={DOT} />
      <Handle type="source" id="left" position={Position.Left} style={DOT} />
      <Handle type="source" id="right" position={Position.Right} style={DOT} />

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="text-xs font-bold text-navy-500 uppercase tracking-wider bg-transparent border-none outline-none"
        />
      ) : (
        <span className="text-xs font-bold text-navy-500 uppercase tracking-wider">
          {data.label || 'Section'}
        </span>
      )}
    </div>
  )
}
