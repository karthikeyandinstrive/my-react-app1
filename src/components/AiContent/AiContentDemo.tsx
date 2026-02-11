import { useMemo, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import AiContent from './AiContent';
import { parseSSEResponse, type ContentSegment } from '../../utils/sseParser';
import { usePresentation } from '../../context/PresentationContext';
import type { TextElement, TableElement, ChartElement, TableCell, ChartType } from '../../types/presentation';

// ── Sample SSE responses ──────────────────────────────────────────────────────

const SAMPLE_SSE_1 = `event: message_session
data: eaf2ae10-8066-4fb1-99f4-b461a785168f

event: info
data: internal search query: UPI Payments last 5 year analysis table format

event: info
data: rag results: [{"title":"Transformation of Digital Payments Landscape of India - Powered by UPI - Powered by NPCI","file_id":"691d861d"}]

event: info
data: online search query: UPI payments last 5 years transaction volume yearly NPCI report 2019 2024

event: info
data: online search results: [{"url":"https://bfsi.economictimes.indiatimes.com/...","title":"UPI Sets Record with 21.6 Billion Transactions"}]

event: thinking
data: "**Considering the Task's Scope**\\n\\nI'm focused on distilling the essence of UPI payments and then presenting a 5-year analysis."

event: thinking
data: "**Refining the Approach**\\n\\nI'm now prioritizing the definition of UPI, leaning towards incorporating key phrases like \\"instant, inclusive, and interoperable platform\\"."

event: thinking
data: "**Mapping the Strategy**\\n\\nI'm now breaking down the tasks into steps. First, define UPI using key phrases like \\"digital public infrastructure\\"."

UPI (Unified Payments Interface) is India's digital public payment infrastructure, an instant, inclusive, and interoperable platform developed by NPCI (National Payments Corporation of India) that connects bank accounts, wallets, and credit lines for various payment use cases. It has evolved to become the world's largest payment network by volume.

\`\`\`csv
"Metric","FY2021","FY2022","FY2023","FY2024","FY2025 (Partial)"
"Transaction Volume (Crore)","TBD","TBD","TBD","7,062 (Apr-Aug)","21.63 Billion (Dec)"
"Transaction Value (₹ Lakh Crore)","TBD","TBD","TBD","101 (Apr-Aug)","27.97 Trillion (Dec)"
"Annual Growth Rate (CAGR)","TBD","TBD","TBD","138% (Value, from ₹1L to ₹200L)","TBD"
"Source","link_29","link_29","link_29","link_29","link_28"
\`\`\`

event: citation
data: [{"title":"Transformation of Digital Payments Landscape of India - Powered by UPI","file_id":"691d861d6a26694bb542ee7f"}]
`;

const SAMPLE_SSE_2 = `event: message_session
data: fed05e6f-6c7b-4607-bb6a-c133f524c269

event: info
data: internal search query: UPI payment trends last few years

event: info
data: rag results: [{"title":"Unlocking Instant Cross-Border Payments in APAC","file_id":"67ff84c2016d9851b2743c66"}]

event: info
data: online search query: UPI payment trends India last few years 2021 2022 2023 statistics NPCI reports

event: info
data: online search results: [{"url":"https://m.economictimes.com/...","title":"UPI payments in India register steady growth YoY in November 2025"}]

event: thinking
data: "**Examining Data's Scope**\\n\\nI'm focused on grasping the specific UPI payment trends the user is seeking."

event: thinking
data: "**Charting UPI's Evolution**\\n\\nI'm solidifying the chart's structure now, aiming for an elegant visual of transaction volumes from FY2019-20 to FY2023-24."

event: thinking
data: "**Refining the JSON Structure**\\n\\nI'm now deep into the JSON creation for the bar chart."

event: thinking
data: "**Processing Data and Text**\\n\\nI'm now in the process of extracting the required data."

Alright, let's dive straight into the UPI payment trends, *dost*! The growth trajectory is nothing short of phenomenal, showcasing India's rapid shift to digital payments.

\`\`\`json_chart
{"type":"bar","data":{"labels":["FY 2019-20","FY 2022-23","FY 2023-24"],"datasets":[{"label":"UPI Transaction Volume (Billions)","data":[12.5,84,131],"backgroundColor":"#4CAF50"}]},"options":{"responsive":true,"plugins":{"title":{"display":true,"text":"UPI Transaction Volume Growth (Fiscal Years)","font":{"size":16}},"legend":{"display":true,"position":"top"}},"scales":{"y":{"beginAtZero":true,"title":{"display":true,"text":"Transaction Volume (Billions)"}},"x":{"title":{"display":true,"text":"Fiscal Year"}}}}}
\`\`\`json_chart

**Key Insights:**

*   **Explosive Growth:** UPI transaction volume surged from 12.5 billion in FY 2019-20 to a massive 131 billion in FY 2023-24. That's a nearly ten-fold increase in just four years!
*   **Dominant Force:** UPI accounted for 80% of India's total digital payment volumes in FY 2023-24.
*   **Consistent Upward Trend:** November 2025 saw transaction volume grow approximately 23% year-on-year compared to November 2024.
*   **Fintech Powerhouses:** In July 2024, PhonePe led with approximately 6.98 billion transactions, followed by GPay at around 5.34 billion.
*   **Shifting Landscape:** While UPI transactions grew 57% year-on-year in FY24, debit card transactions declined by 43%.

This isn't just growth; it's a digital payment revolution, *yaar*!

event: citation
data: [{"title":"UPI payments in India register steady growth YoY in November 2025","file_id":"691d8657fee5c8ef094dcc37"}]
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

type SlideEl = TextElement | TableElement | ChartElement;

const SLIDE_MAX_Y = 90; // % — start a new slide when content exceeds this
const GAP = 2;          // % vertical gap between elements

// Chart.js type → app ChartType
const CHART_TYPE_MAP: Partial<Record<string, ChartType>> = {
  bar:           'column',
  horizontalBar: 'bar',
  line:          'line',
  pie:           'pie',
  doughnut:      'doughnut',
  radar:         'radar',
  scatter:       'scatter',
  bubble:        'bubble',
};

/** Strip **bold**, *italic* markers and (link_N) citation refs */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*([^*\n]+?)\*/g, '$1')
    .replace(/\s*\(link_\d+\)\s*/g, ' ')
    .trim();
}

// A "placement unit" is a content block with a known height (%)
type PlacementUnit =
  | { kind: 'text-plain';  content: string;  height: number }
  | { kind: 'text-bullet'; items: string[];  height: number }
  | { kind: 'table'; seg: Extract<ContentSegment, { type: 'table' }>; height: number }
  | { kind: 'chart'; seg: Extract<ContentSegment, { type: 'chart' }>; height: number };

const TEXT_BASE: Omit<TextElement, 'id' | 'position' | 'content' | 'listType'> = {
  type: 'text', zIndex: 1, fontSize: 12, fontFamily: 'Arial',
  color: '#222222', bold: false, italic: false, underline: false,
  strike: false, superscript: false, subscript: false,
  align: 'left', listStyle: 'disc',
};

/** Parse a text segment into placement units (plain blocks + bullet blocks) */
function textToUnits(content: string): PlacementUnit[] {
  const units: PlacementUnit[] = [];
  const lines = content.split('\n');

  type Run = { kind: 'bullet'; items: string[] } | { kind: 'plain'; lines: string[] };
  const runs: Run[] = [];

  for (const line of lines) {
    const bm = line.match(/^\*\s+(.*)$/);
    if (bm) {
      const last = runs[runs.length - 1];
      if (last?.kind === 'bullet') { last.items.push(bm[1]); }
      else { runs.push({ kind: 'bullet', items: [bm[1]] }); }
    } else {
      const last = runs[runs.length - 1];
      if (last?.kind === 'plain') { last.lines.push(line); }
      else { runs.push({ kind: 'plain', lines: [line] }); }
    }
  }

  for (const run of runs) {
    if (run.kind === 'plain') {
      const clean = run.lines.map(l => stripInlineMarkdown(l)).filter(Boolean).join('\n');
      if (!clean) continue;
      units.push({ kind: 'text-plain', content: clean, height: Math.max(8, Math.min(clean.split('\n').length * 4, 20)) });
    } else {
      const items = run.items.map(stripInlineMarkdown);
      units.push({ kind: 'text-bullet', items, height: Math.max(10, Math.min(items.length * 6, 40)) });
    }
  }
  return units;
}

/** Build a concrete slide element from a placement unit at a given Y% */
function unitToElement(unit: PlacementUnit, y: number): SlideEl {
  switch (unit.kind) {
    case 'text-plain':
      return { ...TEXT_BASE, id: uuidv4(), position: { x: 5, y, width: 90, height: unit.height }, content: unit.content, listType: 'none' };
    case 'text-bullet':
      return { ...TEXT_BASE, id: uuidv4(), position: { x: 5, y, width: 90, height: unit.height }, content: unit.items.join('\n'), listType: 'bullets' };
    case 'table': {
      const { headers, rows } = unit.seg;
      const totalRows = rows.length + 1;
      const headerCells: TableCell[] = headers.map(h => ({ text: h, bold: true, fontSize: 11, color: '#000000', fillColor: '#E8F0FE', align: 'center', valign: 'middle' }));
      const bodyCells: TableCell[][] = rows.map(row => row.map(cell => ({ text: cell, bold: false, fontSize: 10, color: '#333333', fillColor: '#FFFFFF', align: 'center', valign: 'middle' })));
      return { id: uuidv4(), type: 'table', position: { x: 5, y, width: 90, height: unit.height }, zIndex: 1, rows: totalRows, cols: headers.length, cells: [headerCells, ...bodyCells], borderColor: '#CCCCCC', borderWidth: 1, headerRow: true };
    }
    case 'chart': {
      const { data } = unit.seg;
      return { id: uuidv4(), type: 'chart', position: { x: 5, y, width: 90, height: unit.height }, zIndex: 1, chartType: (CHART_TYPE_MAP[data.chartType] ?? 'column') as ChartType, title: data.title, labels: data.labels, series: data.datasets.map(ds => ({ name: ds.label, values: ds.data, color: ds.color })), showLegend: true, showTitle: !!data.title };
    }
  }
}

/**
 * Distribute parsed segments across one or more slides.
 * Returns SlideEl[][] — index 0 is the current slide, subsequent indices are new slides.
 * When a unit won't fit in the remaining space, a new slide is started automatically.
 */
function distributeToSlides(segments: ContentSegment[]): SlideEl[][] {
  // Flatten all segments into flat placement units
  const allUnits: PlacementUnit[] = [];
  for (const seg of segments) {
    if (seg.type === 'text') {
      allUnits.push(...textToUnits(seg.content));
    } else if (seg.type === 'table') {
      const h = Math.min((seg.rows.length + 1) * 9 + 4, 55);
      allUnits.push({ kind: 'table', seg, height: h });
    } else if (seg.type === 'chart') {
      allUnits.push({ kind: 'chart', seg, height: 48 });
    }
  }

  const slides: SlideEl[][] = [[]];
  let currentY = 5;

  for (const unit of allUnits) {
    // Overflow → start a new slide (only if current slide already has content)
    if (currentY + unit.height > SLIDE_MAX_Y && slides[slides.length - 1].length > 0) {
      slides.push([]);
      currentY = 5;
    }
    slides[slides.length - 1].push(unitToElement(unit, currentY));
    currentY += unit.height + GAP;
  }

  return slides.filter(s => s.length > 0);
}

// ── Single response panel ─────────────────────────────────────────────────────

interface PanelProps {
  label: string;
  sseRaw: string;
  onClose: () => void;
}

function ResponsePanel({ label, sseRaw, onClose }: PanelProps) {
  const { actions } = usePresentation();
  const [added, setAdded] = useState(false);

  const segments = useMemo(() => parseSSEResponse(sseRaw), [sseRaw]);
  const slideGroups = useMemo(() => distributeToSlides(segments), [segments]);
  const slideCount = slideGroups.length;

  function handleShowInSlide() {
    // React processes useReducer dispatches sequentially within one event handler,
    // so addSlide() state is visible to the immediately following addElement() calls.
    slideGroups.forEach((els, idx) => {
      if (idx > 0) actions.addSlide(); // new slide for overflow content
      els.forEach(el => actions.addElement(el));
    });
    setAdded(true);
    setTimeout(onClose, 600);
  }

  const addLabel = added
    ? `✓ Added (${slideCount} slide${slideCount > 1 ? 's' : ''})`
    : `+ Show in Slide${slideCount > 1 ? ` (${slideCount} slides)` : ''}`;

  return (
    <div style={styles.panel}>
      {/* Panel header */}
      <div style={styles.panelHeader}>
        <span style={styles.panelLabel}>{label}</span>
        <button
          style={added
            ? { ...styles.btn, ...styles.btnSuccess }
            : { ...styles.btn, ...styles.btnPrimary }
          }
          onClick={handleShowInSlide}
          disabled={added}
        >
          {addLabel}
        </button>
      </div>

      {/* Parsed output */}
      <div style={styles.panelBody}>
        <AiContent segments={segments} />
      </div>
    </div>
  );
}

// ── Main demo page ────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function AiContentDemo({ onClose }: Props) {
  return (
    <div style={styles.page}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.heading}>AI Response Preview</h2>
          <p style={styles.sub}>
            Filtered output — <code>message_session</code>, <code>info</code>,{' '}
            <code>thinking</code>, <code>citation</code> events removed.
          </p>
        </div>
        <button style={{ ...styles.btn, ...styles.btnSecondary }} onClick={onClose}>
          ✕ Close
        </button>
      </div>

      {/* Two response panels */}
      <div style={styles.panels}>
        <ResponsePanel
          label="Response 1 — UPI 5-Year Table"
          sseRaw={SAMPLE_SSE_1}
          onClose={onClose}
        />
        <ResponsePanel
          label="Response 2 — UPI Growth Chart"
          sseRaw={SAMPLE_SSE_2}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f4f6f9',
    padding: '32px 20px 48px',
    boxSizing: 'border-box',
  },
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    maxWidth: 1200,
    margin: '0 auto 24px',
    flexWrap: 'wrap',
  },
  heading: {
    margin: '0 0 4px',
    fontSize: 20,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  sub: {
    margin: 0,
    color: '#666',
    fontSize: 12,
    lineHeight: 1.5,
  },
  panels: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
    gap: 20,
    maxWidth: 1200,
    margin: '0 auto',
  },
  panel: {
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 10px rgba(0,0,0,0.09)',
    overflow: 'hidden',
  },
  panelHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 18px',
    background: '#f0f4f8',
    borderBottom: '1px solid #dde3ec',
    gap: 12,
  },
  panelLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: '#1a1a2e',
  },
  panelBody: {
    padding: '20px 22px',
  },
  btn: {
    border: 'none',
    borderRadius: 5,
    padding: '8px 18px',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  btnPrimary:   { background: '#4A90E2', color: '#fff' },
  btnSuccess:   { background: '#38a169', color: '#fff', cursor: 'default' },
  btnSecondary: { background: '#e8edf3', color: '#444' },
};
