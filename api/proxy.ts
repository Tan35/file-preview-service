export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  const url = new URL(req.url)

  // The rewrite passes the original path as a query param
  const filePath = url.searchParams.get('path')

  if (!filePath) {
    return new Response(JSON.stringify({ error: 'No file path provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Missing env vars' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Fetch from Supabase Storage (public bucket)
  const targetUrl = `${supabaseUrl}/storage/v1/object/public/public_office/${filePath}`

  try {
    const res = await fetch(targetUrl)

    if (!res.ok) {
      const errText = await res.text()
      return new Response(JSON.stringify({ error: 'Supabase error', status: res.status, detail: errText }), {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const contentType = res.headers.get('Content-Type') || 'application/octet-stream'

    return new Response(res.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Fetch failed', message: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
