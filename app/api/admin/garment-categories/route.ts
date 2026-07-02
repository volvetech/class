import { NextResponse } from 'next/server'
import { db } from '@/db'
import { garmentCategories } from '@/db/schema'

export async function GET() {
  const data = await db.select().from(garmentCategories).orderBy(garmentCategories.sortOrder)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const result = await db.insert(garmentCategories).values(body).returning()
  return NextResponse.json(result[0])
}