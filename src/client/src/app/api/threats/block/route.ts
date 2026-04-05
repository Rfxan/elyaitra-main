import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Block an IP address in the real security engine.
 * Persists to disk and takes effect immediately via middleware.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ip, type, value, reason, category } = body

    // Support both direct IP blocking and type-based blocking
    const targetIP = ip || (type === 'ip' ? value : null)

    if (!targetIP) {
      // If blocking an endpoint/domain rather than IP, store it differently
      const entry = engine.blockIP(
        value || 'unknown',
        reason || `Manual block: ${type} — ${value}`,
        category || 'unknown',
        false // permanent (manual blocks don't expire)
      )
      return NextResponse.json(entry)
    }

    const entry = engine.blockIP(
      targetIP,
      reason || 'Manually blocked from dashboard',
      category || 'unknown',
      false
    )

    return NextResponse.json(entry)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
