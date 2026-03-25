import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import http from 'http'
import cors from 'cors'
import helmet from 'helmet'
import { Server as SocketServer } from 'socket.io'
import authRoutes from './routes/authRoutes'
import canvasRoutes from './routes/canvasRoutes'
import notesRoutes from './routes/notesRoutes'
import tickerRoutes from './routes/tickerRoutes'
import { setupSocket } from './socket'

const app = express()
const server = http.createServer(app)

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5173').split(',').map((o) => o.trim())

app.use(helmet())
app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json({ limit: '1mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/canvas', canvasRoutes)
app.use('/api/notes', notesRoutes)
app.use('/api/ticker', tickerRoutes)

app.get('/health', (_req, res) => res.json({ ok: true }))

const io = new SocketServer(server, {
  cors: { origin: allowedOrigins, credentials: true },
})

setupSocket(io)

const PORT = parseInt(process.env.PORT ?? '3001')
server.listen(PORT, () => {
  console.log(`Wire-Work server running on port ${PORT}`)
})
