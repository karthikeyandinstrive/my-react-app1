import { useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import ElementWrapper from './ElementWrapper';
import type { ImageElement as ImageElementType } from '../../types/presentation';
import './ImageElement.css';

interface ImageElementProps {
  element: ImageElementType;
  isSelected: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
}

function ImageElement({ element, isSelected, onContextMenu }: ImageElementProps) {
  const { actions } = usePresentation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      actions.updateElement({
        ...element,
        src: base64,
        alt: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <ElementWrapper element={element} isSelected={isSelected} onContextMenu={onContextMenu}>
      <div className="image-element">
        <img src={element.src} alt={element.alt} className="image-element-img" />

        {isSelected && (
          <div className="image-element-overlay">
            <button onClick={handleUploadClick} className="image-upload-btn">
              Change Image
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        )}
      </div>
    </ElementWrapper>
  );
}

export default ImageElement;
