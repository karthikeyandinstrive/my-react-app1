import type { Slide, SlideElement, TextElement as TextElementType, ImageElement as ImageElementType, ShapeElement as ShapeElementType, TableElement as TableElementType, ChartElement as ChartElementType } from '../../types/presentation';
import './SlidePreview.css';

interface SlidePreviewProps {
  slide: Slide;
}

function SlidePreview({ slide }: SlidePreviewProps) {
  const renderElement = (element: SlideElement) => {
    const style = {
      position: 'absolute' as const,
      left: `${element.position.x}%`,
      top: `${element.position.y}%`,
      width: `${element.position.width}%`,
      height: `${element.position.height}%`,
      zIndex: element.zIndex,
    };

    switch (element.type) {
      case 'text': {
        const textEl = element as TextElementType;
        const textStyle = {
          fontSize: `${textEl.fontSize}px`,
          fontFamily: textEl.fontFamily,
          color: textEl.color,
          fontWeight: textEl.bold ? 'bold' : 'normal',
          fontStyle: textEl.italic ? 'italic' : 'normal',
          textDecoration: textEl.underline ? 'underline' : 'none',
          textAlign: textEl.align,
        };

        const listType = textEl.listType || 'none';

        if (listType === 'none') {
          return (
            <div
              key={element.id}
              className="preview-text-element"
              style={{
                ...style,
                ...textStyle,
              }}
            >
              {textEl.content}
            </div>
          );
        }

        // Render as list in preview
        const lines = textEl.content.split('\n').filter(line => line.trim() !== '');
        const ListTag = listType === 'bullets' ? 'ul' : 'ol';
        const listStyle = textEl.listStyle || (listType === 'bullets' ? 'disc' : 'decimal');

        return (
          <div
            key={element.id}
            className="preview-text-element"
            style={{
              ...style,
              ...textStyle,
            }}
          >
            <ListTag style={{
              listStyleType: listStyle,
              margin: 0,
              paddingLeft: '25px',
            }}>
              {lines.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ListTag>
          </div>
        );
      }

      case 'image': {
        const imageEl = element as ImageElementType;
        return (
          <img
            key={element.id}
            src={imageEl.src}
            alt={imageEl.alt}
            className="preview-image-element"
            style={style}
          />
        );
      }

      case 'shape': {
        const shapeEl = element as ShapeElementType;
        const shapeStyle = {
          ...style,
          backgroundColor: shapeEl.fillColor,
          border: `${shapeEl.borderWidth}px solid ${shapeEl.borderColor}`,
          borderRadius: shapeEl.shapeType === 'circle' ? '50%' : shapeEl.shapeType === 'rectangle' ? '4px' : '0',
          height: shapeEl.shapeType === 'line' ? `${shapeEl.borderWidth}px` : style.height,
        };

        return (
          <div
            key={element.id}
            className="preview-shape-element"
            style={shapeStyle}
          />
        );
      }

      case 'table': {
        const tableEl = element as TableElementType;
        return (
          <div key={element.id} style={style}>
            <table
              className="preview-table-element"
              style={{
                width: '100%',
                height: '100%',
                borderCollapse: 'collapse',
                border: `${tableEl.borderWidth}px solid ${tableEl.borderColor}`,
              }}
            >
              <tbody>
                {tableEl.cells.map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, colIdx) => (
                      <td
                        key={`${rowIdx}-${colIdx}`}
                        style={{
                          border: `${tableEl.borderWidth}px solid ${tableEl.borderColor}`,
                          padding: '8px',
                          backgroundColor: cell.fillColor || (rowIdx === 0 && tableEl.headerRow ? '#f0f0f0' : '#ffffff'),
                          color: cell.color || '#000000',
                          fontSize: `${cell.fontSize || 12}px`,
                          fontWeight: cell.bold || (rowIdx === 0 && tableEl.headerRow) ? 'bold' : 'normal',
                          fontStyle: cell.italic ? 'italic' : 'normal',
                          textAlign: cell.align || 'left',
                          verticalAlign: cell.valign || 'middle',
                        }}
                      >
                        {cell.text}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'chart': {
        const chartEl = element as ChartElementType;

        const renderChartVisual = () => {
          const { chartType, series, labels } = chartEl;

          switch (chartType) {
            case 'bar':
            case 'column':
              if (!series[0] || !series[0].values || series[0].values.length === 0) {
                return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data</div>;
              }
              const maxValue = Math.max(...series[0].values);
              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'space-around',
                  height: '100%',
                  padding: '10px',
                  gap: '4px',
                }}>
                  {series[0].values.slice(0, 6).map((value, idx) => {
                    const barHeight = maxValue > 0 ? (value / maxValue) * 80 : 0;
                    return (
                      <div key={idx} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        flex: 1,
                        minWidth: '20px',
                        maxWidth: '60px',
                        height: '100%',
                        justifyContent: 'flex-end',
                      }}>
                        <div style={{
                          width: '80%',
                          height: `${barHeight}%`,
                          minHeight: value > 0 ? '5px' : '0',
                          backgroundColor: series[0].color || '#4A90E2',
                          borderRadius: '2px 2px 0 0',
                        }} />
                        <span style={{
                          fontSize: '9px',
                          marginTop: '2px',
                          color: '#666',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '100%',
                          textAlign: 'center',
                        }}>
                          {labels[idx]?.substring(0, 4) || `L${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );

            case 'line':
            case 'area':
              if (!series || series.length === 0 || !series[0].values || series[0].values.length === 0) {
                return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data</div>;
              }
              return (
                <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
                  {series.map((s, seriesIdx) => {
                    if (!s.values || s.values.length === 0) return null;
                    const maxVal = Math.max(...s.values);
                    const points = s.values.slice(0, 8).map((value, idx) => ({
                      x: s.values.length > 1 ? (idx / (s.values.length - 1)) * 180 + 10 : 100,
                      y: maxVal > 0 ? 90 - (value / maxVal) * 70 : 50,
                    }));
                    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                    const areaPath = chartType === 'area' ? `${pathData} L ${points[points.length - 1].x} 90 L ${points[0].x} 90 Z` : pathData;
                    return (
                      <path
                        key={seriesIdx}
                        d={chartType === 'area' ? areaPath : pathData}
                        fill={chartType === 'area' ? s.color || '#4A90E2' : 'none'}
                        fillOpacity={chartType === 'area' ? 0.4 : 0}
                        stroke={s.color || '#4A90E2'}
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              );

            case 'pie':
            case 'doughnut':
              if (!series[0] || !series[0].values || series[0].values.length === 0) {
                return <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No data</div>;
              }
              return (
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  {(() => {
                    const values = series[0].values;
                    const total = values.reduce((sum, val) => sum + val, 0);
                    if (total === 0) {
                      return <text x="50" y="50" textAnchor="middle" fill="#999" fontSize="8">No data</text>;
                    }
                    let currentAngle = -90;
                    const colors = ['#4A90E2', '#50C878', '#FFB347', '#FF6B6B', '#9B59B6'];

                    return values.map((value, idx) => {
                      const sliceAngle = (value / total) * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + sliceAngle;
                      currentAngle = endAngle;

                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      const outerRadius = 45;
                      const innerRadius = chartType === 'doughnut' ? 20 : 0;

                      const x1 = 50 + outerRadius * Math.cos(startRad);
                      const y1 = 50 + outerRadius * Math.sin(startRad);
                      const x2 = 50 + outerRadius * Math.cos(endRad);
                      const y2 = 50 + outerRadius * Math.sin(endRad);

                      const largeArc = sliceAngle > 180 ? 1 : 0;

                      let pathData;
                      if (chartType === 'doughnut') {
                        const x3 = 50 + innerRadius * Math.cos(endRad);
                        const y3 = 50 + innerRadius * Math.sin(endRad);
                        const x4 = 50 + innerRadius * Math.cos(startRad);
                        const y4 = 50 + innerRadius * Math.sin(startRad);
                        pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
                      } else {
                        pathData = `M 50 50 L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                      }

                      return (
                        <path
                          key={idx}
                          d={pathData}
                          fill={colors[idx % colors.length]}
                        />
                      );
                    });
                  })()}
                </svg>
              );

            case 'scatter':
            case 'bubble':
              return (
                <svg viewBox="0 0 200 100" style={{ width: '100%', height: '100%' }}>
                  {series.map((s, seriesIdx) =>
                    s.values.map((value, idx) => (
                      <circle
                        key={`${seriesIdx}-${idx}`}
                        cx={(idx / s.values.length) * 180 + 10}
                        cy={90 - (value / Math.max(...s.values)) * 70}
                        r={chartType === 'bubble' ? 5 : 3}
                        fill={s.color || '#4A90E2'}
                        opacity="0.7"
                      />
                    ))
                  )}
                </svg>
              );

            case 'radar':
              return (
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#ddd" strokeWidth="1" />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="#ddd" strokeWidth="1" />
                  {series[0]?.values.slice(0, 6).map((value, idx) => {
                    const angle = (idx / series[0].values.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = (value / Math.max(...series[0].values)) * 35;
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    return <line key={idx} x1="50" y1="50" x2={x} y2={y} stroke="#4A90E2" strokeWidth="2" />;
                  })}
                </svg>
              );

            default:
              return (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  fontSize: '24px',
                }}>
                  <div>📊</div>
                  <div style={{ fontSize: '12px', marginTop: '8px', color: '#666' }}>
                    {String(chartType).toUpperCase()}
                  </div>
                </div>
              );
          }
        };

        return (
          <div
            key={element.id}
            style={style}
            className="preview-chart-element"
          >
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              padding: '8px',
              boxSizing: 'border-box',
            }}>
              {chartEl.showTitle && chartEl.title && (
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  marginBottom: '6px',
                  color: '#333',
                }}>
                  {chartEl.title}
                </div>
              )}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {renderChartVisual()}
              </div>
              {chartEl.showLegend && chartEl.series.length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginTop: '6px',
                  paddingTop: '6px',
                  borderTop: '1px solid #e0e0e0',
                  justifyContent: 'center',
                  fontSize: '10px',
                }}>
                  {chartEl.series.map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: s.color || '#4A90E2',
                      }} />
                      <span style={{ color: '#555' }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className="slide-preview"
      style={{
        background: slide.background?.startsWith('#') || !slide.background
          ? slide.background || '#fff'
          : '#fff',
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

export default SlidePreview;
