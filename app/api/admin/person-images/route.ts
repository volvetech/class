import { NextResponse } from 'next/server'
import { db } from '@/db'
import { personImages, users } from '@/db/schema'
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
      id: personImages.id,
      userId: personImages.userId,
      email: users.email,
      fileUrl: personImages.fileUrl,
      width: personImages.width,
      height: personImages.height,
      fileSize: personImages.fileSize,
      status: personImages.status,
      isDefault: personImages.isDefault,
      createdAt: personImages.createdAt,
    })
    .from(personImages)
    .leftJoin(users, eq(personImages.userId, users.id))

  if (search) {
    query = query.where(users.email.like(`%${search}%`))
  }

  if (status) {
    query = query.where(eq(personImages.status, status))
  }

  const totalResult = await db.select({ count: count() }).from(personImages)
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