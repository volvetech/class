import { NextResponse } from 'next/server'
import { db } from '@/db'
import { garmentCategories, garmentImages, tryOnJobs } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const result = await db.select().from(garmentCategories).where(eq(garmentCategories.id, id))
  
  if (result.length === 0) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }
  
  return NextResponse.json(result[0])
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const body = await request.json()
  const result = await db.update(garmentCategories)
    .set(body)
    .where(eq(garmentCategories.id, id))
    .returning()
  
  if (result.length === 0) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }
  
  return NextResponse.json(result[0])
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  
  const category = await db.select().from(garmentCategories).where(eq(garmentCategories.id, id))
  if (category.length === 0) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }
  
  const code = category[0].code
  
  const imageCount = await db.select({ count: db.count() })
    .from(garmentImages)
    .where(eq(garmentImages.userSelectedCategory, code))
  
  const jobCount = await db.select({ count: db.count() })
    .from(tryOnJobs)
    .where(eq(tryOnJobs.garmentCategory, code))
  
  if (imageCount[0].count > 0 || jobCount[0].count > 0) {
    return NextResponse.json(
      { error: '该类别正在被使用，只能禁用不能删除' },
      { status: 400 }
    )
  }
  
  const result = await db.delete(garmentCategories).where(eq(garmentCategories.id, id)).returning()
  return NextResponse.json(result[0])
}