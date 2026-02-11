import { useState, useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import SlidePreview from './SlidePreview';
import './PreviewModal.css';

function PreviewModal() {
  const { state, actions } = usePresentation();
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        actions.togglePreview();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPreviewIndex, state.presentation]);

  if (!state.presentation) return null;

  const handlePrevious = () => {
    setCurrentPreviewIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPreviewIndex(prev => Math.min(state.presentation!.slides.length - 1, prev + 1));
  };

  const currentSlide = state.presentation.slides[currentPreviewIndex];

  return (
    <div className="preview-modal-overlay" onClick={actions.togglePreview}>
      <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preview-header">
          <h2 className="preview-title">{state.presentation.title}</h2>
          <button className="preview-close-btn" onClick={actions.togglePreview}>
            ×
          </button>
        </div>

        <div className="preview-content">
          <button
            className="preview-nav-btn preview-prev"
            onClick={handlePrevious}
            disabled={currentPreviewIndex === 0}
          >
            ‹
          </button>

          <div className="preview-slide-container">
            {currentSlide && <SlidePreview slide={currentSlide} />}
          </div>

          <button
            className="preview-nav-btn preview-next"
            onClick={handleNext}
            disabled={currentPreviewIndex === state.presentation.slides.length - 1}
          >
            ›
          </button>
        </div>

        <div className="preview-footer">
          <span className="preview-counter">
            {currentPreviewIndex + 1} / {state.presentation.slides.length}
          </span>
          <div className="preview-controls">
            <button onClick={handlePrevious} disabled={currentPreviewIndex === 0}>
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentPreviewIndex === state.presentation.slides.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewModal;
