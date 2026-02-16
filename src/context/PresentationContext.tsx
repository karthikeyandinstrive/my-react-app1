import { createContext, useContext, useReducer, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { PresentationState, Presentation, Slide, SlideElement } from '../types/presentation';
import { apiService } from '../services/api';
import { DEFAULT_SLIDE_WIDTH, DEFAULT_SLIDE_HEIGHT, DEFAULT_SLIDE_BACKGROUND } from '../utils/constants';
import { TRACKED_ACTIONS } from '../types/history';

type Action =
  | { type: 'SET_PRESENTATION'; payload: Presentation }
  | { type: 'CREATE_NEW_PRESENTATION'; payload: string }
  | { type: 'CREATE_PRESENTATION_WITH_SLIDES'; payload: { title: string; slides: Slide[] } }
  | { type: 'ADD_SLIDE' }
  | { type: 'ADD_SLIDE_WITH_TEMPLATE'; payload: { elements: SlideElement[]; background: string; masterName: string } }
  | { type: 'DUPLICATE_SLIDE'; payload: string }
  | { type: 'DELETE_SLIDE'; payload: string }
  | { type: 'UPDATE_SLIDE'; payload: Slide }
  | { type: 'REORDER_SLIDES'; payload: Slide[] }
  | { type: 'SET_CURRENT_SLIDE'; payload: number }
  | { type: 'ADD_ELEMENT'; payload: SlideElement }
  | { type: 'UPDATE_ELEMENT'; payload: SlideElement }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'MOVE_ELEMENT_FORWARD'; payload: string }
  | { type: 'MOVE_ELEMENT_BACKWARD'; payload: string }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'COPY_ELEMENT'; payload: string }
  | { type: 'PASTE_ELEMENT' }
  | { type: 'SET_PREVIEW_MODE'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: string }
  | { type: 'RESTORE_FROM_HISTORY'; payload: { presentation: Presentation; currentSlideIndex: number; selectedElementId: string | null } };

// Type for history recording callback
type HistoryRecorder = (
  actionType: string,
  presentation: Presentation | null,
  currentSlideIndex: number,
  selectedElementId: string | null,
  payload?: unknown
) => void;

interface PresentationContextType {
  state: PresentationState;
  dispatch: React.Dispatch<Action>;
  actions: {
    createNewPresentation: (title: string) => void;
    createPresentationWithSlides: (title: string, slides: Slide[]) => void;
    addSlide: () => void;
    addSlideWithTemplate: (elements: SlideElement[], background: string, masterName: string) => void;
    duplicateSlide: (id: string) => void;
    deleteSlide: (id: string) => void;
    updateSlide: (slide: Slide) => void;
    reorderSlides: (slides: Slide[]) => void;
    setCurrentSlide: (index: number) => void;
    addElement: (element: SlideElement) => void;
    updateElement: (element: SlideElement) => void;
    updateElementSilent: (element: SlideElement) => void; // Update without recording history (for dragging)
    commitElementUpdate: (element: SlideElement) => void; // Commit final position to history
    deleteElement: (id: string) => void;
    moveElementForward: (id: string) => void;
    moveElementBackward: (id: string) => void;
    selectElement: (id: string | null) => void;
    copyElement: (id: string) => void;
    pasteElement: () => void;
    togglePreview: () => void;
    loadPresentation: (presentation: Presentation) => void;
    savePresentation: () => Promise<void>;
    restoreFromHistory: (presentation: Presentation, currentSlideIndex: number, selectedElementId: string | null) => void;
  };
  setHistoryRecorder: (recorder: HistoryRecorder | null) => void;
}

const PresentationContext = createContext<PresentationContextType | undefined>(undefined);

const initialState: PresentationState = {
  presentation: null,
  currentSlideIndex: 0,
  selectedElementId: null,
  isPreviewMode: false,
  isSaving: false,
  lastSaved: null,
  copiedElement: null,
};

function presentationReducer(state: PresentationState, action: Action): PresentationState {
  switch (action.type) {
    case 'SET_PRESENTATION':
      return {
        ...state,
        presentation: action.payload,
        currentSlideIndex: 0,
        selectedElementId: null,
      };

    case 'CREATE_NEW_PRESENTATION':
      const newSlide: Slide = {
        id: uuidv4(),
        order: 0,
        elements: [],
        background: DEFAULT_SLIDE_BACKGROUND,
      };

      const newPresentation: Presentation = {
        id: '',
        title: action.payload,
        slides: [newSlide],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          slideWidth: DEFAULT_SLIDE_WIDTH,
          slideHeight: DEFAULT_SLIDE_HEIGHT,
        },
      };

      return {
        ...state,
        presentation: newPresentation,
        currentSlideIndex: 0,
      };

    case 'CREATE_PRESENTATION_WITH_SLIDES': {
      const { title, slides } = action.payload;

      const presentation: Presentation = {
        id: '',
        title,
        slides,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          slideWidth: DEFAULT_SLIDE_WIDTH,
          slideHeight: DEFAULT_SLIDE_HEIGHT,
        },
      };

      return {
        ...state,
        presentation,
        currentSlideIndex: 0,
        selectedElementId: null,
      };
    }

    case 'ADD_SLIDE': {
      if (!state.presentation) return state;

      const newSlide: Slide = {
        id: uuidv4(),
        order: state.presentation.slides.length,
        elements: [],
        background: DEFAULT_SLIDE_BACKGROUND,
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: [...state.presentation.slides, newSlide],
          updatedAt: new Date().toISOString(),
        },
        currentSlideIndex: state.presentation.slides.length,
      };
    }

    case 'ADD_SLIDE_WITH_TEMPLATE': {
      if (!state.presentation) return state;

      const { elements, background, masterName } = action.payload;
      const newSlide: Slide = {
        id: uuidv4(),
        order: state.presentation.slides.length,
        elements: elements,
        background: background,
        masterName: masterName,
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: [...state.presentation.slides, newSlide],
          updatedAt: new Date().toISOString(),
        },
        currentSlideIndex: state.presentation.slides.length,
      };
    }

    case 'DUPLICATE_SLIDE': {
      if (!state.presentation) return state;

      const slideIndex = state.presentation.slides.findIndex(s => s.id === action.payload);
      if (slideIndex === -1) return state;

      const slideToDuplicate = state.presentation.slides[slideIndex];

      // Deep clone the slide with new IDs for all elements
      const duplicatedSlide: Slide = {
        id: uuidv4(),
        order: slideIndex + 1,
        background: slideToDuplicate.background,
        elements: slideToDuplicate.elements.map(el => ({
          ...el,
          id: uuidv4(),
        })),
      };

      // Insert duplicated slide after the original
      const newSlides = [
        ...state.presentation.slides.slice(0, slideIndex + 1),
        duplicatedSlide,
        ...state.presentation.slides.slice(slideIndex + 1),
      ].map((slide, index) => ({ ...slide, order: index }));

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: newSlides,
          updatedAt: new Date().toISOString(),
        },
        currentSlideIndex: slideIndex + 1,
      };
    }

    case 'DELETE_SLIDE': {
      if (!state.presentation) return state;

      const filteredSlides = state.presentation.slides
        .filter(slide => slide.id !== action.payload)
        .map((slide, index) => ({ ...slide, order: index }));

      if (filteredSlides.length === 0) return state;

      const newIndex = Math.min(state.currentSlideIndex, filteredSlides.length - 1);

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: filteredSlides,
          updatedAt: new Date().toISOString(),
        },
        currentSlideIndex: newIndex,
        selectedElementId: null,
      };
    }

    case 'UPDATE_SLIDE': {
      if (!state.presentation) return state;

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(slide =>
            slide.id === action.payload.id ? action.payload : slide
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'REORDER_SLIDES': {
      if (!state.presentation) return state;

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: action.payload,
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'SET_CURRENT_SLIDE':
      return {
        ...state,
        currentSlideIndex: action.payload,
        selectedElementId: null,
      };

    case 'ADD_ELEMENT': {
      if (!state.presentation) return state;

      const currentSlide = state.presentation.slides[state.currentSlideIndex];
      if (!currentSlide) return state;

      const updatedSlide: Slide = {
        ...currentSlide,
        elements: [...currentSlide.elements, action.payload],
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(slide =>
            slide.id === currentSlide.id ? updatedSlide : slide
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedElementId: action.payload.id,
      };
    }

    case 'UPDATE_ELEMENT': {
      if (!state.presentation) return state;

      const currentSlide = state.presentation.slides[state.currentSlideIndex];
      if (!currentSlide) return state;

      const updatedSlide: Slide = {
        ...currentSlide,
        elements: currentSlide.elements.map(el =>
          el.id === action.payload.id ? action.payload : el
        ),
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(slide =>
            slide.id === currentSlide.id ? updatedSlide : slide
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'DELETE_ELEMENT': {
      if (!state.presentation) return state;

      const currentSlide = state.presentation.slides[state.currentSlideIndex];
      if (!currentSlide) return state;

      const updatedSlide: Slide = {
        ...currentSlide,
        elements: currentSlide.elements.filter(el => el.id !== action.payload),
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(slide =>
            slide.id === currentSlide.id ? updatedSlide : slide
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedElementId: null,
      };
    }

    case 'MOVE_ELEMENT_FORWARD': {
      if (!state.presentation) return state;

      const currentSlide = state.presentation.slides[state.currentSlideIndex];
      if (!currentSlide) return state;

      const elementIndex = currentSlide.elements.findIndex(el => el.id === action.payload);
      if (elementIndex === -1) return state;

      const updatedElements = currentSlide.elements.map(el => {
        if (el.id === action.payload) {
          return { ...el, zIndex: el.zIndex + 1 };
        }
        return el;
      });

      const updatedSlide: Slide = {
        ...currentSlide,
        elements: updatedElements,
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(slide =>
            slide.id === currentSlide.id ? updatedSlide : slide
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'MOVE_ELEMENT_BACKWARD': {
      if (!state.presentation) return state;

      const currentSlide = state.presentation.slides[state.currentSlideIndex];
      if (!currentSlide) return state;

      const elementIndex = currentSlide.elements.findIndex(el => el.id === action.payload);
      if (elementIndex === -1) return state;

      const element = currentSlide.elements[elementIndex];
      if (element.zIndex <= 0) return state;

      const updatedElements = currentSlide.elements.map(el => {
        if (el.id === action.payload) {
          return { ...el, zIndex: Math.max(0, el.zIndex - 1) };
        }
        return el;
      });

      const updatedSlide: Slide = {
        ...currentSlide,
        elements: updatedElements,
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(slide =>
            slide.id === currentSlide.id ? updatedSlide : slide
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    }

    case 'SELECT_ELEMENT':
      return {
        ...state,
        selectedElementId: action.payload,
      };

    case 'COPY_ELEMENT': {
      if (!state.presentation) return state;

      const currentSlide = state.presentation.slides[state.currentSlideIndex];
      if (!currentSlide) return state;

      const element = currentSlide.elements.find(el => el.id === action.payload);
      if (!element) return state;

      return {
        ...state,
        copiedElement: element,
      };
    }

    case 'PASTE_ELEMENT': {
      if (!state.presentation || !state.copiedElement) return state;

      const currentSlide = state.presentation.slides[state.currentSlideIndex];
      if (!currentSlide) return state;

      // Create a new element with a new ID and slightly offset position
      const newElement: SlideElement = {
        ...state.copiedElement,
        id: uuidv4(),
        position: {
          ...state.copiedElement.position,
          x: Math.min(state.copiedElement.position.x + 5, 90),
          y: Math.min(state.copiedElement.position.y + 5, 90),
        },
      };

      const updatedSlide: Slide = {
        ...currentSlide,
        elements: [...currentSlide.elements, newElement],
      };

      return {
        ...state,
        presentation: {
          ...state.presentation,
          slides: state.presentation.slides.map(slide =>
            slide.id === currentSlide.id ? updatedSlide : slide
          ),
          updatedAt: new Date().toISOString(),
        },
        selectedElementId: newElement.id,
      };
    }

    case 'SET_PREVIEW_MODE':
      return {
        ...state,
        isPreviewMode: action.payload,
        selectedElementId: null,
      };

    case 'SET_SAVING':
      return {
        ...state,
        isSaving: action.payload,
      };

    case 'SET_LAST_SAVED':
      return {
        ...state,
        lastSaved: action.payload,
      };

    case 'RESTORE_FROM_HISTORY': {
      const { presentation, currentSlideIndex, selectedElementId } = action.payload;
      return {
        ...state,
        presentation,
        currentSlideIndex,
        selectedElementId,
      };
    }

    default:
      return state;
  }
}

export function PresentationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(presentationReducer, initialState);
  const historyRecorderRef = useRef<HistoryRecorder | null>(null);

  // Function to set the history recorder (called by HistoryIntegration)
  const setHistoryRecorder = useCallback((recorder: HistoryRecorder | null) => {
    historyRecorderRef.current = recorder;
  }, []);

  // Helper to dispatch and record history
  const dispatchWithHistory = useCallback((action: Action, payload?: unknown) => {
    dispatch(action);

    // Record to history if it's a tracked action
    if (TRACKED_ACTIONS.includes(action.type as typeof TRACKED_ACTIONS[number]) && historyRecorderRef.current) {
      // We need to get the new state after dispatch, but useReducer is synchronous
      // So we use a microtask to ensure the state has updated
      queueMicrotask(() => {
        // The state here is stale, so we compute what the new state would be
        const newState = presentationReducer(state, action);
        historyRecorderRef.current?.(
          action.type,
          newState.presentation,
          newState.currentSlideIndex,
          newState.selectedElementId,
          payload
        );
      });
    }
  }, [state]);

  // Auto-save effect
  useEffect(() => {
    if (!state.presentation || state.presentation.id === '' || state.isSaving) {
      return;
    }

    const timeout = setTimeout(async () => {
      if (!state.presentation) return;
      try {
        dispatch({ type: 'SET_SAVING', payload: true });
        await apiService.updatePresentation(state.presentation.id, state.presentation);
        dispatch({ type: 'SET_LAST_SAVED', payload: new Date().toISOString() });
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [state.presentation]);

  const actions = {
    createNewPresentation: (title: string) => {
      dispatchWithHistory({ type: 'CREATE_NEW_PRESENTATION', payload: title }, title);
    },

    createPresentationWithSlides: (title: string, slides: Slide[]) => {
      dispatchWithHistory({ type: 'CREATE_PRESENTATION_WITH_SLIDES', payload: { title, slides } }, { title, slides });
    },

    addSlide: () => {
      dispatchWithHistory({ type: 'ADD_SLIDE' });
    },

    addSlideWithTemplate: (elements: SlideElement[], background: string, masterName: string) => {
      dispatchWithHistory({ type: 'ADD_SLIDE_WITH_TEMPLATE', payload: { elements, background, masterName } }, { masterName });
    },

    duplicateSlide: (id: string) => {
      dispatchWithHistory({ type: 'DUPLICATE_SLIDE', payload: id }, id);
    },

    deleteSlide: (id: string) => {
      dispatchWithHistory({ type: 'DELETE_SLIDE', payload: id }, id);
    },

    updateSlide: (slide: Slide) => {
      dispatchWithHistory({ type: 'UPDATE_SLIDE', payload: slide }, slide);
    },

    reorderSlides: (slides: Slide[]) => {
      dispatchWithHistory({ type: 'REORDER_SLIDES', payload: slides });
    },

    setCurrentSlide: (index: number) => {
      dispatch({ type: 'SET_CURRENT_SLIDE', payload: index }); // Not tracked in history
    },

    addElement: (element: SlideElement) => {
      dispatchWithHistory({ type: 'ADD_ELEMENT', payload: element }, element);
    },

    updateElement: (element: SlideElement) => {
      dispatchWithHistory({ type: 'UPDATE_ELEMENT', payload: element }, element);
    },

    // Silent update - doesn't record history (use for continuous updates like dragging)
    updateElementSilent: (element: SlideElement) => {
      dispatch({ type: 'UPDATE_ELEMENT', payload: element });
    },

    // Commit update - records to history (use when drag ends)
    commitElementUpdate: (element: SlideElement) => {
      dispatchWithHistory({ type: 'UPDATE_ELEMENT', payload: element }, element);
    },

    deleteElement: (id: string) => {
      dispatchWithHistory({ type: 'DELETE_ELEMENT', payload: id }, id);
    },

    moveElementForward: (id: string) => {
      dispatchWithHistory({ type: 'MOVE_ELEMENT_FORWARD', payload: id }, id);
    },

    moveElementBackward: (id: string) => {
      dispatchWithHistory({ type: 'MOVE_ELEMENT_BACKWARD', payload: id }, id);
    },

    selectElement: (id: string | null) => {
      dispatch({ type: 'SELECT_ELEMENT', payload: id }); // Not tracked in history
    },

    copyElement: (id: string) => {
      dispatch({ type: 'COPY_ELEMENT', payload: id }); // Not tracked in history
    },

    pasteElement: () => {
      dispatchWithHistory({ type: 'PASTE_ELEMENT' });
    },

    togglePreview: () => {
      dispatch({ type: 'SET_PREVIEW_MODE', payload: !state.isPreviewMode }); // Not tracked
    },

    loadPresentation: (presentation: Presentation) => {
      dispatch({ type: 'SET_PRESENTATION', payload: presentation }); // Not tracked (initial load)
    },

    savePresentation: async () => {
      if (!state.presentation) return;

      try {
        dispatch({ type: 'SET_SAVING', payload: true });

        if (state.presentation.id) {
          await apiService.updatePresentation(state.presentation.id, state.presentation);
        } else {
          const response = await apiService.savePresentation(state.presentation);
          dispatch({
            type: 'SET_PRESENTATION',
            payload: { ...state.presentation, id: response.id },
          });
        }

        dispatch({ type: 'SET_LAST_SAVED', payload: new Date().toISOString() });
      } catch (error) {
        console.error('Save failed:', error);
        throw error;
      } finally {
        dispatch({ type: 'SET_SAVING', payload: false });
      }
    },

    restoreFromHistory: (presentation: Presentation, currentSlideIndex: number, selectedElementId: string | null) => {
      dispatch({ type: 'RESTORE_FROM_HISTORY', payload: { presentation, currentSlideIndex, selectedElementId } });
    },
  };

  return (
    <PresentationContext.Provider value={{ state, dispatch, actions, setHistoryRecorder }}>
      {children}
    </PresentationContext.Provider>
  );
}

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within PresentationProvider');
  }
  return context;
};
