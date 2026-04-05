import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Returns the real list of currently blocked IPs from the security engine.
 */
export async function GET() {
  const blockedIPs = engine.getBlockedIPs()

  return NextResponse.json(
    blockedIPs.map(entry => ({
      id: `block-${entry.ip}`,
      type: 'ip',
      value: entry.ip,
      reason: entry.reason,
      category: entry.category,
      blockedAt: entry.blockedAt,
      expiresAt: entry.expiresAt,
      threatCount: entry.threatCount,
      permanent: entry.permanent,
    }))
  )
}
