import { NextResponse } from 'next/server'
import { engine } from '@/lib/security/engine'
import { analyzeRequest } from '@/lib/security/patterns'
import { chat } from '@/lib/ai-client'

/**
 * Detect threats in provided logs using real pattern matching
 * and optional AI-powered analysis via Groq.
 */
export async function POST(req: Request) {
  try {
    const { logs, context, useAI } = await req.json()

    const threats: any[] = []

    // 1. Real pattern-based detection on each log line
    if (Array.isArray(logs)) {
      for (const line of logs) {
        // Check web patterns
        const detection = analyzeRequest(line, '', '', '')
        if (detection && detection.detected) {
          threats.push({
            id: crypto.randomUUID(),
            severity: detection.severity,
            type: detection.category.replace(/_/g, ' '),
            description: `${detection.category.replace(/_/g, ' ').toUpperCase()} pattern detected: "${detection.payload.slice(0, 80)}"`,
            affectedSystem: 'Elyaitra Infrastructure',
            recommendedAction: detection.severity === 'critical' ? 'Block source IP immediately' : 'Investigate and monitor',
            timestamp: new Date().toISOString(),
            matchedPattern: detection.pattern,
          })
        }

        // Check authentication failure patterns
        const { detectAuthFailure } = require('@/lib/security/patterns')
        const auth = detectAuthFailure(line)
        if (auth.detected) {
          threats.push({
            id: crypto.randomUUID(),
            severity: 'medium',
            type: 'auth failure',
            description: `AUTHENTICATION FAILURE detected from ${auth.ip} on ${auth.service}`,
            affectedSystem: 'Local System',
            recommendedAction: 'Monitor for brute force activity',
            timestamp: new Date().toISOString(),
            sourceIp: auth.ip,
          })
        }
      }
    }

    // 2. Get real threats from the engine (already detected from live traffic)
    const engineThreats = engine.getThreats(20)
    for (const t of engineThreats) {
      threats.push({
        id: t.id,
        severity: t.severity,
        type: t.category.replace(/_/g, ' '),
        description: t.description,
        affectedSystem: t.targetPath || 'System',
        recommendedAction: t.autoBlocked ? 'Auto-blocked by engine' : 'Review and take action',
        timestamp: t.timestamp,
        matchedPattern: t.matchedPattern,
        sourceIp: t.sourceIp,
        mitigationStatus: t.mitigationStatus,
      })
    }

    // 3. Optional AI analysis via local/external AI
    if (useAI && logs && logs.length > 0) {
      try {
        const systemPrompt = `You are an expert cybersecurity AI. Analyze these REAL system logs for threats. Respond with ONLY valid JSON: {"aiThreats":[{"severity":"critical|high|medium|low","type":"threat type","description":"what you found","recommendedAction":"what to do"}]}`
        const userMessage = `Analyze these real logs:\n${logs.slice(0, 30).join('\n')}${context ? `\nContext: ${context}` : ''}`
        
        const raw = await chat([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ])
        
        const clean = raw.replace(/```json|```/g, '').trim()
        const jsonMatch = clean.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          if (parsed.aiThreats) {
            for (const t of parsed.aiThreats) {
              threats.push({
                id: `ai-${crypto.randomUUID()}`,
                ...t,
                affectedSystem: 'AI Analysis',
                timestamp: new Date().toISOString(),
                source: 'groq-ai',
              })
            }
          }
        }
      } catch (err) {
        console.error('[Detect] AI analysis failed:', err)
      }
    }

    // Deduplicate by description
    const seen = new Set<string>()
    const unique = threats.filter(t => {
      const key = t.description
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    return NextResponse.json({
      threats: unique,
      stats: engine.getStats(),
      analysisType: useAI ? 'pattern+ai' : 'pattern',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
