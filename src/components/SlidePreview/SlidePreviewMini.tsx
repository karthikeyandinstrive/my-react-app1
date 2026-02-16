import type { Slide, SlideElement, TextElement, ShapeElement, ChartElement, TableElement } from '../../types/presentation';
import './SlidePreviewMini.css';

interface SlidePreviewMiniProps {
  slide: Slide;
  width?: number;
  height?: number;
}

// Mini bar chart renderer
const MiniBarChart = ({ element, scaleX }: { element: ChartElement; scaleX: number }) => {
  const maxValue = Math.max(...element.series.flatMap(s => s.values));
  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', height: '80%', gap: Math.max(1, 2 * scaleX), padding: '10%' }}>
      {element.labels.map((_, labelIdx) => (
        <div key={labelIdx} style={{ display: 'flex', gap: Math.max(1, scaleX), alignItems: 'flex-end' }}>
          {element.series.map((series, seriesIdx) => (
            <div
              key={seriesIdx}
              style={{
                width: Math.max(2, 8 * scaleX),
                height: `${(series.values[labelIdx] / maxValue) * 100}%`,
                backgroundColor: series.color || colors[seriesIdx % colors.length],
                borderRadius: Math.max(1, 2 * scaleX),
                minHeight: 2,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Mini line chart renderer
const MiniLineChart = ({ element, scaleX }: { element: ChartElement; scaleX: number }) => {
  const maxValue = Math.max(...element.series.flatMap(s => s.values));
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <svg width="100%" height="80%" viewBox="0 0 100 60" preserveAspectRatio="none" style={{ padding: '10%' }}>
      {element.series.map((series, idx) => {
        const points = series.values.map((val, i) => {
          const x = (i / (series.values.length - 1)) * 100;
          const y = 60 - (val / maxValue) * 60;
          return `${x},${y}`;
        }).join(' ');
        return (
          <polyline
            key={idx}
            points={points}
            fill="none"
            stroke={series.color || colors[idx % colors.length]}
            strokeWidth={Math.max(1, 2 * scaleX)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
};

// Mini pie chart renderer
const MiniPieChart = ({ element }: { element: ChartElement }) => {
  const values = element.series[0]?.values || [];
  const total = values.reduce((a, b) => a + b, 0);
  const colors = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  let cumulativeAngle = -90;
  const isDoughnut = element.chartType === 'doughnut';

  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <g transform="translate(50, 50)">
        {values.map((value, idx) => {
          const angle = (value / total) * 360;
          const startAngle = cumulativeAngle;
          const endAngle = cumulativeAngle + angle;
          cumulativeAngle = endAngle;

          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;

          const x1 = Math.cos(startRad) * 35;
          const y1 = Math.sin(startRad) * 35;
          const x2 = Math.cos(endRad) * 35;
          const y2 = Math.sin(endRad) * 35;

          const largeArc = angle > 180 ? 1 : 0;

          const d = `M 0 0 L ${x1} ${y1} A 35 35 0 ${largeArc} 1 ${x2} ${y2} Z`;

          return <path key={idx} d={d} fill={colors[idx % colors.length]} />;
        })}
        {isDoughnut && <circle cx="0" cy="0" r="18" fill="white" />}
      </g>
    </svg>
  );
};

// Mini table renderer
const MiniTable = ({ element, scaleX }: { element: TableElement; scaleX: number }) => {
  const rows = element.cells.slice(0, 4);
  const cols = rows[0]?.slice(0, 4) || [];

  return (
    <div style={{
      display: 'grid',
      gridTemplateRows: `repeat(${rows.length}, 1fr)`,
      gridTemplateColumns: `repeat(${cols.length}, 1fr)`,
      gap: Math.max(1, scaleX),
      padding: '8%',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {rows.map((row, rowIdx) =>
        row.slice(0, 4).map((cell, colIdx) => (
          <div
            key={`${rowIdx}-${colIdx}`}
            style={{
              backgroundColor: cell.fillColor || (rowIdx === 0 && element.headerRow ? '#6366f1' : '#f3f4f6'),
              borderRadius: Math.max(1, scaleX),
              minHeight: 2,
            }}
          />
        ))
      )}
    </div>
  );
};

function SlidePreviewMini({ slide, width = 160, height = 90 }: SlidePreviewMiniProps) {
  // Scale factor from 1920x1080 to preview size
  const scaleX = width / 1920;

  const renderElement = (element: SlideElement) => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${element.position.x}%`,
      top: `${element.position.y}%`,
      width: `${element.position.width}%`,
      height: `${element.position.height}%`,
      overflow: 'hidden',
    };

    switch (element.type) {
      case 'text': {
        const textEl = element as TextElement;
        // Scale font size proportionally
        const scaledFontSize = Math.max(textEl.fontSize * scaleX * 0.8, 2);
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              fontSize: `${scaledFontSize}px`,
              fontWeight: textEl.bold ? 'bold' : 'normal',
              fontStyle: textEl.italic ? 'italic' : 'normal',
              color: textEl.color || '#000',
              textAlign: textEl.align || 'left',
              lineHeight: 1.2,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {textEl.content.substring(0, 100)}
          </div>
        );
      }

      case 'shape': {
        const shapeEl = element as ShapeElement;
        const shapeStyle: React.CSSProperties = {
          ...baseStyle,
          backgroundColor: shapeEl.fillColor || '#6366f1',
          border: shapeEl.borderWidth > 0 ? `${Math.max(1, shapeEl.borderWidth * scaleX)}px solid ${shapeEl.borderColor}` : 'none',
        };

        if (shapeEl.shapeType === 'circle') {
          shapeStyle.borderRadius = '50%';
        }

        return <div key={element.id} style={shapeStyle} />;
      }

      case 'image': {
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 8, color: '#9ca3af' }}>IMG</span>
          </div>
        );
      }

      case 'chart': {
        const chartEl = element as ChartElement;
        const chartStyle: React.CSSProperties = {
          ...baseStyle,
          backgroundColor: '#ffffff',
          borderRadius: Math.max(2, 4 * scaleX),
          border: '1px solid #e5e7eb',
        };

        // Render appropriate chart type
        if (['pie', 'doughnut'].includes(chartEl.chartType)) {
          return (
            <div key={element.id} style={chartStyle}>
              <MiniPieChart element={chartEl} />
            </div>
          );
        } else if (chartEl.chartType === 'line' || chartEl.chartType === 'area') {
          return (
            <div key={element.id} style={chartStyle}>
              <MiniLineChart element={chartEl} scaleX={scaleX} />
            </div>
          );
        } else {
          return (
            <div key={element.id} style={chartStyle}>
              <MiniBarChart element={chartEl} scaleX={scaleX} />
            </div>
          );
        }
      }

      case 'table': {
        const tableEl = element as TableElement;
        return (
          <div
            key={element.id}
            style={{
              ...baseStyle,
              backgroundColor: '#ffffff',
              borderRadius: Math.max(2, 4 * scaleX),
              border: '1px solid #e5e7eb',
            }}
          >
            <MiniTable element={tableEl} scaleX={scaleX} />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className="slide-preview-mini"
      style={{
        width,
        height,
        backgroundColor: slide.background?.startsWith('#') ? slide.background : '#fff',
        backgroundImage: slide.background && !slide.background.startsWith('#')
          ? `url(${slide.background})`
          : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {slide.elements
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(element => renderElement(element))}
    </div>
  );
}

export default SlidePreviewMini;
