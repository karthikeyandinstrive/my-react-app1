import type { ToolType } from '../Layout/AppLayout';
import './IconToolbar.css';

interface IconToolbarProps {
  activeTool: ToolType | null;
  onToolChange: (tool: ToolType) => void;
}

const tools: { id: ToolType; icon: string; label: string }[] = [
  { id: 'text', icon: 'T', label: 'Text' },
  { id: 'shapes', icon: '□', label: 'Shapes' },
  { id: 'tables', icon: '⊞', label: 'Tables' },
  { id: 'charts', icon: '📊', label: 'Charts' },
  { id: 'images', icon: '🖼', label: 'Images' },
];

function IconToolbar({ activeTool, onToolChange }: IconToolbarProps) {
  return (
    <div className="icon-toolbar">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`icon-tool-btn ${activeTool === tool.id ? 'active' : ''}`}
          onClick={() => onToolChange(tool.id)}
          title={tool.label}
        >
          <span className="icon-tool-icon">{tool.icon}</span>
        </button>
      ))}
    </div>
  );
}

export default IconToolbar;
