import { useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import './SlideSorter.css';

function SlideSorter() {
  const { state, actions } = usePresentation();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!state.presentation) return null;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="slide-sorter">
      <div className="slide-sorter-label">
        <span className="slide-sorter-dot" />
        SLIDE SORTER
      </div>

      <button className="slide-sorter-nav left" onClick={scrollLeft}>
        ‹
      </button>

      <div className="slide-sorter-scroll" ref={scrollRef}>
        <div className="slide-sorter-track">
          {state.presentation.slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide-sorter-item ${index === state.currentSlideIndex ? 'active' : ''}`}
              onClick={() => actions.setCurrentSlide(index)}
            >
              <div
                className="slide-sorter-thumbnail"
                style={{
                  backgroundColor: slide.background?.startsWith('#') ? slide.background : '#fff',
                  backgroundImage: slide.background && !slide.background.startsWith('#')
                    ? `url(${slide.background})`
                    : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {slide.elements.length === 0 && (
                  <span className="slide-sorter-empty">Empty</span>
                )}
                {slide.elements.length > 0 && (
                  <span className="slide-sorter-count">{slide.elements.length}</span>
                )}
              </div>
              <span className="slide-sorter-number">{index + 1}</span>
            </div>
          ))}

          <button className="slide-sorter-add" onClick={() => actions.addSlide()}>
            <span>+</span>
            <span className="add-label">New</span>
          </button>
        </div>
      </div>

      <button className="slide-sorter-nav right" onClick={scrollRight}>
        ›
      </button>
    </div>
  );
}

export default SlideSorter;
