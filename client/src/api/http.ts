import axios from 'axios'
import { getBackendUrl } from './socket'

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export function apiUrl(path: string) {
  return `${getBackendUrl()}${path}`
}
