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
  { name: 'Yellow', value: '#facc15' },
  { name: 'Orange', value: '#fb923c' },
  { name: 'Red', value: '#f87171' },
  { name: 'Pink', value: '#f472b6' },
  { name: 'Purple', value: '#a78bfa' },
  { name: 'Blue', value: '#60a5fa' },
  { name: 'Teal', value: '#2dd4bf' },
  { name: 'Green', value: '#4ade80' },
  { name: 'Gray', value: '#9ca3af' },
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
