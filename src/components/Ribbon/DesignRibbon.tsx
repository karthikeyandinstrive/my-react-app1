import { useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import './Ribbon.css';

const THEMES = [
  { id: 'professional', name: 'Professional', colors: { primary: '#0078d4', secondary: '#2b88d8', background: '#ffffff' } },
  { id: 'modern', name: 'Modern', colors: { primary: '#6264a7', secondary: '#8b8cc7', background: '#f5f5f5' } },
  { id: 'elegant', name: 'Elegant', colors: { primary: '#8764b8', secondary: '#a584c7', background: '#fafafa' } },
  { id: 'bold', name: 'Bold', colors: { primary: '#e81123', secondary: '#f1414c', background: '#ffffff' } },
  { id: 'nature', name: 'Nature', colors: { primary: '#107c10', secondary: '#30a130', background: '#f3f9f3' } },
];

const BACKGROUND_STYLES = [
  { id: 'white', name: 'White', value: '#ffffff' },
  { id: 'light-gray', name: 'Light Gray', value: '#f5f5f5' },
  { id: 'blue', name: 'Blue', value: '#0078d4' },
  { id: 'dark-blue', name: 'Dark Blue', value: '#1a3d5c' },
  { id: 'green', name: 'Green', value: '#107c10' },
  { id: 'purple', name: 'Purple', value: '#6264a7' },
];

function DesignRibbon() {
  const { state, actions } = usePresentation();
  const backgroundFileInputRef = useRef<HTMLInputElement>(null);

  const currentSlide = state.presentation?.slides[state.currentSlideIndex];

  const applyBackgroundToAll = (background: string) => {
    if (!state.presentation) return;
    state.presentation.slides.forEach(slide => {
      actions.updateSlide({ ...slide, background });
    });
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSlide) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      applyBackgroundToAll(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="ribbon">
      <div className="ribbon-group">
        <div className="ribbon-group-label">Themes</div>
        <div className="ribbon-buttons">
          {THEMES.slice(0, 4).map(theme => (
            <button
              key={theme.id}
              className="ribbon-btn ribbon-btn-theme"
              onClick={() => applyBackgroundToAll(theme.colors.background)}
              title={theme.name}
            >
              <div className="theme-preview" style={{ background: theme.colors.primary }}>
                <div className="theme-preview-bar" style={{ background: theme.colors.secondary }}></div>
              </div>
              <span>{theme.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ribbon-separator"></div>

      <div className="ribbon-group">
        <div className="ribbon-group-label">Background</div>
        <div className="ribbon-buttons ribbon-buttons-wrap">
          {BACKGROUND_STYLES.map(style => (
            <button
              key={style.id}
              className="ribbon-btn ribbon-btn-color"
              onClick={() => applyBackgroundToAll(style.value)}
              title={style.name}
            >
              <div className="color-preview" style={{ background: style.value, border: style.value === '#ffffff' ? '1px solid #666' : 'none' }}></div>
            </button>
          ))}
          <button
            className="ribbon-btn ribbon-btn-small"
            onClick={() => backgroundFileInputRef.current?.click()}
          >
            Upload Image
          </button>
          <input
            ref={backgroundFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBackgroundImageUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <div className="ribbon-separator"></div>

      <div className="ribbon-group">
        <div className="ribbon-group-label">Customize</div>
        <div className="ribbon-buttons">
          <button className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">🎨</div>
            <span>Colors</span>
          </button>
          <button className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">Aa</div>
            <span>Fonts</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DesignRibbon;
