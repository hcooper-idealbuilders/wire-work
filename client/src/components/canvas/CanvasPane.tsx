import React, { useEffect, useState, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  BackgroundVariant,
  ConnectionMode,
  Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import WorkflowNode from './WorkflowNode'
import TextNode from './TextNode'
import StickyNode from './StickyNode'
import SectionNode from './SectionNode'
import { useCanvas } from '../../hooks/useCanvas'
import { NODE_COLORS, CanvasNodeData } from '../../types'

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
  textNode: TextNode,
  stickyNode: StickyNode,
  sectionNode: SectionNode,
}

const ADD_ITEMS = [
  { type: 'workflowNode', label: 'Step', icon: '▢', defaultLabel: 'New Step', color: '#ffffff' },
  { type: 'textNode', label: 'Text', icon: 'T', defaultLabel: 'Text', color: '#ffffff' },
  { type: 'stickyNode', label: 'Note', icon: '▤', defaultLabel: '', color: '#fef9c3' },
  { type: 'sectionNode', label: 'Section', icon: '⊞', defaultLabel: 'Section', color: '#f3f4f6' },
]

export default function CanvasPane() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, updateNodeLabel, updateNodeColor } = useCanvas()
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null

  useEffect(() => {
    function onLabelChange(e: Event) {
      const { id, label } = (e as CustomEvent<{ id: string; label: string }>).detail
      updateNodeLabel(id, label)
    }
    window.addEventListener('ww:node_label_change', onLabelChange)
    return () => window.removeEventListener('ww:node_label_change', onLabelChange)
  }, [updateNodeLabel])

  const onSelectionChange = useCallback(({ nodes: sel }: { nodes: Node<CanvasNodeData>[] }) => {
    setSelectedNodeId(sel.length === 1 ? sel[0].id : null)
  }, [])

  const onPaneClick = useCallback(() => {
    setShowAddMenu(false)
  }, [])

  return (
    <div className="w-full h-full bg-navy-50 relative">
      {/* Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 flex-wrap">
        {/* Add dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="bg-navy-600 hover:bg-navy-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow transition-colors flex items-center gap-1"
          >
            + Add
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAddMenu && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-navy-200 rounded-lg shadow-lg py-1 min-w-[160px]">
              {ADD_ITEMS.map((item) => (
                <button
                  key={item.type}
                  onClick={() => {
                    addNode(item.type, item.defaultLabel, item.color)
                    setShowAddMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-navy-700 hover:bg-navy-50 flex items-center gap-2"
                >
                  <span className="w-5 text-center text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color picker — visible when a node is selected */}
        {selectedNode && (
          <div className="flex items-center gap-1 bg-white border border-navy-200 rounded-lg px-2 py-1 shadow-sm">
            <span className="text-[11px] text-navy-400 mr-1">Color:</span>
            {NODE_COLORS.map((c) => (
              <button
                key={c.value}
                title={c.name}
                onClick={() => updateNodeColor(selectedNodeId!, c.value)}
                className={`w-5 h-5 rounded-full border-2 transition-transform hover:scale-125 ${
                  selectedNode.data?.color === c.value ? 'border-gold-400 scale-110' : 'border-navy-200'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>
        )}
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        snapToGrid
        snapGrid={[16, 16]}
        className="w-full h-full"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#9cc3da" />
        <Controls />
        <MiniMap
          nodeColor={(node) => (node.data as CanvasNodeData)?.color || '#3b82f6'}
          maskColor="rgba(0,0,0,0.05)"
          className="!bg-white !border !border-gray-200 !rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}
