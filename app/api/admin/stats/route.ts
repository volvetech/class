import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users, tryOnJobs, tryOnResults, usageLogs } from '@/db/schema'
import { count, eq, gte, sum } from 'drizzle-orm'

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const totalUsers = await db.select({ count: count() }).from(users)
  const todayUsers = await db.select({ count: count() }).from(users).where(gte(users.createdAt, today))
  
  const totalJobs = await db.select({ count: count() }).from(tryOnJobs)
  const todayJobs = await db.select({ count: count() }).from(tryOnJobs).where(gte(tryOnJobs.createdAt, today))
  const successJobs = await db.select({ count: count() }).from(tryOnJobs).where(eq(tryOnJobs.status, 'completed'))
  const failedJobs = await db.select({ count: count() }).from(tryOnJobs).where(eq(tryOnJobs.status, 'failed'))
  
  const totalResults = await db.select({ count: count() }).from(tryOnResults)
  
  const todayCredits = await db.select({ sum: sum(usageLogs.creditChange) }).from(usageLogs).where(gte(usageLogs.createdAt, today))

  return NextResponse.json({
    totalUsers: totalUsers[0]?.count || 0,
    todayUsers: todayUsers[0]?.count || 0,
    totalJobs: totalJobs[0]?.count || 0,
    todayJobs: todayJobs[0]?.count || 0,
    successJobs: successJobs[0]?.count || 0,
    failedJobs: failedJobs[0]?.count || 0,
    totalResults: totalResults[0]?.count || 0,
    todayCredits: Math.abs(todayCredits[0]?.sum || 0),
  })
}