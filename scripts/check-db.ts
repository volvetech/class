import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

const db = drizzle(pool)

async function main() {
  const result = await db.execute(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `)
  console.log('Existing tables:', result.rows)
  process.exit(0)
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})