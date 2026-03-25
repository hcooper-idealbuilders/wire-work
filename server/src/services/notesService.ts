import { pool } from '../db'

export type PanelKey = 'biz_dev' | 'project_mgmt' | 'financials'

export interface NotePanel {
  panelKey: PanelKey
  content: string
  updatedAt: string
  updatedBy: number | null
}

export async function getAllNotes(): Promise<Record<PanelKey, string>> {
  const result = await pool.query('SELECT panel_key, content FROM notes')
  const map: Record<string, string> = {}
  for (const row of result.rows) {
    map[row.panel_key] = row.content
  }
  return {
    biz_dev: map.biz_dev ?? '',
    project_mgmt: map.project_mgmt ?? '',
    financials: map.financials ?? '',
  }
}

export async function updateNote(panelKey: PanelKey, content: string, updatedBy: number): Promise<NotePanel> {
  const result = await pool.query(
    `UPDATE notes SET content = $1, updated_by = $2, updated_at = NOW()
     WHERE panel_key = $3
     RETURNING panel_key, content, updated_at, updated_by`,
    [content, updatedBy, panelKey],
  )
  const row = result.rows[0]
  return {
    panelKey: row.panel_key,
    content: row.content,
    updatedAt: String(row.updated_at),
    updatedBy: row.updated_by,
  }
}
