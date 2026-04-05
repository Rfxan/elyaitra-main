import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Returns real-time security engine statistics.
 */
export async function GET() {
  return NextResponse.json(engine.getStats())
}
