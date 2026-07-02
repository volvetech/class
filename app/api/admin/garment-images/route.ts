import { NextResponse } from 'next/server'
import { db } from '@/db'
import { garmentImages, users } from '@/db/schema'
import { eq, count } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''
  const category = searchParams.get('category') || ''

  const offset = (page - 1) * limit

  let query = db
    .select({
      id: garmentImages.id,
      userId: garmentImages.userId,
      email: users.email,
      fileUrl: garmentImages.fileUrl,
      detectedCategory: garmentImages.detectedCategory,
      userSelectedCategory: garmentImages.userSelectedCategory,
      width: garmentImages.width,
      height: garmentImages.height,
      fileSize: garmentImages.fileSize,
      status: garmentImages.status,
      createdAt: garmentImages.createdAt,
    })
    .from(garmentImages)
    .leftJoin(users, eq(garmentImages.userId, users.id))

  if (search) {
    query = query.where(users.email.like(`%${search}%`))
  }

  if (status) {
    query = query.where(eq(garmentImages.status, status))
  }

  if (category) {
    query = query.where(eq(garmentImages.userSelectedCategory, category))
  }

  const totalResult = await db.select({ count: count() }).from(garmentImages)
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