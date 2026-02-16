import { useState, useRef } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { generateAndDownloadPPTX } from '../../services/pptxGenerator';
import './HeaderBar.css';

interface HeaderBarProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  theme: 'dark' | 'light';
  onThemeChange: (theme: 'dark' | 'light') => void;
  onOpenTemplateGallery: () => void;
}

function HeaderBar({ zoom, onZoomChange, theme, onThemeChange, onOpenTemplateGallery }: HeaderBarProps) {
  const { state, actions } = usePresentation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

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
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleViewJson = () => {
    setShowJsonModal(true);
    setShowMoreMenu(false);
  };

  const handleExportJson = () => {
    if (!state.presentation) return;
    const json = JSON.stringify(state.presentation, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.presentation.title || 'presentation'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMoreMenu(false);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (json && json.slides) {
          actions.loadPresentation(json);
          alert('Presentation imported successfully!');
        } else {
          alert('Invalid presentation file format');
        }
      } catch (error) {
        console.error('Import failed:', error);
        alert('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);

    if (importInputRef.current) {
      importInputRef.current.value = '';
    }
    setShowMoreMenu(false);
  };

  const zoomOptions = [50, 75, 100, 125, 150, 200];

  return (
    <>
      <header className="header-bar">
        <div className="header-left">
          <div className="header-logo">
            <span className="logo-text">GFTN Slides</span>
          </div>

          <div className="header-title-section">
            <input
              type="text"
              className="header-title-input"
              value={state.presentation?.title || 'Untitled Presentation'}
              readOnly
              placeholder="Untitled Presentation"
            />
            {state.isSaving ? (
              <span className="header-save-status saving">Saving...</span>
            ) : state.lastSaved ? (
              <span className="header-save-status saved">SAVED</span>
            ) : null}
          </div>
        </div>

        <div className="header-center">
          <button className="header-btn icon-btn" title="Undo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h10c4.418 0 8 3.582 8 8v0M3 10l6-6M3 10l6 6"/>
            </svg>
          </button>
          <button className="header-btn icon-btn" title="Redo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10H11C6.582 10 3 13.582 3 18v0M21 10l-6-6M21 10l-6 6"/>
            </svg>
          </button>

          <div className="header-separator" />

          <button className="header-btn icon-btn" title="Zoom Out" onClick={() => onZoomChange(Math.max(50, zoom - 25))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6"/>
            </svg>
          </button>

          <select
            className="header-zoom-select"
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
          >
            {zoomOptions.map(z => (
              <option key={z} value={z}>{z}%</option>
            ))}
          </select>

          <button className="header-btn icon-btn" title="Zoom In" onClick={() => onZoomChange(Math.min(200, zoom + 25))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/>
            </svg>
          </button>
        </div>

        <div className="header-right">
          {/* Theme Toggle */}
          <button
            className="header-btn icon-btn"
            onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* More Menu */}
          <div className="header-menu-wrapper">
            <button
              className="header-btn icon-btn"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              title="More Options"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </button>

            {showMoreMenu && (
              <div className="header-dropdown-menu">
                <button onClick={handleViewJson}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                  </svg>
                  View JSON
                </button>
                <button onClick={handleExportJson}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                  </svg>
                  Export JSON
                </button>
                <button onClick={() => importInputRef.current?.click()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                  </svg>
                  Import JSON
                </button>
              </div>
            )}
          </div>

          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            style={{ display: 'none' }}
          />

          <button className="header-btn text-btn" onClick={onOpenTemplateGallery}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Templates
          </button>

          <div className="header-separator" />

          <button className="header-btn text-btn" onClick={handleSave}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
              <polyline points="17,21 17,13 7,13 7,21"/>
              <polyline points="7,3 7,8 15,8"/>
            </svg>
            Save
          </button>

          <button className="header-btn text-btn" onClick={actions.togglePreview}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
            Present
          </button>

          <button
            className="header-btn primary-btn"
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download PPT'}
          </button>
        </div>
      </header>

      {/* JSON Modal */}
      {showJsonModal && (
        <div className="json-modal-overlay" onClick={() => setShowJsonModal(false)}>
          <div className="json-modal" onClick={(e) => e.stopPropagation()}>
            <div className="json-modal-header">
              <h3>Presentation JSON</h3>
              <button className="json-modal-close" onClick={() => setShowJsonModal(false)}>×</button>
            </div>
            <pre className="json-modal-content">
              {JSON.stringify(state.presentation, null, 2)}
            </pre>
            <div className="json-modal-footer">
              <button onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(state.presentation, null, 2));
                alert('JSON copied to clipboard!');
              }}>
                Copy to Clipboard
              </button>
              <button onClick={() => setShowJsonModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HeaderBar;
