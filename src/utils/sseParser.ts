// Events to silently drop from the SSE stream
const FILTERED_EVENTS = new Set([
  'message_session',
  'info',
  'thinking',
  'citation',
]);

// ── Public types ──────────────────────────────────────────────────────────────

export interface ChartDataset {
  label: string;
  data: number[];
  color?: string;
}

export interface ChartData {
  chartType: string;   // Chart.js type string  e.g. 'bar', 'line', 'pie'
  title: string;
  labels: string[];
  datasets: ChartDataset[];
}

export type ContentSegment =
  | { type: 'text';  content: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'chart'; data: ChartData };

// ── CSV helpers ───────────────────────────────────────────────────────────────

function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(csv: string): { headers: string[]; rows: string[][] } {
  const lines = csv.trim().split('\n').filter(l => l.trim());
  const [headerLine, ...bodyLines] = lines;
  return {
    headers: parseCSVRow(headerLine),
    rows: bodyLines.map(parseCSVRow),
  };
}

// ── Chart JSON helpers ────────────────────────────────────────────────────────

function parseChartJSON(jsonStr: string): ChartData | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed: any = JSON.parse(jsonStr.trim());
    return {
      chartType: parsed.type ?? 'bar',
      title: parsed.options?.plugins?.title?.text ?? '',
      labels: parsed.data?.labels ?? [],
      datasets: (parsed.data?.datasets ?? []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ds: any): ChartDataset => ({
          label: ds.label ?? '',
          data: ds.data ?? [],
          color: ds.backgroundColor ?? ds.borderColor ?? undefined,
        }),
      ),
    };
  } catch {
    return null;
  }
}

// ── Segment splitter ──────────────────────────────────────────────────────────

/**
 * Splits clean text into alternating text / table / chart segments.
 *
 * Handles:
 *   - ```csv ... ```
 *   - ```json_chart ... ```json_chart   (closing tag may repeat the language ID)
 */
function splitIntoSegments(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];

  // Matches ```csv or ```json_chart blocks.
  // Closing fence may optionally carry the language ID (```json_chart).
  const blockPattern = /```(csv|json_chart)\n([\s\S]*?)```(?:json_chart)?/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = blockPattern.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index).trim();
    if (before) {
      segments.push({ type: 'text', content: before });
    }

    const blockType = match[1];
    const blockContent = match[2];

    if (blockType === 'csv') {
      const { headers, rows } = parseCSV(blockContent);
      segments.push({ type: 'table', headers, rows });
    } else if (blockType === 'json_chart') {
      const data = parseChartJSON(blockContent);
      if (data) {
        segments.push({ type: 'chart', data });
      }
    }

    lastIndex = match.index + match[0].length;
  }

  const remaining = text.slice(lastIndex).trim();
  if (remaining) {
    segments.push({ type: 'text', content: remaining });
  }

  return segments;
}

// ── Main parser ───────────────────────────────────────────────────────────────

/**
 * Parse a raw SSE response string.
 *
 * - Lines with `event: <type>` set the current event context.
 *   If the type is in FILTERED_EVENTS, the following data lines are dropped.
 * - `data: ` lines are included only when the current event is not filtered.
 * - Blank lines reset the event context.
 * - Plain text lines (not inside an event block) are always included.
 *
 * After filtering, fenced code blocks (csv / json_chart) are converted to
 * table / chart segments; all other text becomes text segments.
 */
export function parseSSEResponse(raw: string): ContentSegment[] {
  const lines = raw.split('\n');
  const output: string[] = [];
  let isFiltered = false;

  for (const line of lines) {
    if (line.startsWith('event: ')) {
      const eventType = line.slice(7).trim();
      isFiltered = FILTERED_EVENTS.has(eventType);
    } else if (line.startsWith('data: ')) {
      if (!isFiltered) {
        output.push(line.slice(6));
      }
    } else if (line === '') {
      isFiltered = false;
      output.push('');
    } else {
      if (!isFiltered) {
        output.push(line);
      }
    }
  }

  const combined = output.join('\n').trim();
  return splitIntoSegments(combined);
}
