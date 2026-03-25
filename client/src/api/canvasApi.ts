import axios from 'axios'
import { getBackendUrl } from './socket'

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export async function fetchCanvas(token: string) {
  const res = await axios.get(`${getBackendUrl()}/api/canvas`, { headers: authHeader(token) })
  return res.data as { nodes: unknown[]; edges: unknown[] }
}
