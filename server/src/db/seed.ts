import bcrypt from 'bcrypt'
import { pool } from './index'
import dotenv from 'dotenv'

dotenv.config()

async function seed() {
  const users = [
    {
      username: process.env.USER1_USERNAME!,
      password: process.env.USER1_PASSWORD!,
      displayName: process.env.USER1_USERNAME!,
    },
    {
      username: process.env.USER2_USERNAME!,
      password: process.env.USER2_PASSWORD!,
      displayName: process.env.USER2_USERNAME!,
    },
  ]

  for (const user of users) {
    if (!user.username || !user.password) {
      console.error('Missing USER1/USER2 env vars. Check .env file.')
      process.exit(1)
    }
    const hash = await bcrypt.hash(user.password, 12)
    await pool.query(
      `INSERT INTO users (username, password_hash, display_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      [user.username, hash, user.displayName],
    )
    console.log(`✓ Seeded user: ${user.username}`)
  }

  await pool.end()
  console.log('Seed complete.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
