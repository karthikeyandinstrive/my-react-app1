import React from 'react';
import type { ContentSegment, ChartData } from '../../utils/sseParser';
import './AiContent.css';

interface Props {
  segments: ContentSegment[];
  loading?: boolean;
}

// ── Inline markdown renderer ──────────────────────────────────────────────────

/** Convert **bold** and *italic* spans to React elements within a line */
function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = pattern.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    if (m[0].startsWith('**')) {
      parts.push(<strong key={m.index}>{m[2]}</strong>);
    } else {
      parts.push(<em key={m.index}>{m[3]}</em>);
    }
    last = m.index + m[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return parts;
}

// ── Text block (supports bullet lists + inline markdown) ─────────────────────

function TextBlock({ content }: { content: string }) {
  const lines = content.split('\n');

  // Group consecutive bullet lines into <ul> blocks
  type Run = { kind: 'bullet'; items: string[] } | { kind: 'plain'; lines: string[] };
  const runs: Run[] = [];

  for (const line of lines) {
    // Bullet: lines starting with "* " or "*   "
    const bulletMatch = line.match(/^\*\s+(.*)$/);
    if (bulletMatch) {
      const last = runs[runs.length - 1];
      if (last?.kind === 'bullet') {
        last.items.push(bulletMatch[1]);
      } else {
        runs.push({ kind: 'bullet', items: [bulletMatch[1]] });
      }
    } else {
      const last = runs[runs.length - 1];
      if (last?.kind === 'plain') {
        last.lines.push(line);
      } else {
        runs.push({ kind: 'plain', lines: [line] });
      }
    }
  }

  return (
    <div className="ai-text">
      {runs.map((run, ri) => {
        if (run.kind === 'bullet') {
          return (
            <ul key={ri} className="ai-list">
              {run.items.map((item, ii) => (
                <li key={ii}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }
        // Plain lines — blank lines become spacing
        return (
          <p key={ri} className="ai-para">
            {run.lines.map((line, li) => (
              <span key={li}>
                {renderInline(line)}
                {li < run.lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// ── Table block ───────────────────────────────────────────────────────────────

function TableBlock({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="ai-table-wrapper">
      <table className="ai-table">
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Chart block (CSS bar chart) ───────────────────────────────────────────────

function ChartBlock({ data }: { data: ChartData }) {
  const allValues = data.datasets.flatMap(d => d.data);
  const maxVal = Math.max(...allValues, 1);

  return (
    <div className="ai-chart">
      {data.title && <div className="ai-chart-title">{data.title}</div>}

      {/* Legend */}
      {data.datasets.length > 1 && (
        <div className="ai-chart-legend">
          {data.datasets.map((ds, i) => (
            <span key={i} className="ai-chart-legend-item">
              <span
                className="ai-chart-legend-dot"
                style={{ background: ds.color ?? '#4A90E2' }}
              />
              {ds.label}
            </span>
          ))}
        </div>
      )}

      {/* Bars */}
      <div className="ai-chart-area">
        {data.labels.map((label, li) => (
          <div key={li} className="ai-chart-col">
            <div className="ai-chart-bars-row">
              {data.datasets.map((ds, di) => {
                const val = ds.data[li] ?? 0;
                const pct = (val / maxVal) * 100;
                return (
                  <div key={di} className="ai-chart-bar-wrap">
                    <span className="ai-chart-bar-value">{val}</span>
                    <div
                      className="ai-chart-bar"
                      style={{
                        height: `${pct}%`,
                        background: ds.color ?? '#4A90E2',
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="ai-chart-label">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AiContent({ segments, loading }: Props) {
  return (
    <div className="ai-content">
      {segments.map((seg, i) => {
        if (seg.type === 'text')  return <TextBlock  key={i} content={seg.content} />;
        if (seg.type === 'table') return <TableBlock key={i} headers={seg.headers} rows={seg.rows} />;
        if (seg.type === 'chart') return <ChartBlock key={i} data={seg.data} />;
        return null;
      })}
      {loading && <span className="ai-cursor" aria-hidden="true" />}
    </div>
  );
}
