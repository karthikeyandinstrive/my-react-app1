import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePresentation } from '../../context/PresentationContext';
import SlidePreviewMini from '../SlidePreview/SlidePreviewMini';
import './SlidePanel.css';

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  slideId: string;
  slideIndex: number;
}

function SlidePanel() {
  const { state, actions } = usePresentation();
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    slideId: '',
    slideIndex: 0,
  });

  // Close context menu on click outside or scroll
  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    const handleScroll = () => setContextMenu(prev => ({ ...prev, visible: false }));

    if (contextMenu.visible) {
      document.addEventListener('click', handleClick);
      document.addEventListener('scroll', handleScroll, true);
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [contextMenu.visible]);

  if (!state.presentation) return null;

  const moveSlideUp = (index: number) => {
    if (index === 0) return;
    const slides = [...state.presentation!.slides];
    [slides[index - 1], slides[index]] = [slides[index], slides[index - 1]];
    slides.forEach((slide, idx) => {
      slide.order = idx;
    });
    actions.reorderSlides(slides);
    if (state.currentSlideIndex === index) {
      actions.setCurrentSlide(index - 1);
    } else if (state.currentSlideIndex === index - 1) {
      actions.setCurrentSlide(index);
    }
  };

  const moveSlideDown = (index: number) => {
    if (index === state.presentation!.slides.length - 1) return;
    const slides = [...state.presentation!.slides];
    [slides[index], slides[index + 1]] = [slides[index + 1], slides[index]];
    slides.forEach((slide, idx) => {
      slide.order = idx;
    });
    actions.reorderSlides(slides);
    if (state.currentSlideIndex === index) {
      actions.setCurrentSlide(index + 1);
    } else if (state.currentSlideIndex === index + 1) {
      actions.setCurrentSlide(index);
    }
  };

  const handleDeleteSlide = (slideId: string) => {
    if (state.presentation!.slides.length <= 1) {
      alert('Cannot delete the last slide');
      return;
    }
    actions.deleteSlide(slideId);
  };

  const handleDuplicateSlide = (slideId: string) => {
    actions.duplicateSlide(slideId);
  };

  const handleContextMenu = (e: React.MouseEvent, slideId: string, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      slideId,
      slideIndex: index,
    });
  };

  const handleContextAction = (action: string) => {
    const { slideId, slideIndex } = contextMenu;

    switch (action) {
      case 'moveUp':
        moveSlideUp(slideIndex);
        break;
      case 'moveDown':
        moveSlideDown(slideIndex);
        break;
      case 'duplicate':
        handleDuplicateSlide(slideId);
        break;
      case 'delete':
        handleDeleteSlide(slideId);
        break;
      case 'addSlide':
        actions.addSlide();
        break;
    }
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="slide-panel">
      <div className="slide-panel-header">
        <span>Slides</span>
        {/* <button className="slide-panel-add-btn" onClick={() => actions.addSlide()}>
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button> */}
      </div>

      <div className="slide-panel-list">
        {state.presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-panel-item ${index === state.currentSlideIndex ? 'active' : ''}`}
            onClick={() => { actions.setCurrentSlide(index); actions.selectSlide(); }}
            onContextMenu={(e) => handleContextMenu(e, slide.id, index)}
          >
            <div className="slide-panel-thumbnail">
              <SlidePreviewMini slide={slide} width={130} height={73} />
              <span className="slide-panel-number">{index + 1}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="slide-panel-footer">
        <button className="slide-panel-new-btn" onClick={() => actions.addSlide()}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Slide
        </button>
      </div>

      {/* Context Menu - Rendered via Portal */}
      {contextMenu.visible && createPortal(
        <div
          className="slide-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('addSlide')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Slide
          </button>
          <div className="context-menu-divider" />
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('moveUp')}
            disabled={contextMenu.slideIndex === 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
            Move Up
          </button>
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('moveDown')}
            disabled={contextMenu.slideIndex === state.presentation!.slides.length - 1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            Move Down
          </button>
          <div className="context-menu-divider" />
          <button
            className="context-menu-item"
            onClick={() => handleContextAction('duplicate')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Duplicate Slide
          </button>
          <div className="context-menu-divider" />
          <button
            className="context-menu-item danger"
            onClick={() => handleContextAction('delete')}
            disabled={state.presentation!.slides.length <= 1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Delete Slide
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}

export default SlidePanel;
