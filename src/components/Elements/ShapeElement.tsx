import { usePresentation } from '../../context/PresentationContext';
import ElementWrapper from './ElementWrapper';
import type { ShapeElement as ShapeElementType } from '../../types/presentation';
import './ShapeElement.css';

interface ShapeElementProps {
  element: ShapeElementType;
  isSelected: boolean;
  onContextMenu?: (e: React.MouseEvent) => void;
}

function ShapeElement({ element, isSelected, onContextMenu }: ShapeElementProps) {
  const { actions: _actions } = usePresentation();

  const renderShape = () => {
    const commonStyle = {
      width: '100%',
      height: '100%',
    };

    switch (element.shapeType) {
      case 'circle':
        return (
          <div
            className="shape-circle"
            style={{
              ...commonStyle,
              backgroundColor: element.fillColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
            }}
          />
        );

      case 'line':
        return (
          <div
            className="shape-line"
            style={{
              ...commonStyle,
              backgroundColor: element.borderColor,
              height: `${element.borderWidth}px`,
            }}
          />
        );

      case 'rectangle':
      default:
        return (
          <div
            className="shape-rectangle"
            style={{
              ...commonStyle,
              backgroundColor: element.fillColor,
              border: `${element.borderWidth}px solid ${element.borderColor}`,
            }}
          />
        );
    }
  };

  return (
    <ElementWrapper element={element} isSelected={isSelected} onContextMenu={onContextMenu}>
      <div className="shape-element">{renderShape()}</div>
    </ElementWrapper>
  );
}

export default ShapeElement;
