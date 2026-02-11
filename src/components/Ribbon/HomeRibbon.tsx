import { useState } from 'react';
import { usePresentation } from '../../context/PresentationContext';
import { v4 as uuidv4 } from 'uuid';
import type { TextElement, ImageElement, ShapeElement, TableElement, ChartElement, TableCell, ChartType } from '../../types/presentation';
import { DEFAULT_TEXT_ELEMENT, DEFAULT_SHAPE_ELEMENT, DEFAULT_TABLE_ELEMENT, DEFAULT_TABLE_CELL, DEFAULT_CHART_ELEMENT, SAMPLE_CHART_DATA } from '../../utils/constants';
import { generateAndDownloadPPTX } from '../../services/pptxGenerator';
import ChartTypeSelector from '../Elements/ChartTypeSelector';
import ReactJson from 'react-json-view';
import './Ribbon.css';

function HomeRibbon() {
  const { state, actions } = usePresentation();
  const [showChartSelector, setShowChartSelector] = useState(false);

  const handleAddSlide = () => {
    actions.addSlide();
  };

  const handleDeleteSlide = () => {
    const currentSlide = state.presentation?.slides[state.currentSlideIndex];
    if (currentSlide && state.presentation!.slides.length > 1) {
      actions.deleteSlide(currentSlide.id);
    }
  };

  const handleAddText = () => {
    const newTextElement: TextElement = {
      id: uuidv4(),
      type: 'text',
      position: { x: 10, y: 10, width: 40, height: 10 },
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
      position: { x: 30, y: 30, width: 30, height: 30 },
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
      position: { x: 40, y: 40, width: 20, height: 20 },
      zIndex: 1,
      shapeType: 'rectangle',
      ...DEFAULT_SHAPE_ELEMENT,
    };
    actions.addElement(newShapeElement);
  };

  const handleAddTable = () => {
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
      position: { x: 20, y: 20, width: 60, height: 40 },
      zIndex: 1,
      rows,
      cols,
      cells,
      ...DEFAULT_TABLE_ELEMENT,
    };
    actions.addElement(newTableElement);
  };

  const handleAddChart = () => {
    setShowChartSelector(true);
  };

  const handleChartTypeSelect = (chartType: ChartType) => {
    const sampleData = SAMPLE_CHART_DATA[chartType as keyof typeof SAMPLE_CHART_DATA] || SAMPLE_CHART_DATA.bar;

    const newChartElement: ChartElement = {
      id: uuidv4(),
      type: 'chart',
      position: { x: 15, y: 15, width: 70, height: 60 },
      zIndex: 1,
      chartType,
      title: sampleData.title,
      labels: sampleData.labels,
      series: sampleData.series,
      ...DEFAULT_CHART_ELEMENT,
    };
    actions.addElement(newChartElement);
    setShowChartSelector(false);
  };

  const handleDownload = async () => {
    if (!state.presentation) return;
    try {
      await generateAndDownloadPPTX(state.presentation);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download presentation');
    }
  };

  const [showJsonViewer, setShowJsonViewer] = useState(false);

  const handleExportJSON = () => {
    if (!state.presentation) return;
    const json = JSON.stringify(state.presentation, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.presentation.title}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewJSON = () => {
    setShowJsonViewer(true);
  };

  const handleImportJSON = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string;
          const presentation = JSON.parse(json);
          actions.loadPresentation(presentation);
          alert('Presentation imported successfully!');
        } catch (error) {
          console.error('Import failed:', error);
          alert('Failed to import presentation');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <>
    <div className="ribbon">
      <div className="ribbon-group">
        <div className="ribbon-group-label">Slides</div>
        <div className="ribbon-buttons">
          <button onClick={handleAddSlide} className="ribbon-btn ribbon-btn-large">
            <div className="ribbon-icon">📄</div>
            <span>New Slide</span>
          </button>
          <button onClick={handleDeleteSlide} className="ribbon-btn ribbon-btn-small" disabled={state.presentation?.slides.length === 1}>
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="ribbon-separator"></div>

      <div className="ribbon-group">
        <div className="ribbon-group-label">Insert</div>
        <div className="ribbon-buttons">
          <button onClick={handleAddText} className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">T</div>
            <span>Text Box</span>
          </button>
          <button onClick={handleAddImage} className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">🖼</div>
            <span>Picture</span>
          </button>
          <button onClick={handleAddShape} className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">◼</div>
            <span>Shapes</span>
          </button>
          <button onClick={handleAddTable} className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">⊞</div>
            <span>Table</span>
          </button>
          <button onClick={handleAddChart} className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">📊</div>
            <span>Chart</span>
          </button>
        </div>
      </div>

      <div className="ribbon-separator"></div>

      <div className="ribbon-group">
        <div className="ribbon-group-label">Presentation</div>
        <div className="ribbon-buttons">
          <button onClick={actions.togglePreview} className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">▶</div>
            <span>Preview</span>
          </button>
          <button onClick={handleDownload} className="ribbon-btn ribbon-btn-medium">
            <div className="ribbon-icon-small">💾</div>
            <span>Export PPT</span>
          </button>
        </div>
      </div>

      <div className="ribbon-separator"></div>

      <div className="ribbon-group">
        <div className="ribbon-group-label">File</div>
        <div className="ribbon-buttons">
          <button onClick={handleViewJSON} className="ribbon-btn ribbon-btn-small">
            <span>View JSON</span>
          </button>
          <button onClick={handleExportJSON} className="ribbon-btn ribbon-btn-small">
            <span>Export JSON</span>
          </button>
          <button onClick={handleImportJSON} className="ribbon-btn ribbon-btn-small">
            <span>Import JSON</span>
          </button>
        </div>
      </div>
    </div>

    {showChartSelector && (
      <ChartTypeSelector
        onSelect={handleChartTypeSelect}
        onClose={() => setShowChartSelector(false)}
      />
    )}

    {showJsonViewer && state.presentation && (
      <div className="json-viewer-overlay" onClick={() => setShowJsonViewer(false)}>
        <div className="json-viewer-modal" onClick={(e) => e.stopPropagation()}>
          <div className="json-viewer-header">
            <h3>Presentation JSON</h3>
            <div className="json-viewer-actions">
              <button
                className="json-copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(state.presentation, null, 2));
                  alert('JSON copied to clipboard!');
                }}
              >
                Copy
              </button>
              <button className="json-close-btn" onClick={() => setShowJsonViewer(false)}>×</button>
            </div>
          </div>
          <div className="json-viewer-content">
            <ReactJson
              src={state.presentation}
              theme="monokai"
              displayDataTypes={false}
              displayObjectSize={true}
              enableClipboard={true}
              collapsed={2}
              name="presentation"
              style={{
                padding: '16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontFamily: "'Consolas', 'Monaco', monospace",
              }}
            />
          </div>
        </div>
      </div>
    )}
    </>
  );
}

export default HomeRibbon;
