import { NextResponse } from 'next/server'
import { db } from '@/db'
import { tryOnResults, tryOnJobs, users } from '@/db/schema'
import { eq, count } from 'drizzle-orm'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const jobId = searchParams.get('jobId') || ''

  const offset = (page - 1) * limit

  let query = db
    .select({
      id: tryOnResults.id,
      jobId: tryOnResults.jobId,
      resultImageUrl: tryOnResults.resultImageUrl,
      thumbnailUrl: tryOnResults.thumbnailUrl,
      qualityScore: tryOnResults.qualityScore,
      isSaved: tryOnResults.isSaved,
      isDownloaded: tryOnResults.isDownloaded,
      createdAt: tryOnResults.createdAt,
      userId: users.id,
      email: users.email,
      jobStatus: tryOnJobs.status,
    })
    .from(tryOnResults)
    .leftJoin(tryOnJobs, eq(tryOnResults.jobId, tryOnJobs.id))
    .leftJoin(users, eq(tryOnJobs.userId, users.id))

  if (jobId) {
    query = query.where(eq(tryOnResults.jobId, parseInt(jobId)))
  }

  const totalResult = await db.select({ count: count() }).from(tryOnResults)
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