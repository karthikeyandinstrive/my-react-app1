import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import type { ShapeElement } from '../../types/presentation';
import { DEFAULT_SHAPE_ELEMENT } from '../../utils/constants';

const shapes = [
  { type: 'rectangle', icon: '▭', label: 'Rectangle' },
  { type: 'circle', icon: '○', label: 'Circle' },
  { type: 'line', icon: '—', label: 'Line' },
] as const;

const colors = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6', '#1e1e1e', '#ffffff',
];

interface ShapesPanelProps {
  onClose: () => void;
}

function ShapesPanel({ onClose }: ShapesPanelProps) {
  const { actions } = usePresentation();

  const handleAddShape = (shapeType: 'rectangle' | 'circle' | 'line', color?: string) => {
    const newShapeElement: ShapeElement = {
      id: uuidv4(),
      type: 'shape',
      position: { x: 30, y: 30, width: 20, height: 20 },
      zIndex: 1,
      shapeType,
      ...DEFAULT_SHAPE_ELEMENT,
      fillColor: color || DEFAULT_SHAPE_ELEMENT.fillColor,
    };
    actions.addElement(newShapeElement);
  };

  return (
    <div className="left-panel">
      <div className="panel-header">
        <div className="panel-header-top">
          <h2 className="panel-title">Shapes</h2>
          <button className="panel-close-btn" onClick={onClose}>×</button>
        </div>
        <p className="panel-subtitle">Add shapes to your slide</p>
      </div>

      <div className="panel-content">
        <div className="panel-section">
          <div className="panel-section-title">Basic Shapes</div>
          <div className="panel-grid">
            {shapes.map((shape) => (
              <button
                key={shape.type}
                className="panel-grid-item"
                style={{ height: 40, fontSize: 16 }}
                onClick={() => handleAddShape(shape.type)}
                title={shape.label}
              >
                {shape.icon}
              </button>
            ))}
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Quick Colors</div>
          <div className="panel-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {colors.map((color) => (
              <button
                key={color}
                className="panel-grid-item"
                style={{
                  backgroundColor: color,
                  border: color === '#ffffff' ? '1px solid var(--border-color, #3d3d5c)' : 'none',
                }}
                onClick={() => handleAddShape('rectangle', color)}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShapesPanel;
