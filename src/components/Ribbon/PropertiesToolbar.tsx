import { useRef, useEffect, useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import type { TextElement, ShapeElement, TableElement, ChartElement } from '../../types/presentation';
import './PropertiesToolbar.css';

function PropertiesToolbar() {
  const { state, actions } = usePresentation();
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);
  const [showEffects, setShowEffects] = useState(false);

  // Keyboard shortcuts for copy/paste
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && state.selectedElementId) {
        e.preventDefault();
        actions.copyElement(state.selectedElementId);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'v' && state.copiedElement) {
        e.preventDefault();
        actions.pasteElement();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElementId, state.copiedElement]);

  if (!state.presentation) return null;

  const currentSlide = state.presentation.slides[state.currentSlideIndex];
  const selectedElement = currentSlide?.elements.find(el => el.id === state.selectedElementId);
  const textEl = selectedElement?.type === 'text' ? selectedElement as TextElement : null;
  const shapeEl = selectedElement?.type === 'shape' ? selectedElement as ShapeElement : null;
  const tableEl = selectedElement?.type === 'table' ? selectedElement as TableElement : null;
  const chartEl = selectedElement?.type === 'chart' ? selectedElement as ChartElement : null;

  const updateText = (property: string, value: any) => {
    if (!textEl) return;
    actions.updateElement({ ...textEl, [property]: value });
  };

  const updateShape = (property: string, value: any) => {
    if (!shapeEl) return;
    actions.updateElement({ ...shapeEl, [property]: value });
  };

  const updateTable = (property: string, value: any) => {
    if (!tableEl) return;
    actions.updateElement({ ...tableEl, [property]: value });
  };

  const updateChart = (property: string, value: any) => {
    if (!chartEl) return;
    actions.updateElement({ ...chartEl, [property]: value });
  };

  const handleSlideBackgroundChange = (color: string) => {
    if (!currentSlide) return;
    actions.updateSlide({ ...currentSlide, background: color });
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSlide) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      actions.updateSlide({ ...currentSlide, background: base64 });
    };
    reader.readAsDataURL(file);
  };

  // Check if any effect is active
  const hasActiveEffects = textEl && (
    (textEl.outlineWidth && textEl.outlineWidth > 0) ||
    (textEl.glowSize && textEl.glowSize > 0) ||
    (textEl.shadowBlur && textEl.shadowBlur > 0) ||
    textEl.highlight ||
    textEl.backgroundColor
  );

  return (
    <div className="properties-toolbar">
      {/* Slide Background */}
      <div className="prop-section">
        <span className="prop-section-title">Slide</span>
        <input
          type="color"
          value={currentSlide?.background?.startsWith('#') ? currentSlide.background : '#FFFFFF'}
          onChange={(e) => handleSlideBackgroundChange(e.target.value)}
          className="prop-color-input"
          title="Background Color"
        />
        <button
          onClick={() => backgroundFileInputRef.current?.click()}
          className="prop-btn"
          title="Upload Background Image"
        >
          🖼
        </button>
        <input
          ref={backgroundFileInputRef}
          type="file"
          accept="image/*"
          onChange={handleBackgroundImageUpload}
          style={{ display: 'none' }}
        />
        {currentSlide?.background && !currentSlide.background.startsWith('#') && (
          <button
            onClick={() => actions.updateSlide({ ...currentSlide, background: '#FFFFFF' })}
            className="prop-btn"
            title="Remove Background Image"
          >
            ✕
          </button>
        )}
      </div>

      {selectedElement && (
        <>
          <div className="prop-separator" />

          {/* Layer & Actions */}
          <div className="prop-section">
            <span className="prop-section-title">Layer</span>
            <div className="prop-btn-group">
              <button
                onClick={() => actions.moveElementForward(selectedElement.id)}
                className="prop-btn"
                title="Bring Forward"
              >
                ↑
              </button>
              <button
                onClick={() => actions.moveElementBackward(selectedElement.id)}
                className="prop-btn"
                title="Send Backward"
              >
                ↓
              </button>
            </div>
            <span className="prop-value">Z:{selectedElement.zIndex}</span>
            <button
              onClick={() => actions.copyElement(selectedElement.id)}
              className="prop-btn prop-btn-text"
              title="Copy (Ctrl+C)"
            >
              📋 Copy
            </button>
          </div>

          {/* Text Properties */}
          {textEl && (
            <>
              <div className="prop-separator" />

              {/* Font */}
              <div className="prop-section">
                <span className="prop-section-title">Font</span>
                <select
                  value={textEl.fontFamily}
                  onChange={(e) => updateText('fontFamily', e.target.value)}
                  className="prop-select"
                  title="Font Family"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times</option>
                  <option value="Courier New">Courier</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
                <input
                  type="number"
                  min="8"
                  max="200"
                  value={textEl.fontSize}
                  onChange={(e) => updateText('fontSize', parseInt(e.target.value))}
                  className="prop-number-input"
                  title="Font Size"
                />
                <input
                  type="color"
                  value={textEl.color}
                  onChange={(e) => updateText('color', e.target.value)}
                  className="prop-color-input"
                  title="Text Color"
                />
              </div>

              {/* Style */}
              <div className="prop-section">
                <span className="prop-section-title">Style</span>
                <div className="prop-btn-group">
                  <button
                    onClick={() => updateText('bold', !textEl.bold)}
                    className={`prop-btn ${textEl.bold ? 'active' : ''}`}
                    title="Bold (B)"
                  >
                    <strong>B</strong>
                  </button>
                  <button
                    onClick={() => updateText('italic', !textEl.italic)}
                    className={`prop-btn ${textEl.italic ? 'active' : ''}`}
                    title="Italic (I)"
                  >
                    <em>I</em>
                  </button>
                  <button
                    onClick={() => updateText('underline', !textEl.underline)}
                    className={`prop-btn ${textEl.underline ? 'active' : ''}`}
                    title="Underline (U)"
                  >
                    <span style={{ textDecoration: 'underline' }}>U</span>
                  </button>
                  <button
                    onClick={() => updateText('strike', !textEl.strike)}
                    className={`prop-btn ${textEl.strike ? 'active' : ''}`}
                    title="Strikethrough"
                  >
                    <span style={{ textDecoration: 'line-through' }}>S</span>
                  </button>
                </div>
                <div className="prop-btn-group">
                  <button
                    onClick={() => {
                      updateText('superscript', !textEl.superscript);
                      if (!textEl.superscript) updateText('subscript', false);
                    }}
                    className={`prop-btn ${textEl.superscript ? 'active' : ''}`}
                    title="Superscript"
                  >
                    <span style={{ fontSize: '10px' }}>X<sup>2</sup></span>
                  </button>
                  <button
                    onClick={() => {
                      updateText('subscript', !textEl.subscript);
                      if (!textEl.subscript) updateText('superscript', false);
                    }}
                    className={`prop-btn ${textEl.subscript ? 'active' : ''}`}
                    title="Subscript"
                  >
                    <span style={{ fontSize: '10px' }}>X<sub>2</sub></span>
                  </button>
                </div>
              </div>

              {/* Align */}
              <div className="prop-section">
                <span className="prop-section-title">Align</span>
                <div className="prop-btn-group">
                  <button
                    onClick={() => updateText('align', 'left')}
                    className={`prop-btn ${textEl.align === 'left' ? 'active' : ''}`}
                    title="Align Left"
                  >
                    ≡
                  </button>
                  <button
                    onClick={() => updateText('align', 'center')}
                    className={`prop-btn ${textEl.align === 'center' ? 'active' : ''}`}
                    title="Align Center"
                  >
                    ≡
                  </button>
                  <button
                    onClick={() => updateText('align', 'right')}
                    className={`prop-btn ${textEl.align === 'right' ? 'active' : ''}`}
                    title="Align Right"
                  >
                    ≡
                  </button>
                </div>
                <select
                  value={textEl.valign || 'top'}
                  onChange={(e) => updateText('valign', e.target.value)}
                  className="prop-select"
                  style={{ minWidth: '60px' }}
                  title="Vertical Align"
                >
                  <option value="top">Top</option>
                  <option value="middle">Mid</option>
                  <option value="bottom">Bot</option>
                </select>
              </div>

              {/* List */}
              <div className="prop-section">
                <span className="prop-section-title">List</span>
                <select
                  value={textEl.listType || 'none'}
                  onChange={(e) => updateText('listType', e.target.value)}
                  className="prop-select"
                  style={{ minWidth: '70px' }}
                >
                  <option value="none">None</option>
                  <option value="bullets">• Bullets</option>
                  <option value="numbers">1. Numbers</option>
                </select>
              </div>

              <div className="prop-separator" />

              {/* Effects Toggle */}
              <div className="prop-section">
                <button
                  onClick={() => setShowEffects(!showEffects)}
                  className={`prop-btn prop-btn-text ${hasActiveEffects ? 'active' : ''}`}
                  title="Text Effects"
                >
                  ✨ Effects {showEffects ? '▼' : '▶'}
                </button>
              </div>

              {/* Effects Panel */}
              {showEffects && (
                <>
                  {/* Highlight & Background */}
                  <div className="prop-effect-control">
                    <span className="prop-effect-label">Highlight</span>
                    <input
                      type="color"
                      value={textEl.highlight || '#FFFF00'}
                      onChange={(e) => updateText('highlight', e.target.value)}
                      className="prop-effect-color"
                      title="Highlight Color"
                    />
                    {textEl.highlight && (
                      <button onClick={() => updateText('highlight', '')} className="prop-effect-remove">✕</button>
                    )}
                  </div>

                  <div className="prop-effect-control">
                    <span className="prop-effect-label">Fill</span>
                    <input
                      type="color"
                      value={textEl.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateText('backgroundColor', e.target.value)}
                      className="prop-effect-color"
                      title="Background Fill"
                    />
                    {textEl.backgroundColor && (
                      <button onClick={() => updateText('backgroundColor', '')} className="prop-effect-remove">✕</button>
                    )}
                  </div>

                  {/* Outline */}
                  <div className="prop-effect-control">
                    <span className="prop-effect-label">Outline</span>
                    <input
                      type="color"
                      value={textEl.outlineColor || '#000000'}
                      onChange={(e) => {
                        updateText('outlineColor', e.target.value);
                        if (!textEl.outlineWidth) updateText('outlineWidth', 1);
                      }}
                      className="prop-effect-color"
                      title="Outline Color"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                      value={textEl.outlineWidth || 0}
                      onChange={(e) => updateText('outlineWidth', parseFloat(e.target.value))}
                      className="prop-effect-input"
                      title="Width"
                    />
                    {textEl.outlineWidth && textEl.outlineWidth > 0 && (
                      <button onClick={() => { updateText('outlineWidth', 0); updateText('outlineColor', ''); }} className="prop-effect-remove">✕</button>
                    )}
                  </div>

                  {/* Glow */}
                  <div className="prop-effect-control">
                    <span className="prop-effect-label">Glow</span>
                    <input
                      type="color"
                      value={textEl.glowColor || '#FFFF00'}
                      onChange={(e) => {
                        updateText('glowColor', e.target.value);
                        if (!textEl.glowSize) updateText('glowSize', 5);
                      }}
                      className="prop-effect-color"
                      title="Glow Color"
                    />
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={textEl.glowSize || 0}
                      onChange={(e) => updateText('glowSize', parseInt(e.target.value))}
                      className="prop-effect-input"
                      title="Size"
                    />
                    {textEl.glowSize && textEl.glowSize > 0 && (
                      <button onClick={() => { updateText('glowSize', 0); updateText('glowColor', ''); }} className="prop-effect-remove">✕</button>
                    )}
                  </div>

                  {/* Shadow */}
                  <div className="prop-effect-control">
                    <span className="prop-effect-label">Shadow</span>
                    <input
                      type="color"
                      value={textEl.shadowColor || '#000000'}
                      onChange={(e) => {
                        updateText('shadowColor', e.target.value);
                        if (!textEl.shadowBlur) {
                          updateText('shadowBlur', 4);
                          updateText('shadowOffsetX', 2);
                          updateText('shadowOffsetY', 2);
                        }
                      }}
                      className="prop-effect-color"
                      title="Shadow Color"
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={textEl.shadowBlur || 0}
                      onChange={(e) => updateText('shadowBlur', parseInt(e.target.value))}
                      className="prop-effect-input"
                      title="Blur"
                      placeholder="Blur"
                    />
                    <input
                      type="number"
                      min="-20"
                      max="20"
                      value={textEl.shadowOffsetX || 0}
                      onChange={(e) => updateText('shadowOffsetX', parseInt(e.target.value))}
                      className="prop-effect-input"
                      title="Offset X"
                      placeholder="X"
                    />
                    <input
                      type="number"
                      min="-20"
                      max="20"
                      value={textEl.shadowOffsetY || 0}
                      onChange={(e) => updateText('shadowOffsetY', parseInt(e.target.value))}
                      className="prop-effect-input"
                      title="Offset Y"
                      placeholder="Y"
                    />
                    {textEl.shadowBlur && textEl.shadowBlur > 0 && (
                      <button onClick={() => {
                        updateText('shadowBlur', 0);
                        updateText('shadowOffsetX', 0);
                        updateText('shadowOffsetY', 0);
                        updateText('shadowColor', '');
                      }} className="prop-effect-remove">✕</button>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Shape Properties */}
          {shapeEl && (
            <>
              <div className="prop-separator" />
              <div className="prop-section">
                <span className="prop-section-title">Shape</span>
                <select
                  value={shapeEl.shapeType}
                  onChange={(e) => updateShape('shapeType', e.target.value)}
                  className="prop-select"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                  <option value="line">Line</option>
                </select>
                <span className="prop-label">Fill</span>
                <input
                  type="color"
                  value={shapeEl.fillColor}
                  onChange={(e) => updateShape('fillColor', e.target.value)}
                  className="prop-color-input"
                />
                <span className="prop-label">Border</span>
                <input
                  type="color"
                  value={shapeEl.borderColor}
                  onChange={(e) => updateShape('borderColor', e.target.value)}
                  className="prop-color-input"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={shapeEl.borderWidth}
                  onChange={(e) => updateShape('borderWidth', parseInt(e.target.value))}
                  className="prop-number-input"
                  title="Border Width"
                />
              </div>
            </>
          )}

          {/* Table Properties */}
          {tableEl && (
            <>
              <div className="prop-separator" />
              <div className="prop-section">
                <span className="prop-section-title">Table</span>
                <span className="prop-label">Border</span>
                <input
                  type="color"
                  value={tableEl.borderColor}
                  onChange={(e) => updateTable('borderColor', e.target.value)}
                  className="prop-color-input"
                />
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={tableEl.borderWidth}
                  onChange={(e) => updateTable('borderWidth', parseInt(e.target.value))}
                  className="prop-number-input"
                />
                <label className="prop-checkbox">
                  <input
                    type="checkbox"
                    checked={tableEl.headerRow}
                    onChange={(e) => updateTable('headerRow', e.target.checked)}
                  />
                  Header
                </label>
                <span className="prop-hint">Double-click to edit</span>
              </div>
            </>
          )}

          {/* Chart Properties */}
          {chartEl && (
            <>
              <div className="prop-separator" />
              <div className="prop-section">
                <span className="prop-section-title">Chart</span>
                <select
                  value={chartEl.chartType}
                  onChange={(e) => updateChart('chartType', e.target.value)}
                  className="prop-select"
                >
                  <option value="bar">Bar</option>
                  <option value="column">Column</option>
                  <option value="line">Line</option>
                  <option value="area">Area</option>
                  <option value="pie">Pie</option>
                  <option value="doughnut">Doughnut</option>
                  <option value="scatter">Scatter</option>
                  <option value="bubble">Bubble</option>
                  <option value="radar">Radar</option>
                </select>
                <label className="prop-checkbox">
                  <input
                    type="checkbox"
                    checked={chartEl.showTitle}
                    onChange={(e) => updateChart('showTitle', e.target.checked)}
                  />
                  Title
                </label>
                <label className="prop-checkbox">
                  <input
                    type="checkbox"
                    checked={chartEl.showLegend}
                    onChange={(e) => updateChart('showLegend', e.target.checked)}
                  />
                  Legend
                </label>
                <span className="prop-hint">Double-click to edit data</span>
              </div>
            </>
          )}
        </>
      )}

      {!selectedElement && state.copiedElement && (
        <>
          <div className="prop-separator" />
          <div className="prop-section">
            <button
              onClick={() => actions.pasteElement()}
              className="prop-btn prop-btn-text"
              title="Paste (Ctrl+V)"
            >
              📄 Paste {state.copiedElement.type}
            </button>
          </div>
        </>
      )}

      {!selectedElement && !state.copiedElement && (
        <>
          <div className="prop-separator" />
          <span className="prop-hint">Select an element to edit properties</span>
        </>
      )}
    </div>
  );
}

export default PropertiesToolbar;
