import { usePresentation } from '../../context/PresentationContext';
import type { TextElement } from '../../types/presentation';

interface TextSettingsProps {
  element: TextElement;
}

const fontFamilies = ['Inter', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New'];
const fontWeights = [
  { label: 'Light', value: 300 },
  { label: 'Regular', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semibold', value: 600 },
  { label: 'Bold', value: 700 },
];

const highlightColors = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fbcfe8',
  '#fed7aa', '#fecaca', '#e5e7eb', '#fcd34d', '#86efac',
  '#93c5fd', '#c4b5fd', '#f9a8d4', '#fdba74', '#f87171',
  'transparent',
];

function TextSettings({ element }: TextSettingsProps) {
  const { actions } = usePresentation();

  const updateElement = (updates: Partial<TextElement>) => {
    actions.updateElement({ ...element, ...updates });
  };

  return (
    <>
      <div className="settings-header">
        <span className="settings-title">
          <span className="settings-icon">T</span>
          Text Settings
        </span>
        <button className="settings-close" onClick={() => actions.selectElement(null)}>×</button>
      </div>

      <div className="settings-content">
        {/* Typography */}
        <div className="settings-section">
          <div className="settings-section-title">Typography</div>

          <div className="settings-row">
            <select
              className="settings-select"
              value={element.fontFamily}
              onChange={(e) => updateElement({ fontFamily: e.target.value })}
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div className="settings-row two-col">
            <div>
              <label className="settings-label">Size</label>
              <input
                type="number"
                className="settings-input"
                value={element.fontSize}
                min={8}
                max={200}
                onChange={(e) => updateElement({ fontSize: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="settings-label">Weight</label>
              <select
                className="settings-select"
                value={element.bold ? 700 : 400}
                onChange={(e) => updateElement({ bold: parseInt(e.target.value) >= 600 })}
              >
                {fontWeights.map(w => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Formatting */}
        <div className="settings-section">
          <div className="settings-section-title">Formatting</div>

          <div className="settings-row">
            <div className="settings-btn-group">
              <button
                className={`settings-btn ${element.bold ? 'active' : ''}`}
                onClick={() => updateElement({ bold: !element.bold })}
                title="Bold"
              >
                <strong>B</strong>
              </button>
              <button
                className={`settings-btn ${element.italic ? 'active' : ''}`}
                onClick={() => updateElement({ italic: !element.italic })}
                title="Italic"
              >
                <em>I</em>
              </button>
              <button
                className={`settings-btn ${element.underline ? 'active' : ''}`}
                onClick={() => updateElement({ underline: !element.underline })}
                title="Underline"
              >
                <span style={{ textDecoration: 'underline' }}>U</span>
              </button>
              <button
                className={`settings-btn ${element.strike ? 'active' : ''}`}
                onClick={() => updateElement({ strike: !element.strike })}
                title="Strikethrough"
              >
                <span style={{ textDecoration: 'line-through' }}>S</span>
              </button>
              <button
                className={`settings-btn ${element.superscript ? 'active' : ''}`}
                onClick={() => updateElement({ superscript: !element.superscript, subscript: false })}
                title="Superscript"
              >
                x²
              </button>
              <button
                className={`settings-btn ${element.subscript ? 'active' : ''}`}
                onClick={() => updateElement({ subscript: !element.subscript, superscript: false })}
                title="Subscript"
              >
                x₂
              </button>
            </div>
          </div>

          <div className="settings-row" style={{ marginTop: 12 }}>
            <div className="settings-btn-group">
              <button
                className={`settings-btn ${element.align === 'left' ? 'active' : ''}`}
                onClick={() => updateElement({ align: 'left' })}
                title="Align Left"
              >
                ≡
              </button>
              <button
                className={`settings-btn ${element.align === 'center' ? 'active' : ''}`}
                onClick={() => updateElement({ align: 'center' })}
                title="Align Center"
              >
                ≡
              </button>
              <button
                className={`settings-btn ${element.align === 'right' ? 'active' : ''}`}
                onClick={() => updateElement({ align: 'right' })}
                title="Align Right"
              >
                ≡
              </button>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="settings-section">
          <div className="settings-section-title">Colors</div>

          <div className="settings-row">
            <span className="settings-label">Text</span>
            <input
              type="color"
              className="settings-color-input"
              value={element.color}
              onChange={(e) => updateElement({ color: e.target.value })}
            />
          </div>
        </div>

        {/* Highlight */}
        <div className="settings-section">
          <div className="settings-section-title">Highlight</div>
          <div className="settings-color-palette">
            {highlightColors.map((color) => (
              <button
                key={color}
                className={`settings-color-swatch ${element.highlight === color ? 'active' : ''}`}
                style={{
                  backgroundColor: color === 'transparent' ? '#252540' : color,
                  border: color === 'transparent' ? '1px dashed #3d3d5c' : 'none',
                }}
                onClick={() => updateElement({ highlight: color === 'transparent' ? undefined : color })}
                title={color === 'transparent' ? 'No highlight' : color}
              />
            ))}
          </div>
        </div>

        {/* Lists */}
        <div className="settings-section">
          <div className="settings-section-title">Lists</div>
          <div className="settings-row">
            <button
              className={`settings-btn-icon ${element.listType === 'bullets' ? 'active' : ''}`}
              onClick={() => updateElement({ listType: element.listType === 'bullets' ? 'none' : 'bullets' })}
              title="Bullet List"
            >
              •≡
            </button>
            <button
              className={`settings-btn-icon ${element.listType === 'numbers' ? 'active' : ''}`}
              onClick={() => updateElement({ listType: element.listType === 'numbers' ? 'none' : 'numbers' })}
              title="Numbered List"
            >
              1.≡
            </button>
          </div>
        </div>

        {/* Effects */}
        <div className="settings-section">
          <div className="settings-section-title">Effects</div>

          {/* Text Outline */}
          <div className="settings-toggle">
            <span className="settings-toggle-label">Text Outline</span>
            <div
              className={`settings-toggle-switch ${element.outlineWidth && element.outlineWidth > 0 ? 'active' : ''}`}
              onClick={() => {
                if (element.outlineWidth && element.outlineWidth > 0) {
                  updateElement({ outlineWidth: 0 });
                } else {
                  updateElement({
                    outlineWidth: 2,
                    outlineColor: '#000000'
                  });
                }
              }}
            />
          </div>

          {element.outlineWidth && element.outlineWidth > 0 && (
            <div className="settings-subsection">
              <div className="settings-row two-col">
                <div>
                  <label className="settings-label">Width</label>
                  <input
                    type="number"
                    className="settings-input"
                    value={element.outlineWidth || 2}
                    min={1}
                    max={10}
                    onChange={(e) => updateElement({ outlineWidth: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="settings-label">Color</label>
                  <input
                    type="color"
                    className="settings-color-input"
                    value={element.outlineColor || '#000000'}
                    onChange={(e) => updateElement({ outlineColor: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Text Glow */}
          <div className="settings-toggle">
            <span className="settings-toggle-label">Text Glow</span>
            <div
              className={`settings-toggle-switch ${element.glowSize && element.glowSize > 0 ? 'active' : ''}`}
              onClick={() => {
                if (element.glowSize && element.glowSize > 0) {
                  updateElement({ glowSize: 0 });
                } else {
                  updateElement({
                    glowSize: 10,
                    glowColor: '#6366f1'
                  });
                }
              }}
            />
          </div>

          {element.glowSize && element.glowSize > 0 && (
            <div className="settings-subsection">
              <div className="settings-row two-col">
                <div>
                  <label className="settings-label">Size</label>
                  <input
                    type="number"
                    className="settings-input"
                    value={element.glowSize || 10}
                    min={1}
                    max={50}
                    onChange={(e) => updateElement({ glowSize: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="settings-label">Color</label>
                  <input
                    type="color"
                    className="settings-color-input"
                    value={element.glowColor || '#6366f1'}
                    onChange={(e) => updateElement({ glowColor: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Text Shadow */}
          <div className="settings-toggle">
            <span className="settings-toggle-label">Text Shadow</span>
            <div
              className={`settings-toggle-switch ${element.shadowBlur && element.shadowBlur > 0 ? 'active' : ''}`}
              onClick={() => {
                if (element.shadowBlur && element.shadowBlur > 0) {
                  updateElement({ shadowBlur: 0 });
                } else {
                  updateElement({
                    shadowBlur: 4,
                    shadowOffsetX: 2,
                    shadowOffsetY: 2,
                    shadowColor: '#000000'
                  });
                }
              }}
            />
          </div>

          {element.shadowBlur && element.shadowBlur > 0 && (
            <div className="settings-subsection">
              <div className="settings-row two-col">
                <div>
                  <label className="settings-label">Blur</label>
                  <input
                    type="number"
                    className="settings-input"
                    value={element.shadowBlur || 4}
                    min={0}
                    max={50}
                    onChange={(e) => updateElement({ shadowBlur: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="settings-label">Color</label>
                  <input
                    type="color"
                    className="settings-color-input"
                    value={element.shadowColor || '#000000'}
                    onChange={(e) => updateElement({ shadowColor: e.target.value })}
                  />
                </div>
              </div>
              <div className="settings-row two-col">
                <div>
                  <label className="settings-label">Offset X</label>
                  <input
                    type="number"
                    className="settings-input"
                    value={element.shadowOffsetX || 0}
                    min={-20}
                    max={20}
                    onChange={(e) => updateElement({ shadowOffsetX: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="settings-label">Offset Y</label>
                  <input
                    type="number"
                    className="settings-input"
                    value={element.shadowOffsetY || 0}
                    min={-20}
                    max={20}
                    onChange={(e) => updateElement({ shadowOffsetY: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TextSettings;
