import { NextResponse } from 'next/server'
import { chat } from '@/lib/ai-client'

export async function POST(req: Request) {
  try {
    const { threatId, severity, investigation, autoApprove } = await req.json()

    const systemPrompt = `You are a cybersecurity response agent. Generate an autonomous response plan as ONLY valid JSON with no markdown:
{"responsePlan":[{"action":"...","target":"...","status":"pending","executedAt":"ISO timestamp"}],"summary":"..."}`

    const userMessage = `Generate response plan for threat ${threatId} with severity ${severity}. Investigation findings: ${JSON.stringify(investigation)}`

    const raw = await chat(systemPrompt, userMessage)
    const clean = raw.replace(/```json|```/g, '').trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : clean)

    if (autoApprove && parsed.responsePlan) {
      parsed.responsePlan = parsed.responsePlan.map((a: { action: string; target: string; status: string; executedAt: string }) => ({
        ...a,
        status: 'executed',
        executedAt: new Date().toISOString()
      }))
    }

    return NextResponse.json(parsed)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
