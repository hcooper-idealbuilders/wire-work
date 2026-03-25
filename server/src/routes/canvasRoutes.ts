import { Router } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import * as canvasService from '../services/canvasService'

const router = Router()
router.use(requireAuth)

router.get('/', async (_req, res) => {
  try {
    const [nodes, edges] = await Promise.all([canvasService.getAllNodes(), canvasService.getAllEdges()])
    res.json({ nodes, edges })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/nodes', async (req: AuthRequest, res) => {
  try {
    const { id, positionX, positionY, width, height, label } = req.body
    const node = await canvasService.upsertNode({ id, positionX, positionY, width, height, label, updatedBy: req.userId! })
    res.json(node)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/nodes/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params
    const { positionX, positionY, label } = req.body
    if (positionX !== undefined && positionY !== undefined) {
      await canvasService.updateNodePosition(id, positionX, positionY, req.userId!)
    }
    if (label !== undefined) {
      await canvasService.updateNodeLabel(id, label, req.userId!)
    }
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/nodes/:id', async (req, res) => {
  try {
    await canvasService.deleteNode(req.params.id)
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/edges', async (req: AuthRequest, res) => {
  try {
    const { id, sourceId, targetId, label, animated } = req.body
    const edge = await canvasService.createEdge({ id, sourceId, targetId, label, animated, updatedBy: req.userId! })
    res.json(edge)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/edges/:id', async (req, res) => {
  try {
    await canvasService.deleteEdge(req.params.id)
    res.status(204).send()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
