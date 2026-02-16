import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePresentation } from '../../context/PresentationContext';
import TextElement from '../Elements/TextElement';
import ImageElement from '../Elements/ImageElement';
import ShapeElement from '../Elements/ShapeElement';
import TableElement from '../Elements/TableElement';
import ChartElement from '../Elements/ChartElement';
import './SlideCanvas.css';

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  elementId: string;
}

function SlideCanvas() {
  const { state, actions } = usePresentation();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    elementId: '',
  });

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    if (contextMenu.visible) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [contextMenu.visible]);

  if (!state.presentation) return null;

  const currentSlide = state.presentation.slides[state.currentSlideIndex];
  if (!currentSlide) return null;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      actions.selectElement(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    actions.selectElement(elementId);
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      elementId,
    });
  };

  const handleContextAction = (action: string) => {
    const { elementId } = contextMenu;
    switch (action) {
      case 'forward':
        actions.moveElementForward(elementId);
        break;
      case 'backward':
        actions.moveElementBackward(elementId);
        break;
      case 'copy':
        actions.copyElement(elementId);
        break;
      case 'paste':
        actions.pasteElement();
        break;
      case 'delete':
        actions.deleteElement(elementId);
        break;
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Don't handle shortcuts when typing in input fields
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? e.metaKey : e.ctrlKey;

    // Delete element
    if (e.key === 'Delete' && state.selectedElementId) {
      actions.deleteElement(state.selectedElementId);
    }

    // Copy element (Ctrl+C / Cmd+C)
    if (modifierKey && e.key === 'c' && state.selectedElementId) {
      e.preventDefault();
      actions.copyElement(state.selectedElementId);
    }

    // Paste element (Ctrl+V / Cmd+V)
    if (modifierKey && e.key === 'v' && state.copiedElement) {
      e.preventDefault();
      actions.pasteElement();
    }
  };

  // Add keyboard listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElementId, state.copiedElement]);

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

            const handleElementContextMenu = (e: React.MouseEvent) => handleContextMenu(e, element.id);

            switch (element.type) {
              case 'text':
                return (
                  <TextElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    onContextMenu={handleElementContextMenu}
                  />
                );
              case 'image':
                return (
                  <ImageElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    onContextMenu={handleElementContextMenu}
                  />
                );
              case 'shape':
                return (
                  <ShapeElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    onContextMenu={handleElementContextMenu}
                  />
                );
              case 'table':
                return (
                  <TableElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    onContextMenu={handleElementContextMenu}
                  />
                );
              case 'chart':
                return (
                  <ChartElement
                    key={element.id}
                    element={element}
                    isSelected={isSelected}
                    onContextMenu={handleElementContextMenu}
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

      {/* Element Context Menu */}
      {contextMenu.visible && createPortal(
        <div
          className="element-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('forward')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            Bring Forward
          </button>
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('backward')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Send Backward
          </button>
          <div className="context-menu-divider" />
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('copy')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </button>
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('paste')}
            disabled={!state.copiedElement}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            Paste
          </button>
          <div className="context-menu-divider" />
          <button
            className="context-menu-item danger"
            onClick={() => handleContextAction('delete')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

export default SlideCanvas;
