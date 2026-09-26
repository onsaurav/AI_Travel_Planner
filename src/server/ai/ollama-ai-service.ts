import { AiUnavailableError, type AiReply, type AiService } from './ai-service';

export interface OllamaAiOptions {
  readonly baseUrl: string;
  readonly model: string;
  readonly fetch?: typeof fetch;
}

interface OllamaChatResponse {
  readonly message?: { readonly content?: string };
  readonly done?: boolean;
  readonly prompt_eval_count?: number;
  readonly eval_count?: number;
}

function describeFailure(error: unknown): string {
  if (error instanceof AiUnavailableError) return error.message;
  if (error instanceof Error && /aborted|AbortError/i.test(error.name + error.message)) {
    return 'The AI provider could not be reached.';
  }
  return 'The AI provider could not be reached.';
}

function toReply(body: OllamaChatResponse, streamedText: string): AiReply {
  const text = streamedText || body.message?.content || '';
  return {
    text,
    inputTokens: body.prompt_eval_count ?? 0,
    outputTokens: body.eval_count ?? 0,
  };
}

async function readStream(
  response: Response,
  onText: ((delta: string) => void) | undefined,
  signal: AbortSignal,
): Promise<AiReply> {
  if (!response.body) throw new AiUnavailableError('The AI reply could not be read.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = '';
  let text = '';
  let last: OllamaChatResponse = {};
  while (!signal.aborted) {
    const { done, value } = await reader.read();
    if (done) break;
    const parts = (pending + decoder.decode(value, { stream: true })).split('\n');
    pending = parts.pop() ?? '';
    for (const line of parts) {
      if (line.trim() === '') continue;
      const chunk = JSON.parse(line) as OllamaChatResponse;
      last = chunk;
      const delta = chunk.message?.content ?? '';
      if (delta !== '') {
        text += delta;
        onText?.(delta);
      }
    }
  }
  if (pending.trim() !== '') {
    last = JSON.parse(pending) as OllamaChatResponse;
    const delta = last.message?.content ?? '';
    if (delta !== '' && !text.endsWith(delta)) {
      text += delta;
      onText?.(delta);
    }
  }
  return toReply(last, text);
}

/**
 * Talks to a local Ollama server (REQ-TRV-117). Failures leave as AiUnavailableError with
 * no request text and no host internals the Traveler does not need.
 */
export function createOllamaAiService(options: OllamaAiOptions): AiService {
  const fetchFn = options.fetch ?? fetch;
  const root = options.baseUrl.replace(/\/$/, '');
  return {
    async complete(request): Promise<AiReply> {
      const stream = request.onText !== undefined;
      try {
        const response = await fetchFn(`${root}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: request.signal,
          body: JSON.stringify({
            model: options.model,
            stream,
            messages: [
              { role: 'system', content: request.system },
              { role: 'user', content: request.user },
            ],
            options: { num_predict: request.maxOutputTokens },
          }),
        });
        if (!response.ok) {
          throw new AiUnavailableError(`The AI provider answered with status ${response.status}.`);
        }
        if (stream) return await readStream(response, request.onText, request.signal);
        const body = (await response.json()) as OllamaChatResponse;
        return toReply(body, '');
      } catch (error) {
        throw error instanceof AiUnavailableError
          ? error
          : new AiUnavailableError(describeFailure(error));
      }
    },
  };
}
