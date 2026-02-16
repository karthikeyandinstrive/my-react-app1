import { useState, useEffect } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import HeaderBar from '../Header/HeaderBar';
import IconToolbar from '../LeftPanel/IconToolbar';
import LeftPanel from '../LeftPanel/LeftPanel';
import RightPanel from '../RightPanel/RightPanel';
import SlidePanel from '../SlidePanel/SlidePanel';
import SlideCanvas from '../SlideBuilder/SlideCanvas';
import PreviewModal from '../Preview/PreviewModal';
import TemplateGallery from '../TemplateGallery/TemplateGallery';
import './AppLayout.css';

export type ToolType = 'text' | 'shapes' | 'tables' | 'charts' | 'images';
export type ThemeType = 'dark' | 'light';

function AppLayout() {
  const { state, actions } = usePresentation();
  const [activeTool, setActiveTool] = useState<ToolType | null>('text');
  const [zoom, setZoom] = useState(100);
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeType) || 'dark';
  });
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Close left panel when right panel opens
  useEffect(() => {
    if (state.selectedElementId || state.isSlideSelected) {
      setActiveTool(null);
    }
  }, [state.selectedElementId, state.isSlideSelected]);

  if (!state.presentation) {
    return <div className="app-loading">Loading...</div>;
  }

  const handleCloseLeftPanel = () => {
    setActiveTool(null);
  };

  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    actions.deselectAll(); // Close right panel when opening left panel
  };

  const showLeftPanel = activeTool !== null;
  const showRightPanel = state.selectedElementId !== null || state.isSlideSelected;

  // Build layout classes
  const layoutClasses = [
    'app-layout',
    theme,
    !showLeftPanel ? 'no-left-panel' : '',
    !showRightPanel ? 'no-right-panel' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      <HeaderBar
        zoom={zoom}
        onZoomChange={setZoom}
        theme={theme}
        onThemeChange={setTheme}
        onOpenTemplateGallery={() => setShowTemplateGallery(true)}
      />

      <div className="slide-panel-area">
        <SlidePanel />
      </div>

      <div className="icon-toolbar-area">
        <IconToolbar activeTool={activeTool} onToolChange={handleToolChange} />
      </div>

      {activeTool && (
        <div className="left-panel-area">
          <LeftPanel activeTool={activeTool} onClose={handleCloseLeftPanel} />
        </div>
      )}

      <div className="canvas-area">
        <div className="canvas-container" style={{ transform: `scale(${zoom / 100})` }}>
          <SlideCanvas />
        </div>
      </div>

      {showRightPanel && (
        <div className="right-panel-area">
          <RightPanel />
        </div>
      )}

      {state.isPreviewMode && <PreviewModal />}

      <TemplateGallery
        isOpen={showTemplateGallery}
        onClose={() => setShowTemplateGallery(false)}
      />
    </div>
  );
}

export default AppLayout;
