import { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import type { ImageElement } from '../../types/presentation';

function ImagesPanel() {
  const { actions } = usePresentation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const newImageElement: ImageElement = {
        id: uuidv4(),
        type: 'image',
        position: { x: 20, y: 20, width: 40, height: 40 },
        zIndex: 1,
        src: base64,
        alt: file.name,
      };
      actions.addElement(newImageElement);
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddPlaceholder = () => {
    const newImageElement: ImageElement = {
      id: uuidv4(),
      type: 'image',
      position: { x: 20, y: 20, width: 40, height: 40 },
      zIndex: 1,
      src: 'https://via.placeholder.com/400x300/6366f1/ffffff?text=Image',
      alt: 'Placeholder image',
    };
    actions.addElement(newImageElement);
  };

  return (
    <div className="left-panel">
      <div className="panel-header">
        <h2 className="panel-title">Images</h2>
        <p className="panel-subtitle">Add images to your slide</p>
      </div>

      <div className="panel-content">
        <div className="panel-section">
          <button
            className="panel-add-btn"
            onClick={() => fileInputRef.current?.click()}
            style={{ marginBottom: 12 }}
          >
            <span className="plus-icon">📁</span>
            Upload Image
          </button>

          <button className="panel-add-btn" onClick={handleAddPlaceholder}>
            <span className="plus-icon">🖼</span>
            Add Placeholder
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Tips</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted, #a0a0b0)', lineHeight: 1.5 }}>
            <p>• Supported formats: PNG, JPG, GIF, SVG</p>
            <p>• Click on an image to replace it</p>
            <p>• Drag corners to resize</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImagesPanel;
