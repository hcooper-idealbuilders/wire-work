import { pool } from '../db'

export interface TickerEntry {
  id: number
  userId: number
  displayName: string
  eventType: string
  entityType: string
  entityId: string | null
  summary: string
  userNote: string | null
  occurredAt: string
}

export async function createTickerEntry(params: {
  userId: number
  eventType: string
  entityType: string
  entityId?: string
  summary: string
  userNote?: string
}): Promise<TickerEntry> {
  const result = await pool.query(
    `INSERT INTO activity_log (user_id, event_type, entity_type, entity_id, summary, user_note)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, user_id, event_type, entity_type, entity_id, summary, user_note, occurred_at`,
    [params.userId, params.eventType, params.entityType, params.entityId ?? null, params.summary, params.userNote ?? null],
  )

  const row = result.rows[0]
  const userResult = await pool.query('SELECT display_name FROM users WHERE id = $1', [params.userId])

  return {
    id: row.id,
    userId: row.user_id,
    displayName: userResult.rows[0]?.display_name ?? 'Unknown',
    eventType: row.event_type,
    entityType: row.entity_type,
    entityId: row.entity_id,
    summary: row.summary,
    userNote: row.user_note,
    occurredAt: row.occurred_at,
  }
}

export async function addNoteToEntry(id: number, userNote: string): Promise<TickerEntry | null> {
  const result = await pool.query(
    `UPDATE activity_log SET user_note = $1 WHERE id = $2
     RETURNING id, user_id, event_type, entity_type, entity_id, summary, user_note, occurred_at`,
    [userNote, id],
  )
  if (result.rows.length === 0) return null

  const row = result.rows[0]
  const userResult = await pool.query('SELECT display_name FROM users WHERE id = $1', [row.user_id])

  return {
    id: row.id,
    userId: row.user_id,
    displayName: userResult.rows[0]?.display_name ?? 'Unknown',
    eventType: row.event_type,
    entityType: row.entity_type,
    entityId: row.entity_id,
    summary: row.summary,
    userNote: row.user_note,
    occurredAt: row.occurred_at,
  }
}

export async function getRecentEntries(limit = 50, before?: string): Promise<TickerEntry[]> {
  const params: (string | number)[] = [limit]
  let whereClause = ''
  if (before) {
    whereClause = 'WHERE a.occurred_at < $2'
    params.push(before)
  }

  const result = await pool.query(
    `SELECT a.id, a.user_id, u.display_name, a.event_type, a.entity_type,
            a.entity_id, a.summary, a.user_note, a.occurred_at
     FROM activity_log a
     JOIN users u ON u.id = a.user_id
     ${whereClause}
     ORDER BY a.occurred_at DESC
     LIMIT $1`,
    params,
  )

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    eventType: row.event_type,
    entityType: row.entity_type,
    entityId: row.entity_id,
    summary: row.summary,
    userNote: row.user_note,
    occurredAt: row.occurred_at,
  }))
}
