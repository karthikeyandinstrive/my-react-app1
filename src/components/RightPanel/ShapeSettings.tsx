import { usePresentation } from '../../context/PresentationContext';
import type { ShapeElement } from '../../types/presentation';

interface ShapeSettingsProps {
  element: ShapeElement;
}

const shapeTypes = [
  { type: 'rectangle', label: 'Rectangle', icon: '▭' },
  { type: 'circle', label: 'Circle', icon: '○' },
  { type: 'line', label: 'Line', icon: '—' },
] as const;

const presetColors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#64748b', '#1e1e1e',
];

function ShapeSettings({ element }: ShapeSettingsProps) {
  const { actions } = usePresentation();

  const updateElement = (updates: Partial<ShapeElement>) => {
    actions.updateElement({ ...element, ...updates });
  };

  return (
    <>
      <div className="settings-header">
        <span className="settings-title">
          <span className="settings-icon">□</span>
          Shape Settings
        </span>
        <button className="settings-close" onClick={() => actions.selectElement(null)}>×</button>
      </div>

      <div className="settings-content">
        {/* Shape Type */}
        <div className="settings-section">
          <div className="settings-section-title">Shape Type</div>
          <div className="settings-row">
            <div className="settings-btn-group">
              {shapeTypes.map(shape => (
                <button
                  key={shape.type}
                  className={`settings-btn ${element.shapeType === shape.type ? 'active' : ''}`}
                  onClick={() => updateElement({ shapeType: shape.type })}
                  title={shape.label}
                >
                  {shape.icon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fill Color */}
        <div className="settings-section">
          <div className="settings-section-title">Fill Color</div>
          <div className="settings-row">
            <input
              type="color"
              className="settings-color-input"
              value={element.fillColor}
              onChange={(e) => updateElement({ fillColor: e.target.value })}
            />
            <span style={{ fontSize: 12, color: '#a0a0b0' }}>{element.fillColor}</span>
          </div>
          <div className="settings-color-palette" style={{ marginTop: 8 }}>
            {presetColors.map((color) => (
              <button
                key={color}
                className={`settings-color-swatch ${element.fillColor === color ? 'active' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => updateElement({ fillColor: color })}
              />
            ))}
          </div>
        </div>

        {/* Border */}
        <div className="settings-section">
          <div className="settings-section-title">Border</div>
          <div className="settings-row">
            <input
              type="color"
              className="settings-color-input"
              value={element.borderColor}
              onChange={(e) => updateElement({ borderColor: e.target.value })}
            />
            <span className="settings-label">Width</span>
            <input
              type="number"
              className="settings-input"
              value={element.borderWidth}
              min={0}
              max={20}
              onChange={(e) => updateElement({ borderWidth: parseInt(e.target.value) })}
              style={{ width: 60 }}
            />
          </div>
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

        {/* Layer */}
        <div className="settings-section">
          <div className="settings-section-title">Layer</div>
          <div className="settings-row">
            <button
              className="settings-btn-icon"
              onClick={() => actions.moveElementForward(element.id)}
              title="Bring Forward"
            >
              ↑
            </button>
            <button
              className="settings-btn-icon"
              onClick={() => actions.moveElementBackward(element.id)}
              title="Send Backward"
            >
              ↓
            </button>
            <span style={{ marginLeft: 8, fontSize: 12, color: '#a0a0b0' }}>
              Z-Index: {element.zIndex}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShapeSettings;
