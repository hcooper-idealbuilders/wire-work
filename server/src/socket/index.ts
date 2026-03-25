import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { registerCanvasHandlers } from './canvasHandlers'
import { registerNotesHandlers } from './notesHandlers'
import * as tickerService from '../services/tickerService'

export function setupSocket(io: Server) {
  // Verify JWT on connection
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined
    if (!token) {
      next(new Error('Unauthorized'))
      return
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number; username: string }
      socket.data.userId = payload.userId
      socket.data.username = payload.username
      next()
    } catch {
      next(new Error('Unauthorized'))
    }
  })

  io.on('connection', (socket) => {
    const userId: number = socket.data.userId
    const username: string = socket.data.username

    socket.join('wire-work')
    console.log(`${username} connected (${socket.id})`)

    // Notify others
    socket.to('wire-work').emit('presence:joined', { userId, displayName: username })

    // Register handlers
    registerCanvasHandlers(io, socket, userId, username)
    registerNotesHandlers(io, socket, userId, username)

    // Shared ticker note handler (used by both canvas and notes prompts)
    socket.on('ticker:note_added', async (data: { entryId: number; userNote: string }) => {
      try {
        const entry = await tickerService.addNoteToEntry(data.entryId, data.userNote)
        if (entry) {
          io.to('wire-work').emit('ticker:entry_updated', { entry })
        }
      } catch (err) {
        console.error('ticker:note_added error', err)
      }
    })

    socket.on('disconnect', () => {
      console.log(`${username} disconnected (${socket.id})`)
      socket.to('wire-work').emit('presence:left', { userId })
    })
  })
}
