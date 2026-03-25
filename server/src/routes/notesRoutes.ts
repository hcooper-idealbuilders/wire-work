import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import * as notesService from '../services/notesService'
import { PanelKey } from '../services/notesService'

const router = Router()
router.use(requireAuth)

router.get('/', async (_req, res) => {
  try {
    const notes = await notesService.getAllNotes()
    res.json(notes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:panelKey', async (req: AuthRequest, res) => {
  const panelKey = req.params.panelKey as PanelKey
  const validKeys: PanelKey[] = ['biz_dev', 'project_mgmt', 'financials']
  if (!validKeys.includes(panelKey)) {
    res.status(400).json({ error: 'Invalid panel key' })
    return
  }

  try {
    const { content } = req.body
    const note = await notesService.updateNote(panelKey, content, req.userId!)
    res.json(note)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
