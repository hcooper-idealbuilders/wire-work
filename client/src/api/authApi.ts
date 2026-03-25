import axios from 'axios'
import { getBackendUrl } from './socket'
import { User } from '../types'

export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  const res = await axios.post(`${getBackendUrl()}/api/auth/login`, { username, password })
  return res.data
}
