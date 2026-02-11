import { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { generateAndDownloadPPTX } from '../../services/pptxGenerator';
import './Toolbar.css';

function Toolbar() {
  const { state, actions } = usePresentation();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!state.presentation) return;

    try {
      setIsDownloading(true);
      await generateAndDownloadPPTX(state.presentation);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download presentation');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSave = async () => {
    try {
      await actions.savePresentation();
      alert('Presentation saved successfully!');
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save presentation');
    }
  };

  const currentSlide = state.presentation?.slides[state.currentSlideIndex];

  const formatLastSaved = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <h1 className="toolbar-title">{state.presentation?.title || 'Untitled'}</h1>
        <div className="toolbar-status">
          {state.isSaving ? (
            <span className="status-saving">Saving...</span>
          ) : (
            <span className="status-saved">
              Last saved: {formatLastSaved(state.lastSaved)}
            </span>
          )}
        </div>
      </div>

      <div className="toolbar-right">
        <button onClick={actions.addSlide} className="toolbar-btn">
          + New Slide
        </button>

        {currentSlide && (
          <button
            onClick={() => actions.deleteSlide(currentSlide.id)}
            className="toolbar-btn toolbar-btn-danger"
            disabled={state.presentation!.slides.length === 1}
          >
            Delete Slide
          </button>
        )}

        <button onClick={handleSave} className="toolbar-btn" disabled={state.isSaving}>
          Save
        </button>

        <button onClick={actions.togglePreview} className="toolbar-btn">
          Preview
        </button>

        <button
          onClick={handleDownload}
          className="toolbar-btn toolbar-btn-primary"
          disabled={isDownloading}
        >
          {isDownloading ? 'Downloading...' : 'Download PPT'}
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
