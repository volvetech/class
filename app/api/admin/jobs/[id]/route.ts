import { NextResponse } from 'next/server'
import { db } from '@/db'
import { tryOnJobs, users, personImages, garmentImages, tryOnResults } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  
  const job = await db
    .select({
      id: tryOnJobs.id,
      userId: tryOnJobs.userId,
      email: users.email,
      username: users.username,
      personImageId: tryOnJobs.personImageId,
      personImageUrl: personImages.fileUrl,
      garmentImageId: tryOnJobs.garmentImageId,
      garmentImageUrl: garmentImages.fileUrl,
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
    .leftJoin(personImages, eq(tryOnJobs.personImageId, personImages.id))
    .leftJoin(garmentImages, eq(tryOnJobs.garmentImageId, garmentImages.id))
    .where(eq(tryOnJobs.id, id))
  
  if (job.length === 0) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }
  
  const results = await db
    .select()
    .from(tryOnResults)
    .where(eq(tryOnResults.jobId, id))
  
  return NextResponse.json({
    ...job[0],
    results,
  })
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const body = await request.json()
  
  const result = await db.update(tryOnJobs)
    .set(body)
    .where(eq(tryOnJobs.id, id))
    .returning()
  
  if (result.length === 0) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }
  
  return NextResponse.json(result[0])
}