import axios from 'axios'
import { getBackendUrl } from './socket'
import { PanelKey } from '../types'

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function fetchNotes(token: string): Promise<Record<PanelKey, string>> {
  const res = await axios.get(`${getBackendUrl()}/api/notes`, { headers: authHeader(token) })
  return res.data
}

export async function patchNote(token: string, panelKey: PanelKey, content: string) {
  await axios.patch(
    `${getBackendUrl()}/api/notes/${panelKey}`,
    { content },
    { headers: authHeader(token) },
  )
}
