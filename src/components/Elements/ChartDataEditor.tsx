import { useState, useMemo } from 'react';
import type { ChartElement, ChartType, ChartSeries } from '../../types/presentation';
import { SAMPLE_CHART_DATA } from '../../utils/constants';
import './ChartDataEditor.css';

interface ChartDataEditorProps {
  element: ChartElement;
  onSave: (updatedElement: ChartElement) => void;
  onClose: () => void;
}

const CHART_TYPE_INFO: { type: ChartType; label: string; icon: string }[] = [
  { type: 'bar', label: 'Bar', icon: '📊' },
  { type: 'column', label: 'Column', icon: '📶' },
  { type: 'line', label: 'Line', icon: '📈' },
  { type: 'area', label: 'Area', icon: '📉' },
  { type: 'pie', label: 'Pie', icon: '🥧' },
  { type: 'doughnut', label: 'Doughnut', icon: '🍩' },
  { type: 'scatter', label: 'Scatter', icon: '⚬' },
  { type: 'bubble', label: 'Bubble', icon: '🔵' },
  { type: 'radar', label: 'Radar', icon: '🎯' },
];

const PRESET_COLORS = [
  '#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6',
  '#1ABC9C', '#E74C3C', '#3498DB', '#F39C12', '#2ECC71',
];

// Check if chart type uses single series (pie/doughnut)
const isSingleSeriesChart = (type: ChartType) => type === 'pie' || type === 'doughnut';

function ChartDataEditor({ element, onSave, onClose }: ChartDataEditorProps) {
  const [chartType, setChartType] = useState<ChartType>(element.chartType);
  const [title, setTitle] = useState(element.title);
  const [labels, setLabels] = useState<string[]>(element.labels);
  const [series, setSeries] = useState<ChartSeries[]>(element.series);
  const [showTitle, setShowTitle] = useState(element.showTitle);
  const [showLegend, setShowLegend] = useState(element.showLegend);

  const handleChartTypeChange = (newType: ChartType) => {
    const wasSimple = isSingleSeriesChart(chartType);
    const isSimple = isSingleSeriesChart(newType);

    // If switching between single-series and multi-series, adjust data
    if (wasSimple !== isSimple) {
      if (isSimple && series.length > 1) {
        // Switching to pie/doughnut: keep only first series
        setSeries([series[0]]);
      }
    }

    setChartType(newType);
  };

  const handleLoadSampleData = () => {
    const sampleData = SAMPLE_CHART_DATA[chartType as keyof typeof SAMPLE_CHART_DATA];
    if (sampleData) {
      setTitle(sampleData.title);
      setLabels(sampleData.labels);
      setSeries(sampleData.series);
    }
  };

  // For pie/doughnut: handle category (label + value pairs)
  const handleCategoryChange = (index: number, field: 'label' | 'value', value: string | number) => {
    if (field === 'label') {
      const newLabels = [...labels];
      newLabels[index] = value as string;
      setLabels(newLabels);
    } else {
      const newSeries = [...series];
      const newValues = [...newSeries[0].values];
      newValues[index] = value as number;
      newSeries[0] = { ...newSeries[0], values: newValues };
      setSeries(newSeries);
    }
  };

  const handleAddCategory = () => {
    setLabels([...labels, `Category ${labels.length + 1}`]);
    setSeries(series.map(s => ({
      ...s,
      values: [...s.values, 0]
    })));
  };

  const handleRemoveCategory = (index: number) => {
    if (labels.length > 1) {
      setLabels(labels.filter((_, i) => i !== index));
      setSeries(series.map(s => ({
        ...s,
        values: s.values.filter((_, i) => i !== index)
      })));
    }
  };

  // For multi-series charts
  const handleLabelChange = (index: number, value: string) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleAddLabel = () => {
    setLabels([...labels, `Label ${labels.length + 1}`]);
    setSeries(series.map(s => ({
      ...s,
      values: [...s.values, 0]
    })));
  };

  const handleRemoveLabel = (index: number) => {
    if (labels.length > 1) {
      setLabels(labels.filter((_, i) => i !== index));
      setSeries(series.map(s => ({
        ...s,
        values: s.values.filter((_, i) => i !== index)
      })));
    }
  };

  const handleSeriesNameChange = (seriesIndex: number, name: string) => {
    const newSeries = [...series];
    newSeries[seriesIndex] = { ...newSeries[seriesIndex], name };
    setSeries(newSeries);
  };

  const handleSeriesColorChange = (seriesIndex: number, color: string) => {
    const newSeries = [...series];
    newSeries[seriesIndex] = { ...newSeries[seriesIndex], color };
    setSeries(newSeries);
  };

  const handleValueChange = (seriesIndex: number, valueIndex: number, value: number) => {
    const newSeries = [...series];
    const newValues = [...newSeries[seriesIndex].values];
    newValues[valueIndex] = value;
    newSeries[seriesIndex] = { ...newSeries[seriesIndex], values: newValues };
    setSeries(newSeries);
  };

  const handleAddSeries = () => {
    const colorIndex = series.length % PRESET_COLORS.length;
    setSeries([...series, {
      name: `Series ${series.length + 1}`,
      values: labels.map(() => 0),
      color: PRESET_COLORS[colorIndex]
    }]);
  };

  const handleRemoveSeries = (index: number) => {
    if (series.length > 1) {
      setSeries(series.filter((_, idx) => idx !== index));
    }
  };

  const handleSave = () => {
    onSave({
      ...element,
      chartType,
      title,
      labels,
      series,
      showTitle,
      showLegend,
    });
    onClose();
  };

  // Calculate max value for visual scaling
  const maxValue = useMemo(() => {
    let max = 0;
    series.forEach(s => {
      s.values.forEach(v => {
        if (v > max) max = v;
      });
    });
    return max || 100;
  }, [series]);

  const isSimpleChart = isSingleSeriesChart(chartType);

  // Render pie/doughnut data editor (categories with values)
  const renderSimpleDataEditor = () => (
    <div className="form-group">
      <div className="series-header">
        <label>Categories & Values</label>
        <div className="header-actions">
          <button onClick={handleLoadSampleData} className="btn-text" title="Load sample data">
            Load Sample
          </button>
          <button onClick={handleAddCategory} className="btn-add-series">+ Category</button>
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>#</th>
              <th>Category Name</th>
              <th style={{ width: '120px' }}>Value</th>
              <th style={{ width: '60px' }}>Color</th>
              <th style={{ width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {labels.map((label, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'center', color: '#888', fontWeight: 600 }}>{idx + 1}</td>
                <td>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => handleCategoryChange(idx, 'label', e.target.value)}
                    className="series-name-input"
                    placeholder="Category name"
                  />
                </td>
                <td>
                  <div className="value-cell">
                    <input
                      type="number"
                      value={series[0]?.values[idx] || 0}
                      onChange={(e) => handleCategoryChange(idx, 'value', parseFloat(e.target.value) || 0)}
                      className="value-input"
                    />
                    <div
                      className="value-bar"
                      style={{
                        width: `${((series[0]?.values[idx] || 0) / maxValue) * 100}%`,
                        backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length],
                      }}
                    />
                  </div>
                </td>
                <td>
                  <div
                    className="color-preview"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: PRESET_COLORS[idx % PRESET_COLORS.length],
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                    }}
                  />
                </td>
                <td>
                  {labels.length > 1 && (
                    <button
                      onClick={() => handleRemoveCategory(idx)}
                      className="btn-remove-series"
                      title="Remove category"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pie-info">
        Pie and Doughnut charts display a single data series with multiple categories.
      </div>
    </div>
  );

  // Render multi-series data editor (bar, line, area, etc.)
  const renderMultiSeriesDataEditor = () => (
    <div className="form-group">
      <div className="series-header">
        <label>Data Table</label>
        <div className="header-actions">
          <button onClick={handleLoadSampleData} className="btn-text" title="Load sample data">
            Load Sample
          </button>
          <button onClick={handleAddSeries} className="btn-add-series">+ Series</button>
          <button onClick={handleAddLabel} className="btn-add-series">+ Column</button>
        </div>
      </div>

      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th className="series-col">Series</th>
              <th className="color-col">Color</th>
              {labels.map((label, idx) => (
                <th key={idx} className="value-col">
                  <div className="label-cell">
                    <input
                      type="text"
                      value={label}
                      onChange={(e) => handleLabelChange(idx, e.target.value)}
                      className="label-input"
                    />
                    {labels.length > 1 && (
                      <button
                        onClick={() => handleRemoveLabel(idx)}
                        className="btn-remove-small"
                        title="Remove column"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="action-col"></th>
            </tr>
          </thead>
          <tbody>
            {series.map((s, seriesIdx) => (
              <tr key={seriesIdx}>
                <td className="series-col">
                  <input
                    type="text"
                    value={s.name}
                    onChange={(e) => handleSeriesNameChange(seriesIdx, e.target.value)}
                    className="series-name-input"
                  />
                </td>
                <td className="color-col">
                  <input
                    type="color"
                    value={s.color || '#4A90E2'}
                    onChange={(e) => handleSeriesColorChange(seriesIdx, e.target.value)}
                    className="form-color"
                  />
                </td>
                {s.values.map((value, valueIdx) => (
                  <td key={valueIdx} className="value-col">
                    <div className="value-cell">
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleValueChange(seriesIdx, valueIdx, parseFloat(e.target.value) || 0)}
                        className="value-input"
                      />
                      <div
                        className="value-bar"
                        style={{
                          width: `${(value / maxValue) * 100}%`,
                          backgroundColor: s.color || '#4A90E2',
                        }}
                      />
                    </div>
                  </td>
                ))}
                <td className="action-col">
                  {series.length > 1 && (
                    <button
                      onClick={() => handleRemoveSeries(seriesIdx)}
                      className="btn-remove-series"
                      title="Remove series"
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="chart-editor-overlay" onClick={onClose}>
      <div className="chart-editor-modal chart-editor-modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="chart-editor-header">
          <h3>Edit Chart Data</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="chart-editor-content">
          {/* Chart Type Selection */}
          <div className="form-group">
            <label>Chart Type</label>
            <div className="chart-type-grid">
              {CHART_TYPE_INFO.map(({ type, label, icon }) => (
                <button
                  key={type}
                  className={`chart-type-btn ${chartType === type ? 'selected' : ''}`}
                  onClick={() => handleChartTypeChange(type)}
                  title={label}
                >
                  <span className="chart-type-btn-icon">{icon}</span>
                  <span className="chart-type-btn-label">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title and Options */}
          <div className="form-row">
            <div className="form-group flex-1">
              <label>Chart Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
                placeholder="Enter chart title"
              />
            </div>
            <div className="form-group">
              <label>Options</label>
              <div className="checkbox-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showTitle}
                    onChange={(e) => setShowTitle(e.target.checked)}
                  />
                  Show Title
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showLegend}
                    onChange={(e) => setShowLegend(e.target.checked)}
                  />
                  Show Legend
                </label>
              </div>
            </div>
          </div>

          {/* Data Table - different UI for pie/doughnut vs others */}
          {isSimpleChart ? renderSimpleDataEditor() : renderMultiSeriesDataEditor()}
        </div>

        <div className="chart-editor-footer">
          <button onClick={onClose} className="btn-cancel">Cancel</button>
          <button onClick={handleSave} className="btn-save">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default ChartDataEditor;
