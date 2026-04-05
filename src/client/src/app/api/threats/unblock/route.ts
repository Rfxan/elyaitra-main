import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Unblock an IP address from the real security engine.
 */
export async function POST(req: Request) {
  try {
    const { id, ip } = await req.json()

    // Support both ID-based and IP-based unblocking
    const targetIP = ip || (id?.startsWith('block-') ? id.replace('block-', '') : id)

    if (!targetIP) {
      return NextResponse.json({ error: 'IP address required' }, { status: 400 })
    }

    const success = engine.unblockIP(targetIP)

    if (success) {
      return NextResponse.json({
        success: true,
        ip: targetIP,
        unblockedAt: new Date().toISOString(),
        message: `Successfully unblocked IP: ${targetIP}`,
      })
    }

    return NextResponse.json(
      { error: `IP ${targetIP} was not found in the blocklist` },
      { status: 404 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
