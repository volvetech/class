import { NextResponse } from 'next/server'
import { db } from '@/db'
import { tryOnJobs, users, personImages, garmentImages, tryOnResults } from '@/db/schema'
import { eq, count } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  const offset = (page - 1) * limit

  let query = db
    .select({
      id: tryOnJobs.id,
      userId: tryOnJobs.userId,
      email: users.email,
      personImageId: tryOnJobs.personImageId,
      garmentImageId: tryOnJobs.garmentImageId,
      garmentCategory: tryOnJobs.garmentCategory,
      status: tryOnJobs.status,
      modelName: tryOnJobs.modelName,
      modelVersion: tryOnJobs.modelVersion,
      errorMessage: tryOnJobs.errorMessage,
      createdAt: tryOnJobs.createdAt,
      startedAt: tryOnJobs.startedAt,
      completedAt: tryOnJobs.completedAt,
    })
    .from(tryOnJobs)
    .leftJoin(users, eq(tryOnJobs.userId, users.id))

  if (search) {
    query = query.where(users.email.like(`%${search}%`))
  }

  if (status) {
    query = query.where(tryOnJobs.status.eq(status))
  }

  const totalResult = await db.select({ count: count() }).from(tryOnJobs)
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