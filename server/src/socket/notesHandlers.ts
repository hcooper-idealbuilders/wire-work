import { Server, Socket } from 'socket.io'
import * as notesService from '../services/notesService'
import * as tickerService from '../services/tickerService'
import { PanelKey } from '../services/notesService'

const PANEL_LABELS: Record<PanelKey, string> = {
  biz_dev: 'Business Development',
  project_mgmt: 'Project Management',
  financials: 'Financials',
}

export function registerNotesHandlers(io: Server, socket: Socket, userId: number, username: string) {
  socket.on('note:changed', async (data: { panelKey: PanelKey; content: string; userNote?: string }) => {
    try {
      await notesService.updateNote(data.panelKey, data.content, userId)
      const entry = await tickerService.createTickerEntry({
        userId,
        eventType: 'note_edited',
        entityType: 'note',
        entityId: data.panelKey,
        summary: `${username} edited ${PANEL_LABELS[data.panelKey] ?? data.panelKey} notes`,
        userNote: data.userNote,
      })
      socket.to('wire-work').emit('note:changed', { panelKey: data.panelKey, content: data.content, userId })
      io.to('wire-work').emit('ticker:new_entry', { entry })
    } catch (err) {
      console.error('note:changed error', err)
    }
  })

  socket.on('note:ticker_note_added', async (data: { entryId: number; userNote: string }) => {
    try {
      const entry = await tickerService.addNoteToEntry(data.entryId, data.userNote)
      if (entry) {
        io.to('wire-work').emit('ticker:entry_updated', { entry })
      }
    } catch (err) {
      console.error('note:ticker_note_added error', err)
    }
  })
}
