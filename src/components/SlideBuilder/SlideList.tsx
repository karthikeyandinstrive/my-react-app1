import { usePresentation } from '../../context/PresentationContext';
import './SlideList.css';

function SlideList() {
  const { state, actions } = usePresentation();

  if (!state.presentation) return null;

  const moveSlideUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === 0) return;

    const slides = [...state.presentation!.slides];
    [slides[index - 1], slides[index]] = [slides[index], slides[index - 1]];

    // Update order property
    const reorderedSlides = slides.map((slide, idx) => ({ ...slide, order: idx }));
    actions.reorderSlides(reorderedSlides);

    // Update current slide index
    if (state.currentSlideIndex === index) {
      actions.setCurrentSlide(index - 1);
    } else if (state.currentSlideIndex === index - 1) {
      actions.setCurrentSlide(index);
    }
  };

  const moveSlideDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (index === state.presentation!.slides.length - 1) return;

    const slides = [...state.presentation!.slides];
    [slides[index], slides[index + 1]] = [slides[index + 1], slides[index]];

    // Update order property
    const reorderedSlides = slides.map((slide, idx) => ({ ...slide, order: idx }));
    actions.reorderSlides(reorderedSlides);

    // Update current slide index
    if (state.currentSlideIndex === index) {
      actions.setCurrentSlide(index + 1);
    } else if (state.currentSlideIndex === index + 1) {
      actions.setCurrentSlide(index);
    }
  };

  return (
    <div className="slide-list">
      <h3 className="slide-list-title">Slides</h3>
      <div className="slide-list-items">
        {state.presentation.slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide-list-item ${index === state.currentSlideIndex ? 'active' : ''}`}
          >
            <div className="slide-list-header">
              <div className="slide-list-number">{index + 1}</div>
              <div className="slide-reorder-buttons">
                <button
                  onClick={(e) => moveSlideUp(index, e)}
                  disabled={index === 0}
                  className="slide-reorder-btn"
                  title="Move slide up"
                >
                  ↑
                </button>
                <button
                  onClick={(e) => moveSlideDown(index, e)}
                  disabled={index === state.presentation.slides.length - 1}
                  className="slide-reorder-btn"
                  title="Move slide down"
                >
                  ↓
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); actions.duplicateSlide(slide.id); }}
                  className="slide-reorder-btn"
                  title="Duplicate slide"
                >
                  📋
                </button>
              </div>
            </div>
            <div
              className="slide-list-thumbnail"
              style={{
                background: slide.background?.startsWith('#') || !slide.background
                  ? slide.background || '#fff'
                  : '#fff',
                backgroundImage: slide.background && !slide.background.startsWith('#')
                  ? `url(${slide.background})`
                  : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              onClick={() => actions.setCurrentSlide(index)}
            >
              {slide.elements.length === 0 ? (
                <span className="slide-list-empty">Empty</span>
              ) : (
                <span className="slide-list-count">{slide.elements.length} elements</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SlideList;
