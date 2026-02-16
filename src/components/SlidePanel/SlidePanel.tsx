import { usePresentation } from '../../context/PresentationContext';
import './SlidePanel.css';

function SlidePanel() {
  const { state, actions } = usePresentation();

  if (!state.presentation) return null;

  const moveSlideUp = (index: number) => {
    if (index === 0) return;
    const slides = [...state.presentation!.slides];
    [slides[index - 1], slides[index]] = [slides[index], slides[index - 1]];
    // Update order property
    slides.forEach((slide, idx) => {
      slide.order = idx;
    });
    actions.reorderSlides(slides);
    // Move selection with the slide
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
    // Update order property
    slides.forEach((slide, idx) => {
      slide.order = idx;
    });
    actions.reorderSlides(slides);
    // Move selection with the slide
    if (state.currentSlideIndex === index) {
      actions.setCurrentSlide(index + 1);
    } else if (state.currentSlideIndex === index + 1) {
      actions.setCurrentSlide(index);
    }
  };

  const handleDeleteSlide = (slideId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.presentation!.slides.length <= 1) {
      alert('Cannot delete the last slide');
      return;
    }
    actions.deleteSlide(slideId);
  };

  const handleDuplicateSlide = (slideId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    actions.duplicateSlide(slideId);
  };

  return (
    <div className="slide-panel">
      <div className="slide-panel-header">
        <span>Slides</span>
        <button className="slide-panel-add-btn" onClick={() => actions.addSlide()} title="Add Slide">
          +
        </button>
      </div>

      <div className="slide-panel-list">
        {state.presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-panel-item ${index === state.currentSlideIndex ? 'active' : ''}`}
            onClick={() => actions.setCurrentSlide(index)}
          >
            <div
              className="slide-panel-thumbnail"
              style={{
                backgroundColor: slide.background?.startsWith('#') ? slide.background : '#fff',
                backgroundImage: slide.background && !slide.background.startsWith('#')
                  ? `url(${slide.background})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <span className="slide-panel-number">{index + 1}</span>
              {slide.elements.length > 0 && (
                <span className="slide-panel-element-count">{slide.elements.length}</span>
              )}
            </div>

            <div className="slide-panel-actions">
              <button
                className="slide-action-btn"
                onClick={(e) => { e.stopPropagation(); moveSlideUp(index); }}
                disabled={index === 0}
                title="Move Up"
              >
                ▲
              </button>
              <button
                className="slide-action-btn"
                onClick={(e) => { e.stopPropagation(); moveSlideDown(index); }}
                disabled={index === state.presentation!.slides.length - 1}
                title="Move Down"
              >
                ▼
              </button>
              <button
                className="slide-action-btn"
                onClick={(e) => handleDuplicateSlide(slide.id, e)}
                title="Duplicate"
              >
                ⧉
              </button>
              <button
                className="slide-action-btn delete"
                onClick={(e) => handleDeleteSlide(slide.id, e)}
                disabled={state.presentation!.slides.length <= 1}
                title="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="slide-panel-footer">
        <button className="slide-panel-new-btn" onClick={() => actions.addSlide()}>
          + New Slide
        </button>
      </div>
    </div>
  );
}

export default SlidePanel;
