import { useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';

const backgroundColors = [
  '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
  '#1e1e1e', '#1a1a2e', '#0f172a', '#18181b',
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#3b82f6',
];

function SlideSettings() {
  const { state, actions } = usePresentation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!state.presentation) return null;

  const currentSlide = state.presentation.slides[state.currentSlideIndex];

  const handleBackgroundColor = (color: string) => {
    if (currentSlide) {
      actions.updateSlide({ ...currentSlide, background: color });
    }
  };

  const handleBackgroundImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentSlide) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      actions.updateSlide({ ...currentSlide, background: base64 });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeBackgroundImage = () => {
    if (currentSlide) {
      actions.updateSlide({ ...currentSlide, background: '#ffffff' });
    }
  };

  const hasBackgroundImage = currentSlide?.background && !currentSlide.background.startsWith('#');

  return (
    <>
      <div className="settings-header">
        <span className="settings-title">
          <span className="settings-icon">⬜</span>
          Slide Settings
        </span>
      </div>

      <div className="settings-content">
        {/* Background Color */}
        <div className="settings-section">
          <div className="settings-section-title">Background Color</div>
          <div className="settings-color-palette">
            {backgroundColors.map((color) => (
              <button
                key={color}
                className={`settings-color-swatch ${currentSlide?.background === color ? 'active' : ''}`}
                style={{
                  backgroundColor: color,
                  border: color === '#ffffff' ? '1px solid #3d3d5c' : 'none',
                }}
                onClick={() => handleBackgroundColor(color)}
              />
            ))}
          </div>

          <div className="settings-row" style={{ marginTop: 12 }}>
            <span className="settings-label">Custom</span>
            <input
              type="color"
              className="settings-color-input"
              value={currentSlide?.background?.startsWith('#') ? currentSlide.background : '#ffffff'}
              onChange={(e) => handleBackgroundColor(e.target.value)}
            />
          </div>
        </div>

        {/* Background Image */}
        <div className="settings-section">
          <div className="settings-section-title">Background Image</div>

          <button
            className="panel-add-btn"
            onClick={() => fileInputRef.current?.click()}
            style={{ marginBottom: 8 }}
          >
            Upload Image
          </button>

          {hasBackgroundImage && (
            <button
              className="panel-add-btn"
              onClick={removeBackgroundImage}
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
              Remove Image
            </button>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleBackgroundImage}
            style={{ display: 'none' }}
          />
        </div>

        {/* Slide Info */}
        <div className="settings-section">
          <div className="settings-section-title">Slide Info</div>
          <p style={{ fontSize: 12, color: '#a0a0b0' }}>
            Slide {state.currentSlideIndex + 1} of {state.presentation.slides.length}
          </p>
          <p style={{ fontSize: 12, color: '#a0a0b0', marginTop: 4 }}>
            Elements: {currentSlide?.elements.length || 0}
          </p>
        </div>

        {/* Actions */}
        <div className="settings-section">
          <div className="settings-section-title">Actions</div>
          <button
            className="panel-add-btn"
            onClick={() => actions.addSlide()}
            style={{ marginBottom: 8 }}
          >
            + New Slide
          </button>
          {state.presentation.slides.length > 1 && (
            <button
              className="panel-add-btn"
              onClick={() => actions.deleteSlide(currentSlide.id)}
              style={{ borderColor: '#ef4444', color: '#ef4444' }}
            >
              Delete Slide
            </button>
          )}
        </div>

        {/* Hint */}
        <div className="settings-section">
          <p style={{ fontSize: 12, color: '#a0a0b0', fontStyle: 'italic' }}>
            Select an element to edit its properties
          </p>
        </div>
      </div>
    </>
  );
}

export default SlideSettings;
