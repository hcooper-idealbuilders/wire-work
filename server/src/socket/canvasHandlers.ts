import { Server, Socket } from 'socket.io'
import * as canvasService from '../services/canvasService'
import * as tickerService from '../services/tickerService'

export function registerCanvasHandlers(io: Server, socket: Socket, userId: number, username: string) {
  socket.on('canvas:node_created', async (data: {
    node: { id: string; positionX: number; positionY: number; label: string; width?: number; height?: number }
    userNote?: string
  }) => {
    try {
      await canvasService.upsertNode({ ...data.node, updatedBy: userId })
      const entry = await tickerService.createTickerEntry({
        userId,
        eventType: 'node_created',
        entityType: 'node',
        entityId: data.node.id,
        summary: `${username} added node "${data.node.label || 'Untitled'}"`,
        userNote: data.userNote,
      })
      socket.to('wire-work').emit('canvas:node_created', { node: data.node, userId })
      io.to('wire-work').emit('ticker:new_entry', { entry })
    } catch (err) {
      console.error('canvas:node_created error', err)
    }
  })

  socket.on('canvas:node_moved', async (data: { nodeId: string; position: { x: number; y: number } }) => {
    try {
      await canvasService.updateNodePosition(data.nodeId, data.position.x, data.position.y, userId)
      // node_moved is high frequency — no ticker entry
      socket.to('wire-work').emit('canvas:node_moved', { ...data, userId })
    } catch (err) {
      console.error('canvas:node_moved error', err)
    }
  })

  socket.on('canvas:node_label_changed', async (data: { nodeId: string; label: string; userNote?: string }) => {
    try {
      await canvasService.updateNodeLabel(data.nodeId, data.label, userId)
      const entry = await tickerService.createTickerEntry({
        userId,
        eventType: 'node_label_changed',
        entityType: 'node',
        entityId: data.nodeId,
        summary: `${username} renamed node to "${data.label}"`,
        userNote: data.userNote,
      })
      socket.to('wire-work').emit('canvas:node_label_changed', { nodeId: data.nodeId, label: data.label, userId })
      io.to('wire-work').emit('ticker:new_entry', { entry })
    } catch (err) {
      console.error('canvas:node_label_changed error', err)
    }
  })

  socket.on('canvas:node_deleted', async (data: { nodeId: string; label?: string; userNote?: string }) => {
    try {
      await canvasService.deleteNode(data.nodeId)
      const entry = await tickerService.createTickerEntry({
        userId,
        eventType: 'node_deleted',
        entityType: 'node',
        entityId: data.nodeId,
        summary: `${username} deleted node "${data.label || data.nodeId}"`,
        userNote: data.userNote,
      })
      socket.to('wire-work').emit('canvas:node_deleted', { nodeId: data.nodeId, userId })
      io.to('wire-work').emit('ticker:new_entry', { entry })
    } catch (err) {
      console.error('canvas:node_deleted error', err)
    }
  })

  socket.on('canvas:edge_created', async (data: {
    edge: { id: string; sourceId: string; targetId: string; label?: string; animated?: boolean }
    userNote?: string
  }) => {
    try {
      await canvasService.createEdge({ ...data.edge, updatedBy: userId })
      const entry = await tickerService.createTickerEntry({
        userId,
        eventType: 'edge_created',
        entityType: 'edge',
        entityId: data.edge.id,
        summary: `${username} connected two nodes`,
        userNote: data.userNote,
      })
      socket.to('wire-work').emit('canvas:edge_created', { edge: data.edge, userId })
      io.to('wire-work').emit('ticker:new_entry', { entry })
    } catch (err) {
      console.error('canvas:edge_created error', err)
    }
  })

  socket.on('canvas:edge_deleted', async (data: { edgeId: string; userNote?: string }) => {
    try {
      await canvasService.deleteEdge(data.edgeId)
      const entry = await tickerService.createTickerEntry({
        userId,
        eventType: 'edge_deleted',
        entityType: 'edge',
        entityId: data.edgeId,
        summary: `${username} removed a connection`,
        userNote: data.userNote,
      })
      socket.to('wire-work').emit('canvas:edge_deleted', { edgeId: data.edgeId, userId })
      io.to('wire-work').emit('ticker:new_entry', { entry })
    } catch (err) {
      console.error('canvas:edge_deleted error', err)
    }
  })

  socket.on('canvas:ticker_note_added', async (data: { entryId: number; userNote: string }) => {
    try {
      const entry = await tickerService.addNoteToEntry(data.entryId, data.userNote)
      if (entry) {
        io.to('wire-work').emit('ticker:entry_updated', { entry })
      }
    } catch (err) {
      console.error('canvas:ticker_note_added error', err)
    }
  })
}
