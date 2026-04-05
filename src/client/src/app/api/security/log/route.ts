import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'

/**
 * Endpoint for backend-to-frontend security event ingestion.
 * Receives JSON logs from the Python backend and adds them to the live engine.
 */
export async function POST(req: Request) {
  try {
    const log = await req.json()
    
    // Pass to the security engine for real-time processing
    engine.addExternalEvent(log)
    
    return NextResponse.json({ status: 'ingested' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to ingest log' }, { status: 400 })
  }
}
