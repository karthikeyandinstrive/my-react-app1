import { useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import type { TextElement, ShapeElement, TableElement, ChartElement } from '../../types/presentation';
import './PropertyPanel.css';

function PropertyPanel() {
  const { state, actions } = usePresentation();
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  if (!state.presentation) return null;

  const currentSlide = state.presentation.slides[state.currentSlideIndex];
  const selectedElement = currentSlide?.elements.find(el => el.id === state.selectedElementId);

  const handleSlideBackgroundChange = (color: string) => {
    if (!currentSlide) return;
    actions.updateSlide({
      ...currentSlide,
      background: color,
    });
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSlide) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      actions.updateSlide({
        ...currentSlide,
        background: base64,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackgroundImage = () => {
    if (!currentSlide) return;
    actions.updateSlide({
      ...currentSlide,
      background: '#FFFFFF',
    });
  };

  const handleTextPropertyChange = (property: string, value: any) => {
    if (!selectedElement || selectedElement.type !== 'text') return;

    actions.updateElement({
      ...selectedElement,
      [property]: value,
    });
  };

  const handleShapePropertyChange = (property: string, value: any) => {
    if (!selectedElement || selectedElement.type !== 'shape') return;

    actions.updateElement({
      ...selectedElement,
      [property]: value,
    });
  };

  const handleTablePropertyChange = (property: string, value: any) => {
    if (!selectedElement || selectedElement.type !== 'table') return;

    actions.updateElement({
      ...selectedElement,
      [property]: value,
    });
  };

  const handleChartPropertyChange = (property: string, value: any) => {
    if (!selectedElement || selectedElement.type !== 'chart') return;

    actions.updateElement({
      ...selectedElement,
      [property]: value,
    });
  };

  return (
    <div className="property-panel">
      <h3 className="property-panel-title">Properties</h3>

      <div className="property-section">
        <h4>Slide Background</h4>
        <div className="property-field">
          <label>Color:</label>
          <input
            type="color"
            value={currentSlide?.background?.startsWith('#') ? currentSlide.background : '#FFFFFF'}
            onChange={(e) => handleSlideBackgroundChange(e.target.value)}
          />
        </div>
        <div className="property-field">
          <label>Or upload image:</label>
          <button
            onClick={() => backgroundFileInputRef.current?.click()}
            className="upload-background-btn"
          >
            Choose Image
          </button>
          <input
            ref={backgroundFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            style={{ display: 'none' }}
          />
        </div>
        {currentSlide?.background && !currentSlide.background.startsWith('#') && (
          <div className="property-field">
            <button onClick={handleRemoveBackgroundImage} className="remove-background-btn">
              Remove Background Image
            </button>
          </div>
        )}
      </div>

      {selectedElement && (
        <div className="property-section">
          <h4>Layer Order</h4>
          <div className="property-field layer-controls">
            <button
              onClick={() => actions.moveElementForward(selectedElement.id)}
              className="layer-btn"
            >
              ↑ Move Forward
            </button>
            <button
              onClick={() => actions.moveElementBackward(selectedElement.id)}
              className="layer-btn"
            >
              ↓ Move Backward
            </button>
          </div>
          <p className="property-hint">Z-Index: {selectedElement.zIndex}</p>
        </div>
      )}

      {selectedElement && selectedElement.type === 'text' && (
        <div className="property-section">
          <h4>Text Properties</h4>

          <div className="property-field">
            <label>Font Size:</label>
            <input
              type="number"
              min="8"
              max="72"
              value={(selectedElement as TextElement).fontSize}
              onChange={(e) => handleTextPropertyChange('fontSize', parseInt(e.target.value))}
            />
          </div>

          <div className="property-field">
            <label>Font Family:</label>
            <select
              value={(selectedElement as TextElement).fontFamily}
              onChange={(e) => handleTextPropertyChange('fontFamily', e.target.value)}
            >
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>
          </div>

          <div className="property-field">
            <label>Color:</label>
            <input
              type="color"
              value={(selectedElement as TextElement).color}
              onChange={(e) => handleTextPropertyChange('color', e.target.value)}
            />
          </div>

          <div className="property-field">
            <label>Alignment:</label>
            <select
              value={(selectedElement as TextElement).align}
              onChange={(e) => handleTextPropertyChange('align', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>

          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={(selectedElement as TextElement).bold}
                onChange={(e) => handleTextPropertyChange('bold', e.target.checked)}
              />
              Bold
            </label>
          </div>

          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={(selectedElement as TextElement).italic}
                onChange={(e) => handleTextPropertyChange('italic', e.target.checked)}
              />
              Italic
            </label>
          </div>

          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={(selectedElement as TextElement).underline}
                onChange={(e) => handleTextPropertyChange('underline', e.target.checked)}
              />
              Underline
            </label>
          </div>
        </div>
      )}

      {selectedElement && selectedElement.type === 'image' && (
        <div className="property-section">
          <h4>Image Properties</h4>
          <p className="property-hint">
            Click on the image to change it
          </p>
        </div>
      )}

      {selectedElement && selectedElement.type === 'shape' && (
        <div className="property-section">
          <h4>Shape Properties</h4>

          <div className="property-field">
            <label>Shape Type:</label>
            <select
              value={(selectedElement as ShapeElement).shapeType}
              onChange={(e) => handleShapePropertyChange('shapeType', e.target.value)}
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="line">Line</option>
            </select>
          </div>

          <div className="property-field">
            <label>Fill Color:</label>
            <input
              type="color"
              value={(selectedElement as ShapeElement).fillColor}
              onChange={(e) => handleShapePropertyChange('fillColor', e.target.value)}
            />
          </div>

          <div className="property-field">
            <label>Border Color:</label>
            <input
              type="color"
              value={(selectedElement as ShapeElement).borderColor}
              onChange={(e) => handleShapePropertyChange('borderColor', e.target.value)}
            />
          </div>

          <div className="property-field">
            <label>Border Width:</label>
            <input
              type="number"
              min="0"
              max="10"
              value={(selectedElement as ShapeElement).borderWidth}
              onChange={(e) => handleShapePropertyChange('borderWidth', parseInt(e.target.value))}
            />
          </div>
        </div>
      )}

      {selectedElement && selectedElement.type === 'table' && (
        <div className="property-section">
          <h4>Table Properties</h4>

          <div className="property-field">
            <label>Border Color:</label>
            <input
              type="color"
              value={(selectedElement as TableElement).borderColor}
              onChange={(e) => handleTablePropertyChange('borderColor', e.target.value)}
            />
          </div>

          <div className="property-field">
            <label>Border Width:</label>
            <input
              type="number"
              min="0"
              max="10"
              value={(selectedElement as TableElement).borderWidth}
              onChange={(e) => handleTablePropertyChange('borderWidth', parseInt(e.target.value))}
            />
          </div>

          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={(selectedElement as TableElement).headerRow}
                onChange={(e) => handleTablePropertyChange('headerRow', e.target.checked)}
              />
              Header Row
            </label>
          </div>

          <p className="property-hint">
            Double-click the table to edit its structure and content
          </p>
        </div>
      )}

      {selectedElement && selectedElement.type === 'chart' && (
        <div className="property-section">
          <h4>Chart Properties</h4>

          <div className="property-field">
            <label>Chart Type:</label>
            <select
              value={(selectedElement as ChartElement).chartType}
              onChange={(e) => handleChartPropertyChange('chartType', e.target.value)}
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
          </div>

          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={(selectedElement as ChartElement).showTitle}
                onChange={(e) => handleChartPropertyChange('showTitle', e.target.checked)}
              />
              Show Title
            </label>
          </div>

          <div className="property-field">
            <label>
              <input
                type="checkbox"
                checked={(selectedElement as ChartElement).showLegend}
                onChange={(e) => handleChartPropertyChange('showLegend', e.target.checked)}
              />
              Show Legend
            </label>
          </div>

          <p className="property-hint">
            Double-click the chart to edit its data
          </p>
        </div>
      )}

      {!selectedElement && (
        <div className="property-section">
          <p className="property-hint">Select an element to edit its properties</p>
        </div>
      )}
    </div>
  );
}

export default PropertyPanel;
