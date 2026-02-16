import { usePresentation } from '../../context/PresentationContext';
import type { ToolType } from '../Layout/AppLayout';
import TextPanel from './TextPanel';
import ShapesPanel from './ShapesPanel';
import TablesPanel from './TablesPanel';
import ChartsPanel from './ChartsPanel';
import ImagesPanel from './ImagesPanel';
import './LeftPanel.css';

interface LeftPanelProps {
  activeTool: ToolType;
  onClose: () => void;
}

function LeftPanel({ activeTool, onClose }: LeftPanelProps) {
  const { actions } = usePresentation();

  const handleClose = () => {
    onClose();
    actions.selectElement(null); // Also close right panel
  };

  const renderPanel = () => {
    switch (activeTool) {
      case 'text':
        return <TextPanel onClose={handleClose} />;
      case 'shapes':
        return <ShapesPanel onClose={handleClose} />;
      case 'tables':
        return <TablesPanel onClose={handleClose} />;
      case 'charts':
        return <ChartsPanel onClose={handleClose} />;
      case 'images':
        return <ImagesPanel onClose={handleClose} />;
      default:
        return <TextPanel onClose={handleClose} />;
    }
  };

  return (
    <div className="left-panel">
      {renderPanel()}
    </div>
  );
}

export default LeftPanel;
