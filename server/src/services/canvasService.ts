import { pool } from '../db'

export interface CanvasNode {
  id: string
  positionX: number
  positionY: number
  width: number | null
  height: number | null
  label: string
  updatedAt: string
  updatedBy: number | null
}

export interface CanvasEdge {
  id: string
  sourceId: string
  targetId: string
  label: string | null
  animated: boolean
  updatedAt: string
  updatedBy: number | null
}

export async function getAllNodes(): Promise<CanvasNode[]> {
  const result = await pool.query('SELECT * FROM canvas_nodes ORDER BY updated_at')
  return result.rows.map(toNode)
}

export async function getAllEdges(): Promise<CanvasEdge[]> {
  const result = await pool.query('SELECT * FROM canvas_edges ORDER BY updated_at')
  return result.rows.map(toEdge)
}

export async function upsertNode(node: {
  id: string
  positionX: number
  positionY: number
  width?: number
  height?: number
  label: string
  updatedBy: number
}): Promise<CanvasNode> {
  const result = await pool.query(
    `INSERT INTO canvas_nodes (id, position_x, position_y, width, height, label, updated_by, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     ON CONFLICT (id) DO UPDATE SET
       position_x = EXCLUDED.position_x,
       position_y = EXCLUDED.position_y,
       width = EXCLUDED.width,
       height = EXCLUDED.height,
       label = EXCLUDED.label,
       updated_by = EXCLUDED.updated_by,
       updated_at = NOW()
     RETURNING *`,
    [node.id, node.positionX, node.positionY, node.width ?? null, node.height ?? null, node.label, node.updatedBy],
  )
  return toNode(result.rows[0])
}

export async function updateNodePosition(id: string, x: number, y: number, updatedBy: number): Promise<void> {
  await pool.query(
    'UPDATE canvas_nodes SET position_x = $1, position_y = $2, updated_by = $3, updated_at = NOW() WHERE id = $4',
    [x, y, updatedBy, id],
  )
}

export async function updateNodeLabel(id: string, label: string, updatedBy: number): Promise<void> {
  await pool.query(
    'UPDATE canvas_nodes SET label = $1, updated_by = $2, updated_at = NOW() WHERE id = $3',
    [label, updatedBy, id],
  )
}

export async function deleteNode(id: string): Promise<void> {
  await pool.query('DELETE FROM canvas_nodes WHERE id = $1', [id])
}

export async function createEdge(edge: {
  id: string
  sourceId: string
  targetId: string
  label?: string
  animated?: boolean
  updatedBy: number
}): Promise<CanvasEdge> {
  const result = await pool.query(
    `INSERT INTO canvas_edges (id, source_id, target_id, label, animated, updated_by, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (id) DO UPDATE SET updated_at = NOW()
     RETURNING *`,
    [edge.id, edge.sourceId, edge.targetId, edge.label ?? null, edge.animated ?? false, edge.updatedBy],
  )
  return toEdge(result.rows[0])
}

export async function deleteEdge(id: string): Promise<void> {
  await pool.query('DELETE FROM canvas_edges WHERE id = $1', [id])
}

function toNode(row: Record<string, unknown>): CanvasNode {
  return {
    id: row.id as string,
    positionX: row.position_x as number,
    positionY: row.position_y as number,
    width: row.width as number | null,
    height: row.height as number | null,
    label: row.label as string,
    updatedAt: String(row.updated_at),
    updatedBy: row.updated_by as number | null,
  }
}

function toEdge(row: Record<string, unknown>): CanvasEdge {
  return {
    id: row.id as string,
    sourceId: row.source_id as string,
    targetId: row.target_id as string,
    label: row.label as string | null,
    animated: row.animated as boolean,
    updatedAt: String(row.updated_at),
    updatedBy: row.updated_by as number | null,
  }
}
