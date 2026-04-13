import React, { useState, useCallback, useRef } from 'react'
import { NodeProps, Handle, Position } from 'reactflow'
import { CanvasNodeData } from '../../types'
import { useAutosizeTextarea } from '../../hooks/useAutosizeTextarea'

const DOT = {
  width: 8,
  height: 8,
  background: '#0d527e',
  border: '2px solid white',
  borderRadius: '50%',
  opacity: 0.5,
}

export default function TextNode({ id, data, selected }: NodeProps<CanvasNodeData>) {
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
      window.dispatchEvent(new CustomEvent('ww:node_label_change', { detail: { id, label: draft.trim() || 'Text' } }))
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

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`
        w-[280px] px-2 py-1 overflow-hidden
        cursor-default select-none
        rounded
        ${selected ? 'ring-2 ring-gold-400 ring-offset-1' : ''}
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
          className="w-full text-sm text-gray-600 bg-transparent border-none outline-none resize-none overflow-hidden whitespace-pre-wrap break-words [overflow-wrap:anywhere]"
        />
      ) : (
        <span className="block w-full text-sm text-gray-600 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {data.label || 'Double-click to edit'}
        </span>
      )}
    </div>
  )
}
