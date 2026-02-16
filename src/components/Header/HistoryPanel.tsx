import { useHistory } from '../../context/HistoryContext';
import { usePresentation } from '../../context/PresentationContext';
import { formatRelativeTime, getActionIcon } from '../../types/history';
import './HistoryPanel.css';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function HistoryPanel({ isOpen, onClose }: HistoryPanelProps) {
  const { state: historyState, canUndo, canRedo, revertTo } = useHistory();
  const { actions } = usePresentation();

  if (!isOpen) return null;

  const handleRevert = (index: number) => {
    const entry = historyState.entries[index];
    if (entry && entry.presentationSnapshot) {
      // Restore the presentation state
      actions.restoreFromHistory(
        entry.presentationSnapshot,
        entry.currentSlideIndex,
        entry.selectedElementId
      );
      revertTo(index);
    }
    onClose();
  };

  const getIconSvg = (iconType: ReturnType<typeof getActionIcon>) => {
    switch (iconType) {
      case 'slide':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M3 9h18"/>
          </svg>
        );
      case 'element':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <rect x="7" y="7" width="10" height="10" rx="1"/>
          </svg>
        );
      case 'delete':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
          </svg>
        );
      case 'move':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="5 9 2 12 5 15"/>
            <polyline points="9 5 12 2 15 5"/>
            <polyline points="15 19 12 22 9 19"/>
            <polyline points="19 9 22 12 19 15"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="12" y1="2" x2="12" y2="22"/>
          </svg>
        );
      case 'create':
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        );
      default:
        return (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
          </svg>
        );
    }
  };

  return (
    <div className="history-panel">
      <div className="history-panel-header">
        <div className="history-panel-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          History
        </div>
        <button className="history-panel-close" onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="history-panel-content">
        {historyState.entries.length === 0 ? (
          <div className="history-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <p>No history yet</p>
            <span>Make changes to see them here</span>
          </div>
        ) : (
          <div className="history-list">
            {[...historyState.entries].reverse().map((entry, reversedIndex) => {
              const actualIndex = historyState.entries.length - 1 - reversedIndex;
              const isCurrent = actualIndex === historyState.currentIndex;
              const isFuture = actualIndex > historyState.currentIndex;
              const iconType = getActionIcon(entry.actionType);

              return (
                <button
                  key={entry.id}
                  className={`history-item ${isCurrent ? 'current' : ''} ${isFuture ? 'future' : ''}`}
                  onClick={() => handleRevert(actualIndex)}
                  title={`Revert to: ${entry.description}`}
                >
                  <div className="history-item-icon">
                    {getIconSvg(iconType)}
                  </div>
                  <div className="history-item-content">
                    <span className="history-item-description">{entry.description}</span>
                    <span className="history-item-time">{formatRelativeTime(entry.timestamp)}</span>
                  </div>
                  {isCurrent && (
                    <div className="history-item-current-badge">Current</div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="history-panel-footer">
        <div className="history-shortcuts">
          <span>
            <kbd>Ctrl</kbd>+<kbd>Z</kbd> Undo
            {!canUndo && <span className="disabled">(unavailable)</span>}
          </span>
          <span>
            <kbd>Ctrl</kbd>+<kbd>Y</kbd> Redo
            {!canRedo && <span className="disabled">(unavailable)</span>}
          </span>
        </div>
      </div>
    </div>
  );
}

export default HistoryPanel;
