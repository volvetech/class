import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { migrate } from 'drizzle-orm/node-postgres/migrator'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})

const db = drizzle(pool)

async function main() {
  await migrate(db, { migrationsFolder: './drizzle' })
  console.log('Migration completed successfully')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})