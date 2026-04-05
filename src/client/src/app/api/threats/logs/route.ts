import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Returns real-time collected logs from the security engine.
 * Sources: /var/log/auth.log, /var/log/syslog, and HTTP request logs.
 */
export async function GET() {
  const logs = engine.getLogs(100)

  return NextResponse.json({
    logs: logs.map(l => `[${l.timestamp.slice(0, 19).replace('T', ' ')}] ${l.category} :: ${l.message}`),
    structured: logs,
    count: logs.length,
    timestamp: new Date().toISOString(),
  })
}
