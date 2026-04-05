import { NextResponse } from 'next/server'
import { runAgent } from '@/lib/ai-client'
import { realTools } from '@/lib/security/tools'

export async function POST(req: Request) {
  try {
    const { threatId, threatDetails, additionalContext } = await req.json()

    const systemPrompt = `You are a cybersecurity investigation agent. Investigate the given threat thoroughly using the provided tools.
Analyze the tool outputs to find the root cause.
When you need more information, call a tool by responding with EXACTLY this format on its own line:
TOOL_CALL: {"tool": "tool_name", "args": {"key": "value"}}
Available tools: get_related_logs, query_system_state, check_ip_reputation, analyze_file_path
When investigation is complete, respond with ONLY valid JSON:
{"summary":"...","rootCause":"...","attackVector":"...","affectedSystems":["..."],"timeline":["..."],"confidence":"high|medium|low"}`

    const userMessage = `Investigate threat ${threatId}: ${JSON.stringify(threatDetails)}${
      additionalContext ? `\nAdditional context: ${additionalContext}` : ''
    }`

    let parsed: any = { summary: 'Investigation pending...', rootCause: 'Under analysis', attackVector: 'N/A', affectedSystems: [threatDetails.affectedSystem || 'Unknown'], timeline: [], confidence: 'low' }
    
    const raw = await runAgent(systemPrompt, userMessage, realTools)
    // Attempt to extract JSON from the AI response
    const clean = raw.replace(/```json|```/g, '').trim()
    const jsonMatch = clean.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0])
      } catch (e) {
        console.error('Failed to parse AI JSON, using raw text as summary')
        parsed.summary = raw
      }
    } else {
      parsed.summary = raw
    }

    return NextResponse.json({ investigation: parsed })
  } catch (err: unknown) {
    console.error('Investigation execution failed:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ 
      error: message,
      investigation: {
        summary: `Investigation failed: ${message}`,
        rootCause: 'Technical error during forensic analysis',
        attackVector: 'N/A',
        affectedSystems: [],
        timeline: [],
        confidence: 'low'
      }
    }, { status: 200 }) // Return 200 with error info so UI doesn't crash
  }
}
