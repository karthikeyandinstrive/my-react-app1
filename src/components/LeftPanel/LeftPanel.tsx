import type { ToolType } from '../Layout/AppLayout';
import TextPanel from './TextPanel';
import ShapesPanel from './ShapesPanel';
import TablesPanel from './TablesPanel';
import ChartsPanel from './ChartsPanel';
import ImagesPanel from './ImagesPanel';
import './LeftPanel.css';

interface LeftPanelProps {
  activeTool: ToolType;
}

function LeftPanel({ activeTool }: LeftPanelProps) {
  const renderPanel = () => {
    switch (activeTool) {
      case 'text':
        return <TextPanel />;
      case 'shapes':
        return <ShapesPanel />;
      case 'tables':
        return <TablesPanel />;
      case 'charts':
        return <ChartsPanel />;
      case 'images':
        return <ImagesPanel />;
      default:
        return <TextPanel />;
    }
  };

  return (
    <div className="left-panel">
      {renderPanel()}
    </div>
  );
}

export default LeftPanel;
