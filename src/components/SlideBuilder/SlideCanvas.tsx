import { useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import TextElement from '../Elements/TextElement';
import ImageElement from '../Elements/ImageElement';
import ShapeElement from '../Elements/ShapeElement';
import TableElement from '../Elements/TableElement';
import ChartElement from '../Elements/ChartElement';
import './SlideCanvas.css';

function SlideCanvas() {
  const { state, actions } = usePresentation();

  if (!state.presentation) return null;

  const currentSlide = state.presentation.slides[state.currentSlideIndex];
  if (!currentSlide) return null;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      actions.selectElement(null);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && state.selectedElementId) {
      actions.deleteElement(state.selectedElementId);
    }
  };

  // Add keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElementId]);

  return (
    <div className="slide-canvas-container">
      <div
        className="slide-canvas"
        onClick={handleCanvasClick}
        style={{
          background: currentSlide.background?.startsWith('#') || !currentSlide.background
            ? currentSlide.background || '#fff'
            : '#fff',
          backgroundImage: currentSlide.background && !currentSlide.background.startsWith('#')
            ? `url(${currentSlide.background})`
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {currentSlide.elements
          .sort((a, b) => a.zIndex - b.zIndex)
          .map(element => {
            const isSelected = element.id === state.selectedElementId;

            switch (element.type) {
              case 'text':
                return (
                  <TextElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                  />
                );

              case 'image':
                return (
                  <ImageElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                  />
                );

              case 'shape':
                return (
                  <ShapeElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                  />
                );

              case 'table':
                return (
                  <TableElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                  />
                );

              case 'chart':
                return (
                  <ChartElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                  />
                );

              default:
                return null;
            }
          })}

        {currentSlide.elements.length === 0 && (
          <div className="slide-canvas-empty">
            <p>Click "Add Element" to start building your slide</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideCanvas;
