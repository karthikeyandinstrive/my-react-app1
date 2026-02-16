import { usePresentation } from '../../context/PresentationContext';
import type { TableElement } from '../../types/presentation';

interface TableSettingsProps {
  element: TableElement;
}

function TableSettings({ element }: TableSettingsProps) {
  const { actions } = usePresentation();

  const updateElement = (updates: Partial<TableElement>) => {
    actions.updateElement({ ...element, ...updates });
  };

  return (
    <>
      <div className="settings-header">
        <span className="settings-title">
          <span className="settings-icon">⊞</span>
          Table Settings
        </span>
        <button className="settings-close" onClick={() => actions.selectElement(null)}>×</button>
      </div>

      <div className="settings-content">
        {/* Table Size */}
        <div className="settings-section">
          <div className="settings-section-title">Table Size</div>
          <div className="settings-row two-col">
            <div>
              <label className="settings-label">Rows</label>
              <input
                type="number"
                className="settings-input"
                value={element.rows}
                min={1}
                max={20}
                readOnly
              />
            </div>
            <div>
              <label className="settings-label">Columns</label>
              <input
                type="number"
                className="settings-input"
                value={element.cols}
                min={1}
                max={10}
                readOnly
              />
            </div>
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
              max={10}
              onChange={(e) => updateElement({ borderWidth: parseInt(e.target.value) })}
              style={{ width: 60 }}
            />
          </div>
        </div>

        {/* Header Row */}
        <div className="settings-section">
          <div className="settings-section-title">Options</div>
          <label className="settings-checkbox">
            <input
              type="checkbox"
              checked={element.headerRow}
              onChange={(e) => updateElement({ headerRow: e.target.checked })}
            />
            Header Row
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
            Double-click a cell to edit its content
          </p>
        </div>
      </div>
    </>
  );
}

export default TableSettings;
