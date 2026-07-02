import { NextResponse } from 'next/server'
import { db } from '@/db'
import { usageLogs, users, tryOnJobs } from '@/db/schema'
import { eq, count } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const usageType = searchParams.get('usageType') || ''

  const offset = (page - 1) * limit

  let query = db
    .select({
      id: usageLogs.id,
      userId: usageLogs.userId,
      email: users.email,
      jobId: usageLogs.jobId,
      usageType: usageLogs.usageType,
      creditChange: usageLogs.creditChange,
      createdAt: usageLogs.createdAt,
    })
    .from(usageLogs)
    .leftJoin(users, eq(usageLogs.userId, users.id))

  if (search) {
    query = query.where(users.email.like(`%${search}%`))
  }

  if (usageType) {
    query = query.where(eq(usageLogs.usageType, usageType))
  }

  const totalResult = await db.select({ count: count() }).from(usageLogs)
  const total = totalResult[0]?.count || 0

  const data = await query.limit(limit).offset(offset)

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  })
}