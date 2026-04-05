import { chatStream } from '@/lib/ai-client'

export async function POST(req: Request) {
  try {
    const { logs } = await req.json()

    const systemPrompt = `You are a cybersecurity analyst. Analyze these logs and describe any threats you find in clear, concise language.`
    const userMessage = `Logs:\n${logs.join('\n')}`

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const ollamaStream = await chatStream(systemPrompt, userMessage)
          for await (const chunk of ollamaStream) {
            controller.enqueue(new TextEncoder().encode(chunk.message.content))
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked'
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), { status: 500 })
  }
}
