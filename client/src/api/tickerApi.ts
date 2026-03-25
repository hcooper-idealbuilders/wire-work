import axios from 'axios'
import { authHeader, apiUrl } from './http'
import { TickerEntry } from '../types'

export async function fetchTicker(token: string, limit = 50): Promise<TickerEntry[]> {
  const res = await axios.get(apiUrl(`/api/ticker?limit=${limit}`), { headers: authHeader(token) })
  return res.data
}

export async function patchTickerNote(token: string, id: number, userNote: string): Promise<TickerEntry> {
  const res = await axios.patch(
    apiUrl(`/api/ticker/${id}/note`),
    { userNote },
    { headers: authHeader(token) },
  )
  return res.data
}
