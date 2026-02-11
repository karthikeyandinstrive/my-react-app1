import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import type { TextElement, ImageElement, ShapeElement, TableElement, ChartElement, TableCell } from '../../types/presentation';
import { DEFAULT_TEXT_ELEMENT, DEFAULT_SHAPE_ELEMENT, DEFAULT_TABLE_ELEMENT, DEFAULT_TABLE_CELL, DEFAULT_CHART_ELEMENT, SAMPLE_CHART_DATA } from '../../utils/constants';
import './ElementToolbar.css';

function ElementToolbar() {
  const { actions } = usePresentation();

  const handleAddText = () => {
    const newTextElement: TextElement = {
      id: uuidv4(),
      type: 'text',
      position: {
        x: 10,
        y: 10,
        width: 40,
        height: 10,
      },
      zIndex: 1,
      content: 'Double-click to edit',
      ...DEFAULT_TEXT_ELEMENT,
    };

    actions.addElement(newTextElement);
  };

  const handleAddImage = () => {
    const newImageElement: ImageElement = {
      id: uuidv4(),
      type: 'image',
      position: {
        x: 30,
        y: 30,
        width: 30,
        height: 30,
      },
      zIndex: 1,
      src: 'https://via.placeholder.com/300',
      alt: 'Placeholder image',
    };

    actions.addElement(newImageElement);
  };

  const handleAddShape = () => {
    const newShapeElement: ShapeElement = {
      id: uuidv4(),
      type: 'shape',
      position: {
        x: 40,
        y: 40,
        width: 20,
        height: 20,
      },
      zIndex: 1,
      shapeType: 'rectangle',
      ...DEFAULT_SHAPE_ELEMENT,
    };

    actions.addElement(newShapeElement);
  };

  const handleAddTable = () => {
    // Create a 3x3 table by default
    const rows = 3;
    const cols = 3;
    const cells: TableCell[][] = Array(rows).fill(null).map((_, rowIdx) =>
      Array(cols).fill(null).map((_, colIdx) => ({
        ...DEFAULT_TABLE_CELL,
        text: rowIdx === 0 ? `Header ${colIdx + 1}` : `Cell ${rowIdx},${colIdx + 1}`,
      }))
    );

    const newTableElement: TableElement = {
      id: uuidv4(),
      type: 'table',
      position: {
        x: 20,
        y: 20,
        width: 60,
        height: 40,
      },
      zIndex: 1,
      rows,
      cols,
      cells,
      ...DEFAULT_TABLE_ELEMENT,
    };

    actions.addElement(newTableElement);
  };

  const handleAddChart = () => {
    const sampleData = SAMPLE_CHART_DATA.bar;

    const newChartElement: ChartElement = {
      id: uuidv4(),
      type: 'chart',
      position: {
        x: 15,
        y: 15,
        width: 70,
        height: 60,
      },
      zIndex: 1,
      chartType: 'bar',
      title: sampleData.title,
      labels: sampleData.labels,
      series: sampleData.series,
      ...DEFAULT_CHART_ELEMENT,
    };

    actions.addElement(newChartElement);
  };

  return (
    <div className="element-toolbar">
      <span className="element-toolbar-label">Add Element:</span>
      <button onClick={handleAddText} className="element-toolbar-btn">
        <span className="icon">T</span> Text
      </button>
      <button onClick={handleAddImage} className="element-toolbar-btn">
        <span className="icon">🖼</span> Image
      </button>
      <button onClick={handleAddShape} className="element-toolbar-btn">
        <span className="icon">◼</span> Shape
      </button>
      <button onClick={handleAddTable} className="element-toolbar-btn">
        <span className="icon">⊞</span> Table
      </button>
      <button onClick={handleAddChart} className="element-toolbar-btn">
        <span className="icon">📊</span> Chart
      </button>
    </div>
  );
}

export default ElementToolbar;
