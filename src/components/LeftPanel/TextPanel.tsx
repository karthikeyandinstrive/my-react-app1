import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import type { TextElement } from '../../types/presentation';
import { DEFAULT_TEXT_ELEMENT } from '../../utils/constants';
import { fontThemes, getDefaultTheme, getTextStylesFromTheme, type FontTheme } from '../../utils/fontThemes';

function TextPanel() {
  const { actions } = usePresentation();
  const [selectedTheme, setSelectedTheme] = useState<FontTheme>(getDefaultTheme());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get text styles from selected theme
  const textStyles = getTextStylesFromTheme(selectedTheme);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSelectTheme = (theme: FontTheme) => {
    setSelectedTheme(theme);
    setIsDropdownOpen(false);
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

        <div className="panel-section" style={{ marginTop: 20, marginRight:25 }}>
          <div className="panel-section-title">Font Theme</div>
          <div className="panel-dropdown-container" ref={dropdownRef}>
            <div
              className={`panel-dropdown ${isDropdownOpen ? 'active' : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedTheme.name}{' '}
                <span style={{ color: '#6b7280', fontSize: 11 }}>({selectedTheme.category})</span>
              </span>
              <span className={`panel-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isDropdownOpen && (
              <div className="panel-dropdown-menu">
                {fontThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className={`panel-dropdown-item ${selectedTheme.id === theme.id ? 'active' : ''}`}
                    onClick={() => handleSelectTheme(theme)}
                  >
                    <div className="dropdown-item-content">
                      <span className="dropdown-item-name">{theme.name}</span>
                      <span className="dropdown-item-category">{theme.category}</span>
                    </div>
                    <div className="dropdown-item-preview">
                      <span style={{ fontFamily: theme.fonts.heading, fontWeight: 600, fontSize: 11 }}>
                        Aa
                      </span>
                      <span style={{ fontFamily: theme.fonts.body, fontSize: 10, color: '#9ca3af' }}>
                        {theme.fonts.heading === theme.fonts.body ? '' : ` / ${theme.fonts.body}`}
                      </span>
                    </div>
                    {selectedTheme.id === theme.id && (
                      <span className="dropdown-item-check">✓</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="theme-description">{selectedTheme.description}</p>
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
                  fontFamily: style.font,
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
