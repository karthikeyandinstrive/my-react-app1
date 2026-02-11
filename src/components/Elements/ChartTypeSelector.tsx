import { useState } from 'react';
import type { ChartType } from '../../types/presentation';
import './ChartTypeSelector.css';

interface ChartTypeSelectorProps {
  onSelect: (chartType: ChartType) => void;
  onClose: () => void;
}

const CHART_TYPES: { type: ChartType; label: string; icon: string; description: string }[] = [
  { type: 'bar', label: 'Bar', icon: '📊', description: 'Horizontal bars comparing values' },
  { type: 'column', label: 'Column', icon: '📶', description: 'Vertical columns comparing values' },
  { type: 'line', label: 'Line', icon: '📈', description: 'Trends over time or categories' },
  { type: 'area', label: 'Area', icon: '📉', description: 'Filled area showing volume over time' },
  { type: 'pie', label: 'Pie', icon: '🥧', description: 'Parts of a whole' },
  { type: 'doughnut', label: 'Doughnut', icon: '🍩', description: 'Parts of a whole with center hole' },
  { type: 'scatter', label: 'Scatter', icon: '⚬', description: 'Correlation between two variables' },
  { type: 'bubble', label: 'Bubble', icon: '🔵', description: 'Three dimensions of data' },
  { type: 'radar', label: 'Radar', icon: '🎯', description: 'Compare multiple variables' },
];

function ChartTypeSelector({ onSelect, onClose }: ChartTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<ChartType>('column');
  const [hoveredType, setHoveredType] = useState<ChartType | null>(null);

  const handleInsert = () => {
    onSelect(selectedType);
  };

  const displayedType = hoveredType || selectedType;
  const displayedInfo = CHART_TYPES.find(c => c.type === displayedType);

  return (
    <div className="chart-selector-overlay" onClick={onClose}>
      <div className="chart-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chart-selector-header">
          <h3>Insert Chart</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chart-selector-content">
          <div className="chart-selector-sidebar">
            <div className="chart-category">
              <h4>All Charts</h4>
              <div className="chart-type-list">
                {CHART_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    className={`chart-type-item ${selectedType === type ? 'selected' : ''}`}
                    onClick={() => setSelectedType(type)}
                    onMouseEnter={() => setHoveredType(type)}
                    onMouseLeave={() => setHoveredType(null)}
                  >
                    <span className="chart-type-icon">{icon}</span>
                    <span className="chart-type-label">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-selector-preview">
            <div className="preview-header">
              <span className="preview-icon">{displayedInfo?.icon}</span>
              <span className="preview-title">{displayedInfo?.label} Chart</span>
            </div>
            <div className="preview-description">
              {displayedInfo?.description}
            </div>
            <div className="preview-chart">
              <ChartPreview type={displayedType} />
            </div>
          </div>
        </div>

        <div className="chart-selector-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleInsert} className="btn-insert">Insert</button>
        </div>
      </div>
    </div>
  );
}

// Simple chart preview component
function ChartPreview({ type }: { type: ChartType }) {
  const renderBars = (horizontal: boolean) => {
    const values = [65, 85, 45, 75];
    const colors = ['#4A90E2', '#50C878', '#FFB347', '#FF6B6B'];

    if (horizontal) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', padding: 10 }}>
          {values.map((v, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 30, fontSize: 10, color: '#666' }}>Q{i + 1}</span>
              <div style={{ height: 16, width: `${v}%`, background: colors[i], borderRadius: 2 }} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, height: 120, padding: 10 }}>
        {values.map((v, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 24, height: `${v}%`, background: colors[i], borderRadius: 2 }} />
            <span style={{ fontSize: 10, color: '#666' }}>Q{i + 1}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderLine = (filled: boolean) => {
    const points = [[10, 80], [40, 40], [70, 60], [100, 30], [130, 50], [160, 20]];
    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');
    const areaPath = `${path} L 160 100 L 10 100 Z`;

    return (
      <svg width="180" height="120" style={{ margin: '0 auto', display: 'block' }}>
        {filled && <path d={areaPath} fill="rgba(74, 144, 226, 0.3)" />}
        <path d={path} fill="none" stroke="#4A90E2" strokeWidth="2" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#4A90E2" />
        ))}
      </svg>
    );
  };

  const renderPie = (isDoughnut: boolean) => {
    const slices = [
      { percent: 35, color: '#4A90E2', offset: 0 },
      { percent: 25, color: '#50C878', offset: 35 },
      { percent: 20, color: '#FFB347', offset: 60 },
      { percent: 20, color: '#FF6B6B', offset: 80 },
    ];

    return (
      <svg width="120" height="120" style={{ margin: '0 auto', display: 'block' }}>
        {slices.map((slice, i) => {
          const startAngle = (slice.offset / 100) * 360 - 90;
          const endAngle = ((slice.offset + slice.percent) / 100) * 360 - 90;
          const largeArc = slice.percent > 50 ? 1 : 0;

          const startX = 60 + 50 * Math.cos(startAngle * Math.PI / 180);
          const startY = 60 + 50 * Math.sin(startAngle * Math.PI / 180);
          const endX = 60 + 50 * Math.cos(endAngle * Math.PI / 180);
          const endY = 60 + 50 * Math.sin(endAngle * Math.PI / 180);

          const innerRadius = isDoughnut ? 25 : 0;
          const innerStartX = 60 + innerRadius * Math.cos(endAngle * Math.PI / 180);
          const innerStartY = 60 + innerRadius * Math.sin(endAngle * Math.PI / 180);
          const innerEndX = 60 + innerRadius * Math.cos(startAngle * Math.PI / 180);
          const innerEndY = 60 + innerRadius * Math.sin(startAngle * Math.PI / 180);

          const path = isDoughnut
            ? `M ${startX} ${startY} A 50 50 0 ${largeArc} 1 ${endX} ${endY} L ${innerStartX} ${innerStartY} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerEndX} ${innerEndY} Z`
            : `M 60 60 L ${startX} ${startY} A 50 50 0 ${largeArc} 1 ${endX} ${endY} Z`;

          return <path key={i} d={path} fill={slice.color} />;
        })}
      </svg>
    );
  };

  const renderScatter = () => {
    const points = [[20, 80], [35, 60], [50, 70], [65, 40], [80, 55], [95, 30], [110, 45], [125, 25], [140, 35]];

    return (
      <svg width="180" height="120" style={{ margin: '0 auto', display: 'block' }}>
        <line x1="10" y1="100" x2="170" y2="100" stroke="#ccc" strokeWidth="1" />
        <line x1="10" y1="100" x2="10" y2="10" stroke="#ccc" strokeWidth="1" />
        {points.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="5" fill="#4A90E2" opacity={0.7} />
        ))}
      </svg>
    );
  };

  const renderBubble = () => {
    const bubbles = [
      { x: 30, y: 70, r: 12, color: '#4A90E2' },
      { x: 60, y: 40, r: 18, color: '#50C878' },
      { x: 90, y: 60, r: 10, color: '#FFB347' },
      { x: 120, y: 30, r: 15, color: '#FF6B6B' },
      { x: 150, y: 50, r: 8, color: '#9B59B6' },
    ];

    return (
      <svg width="180" height="120" style={{ margin: '0 auto', display: 'block' }}>
        {bubbles.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={b.color} opacity={0.7} />
        ))}
      </svg>
    );
  };

  const renderRadar = () => {
    const points = 5;
    const centerX = 90;
    const centerY = 60;
    const radius = 45;

    // Draw pentagon background
    const bgPoints = Array.from({ length: points }, (_, i) => {
      const angle = (i * 360 / points - 90) * Math.PI / 180;
      return `${centerX + radius * Math.cos(angle)},${centerY + radius * Math.sin(angle)}`;
    }).join(' ');

    // Draw data polygon
    const dataValues = [0.8, 0.6, 0.9, 0.5, 0.7];
    const dataPoints = dataValues.map((v, i) => {
      const angle = (i * 360 / points - 90) * Math.PI / 180;
      return `${centerX + radius * v * Math.cos(angle)},${centerY + radius * v * Math.sin(angle)}`;
    }).join(' ');

    return (
      <svg width="180" height="120" style={{ margin: '0 auto', display: 'block' }}>
        <polygon points={bgPoints} fill="none" stroke="#ddd" strokeWidth="1" />
        <polygon points={dataPoints} fill="rgba(74, 144, 226, 0.3)" stroke="#4A90E2" strokeWidth="2" />
        {dataValues.map((v, i) => {
          const angle = (i * 360 / points - 90) * Math.PI / 180;
          return (
            <circle
              key={i}
              cx={centerX + radius * v * Math.cos(angle)}
              cy={centerY + radius * v * Math.sin(angle)}
              r="4"
              fill="#4A90E2"
            />
          );
        })}
      </svg>
    );
  };

  switch (type) {
    case 'bar':
      return renderBars(true);
    case 'column':
      return renderBars(false);
    case 'line':
      return renderLine(false);
    case 'area':
      return renderLine(true);
    case 'pie':
      return renderPie(false);
    case 'doughnut':
      return renderPie(true);
    case 'scatter':
      return renderScatter();
    case 'bubble':
      return renderBubble();
    case 'radar':
      return renderRadar();
    default:
      return renderBars(false);
  }
}

export default ChartTypeSelector;
