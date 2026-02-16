import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import { DEFAULT_TEXT_ELEMENT } from '../../utils/constants';
import type { TextElement } from '../../types/presentation';

const textStyles = [
  { name: 'Title', font: 'Inter', size: 48, weight: 700 },
  { name: 'Subtitle', font: 'Inter', size: 32, weight: 500 },
  { name: 'Heading Large', font: 'Inter', size: 36, weight: 600 },
  { name: 'Heading Medium', font: 'Inter', size: 28, weight: 600 },
  { name: 'Heading Small', font: 'Inter', size: 24, weight: 500 },
  { name: 'Body Text', font: 'Inter', size: 20, weight: 400 },
  { name: 'Quote', font: 'Inter', size: 24, weight: 400, italic: true },
  { name: 'Caption', font: 'Inter', size: 16, weight: 400 },
];

function TextPanel() {
  const { actions } = usePresentation();

  const handleAddTextBox = (style?: typeof textStyles[0]) => {
    const newTextElement: TextElement = {
      id: uuidv4(),
      type: 'text',
      position: { x: 10, y: 10, width: 40, height: 15 },
      zIndex: 1,
      content: style ? style.name : 'Double-click to edit',
      ...DEFAULT_TEXT_ELEMENT,
      fontSize: style?.size || 18,
      fontFamily: style?.font || 'Arial',
      bold: (style?.weight || 400) >= 600,
      italic: style?.italic || false,
    };
    actions.addElement(newTextElement);
  };

  return (
    <div className="left-panel">
      <div className="panel-header">
        <h2 className="panel-title">Text</h2>
        <p className="panel-subtitle">Add text elements to your slide</p>
      </div>

      <div className="panel-content">
        <button className="panel-add-btn" onClick={() => handleAddTextBox()}>
          <span className="plus-icon">+</span>
          Add Text Box
        </button>

        <div className="panel-section" style={{ marginTop: 20 }}>
          <div className="panel-section-title">Font Theme</div>
          <div className="panel-dropdown">
            <span>Modern Clean <span style={{ color: '#6b7280', fontSize: 11 }}>(Minimal)</span></span>
            <span className="panel-dropdown-arrow">▼</span>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Text Styles</div>
          {textStyles.map((style) => (
            <div
              key={style.name}
              className="style-card"
              onClick={() => handleAddTextBox(style)}
            >
              <p
                className="style-card-title"
                style={{
                  fontSize: Math.min(style.size * 0.5, 20),
                  fontWeight: style.weight,
                  fontStyle: style.italic ? 'italic' : 'normal',
                  color: style.name === 'Quote' ? '#6366f1' : undefined,
                }}
              >
                {style.name}
              </p>
              <div className="style-card-meta">
                <span><span className="dot" /> {style.font}</span>
                <span>• {style.size}px</span>
                <span>• {style.weight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TextPanel;
