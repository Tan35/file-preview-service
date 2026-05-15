import type { Context } from '@vercel/edge'

export const config = {
  runtime: 'edge',
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY
const BUCKET = 'public_office'

export default async function handler(req: Request, ctx: Context) {
  // Extract the file path from the URL: /api/files/uploads/xxx.docx → uploads/xxx.docx
  const url = new URL(req.url)
  const pathMatch = url.pathname.match(/^\/api\/files\/(.+)$/)
  if (!pathMatch) {
    return new Response('Not Found', { status: 404 })
  }
  const filePath = decodeURIComponent(pathMatch[1])

  // Proxy request to Supabase Storage
  const supabaseUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`

  const res = await fetch(supabaseUrl, {
    method: req.method,
    headers: {
      'apikey': SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY!}`,
    },
    // Forward body for PUT/POST (not needed for GET but keeps it generic)
    body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
  })

  // If Supabase returns error, pass it through
  if (!res.ok) {
    return new Response(res.body, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Stream the file back with correct Content-Type
  const contentType = res.headers.get('Content-Type') || 'application/octet-stream'
  const contentLength = res.headers.get('Content-Length')

  const headers = new Headers({
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Access-Control-Allow-Origin': '*',
  })
  if (contentLength) {
    headers.set('Content-Length', contentLength)
  }

  return new Response(res.body, {
    status: 200,
    headers,
  })
}
