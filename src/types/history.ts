import type { Presentation } from './presentation';

// History entry representing a single state snapshot
export interface HistoryEntry {
  id: string;
  timestamp: string;
  actionType: string;
  description: string;
  presentationSnapshot: Presentation | null;
  currentSlideIndex: number;
  selectedElementId: string | null;
}

// History state
export interface HistoryState {
  entries: HistoryEntry[];
  currentIndex: number;
  maxEntries: number;
}

// Actions that should be tracked in history
export const TRACKED_ACTIONS = [
  'CREATE_NEW_PRESENTATION',
  'CREATE_PRESENTATION_WITH_SLIDES',
  'ADD_SLIDE',
  'ADD_SLIDE_WITH_TEMPLATE',
  'DUPLICATE_SLIDE',
  'DELETE_SLIDE',
  'UPDATE_SLIDE',
  'REORDER_SLIDES',
  'ADD_ELEMENT',
  'UPDATE_ELEMENT',
  'DELETE_ELEMENT',
  'MOVE_ELEMENT_FORWARD',
  'MOVE_ELEMENT_BACKWARD',
  'PASTE_ELEMENT',
] as const;

export type TrackedAction = typeof TRACKED_ACTIONS[number];

// Human-readable descriptions for each action type
export function getActionDescription(actionType: string, payload?: unknown): string {
  switch (actionType) {
    case 'CREATE_NEW_PRESENTATION':
      return 'Created new presentation';
    case 'CREATE_PRESENTATION_WITH_SLIDES':
      return 'Created presentation from template';
    case 'ADD_SLIDE':
      return 'Added new slide';
    case 'ADD_SLIDE_WITH_TEMPLATE':
      return 'Added slide from template';
    case 'DUPLICATE_SLIDE':
      return 'Duplicated slide';
    case 'DELETE_SLIDE':
      return 'Deleted slide';
    case 'UPDATE_SLIDE':
      return 'Updated slide';
    case 'REORDER_SLIDES':
      return 'Reordered slides';
    case 'ADD_ELEMENT': {
      const element = payload as { type?: string } | undefined;
      const elementType = element?.type || 'element';
      return `Added ${elementType}`;
    }
    case 'UPDATE_ELEMENT': {
      const element = payload as { type?: string } | undefined;
      const elementType = element?.type || 'element';
      return `Modified ${elementType}`;
    }
    case 'DELETE_ELEMENT':
      return 'Deleted element';
    case 'MOVE_ELEMENT_FORWARD':
      return 'Moved element forward';
    case 'MOVE_ELEMENT_BACKWARD':
      return 'Moved element backward';
    case 'PASTE_ELEMENT':
      return 'Pasted element';
    default:
      return actionType.toLowerCase().replace(/_/g, ' ');
  }
}

// Get icon name for action type
export function getActionIcon(actionType: string): 'slide' | 'element' | 'move' | 'delete' | 'create' {
  if (actionType.includes('SLIDE')) {
    if (actionType.includes('DELETE')) return 'delete';
    return 'slide';
  }
  if (actionType.includes('ELEMENT')) {
    if (actionType.includes('DELETE')) return 'delete';
    if (actionType.includes('MOVE')) return 'move';
    return 'element';
  }
  if (actionType.includes('CREATE')) return 'create';
  return 'element';
}

// Format relative time
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  return then.toLocaleDateString();
}
