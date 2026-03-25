import axios from 'axios'
import { getBackendUrl } from './socket'
import { TickerEntry } from '../types'

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function fetchTicker(token: string, limit = 50): Promise<TickerEntry[]> {
  const res = await axios.get(`${getBackendUrl()}/api/ticker?limit=${limit}`, { headers: authHeader(token) })
  return res.data
}

export async function patchTickerNote(token: string, id: number, userNote: string): Promise<TickerEntry> {
  const res = await axios.patch(
    `${getBackendUrl()}/api/ticker/${id}/note`,
    { userNote },
    { headers: authHeader(token) },
  )
  return res.data
}
