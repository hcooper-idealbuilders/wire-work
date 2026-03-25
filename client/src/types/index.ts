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
  color: string
}

export const NODE_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Navy Light', value: '#e8f1f7' },
  { name: 'Gold Light', value: '#fdf8ed' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Green', value: '#dcfce7' },
  { name: 'Yellow', value: '#fef9c3' },
  { name: 'Orange', value: '#ffedd5' },
  { name: 'Red', value: '#fee2e2' },
  { name: 'Gray', value: '#f3f4f6' },
]

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
