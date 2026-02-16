import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import type { ChartElement, ChartType } from '../../types/presentation';
import { SAMPLE_CHART_DATA } from '../../utils/constants';

const chartTypes: { type: ChartType; icon: string; label: string }[] = [
  { type: 'bar', icon: '📊', label: 'Bar Chart' },
  { type: 'column', icon: '📶', label: 'Column Chart' },
  { type: 'line', icon: '📈', label: 'Line Chart' },
  { type: 'area', icon: '📉', label: 'Area Chart' },
  { type: 'pie', icon: '🥧', label: 'Pie Chart' },
  { type: 'doughnut', icon: '🍩', label: 'Doughnut Chart' },
  { type: 'scatter', icon: '⚬', label: 'Scatter Plot' },
  { type: 'radar', icon: '🕸', label: 'Radar Chart' },
];

interface ChartsPanelProps {
  onClose: () => void;
}

function ChartsPanel({ onClose }: ChartsPanelProps) {
  const { actions } = usePresentation();

  const handleAddChart = (chartType: ChartType) => {
    const sampleData = SAMPLE_CHART_DATA[chartType as keyof typeof SAMPLE_CHART_DATA] || SAMPLE_CHART_DATA.bar;

    const newChartElement: ChartElement = {
      id: uuidv4(),
      type: 'chart',
      position: { x: 15, y: 15, width: 70, height: 60 },
      zIndex: 1,
      chartType,
      title: sampleData.title,
      labels: sampleData.labels,
      series: sampleData.series,
      showLegend: true,
      showTitle: true,
    };
    actions.addElement(newChartElement);
  };

  return (
    <div className="left-panel">
      <div className="panel-header">
        <div className="panel-header-top">
          <h2 className="panel-title">Charts</h2>
          <button className="panel-close-btn" onClick={onClose}>×</button>
        </div>
        <p className="panel-subtitle">Add data visualizations</p>
      </div>

      <div className="panel-content">
        <div className="panel-section">
          <div className="panel-section-title">Chart Types</div>
          <div className="panel-grid" style={{ gridTemplateColumns: 'repeat(1, 1fr)', gap: 10 }}>
            {chartTypes.map((chart) => (
              <button
                key={chart.type}
                className="panel-grid-item"
                style={{
                  aspectRatio: '16/9',
                  flexDirection: 'column',
                  gap: 4,
                  fontSize: 24,
                }}
                onClick={() => handleAddChart(chart.type)}
                title={chart.label}
              >
                <span>{chart.icon}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted, #a0a0b0)' }}>{chart.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartsPanel;
