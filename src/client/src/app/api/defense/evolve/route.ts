import { NextResponse } from 'next/server'
import { chat } from '@/lib/ai-client'

export async function POST(req: Request) {
  try {
    const { recentThreats, currentRules } = await req.json()

    const systemPrompt = `You are a cybersecurity defense strategy agent. Analyze threat patterns and generate updated defense rules. Respond with ONLY valid JSON, no markdown:
{"newRules":["..."],"deprecatedRules":["..."],"rationale":"...","patternsSeen":["..."]}`

    const userMessage = `Recent threats: ${JSON.stringify(recentThreats)}\nCurrent rules: ${JSON.stringify(currentRules)}`

    const raw = await chat(systemPrompt, userMessage)
    const clean = raw.replace(/```json|```/g, '').trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : clean)

    return NextResponse.json(parsed)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
