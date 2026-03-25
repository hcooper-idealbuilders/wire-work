import { useEffect, useCallback, useRef } from 'react'
import { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow'
import { useAuth } from '../context/AuthContext'
import { useCanvasStore } from '../store/canvasStore'
import { useTickerStore } from '../store/tickerStore'
import { fetchCanvas } from '../api/canvasApi'
import { getSocket } from '../api/socket'
import { CanvasNodeData } from '../types'

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

export function useCanvas() {
  const { token, user } = useAuth()
  const store = useCanvasStore()
  const { openPrompt, prependEntry } = useTickerStore()
  const promptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!token) return

    fetchCanvas(token).then(({ nodes, edges }) => {
      const rfNodes = (nodes as Array<{
        id: string; positionX: number; positionY: number; label: string; color?: string; width?: number; height?: number
      }>).map((n) => ({
        id: n.id,
        type: 'workflowNode',
        position: { x: n.positionX, y: n.positionY },
        data: { label: n.label, color: n.color ?? '#ffffff' },
        width: n.width ?? undefined,
        height: n.height ?? undefined,
      }))

      const rfEdges = (edges as Array<{
        id: string; sourceId: string; targetId: string; label?: string; animated?: boolean; sourceHandle?: string; targetHandle?: string
      }>).map((e) => ({
        id: e.id,
        source: e.sourceId,
        target: e.targetId,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
        label: e.label ?? '',
        animated: e.animated ?? false,
        type: 'smoothstep',
      }))

      store.setNodes(rfNodes)
      store.setEdges(rfEdges)
    }).catch(console.error)

    const socket = getSocket()

    socket.on('canvas:node_created', ({ node, userId }: { node: { id: string; positionX: number; positionY: number; label: string; color?: string; type?: string }; userId: number }) => {
      if (userId !== user?.id) {
        store.addNode({
          id: node.id,
          type: node.type ?? 'workflowNode',
          position: { x: node.positionX, y: node.positionY },
          data: { label: node.label, color: node.color ?? '#ffffff' },
        })
      }
    })

    socket.on('canvas:node_moved', ({ nodeId, position, userId }: { nodeId: string; position: { x: number; y: number }; userId: number }) => {
      if (userId !== user?.id) {
        store.applyNodeChanges([{ type: 'position', id: nodeId, position, dragging: false }])
      }
    })

    socket.on('canvas:node_label_changed', ({ nodeId, label, userId }: { nodeId: string; label: string; userId: number }) => {
      if (userId !== user?.id) {
        store.updateNodeLabel(nodeId, label)
      }
    })

    socket.on('canvas:node_deleted', ({ nodeId, userId }: { nodeId: string; userId: number }) => {
      if (userId !== user?.id) {
        store.removeNode(nodeId)
      }
    })

    socket.on('canvas:edge_created', ({ edge, userId }: { edge: { id: string; sourceId: string; targetId: string; sourceHandle?: string; targetHandle?: string }; userId: number }) => {
      if (userId !== user?.id) {
        store.addEdge({ id: edge.id, source: edge.sourceId, target: edge.targetId, sourceHandle: edge.sourceHandle, targetHandle: edge.targetHandle, type: 'smoothstep' })
      }
    })

    socket.on('canvas:edge_deleted', ({ edgeId, userId }: { edgeId: string; userId: number }) => {
      if (userId !== user?.id) {
        store.removeEdge(edgeId)
      }
    })

    socket.on('canvas:node_color_changed', ({ nodeId, color, userId }: { nodeId: string; color: string; userId: number }) => {
      if (userId !== user?.id) {
        store.updateNodeColor(nodeId, color)
      }
    })

    socket.on('ticker:new_entry', ({ entry }: { entry: { id: number } }) => {
      prependEntry(entry as Parameters<typeof prependEntry>[0])
    })

    return () => {
      socket.off('canvas:node_created')
      socket.off('canvas:node_moved')
      socket.off('canvas:node_label_changed')
      socket.off('canvas:node_deleted')
      socket.off('canvas:edge_created')
      socket.off('canvas:edge_deleted')
      socket.off('canvas:node_color_changed')
      socket.off('ticker:new_entry')
    }
  }, [token, user?.id])

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const socket = getSocket()
    changes.forEach((change) => {
      if (change.type === 'position' && !change.dragging && change.position) {
        socket.emit('canvas:node_moved', {
          nodeId: change.id,
          position: change.position,
        })
      }
      if (change.type === 'remove') {
        const node = store.nodes.find((n) => n.id === change.id)
        socket.emit('canvas:node_deleted', { nodeId: change.id, label: node?.data?.label })
        // Let ticker prompt appear for deletes
        openPromptAfterEvent()
      }
    })
    store.applyNodeChanges(changes)
  }, [store])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    const socket = getSocket()
    changes.forEach((change) => {
      if (change.type === 'remove') {
        socket.emit('canvas:edge_deleted', { edgeId: change.id })
        openPromptAfterEvent()
      }
    })
    store.applyEdgeChanges(changes)
  }, [store])

  const onConnect = useCallback((connection: Connection) => {
    const id = uid()
    const newEdge: Edge = {
      id,
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle ?? undefined,
      targetHandle: connection.targetHandle ?? undefined,
      type: 'smoothstep',
    }
    store.addEdge(newEdge)
    const socket = getSocket()
    socket.emit('canvas:edge_created', {
      edge: {
        id,
        sourceId: connection.source!,
        targetId: connection.target!,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
      },
    })
    openPromptAfterEvent()
  }, [store])

  function addNode(type = 'workflowNode', label = 'New Step', color = '#ffffff') {
    const id = uid()
    const node: Node<CanvasNodeData> = {
      id,
      type,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 200 + 50 },
      data: { label, color },
    }
    store.addNode(node)
    const socket = getSocket()
    socket.emit('canvas:node_created', {
      node: { id, positionX: node.position.x, positionY: node.position.y, label, color, type },
    })
    openPromptAfterEvent()
  }

  function updateNodeLabel(id: string, label: string) {
    store.updateNodeLabel(id, label)
    const socket = getSocket()
    socket.emit('canvas:node_label_changed', { nodeId: id, label })
    openPromptAfterEvent()
  }

  function updateNodeColor(id: string, color: string) {
    store.updateNodeColor(id, color)
    const socket = getSocket()
    socket.emit('canvas:node_color_changed', { nodeId: id, color })
  }

  function openPromptAfterEvent() {
    if (promptTimerRef.current) clearTimeout(promptTimerRef.current)
    promptTimerRef.current = setTimeout(() => {
      const entries = useTickerStore.getState().entries
      if (entries.length > 0 && entries[0].userNote === null) {
        openPrompt(entries[0].id)
      }
    }, 600)
  }

  return {
    nodes: store.nodes,
    edges: store.edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    updateNodeLabel,
    updateNodeColor,
  }
}
