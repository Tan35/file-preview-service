export const config = {
  runtime: 'edge',
}

export default function handler(req: Request) {
  return new Response(JSON.stringify({ 
    message: 'Edge Function is working!',
    timestamp: new Date().toISOString(),
    url: req.url 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
