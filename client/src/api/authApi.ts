import axios from 'axios'
import { apiUrl } from './http'
import { User } from '../types'

export async function login(username: string, password: string): Promise<{ token: string; user: User }> {
  const res = await axios.post(apiUrl('/api/auth/login'), { username, password })
  return res.data
}
