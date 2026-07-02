import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const result = await db.select().from(users).where(users.id.eq(id))
  
  if (result.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  return NextResponse.json(result[0])
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const body = await request.json()
  
  const result = await db.update(users)
    .set(body)
    .where(users.id.eq(id))
    .returning()
  
  if (result.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  
  return NextResponse.json(result[0])
}