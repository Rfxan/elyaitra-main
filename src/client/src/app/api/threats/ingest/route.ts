import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Internal endpoint called by the middleware to ingest request data
 * into the security engine for pattern analysis.
 */
export async function POST(req: Request) {
  // Only accept internal calls
  const internal = req.headers.get('x-internal')
  if (internal !== 'true') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const payload = await req.json()
    const result = engine.ingestRequest(payload)

    return NextResponse.json({
      allowed: result.allowed,
      reason: result.reason,
      threatId: result.threat?.id,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
