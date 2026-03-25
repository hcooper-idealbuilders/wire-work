import React, { useState, useCallback, useRef } from 'react'
import { NodeProps, Handle, Position } from 'reactflow'
import { CanvasNodeData } from '../../types'

interface WorkflowNodeProps extends NodeProps<CanvasNodeData> {
  onLabelChange?: (id: string, label: string) => void
}

export default function WorkflowNode({ id, data, selected }: WorkflowNodeProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(data.label)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const handleDoubleClick = useCallback(() => {
    setDraft(data.label)
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }, [data.label])

  const handleBlur = useCallback(() => {
    setEditing(false)
    if (draft.trim() !== data.label) {
      // Dispatch a custom event — CanvasPane listens to this
      window.dispatchEvent(new CustomEvent('ww:node_label_change', { detail: { id, label: draft.trim() || 'Untitled' } }))
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
        min-w-[120px] max-w-[240px] min-h-[48px]
        bg-white border-2 rounded-lg shadow-md
        flex items-center justify-center px-3 py-2
        cursor-default select-none
        ${selected ? 'border-blue-500' : 'border-gray-300'}
        transition-colors
      `}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-400" />
      <Handle type="target" position={Position.Left} className="!bg-blue-400" />

      {editing ? (
        <textarea
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={2}
          className="w-full text-sm text-gray-800 bg-transparent border-none outline-none resize-none text-center"
        />
      ) : (
        <span className="text-sm text-gray-800 text-center whitespace-pre-wrap break-words">
          {data.label || 'Double-click to edit'}
        </span>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-blue-400" />
      <Handle type="source" position={Position.Right} className="!bg-blue-400" />
    </div>
  )
}
