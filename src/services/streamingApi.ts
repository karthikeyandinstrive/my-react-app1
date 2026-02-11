import { parseSSEResponse, type ContentSegment } from '../utils/sseParser';

export interface StreamOptions {
  /** Called on every new chunk with the full parsed segments so far */
  onChunk?: (segments: ContentSegment[]) => void;
  /** Called once when the stream finishes */
  onDone?: (segments: ContentSegment[]) => void;
  /** Called if an error occurs */
  onError?: (error: Error) => void;
  /** Optional AbortSignal to cancel the request */
  signal?: AbortSignal;
}

/**
 * POST to `url` with a JSON body, consume the SSE stream, filter events,
 * and convert CSV blocks to table segments.
 *
 * Returns the final array of ContentSegments when the stream ends.
 *
 * Example usage:
 *
 *   const segments = await streamSSERequest(
 *     'https://api.example.com/stream',
 *     { query: 'UPI last 5 years' },
 *     {
 *       onChunk: (segs) => setSegments(segs),   // live updates
 *       onDone:  (segs) => setSegments(segs),   // final result
 *     }
 *   );
 */
export async function streamSSERequest(
  url: string,
  body: Record<string, unknown>,
  options: StreamOptions = {},
): Promise<ContentSegment[]> {
  let response: Response;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: options.signal,
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    options.onError?.(error);
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`Stream request failed: ${response.status} ${response.statusText}`);
    options.onError?.(error);
    throw error;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    const error = new Error('Response body is not readable');
    options.onError?.(error);
    throw error;
  }

  const decoder = new TextDecoder();
  let accumulated = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      accumulated += decoder.decode(value, { stream: true });

      if (options.onChunk) {
        options.onChunk(parseSSEResponse(accumulated));
      }
    }
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    options.onError?.(error);
    throw error;
  } finally {
    reader.releaseLock();
  }

  const finalSegments = parseSSEResponse(accumulated);
  options.onDone?.(finalSegments);
  return finalSegments;
}
