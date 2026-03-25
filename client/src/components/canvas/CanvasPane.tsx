import React, { useEffect, useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  BackgroundVariant,
} from 'reactflow'
import 'reactflow/dist/style.css'
import WorkflowNode from './WorkflowNode'
import { useCanvas } from '../../hooks/useCanvas'

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
}

export default function CanvasPane() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, updateNodeLabel } = useCanvas()

  // Listen for label change events from WorkflowNode
  useEffect(() => {
    function onLabelChange(e: Event) {
      const { id, label } = (e as CustomEvent<{ id: string; label: string }>).detail
      updateNodeLabel(id, label)
    }
    window.addEventListener('ww:node_label_change', onLabelChange)
    return () => window.removeEventListener('ww:node_label_change', onLabelChange)
  }, [updateNodeLabel])

  return (
    <div className="w-full h-full bg-gray-50 relative">
      {/* Toolbar */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <button
          onClick={addNode}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow transition-colors"
        >
          + Add Node
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        multiSelectionKeyCode="Shift"
        className="w-full h-full"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#d1d5db" />
        <Controls />
        <MiniMap
          nodeColor="#3b82f6"
          maskColor="rgba(0,0,0,0.05)"
          className="!bg-white !border !border-gray-200 !rounded-lg"
        />
      </ReactFlow>
    </div>
  )
}
