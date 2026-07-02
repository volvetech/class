import { NextResponse } from 'next/server'
import { db } from '@/db'
import { resultFeedback, users, tryOnJobs, tryOnResults } from '@/db/schema'
import { eq, count } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const rating = searchParams.get('rating') || ''
  const search = searchParams.get('search') || ''

  const offset = (page - 1) * limit

  let query = db
    .select({
      id: resultFeedback.id,
      userId: resultFeedback.userId,
      email: users.email,
      jobId: resultFeedback.jobId,
      resultId: resultFeedback.resultId,
      rating: resultFeedback.rating,
      feedbackTags: resultFeedback.feedbackTags,
      comment: resultFeedback.comment,
      createdAt: resultFeedback.createdAt,
      resultImageUrl: tryOnResults.resultImageUrl,
    })
    .from(resultFeedback)
    .leftJoin(users, eq(resultFeedback.userId, users.id))
    .leftJoin(tryOnResults, eq(resultFeedback.resultId, tryOnResults.id))

  if (rating) {
    query = query.where(eq(resultFeedback.rating, parseInt(rating)))
  }

  if (search) {
    query = query.where(users.email.like(`%${search}%`))
  }

  const totalResult = await db.select({ count: count() }).from(resultFeedback)
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