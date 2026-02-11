import { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import TopNavigation, { type TabType } from '../Navigation/TopNavigation';
import PreviewModal from '../Preview/PreviewModal';
import DesignRibbon from '../Ribbon/DesignRibbon';
import HomeRibbon from '../Ribbon/HomeRibbon';
import PropertiesToolbar from '../Ribbon/PropertiesToolbar';
import './SlideBuilder.css';
import SlideCanvas from './SlideCanvas';
import SlideList from './SlideList';

function SlideBuilder() {
  const { state } = usePresentation();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  if (!state.presentation) {
    return (
      <div className="slide-builder-empty">
        <h2>No presentation loaded</h2>
        <p>Create a new presentation or load an existing one</p>
      </div>
    );
  }

  const renderRibbon = () => {
    switch (activeTab) {
      case 'home':
        return <HomeRibbon />;
      case 'design':
        return <DesignRibbon />;
      case 'insert':
      case 'transitions':
      case 'animations':
      case 'slideshow':
      case 'review':
      case 'view':
        return <HomeRibbon />; // Fallback to Home ribbon for now
      default:
        return <HomeRibbon />;
    }
  };

  return (
    <div className="slide-builder">
      <TopNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        presentationTitle={state.presentation.title}
      />

      {renderRibbon()}

      <PropertiesToolbar />

      <div className="slide-builder-content">
        <SlideList />

        <div className="slide-builder-main">
          <SlideCanvas />
        </div>
      </div>

      {state.isPreviewMode && <PreviewModal />}
    </div>
  );
}

export default SlideBuilder;
