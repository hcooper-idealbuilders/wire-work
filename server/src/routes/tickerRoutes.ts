import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import * as tickerService from '../services/tickerService'

const router = Router()
router.use(requireAuth)

router.get('/', async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit ?? '50')), 200)
    const before = req.query.before as string | undefined
    const entries = await tickerService.getRecentEntries(limit, before)
    res.json(entries)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id/note', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { userNote } = req.body
    const entry = await tickerService.addNoteToEntry(id, userNote)
    if (!entry) {
      res.status(404).json({ error: 'Entry not found' })
      return
    }
    res.json(entry)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
