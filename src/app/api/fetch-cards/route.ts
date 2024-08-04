import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)

export async function GET(req: NextRequest) {
  const headers = req.headers
  const authorization = headers?.get('Authorization')

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const token = authorization.split(' ')[1]

  if (token !== process.env.NEXT_INTERNAL_API) {
    return NextResponse.json({ message: 'Forbidden!' }, { status: 403 })
  }

  try {
    const { data, error } = await supabase.from('pokemon').select('*')
    if (error) throw error
    return NextResponse.json({ message: data }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching cards:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
