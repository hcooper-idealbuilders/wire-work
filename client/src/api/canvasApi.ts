import axios from 'axios'
import { authHeader, apiUrl } from './http'

export async function fetchCanvas(token: string) {
  const res = await axios.get(apiUrl('/api/canvas'), { headers: authHeader(token) })
  return res.data as { nodes: unknown[]; edges: unknown[] }
}
