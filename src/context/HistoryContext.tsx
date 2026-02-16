import { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { HistoryEntry, HistoryState } from '../types/history';
import type { Presentation } from '../types/presentation';
import { getActionDescription, TRACKED_ACTIONS } from '../types/history';

const MAX_HISTORY_ENTRIES = 50;

type HistoryAction =
  | { type: 'RECORD'; payload: HistoryEntry }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'REVERT_TO'; payload: number }
  | { type: 'CLEAR' };

interface HistoryContextType {
  state: HistoryState;
  canUndo: boolean;
  canRedo: boolean;
  recordHistory: (
    actionType: string,
    presentation: Presentation | null,
    currentSlideIndex: number,
    selectedElementId: string | null,
    payload?: unknown
  ) => void;
  undo: () => HistoryEntry | null;
  redo: () => HistoryEntry | null;
  revertTo: (index: number) => HistoryEntry | null;
  clearHistory: () => void;
  getCurrentEntry: () => HistoryEntry | null;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const initialState: HistoryState = {
  entries: [],
  currentIndex: -1,
  maxEntries: MAX_HISTORY_ENTRIES,
};

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'RECORD': {
      // When recording a new action, discard any "future" entries (redo stack)
      const newEntries = state.entries.slice(0, state.currentIndex + 1);
      newEntries.push(action.payload);

      // Trim to max entries if needed
      if (newEntries.length > state.maxEntries) {
        newEntries.shift();
        return {
          ...state,
          entries: newEntries,
          currentIndex: newEntries.length - 1,
        };
      }

      return {
        ...state,
        entries: newEntries,
        currentIndex: newEntries.length - 1,
      };
    }

    case 'UNDO': {
      if (state.currentIndex <= 0) return state;
      return {
        ...state,
        currentIndex: state.currentIndex - 1,
      };
    }

    case 'REDO': {
      if (state.currentIndex >= state.entries.length - 1) return state;
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
      };
    }

    case 'REVERT_TO': {
      if (action.payload < 0 || action.payload >= state.entries.length) return state;
      return {
        ...state,
        currentIndex: action.payload,
      };
    }

    case 'CLEAR':
      return initialState;

    default:
      return state;
  }
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(historyReducer, initialState);

  const canUndo = state.currentIndex > 0;
  const canRedo = state.currentIndex < state.entries.length - 1;

  const recordHistory = useCallback((
    actionType: string,
    presentation: Presentation | null,
    currentSlideIndex: number,
    selectedElementId: string | null,
    payload?: unknown
  ) => {
    // Only track specific actions
    if (!TRACKED_ACTIONS.includes(actionType as typeof TRACKED_ACTIONS[number])) {
      return;
    }

    const entry: HistoryEntry = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      actionType,
      description: getActionDescription(actionType, payload),
      // Deep clone the presentation to avoid reference issues
      presentationSnapshot: presentation ? JSON.parse(JSON.stringify(presentation)) : null,
      currentSlideIndex,
      selectedElementId,
    };

    dispatch({ type: 'RECORD', payload: entry });
  }, []);

  const undo = useCallback(() => {
    if (!canUndo) return null;
    dispatch({ type: 'UNDO' });
    // Return the entry we're reverting TO (the previous one)
    return state.entries[state.currentIndex - 1] || null;
  }, [canUndo, state.entries, state.currentIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return null;
    dispatch({ type: 'REDO' });
    // Return the entry we're moving forward TO
    return state.entries[state.currentIndex + 1] || null;
  }, [canRedo, state.entries, state.currentIndex]);

  const revertTo = useCallback((index: number) => {
    if (index < 0 || index >= state.entries.length) return null;
    dispatch({ type: 'REVERT_TO', payload: index });
    return state.entries[index] || null;
  }, [state.entries]);

  const clearHistory = useCallback(() => {
    dispatch({ type: 'CLEAR' });
  }, []);

  const getCurrentEntry = useCallback(() => {
    return state.entries[state.currentIndex] || null;
  }, [state.entries, state.currentIndex]);

  return (
    <HistoryContext.Provider
      value={{
        state,
        canUndo,
        canRedo,
        recordHistory,
        undo,
        redo,
        revertTo,
        clearHistory,
        getCurrentEntry,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within HistoryProvider');
  }
  return context;
};
