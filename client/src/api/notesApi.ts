import axios from 'axios'
import { authHeader, apiUrl } from './http'
import { PanelKey } from '../types'

export async function fetchNotes(token: string): Promise<Record<PanelKey, string>> {
  const res = await axios.get(apiUrl('/api/notes'), { headers: authHeader(token) })
  return res.data
}

export async function patchNote(token: string, panelKey: PanelKey, content: string) {
  await axios.patch(
    apiUrl(`/api/notes/${panelKey}`),
    { content },
    { headers: authHeader(token) },
  )
}
