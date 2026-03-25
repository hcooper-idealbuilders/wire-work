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

function rowToEntry(row: Record<string, unknown>): TickerEntry {
  return {
    id: row.id as number,
    userId: row.user_id as number,
    displayName: row.display_name as string,
    eventType: row.event_type as string,
    entityType: row.entity_type as string,
    entityId: row.entity_id as string | null,
    summary: row.summary as string,
    userNote: row.user_note as string | null,
    occurredAt: String(row.occurred_at),
  }
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
     RETURNING id, user_id, event_type, entity_type, entity_id, summary, user_note, occurred_at,
       (SELECT display_name FROM users WHERE id = $1) AS display_name`,
    [params.userId, params.eventType, params.entityType, params.entityId ?? null, params.summary, params.userNote ?? null],
  )
  return rowToEntry(result.rows[0])
}

export async function addNoteToEntry(id: number, userNote: string): Promise<TickerEntry | null> {
  const result = await pool.query(
    `UPDATE activity_log SET user_note = $1 WHERE id = $2
     RETURNING id, user_id, event_type, entity_type, entity_id, summary, user_note, occurred_at,
       (SELECT display_name FROM users WHERE users.id = activity_log.user_id) AS display_name`,
    [userNote, id],
  )
  if (result.rows.length === 0) return null
  return rowToEntry(result.rows[0])
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

  return result.rows.map(rowToEntry)
}
