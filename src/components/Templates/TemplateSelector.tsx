import type { SlideMaster } from '../../types/presentation';
import { DEFAULT_SLIDE_MASTERS } from '../../utils/slideTemplates';
import './TemplateSelector.css';

interface TemplateSelectorProps {
  onSelect: (master: SlideMaster) => void;
  onClose: () => void;
}

function TemplateSelector({ onSelect, onClose }: TemplateSelectorProps) {
  return (
    <div className="template-selector-overlay" onClick={onClose}>
      <div className="template-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="template-selector-header">
          <h3>Choose a Slide Template</h3>
          <button className="template-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="template-selector-grid">
          {DEFAULT_SLIDE_MASTERS.map((master) => (
            <div
              key={master.id}
              className="template-card"
              onClick={() => onSelect(master)}
            >
              <div className="template-preview" style={{ background: master.background.color }}>
                {/* Render preview of template */}
                {master.objects.map((obj, idx) => {
                  if (obj.type === 'rect') {
                    const x = typeof obj.options.x === 'string' ? parseFloat(obj.options.x) : obj.options.x;
                    const y = typeof obj.options.y === 'string' ? parseFloat(obj.options.y) : obj.options.y;
                    const w = typeof obj.options.w === 'string' ? parseFloat(obj.options.w) : obj.options.w || 10;
                    const h = typeof obj.options.h === 'string' ? parseFloat(obj.options.h) : obj.options.h || 10;
                    return (
                      <div
                        key={idx}
                        className="template-preview-rect"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          width: `${w}%`,
                          height: `${h}%`,
                          background: obj.options.fill,
                        }}
                      />
                    );
                  }
                  if (obj.type === 'line') {
                    const x = typeof obj.options.x === 'string' ? parseFloat(obj.options.x) : obj.options.x;
                    const y = typeof obj.options.y === 'string' ? parseFloat(obj.options.y) : obj.options.y;
                    const h = typeof obj.options.h === 'string' ? parseFloat(obj.options.h) : obj.options.h || 1;
                    return (
                      <div
                        key={idx}
                        className="template-preview-line"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          height: `${h}%`,
                          borderLeft: `1px dashed ${obj.options.line?.color || '#ccc'}`,
                        }}
                      />
                    );
                  }
                  return null;
                })}
                {/* Render placeholders */}
                {master.placeholders.map((placeholder, idx) => (
                  <div
                    key={`ph-${idx}`}
                    className="template-preview-placeholder"
                    style={{
                      left: `${placeholder.position.x}%`,
                      top: `${placeholder.position.y}%`,
                      width: `${placeholder.position.width}%`,
                      height: `${placeholder.position.height}%`,
                    }}
                  >
                    <span
                      className="template-preview-text"
                      style={{
                        fontSize: placeholder.type === 'title' ? '8px' : '5px',
                        color: placeholder.defaultStyle?.color || '#333',
                        textAlign: placeholder.defaultStyle?.align || 'left',
                        fontWeight: placeholder.defaultStyle?.bold ? 'bold' : 'normal',
                      }}
                    >
                      {placeholder.type === 'title' ? 'Title' :
                       placeholder.type === 'subtitle' ? 'Subtitle' :
                       placeholder.type === 'body' ? 'Content' :
                       placeholder.type === 'image' ? '🖼' :
                       'Text'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="template-name">{master.displayName}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;
