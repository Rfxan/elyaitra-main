// ============================================================
// Next.js Middleware — Edge-Compatible Security Layer
// No Node.js APIs (fs, path) — uses fetch to check blocklist.
// ============================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Skip static assets and internal API endpoints to prevent loops
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/api/threats/ingest' ||
    pathname === '/api/threats/is-blocked' ||
    pathname === '/api/threats/logs' ||
    pathname === '/api/threats/stats' ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.map') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2')
  ) {
    return NextResponse.next()
  }

  const ip = getClientIP(req)
  const baseUrl = req.nextUrl.origin

  // Fire-and-forget: send request data to security engine for analysis
  fetch(`${baseUrl}/api/threats/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal': 'true' },
    body: JSON.stringify({
      ip,
      method: req.method,
      path: pathname,
      userAgent: req.headers.get('user-agent') || '',
      query: req.nextUrl.search || '',
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {})

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
