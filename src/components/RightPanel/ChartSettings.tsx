import { usePresentation } from '../../context/PresentationContext';
import type { ChartElement, ChartType } from '../../types/presentation';

interface ChartSettingsProps {
  element: ChartElement;
}

const chartTypes: { type: ChartType; label: string }[] = [
  { type: 'bar', label: 'Bar' },
  { type: 'column', label: 'Column' },
  { type: 'line', label: 'Line' },
  { type: 'area', label: 'Area' },
  { type: 'pie', label: 'Pie' },
  { type: 'doughnut', label: 'Doughnut' },
  { type: 'scatter', label: 'Scatter' },
  { type: 'radar', label: 'Radar' },
];

function ChartSettings({ element }: ChartSettingsProps) {
  const { actions } = usePresentation();

  const updateElement = (updates: Partial<ChartElement>) => {
    actions.updateElement({ ...element, ...updates });
  };

  return (
    <>
      <div className="settings-header">
        <span className="settings-title">
          <span className="settings-icon">📊</span>
          Chart Settings
        </span>
        <button className="settings-close" onClick={() => actions.selectElement(null)}>×</button>
      </div>

      <div className="settings-content">
        {/* Chart Type */}
        <div className="settings-section">
          <div className="settings-section-title">Chart Type</div>
          <select
            className="settings-select"
            value={element.chartType}
            onChange={(e) => updateElement({ chartType: e.target.value as ChartType })}
          >
            {chartTypes.map(ct => (
              <option key={ct.type} value={ct.type}>{ct.label}</option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div className="settings-section">
          <div className="settings-section-title">Title</div>
          <input
            type="text"
            className="settings-input"
            value={element.title}
            onChange={(e) => updateElement({ title: e.target.value })}
            placeholder="Chart title"
          />
          <label className="settings-checkbox" style={{ marginTop: 8 }}>
            <input
              type="checkbox"
              checked={element.showTitle}
              onChange={(e) => updateElement({ showTitle: e.target.checked })}
            />
            Show Title
          </label>
        </div>

        {/* Legend */}
        <div className="settings-section">
          <div className="settings-section-title">Legend</div>
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={element.showLegend}
              onChange={(e) => updateElement({ showLegend: e.target.checked })}
            />
            Show Legend
          </label>
        </div>

        {/* Position & Size */}
        <div className="settings-section">
          <div className="settings-section-title">Position & Size</div>
          <div className="settings-row two-col">
            <div>
              <label className="settings-label">X (%)</label>
              <input
                type="number"
                className="settings-input"
                value={Math.round(element.position.x)}
                min={0}
                max={100}
                onChange={(e) => updateElement({
                  position: { ...element.position, x: parseInt(e.target.value) }
                })}
              />
            </div>
            <div>
              <label className="settings-label">Y (%)</label>
              <input
                type="number"
                className="settings-input"
                value={Math.round(element.position.y)}
                min={0}
                max={100}
                onChange={(e) => updateElement({
                  position: { ...element.position, y: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>
          <div className="settings-row two-col">
            <div>
              <label className="settings-label">W (%)</label>
              <input
                type="number"
                className="settings-input"
                value={Math.round(element.position.width)}
                min={1}
                max={100}
                onChange={(e) => updateElement({
                  position: { ...element.position, width: parseInt(e.target.value) }
                })}
              />
            </div>
            <div>
              <label className="settings-label">H (%)</label>
              <input
                type="number"
                className="settings-input"
                value={Math.round(element.position.height)}
                min={1}
                max={100}
                onChange={(e) => updateElement({
                  position: { ...element.position, height: parseInt(e.target.value) }
                })}
              />
            </div>
          </div>
        </div>

        {/* Hint */}
        <div className="settings-section">
          <p style={{ fontSize: 12, color: '#a0a0b0', fontStyle: 'italic' }}>
            Double-click the chart to edit data
          </p>
        </div>
      </div>
    </>
  );
}

export default ChartSettings;
