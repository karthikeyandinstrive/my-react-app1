import { useState, useMemo } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import ElementWrapper from './ElementWrapper';
import ChartDataEditor from './ChartDataEditor';
import type { ChartElement as ChartElementType } from '../../types/presentation';
import './ChartElement.css';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, Scatter, Bubble } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartElementProps {
  element: ChartElementType;
  isSelected: boolean;
}

// Default colors for charts
const DEFAULT_COLORS = [
  '#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6',
  '#1ABC9C', '#E74C3C', '#3498DB', '#F39C12', '#2ECC71',
];

// Helper to add transparency to hex color
const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function ChartElement({ element, isSelected }: ChartElementProps) {
  const { actions } = usePresentation();
  const [showEditor, setShowEditor] = useState(false);

  const handleEditChart = () => {
    setShowEditor(true);
  };

  const handleSaveChart = (updatedElement: ChartElementType) => {
    actions.updateElement(updatedElement);
  };

  // Build Chart.js data configuration
  const chartData = useMemo(() => {
    const { chartType, series, labels } = element;

    // For pie/doughnut charts, use single dataset with multiple colors
    if (chartType === 'pie' || chartType === 'doughnut') {
      return {
        labels,
        datasets: [{
          data: series[0]?.values || [],
          backgroundColor: labels.map((_, idx) => DEFAULT_COLORS[idx % DEFAULT_COLORS.length]),
          borderColor: labels.map((_, idx) => DEFAULT_COLORS[idx % DEFAULT_COLORS.length]),
          borderWidth: 1,
        }],
      };
    }

    // For other chart types
    return {
      labels,
      datasets: series.map((s, idx) => {
        const color = s.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length];
        return {
          label: s.name,
          data: s.values,
          backgroundColor: chartType === 'area' || chartType === 'radar'
            ? hexToRgba(color, 0.3)
            : color,
          borderColor: color,
          borderWidth: 2,
          fill: chartType === 'area' || chartType === 'radar',
          tension: chartType === 'line' || chartType === 'area' ? 0.3 : 0,
          pointRadius: chartType === 'scatter' || chartType === 'bubble' ? 5 : 3,
          pointBackgroundColor: color,
        };
      }),
    };
  }, [element]);

  // Chart.js options
  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false, // We handle legend separately
        },
        title: {
          display: false, // We handle title separately
        },
        tooltip: {
          enabled: true,
        },
      },
    };

    // Pie/Doughnut charts don't need scales
    if (element.chartType === 'pie' || element.chartType === 'doughnut') {
      return baseOptions;
    }

    // Radar charts use radial scale
    if (element.chartType === 'radar') {
      return {
        ...baseOptions,
        scales: {
          r: {
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)',
            },
            pointLabels: {
              font: { size: 10 },
            },
            ticks: {
              font: { size: 9 },
              backdropColor: 'transparent',
            },
          },
        },
      };
    }

    // Bar, Line, Area, Scatter, Bubble use x/y scales
    return {
      ...baseOptions,
      scales: {
        x: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: { size: 10 },
          },
        },
        y: {
          grid: {
            display: true,
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: { size: 10 },
          },
          beginAtZero: true,
        },
      },
    };
  }, [element.chartType]);

  const renderChart = () => {
    const { chartType, series } = element;

    // Validate data
    if (!series || series.length === 0 || !series[0]?.values?.length) {
      return (
        <div className="chart-preview chart-default">
          <div className="chart-icon">📊</div>
          <div className="chart-type-label">No data available</div>
        </div>
      );
    }

    // Use a unique key based on chart type and element id to force remount when type changes
    const chartKey = `${element.id}-${chartType}`;

    switch (chartType) {
      case 'bar':
        return <Bar key={chartKey} data={chartData} options={{ ...chartOptions, indexAxis: 'y' as const }} />;
      case 'column':
        return <Bar key={chartKey} data={chartData} options={chartOptions} />;
      case 'line':
        return <Line key={chartKey} data={chartData} options={chartOptions} />;
      case 'area':
        return <Line key={chartKey} data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie key={chartKey} data={chartData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut key={chartKey} data={chartData} options={chartOptions} />;
      case 'radar':
        return <Radar key={chartKey} data={chartData} options={chartOptions} />;
      case 'scatter':
        return <Scatter key={chartKey} data={chartData} options={chartOptions} />;
      case 'bubble':
        return <Bubble key={chartKey} data={chartData} options={chartOptions} />;
      default:
        return <Bar key={chartKey} data={chartData} options={chartOptions} />;
    }
  };

  return (
    <>
      <ElementWrapper element={element} isSelected={isSelected}>
        <div className="chart-element" onDoubleClick={handleEditChart}>
          {element.showTitle && element.title && (
            <div className="chart-title">{element.title}</div>
          )}
          <div className="chart-content">{renderChart()}</div>
          {element.showLegend && element.series.length > 0 && (
            <div className="chart-legend">
              {(element.chartType === 'pie' || element.chartType === 'doughnut') ? (
                // For pie/doughnut, show labels with colors
                element.labels.map((label, idx) => (
                  <div key={idx} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                    />
                    <span className="legend-label">{label}</span>
                  </div>
                ))
              ) : (
                // For other charts, show series names
                element.series.map((s, idx) => (
                  <div key={idx} className="legend-item">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: s.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                    />
                    <span className="legend-label">{s.name}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </ElementWrapper>
      {showEditor && (
        <ChartDataEditor
          element={element}
          onSave={handleSaveChart}
          onClose={() => setShowEditor(false)}
        />
      )}
    </>
  );
}

export default ChartElement;
