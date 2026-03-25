export interface User {
  id: number
  username: string
  displayName: string
}

export interface AuthState {
  user: User | null
  token: string | null
}

export type PanelKey = 'biz_dev' | 'project_mgmt' | 'financials'

export interface CanvasNodeData {
  label: string
}

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

export interface NotePromptState {
  open: boolean
  entryId: number | null
}
