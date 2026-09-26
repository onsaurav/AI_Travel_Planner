import { describe, expect, test } from 'vitest';
import { AiUnavailableError } from '../../src/server/ai/ai-service';
import { createOllamaAiService } from '../../src/server/ai/ollama-ai-service';

const request = () => ({
  system: 'You plan trips.',
  user: 'Plan Kyoto.',
  maxOutputTokens: 200,
  signal: new AbortController().signal,
});

describe('the Ollama AI adapter', () => {
  // @covers REQ-TRV-117@v1
  test('posts chat to the configured Ollama base URL with the model, not Anthropic', async () => {
    const seen: { url: string; body: string }[] = [];
    const service = createOllamaAiService({
      baseUrl: 'http://127.0.0.1:11434',
      model: 'llama3.2',
      fetch: async (url, init) => {
        seen.push({ url: String(url), body: String(init?.body ?? '') });
        return new Response(
          JSON.stringify({
            message: { content: 'Day 1 in Kyoto.' },
            done: true,
            prompt_eval_count: 11,
            eval_count: 7,
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      },
    });

    const reply = await service.complete(request());

    expect(seen[0]?.url).toBe('http://127.0.0.1:11434/api/chat');
    expect(seen[0]?.body).toContain('"model":"llama3.2"');
    expect(seen[0]?.url).not.toMatch(/anthropic/i);
    expect(reply).toEqual({ text: 'Day 1 in Kyoto.', inputTokens: 11, outputTokens: 7 });
  });

  // @covers REQ-TRV-117@v1
  test('streams each piece of the reply as Ollama writes it', async () => {
    const pieces: string[] = [];
    const payload =
      `${JSON.stringify({ message: { content: 'Hello' }, done: false })}\n` +
      `${JSON.stringify({ message: { content: ' there' }, done: true, prompt_eval_count: 2, eval_count: 3 })}\n`;
    const service = createOllamaAiService({
      baseUrl: 'http://127.0.0.1:11434',
      model: 'llama3.2',
      fetch: async () => new Response(payload, { status: 200 }),
    });

    const reply = await service.complete({ ...request(), onText: (delta) => pieces.push(delta) });

    expect(pieces).toEqual(['Hello', ' there']);
    expect(reply.text).toBe('Hello there');
  });

  // @covers REQ-TRV-117@v1
  test('turns a failed Ollama answer into AiUnavailableError without the request text', async () => {
    const service = createOllamaAiService({
      baseUrl: 'http://127.0.0.1:11434',
      model: 'missing',
      fetch: async () => new Response('no', { status: 404 }),
    });

    await expect(service.complete(request())).rejects.toBeInstanceOf(AiUnavailableError);
    await expect(service.complete(request())).rejects.toThrow(/status 404/);
    await expect(service.complete(request())).rejects.not.toThrow(/Plan Kyoto/);
  });
});
