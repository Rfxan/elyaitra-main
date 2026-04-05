import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Returns real-time system audit data (agents, vulnerabilities, misconfigs).
 * Replaces all mock data with live system telemetry.
 */
export async function GET() {
  try {
    const audit = await engine.performSystemAudit()
    return NextResponse.json(audit)
  } catch (error) {
    return NextResponse.json({ error: 'Audit failed' }, { status: 500 })
  }
}
