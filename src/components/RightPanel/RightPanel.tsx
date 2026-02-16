import { usePresentation } from '../../context/PresentationContext';
import TextSettings from './TextSettings';
import ShapeSettings from './ShapeSettings';
import TableSettings from './TableSettings';
import ChartSettings from './ChartSettings';
import SlideSettings from './SlideSettings';
import './RightPanel.css';

function RightPanel() {
  const { state } = usePresentation();

  if (!state.presentation) return null;

  const currentSlide = state.presentation.slides[state.currentSlideIndex];
  const selectedElement = currentSlide?.elements.find(el => el.id === state.selectedElementId);

  const renderSettings = () => {
    if (!selectedElement) {
      return <SlideSettings />;
    }

    switch (selectedElement.type) {
      case 'text':
        return <TextSettings element={selectedElement} />;
      case 'shape':
        return <ShapeSettings element={selectedElement} />;
      case 'table':
        return <TableSettings element={selectedElement} />;
      case 'chart':
        return <ChartSettings element={selectedElement} />;
      case 'image':
        return <SlideSettings />;
      default:
        return <SlideSettings />;
    }
  };

  return (
    <div className="right-panel">
      {renderSettings()}
    </div>
  );
}

export default RightPanel;
