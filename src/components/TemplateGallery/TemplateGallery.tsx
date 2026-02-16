import { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { usePresentation } from '../../context/PresentationContext';
import { templateCategories, templatePacks, getSlideLayout } from '../../utils/templatePacks';
import type { TemplatePack, TemplateElement } from '../../utils/templateTypes';
import type { Slide, SlideElement, TextElement, ChartElement, TableElement, TableCell } from '../../types/presentation';
import { DEFAULT_TEXT_ELEMENT } from '../../utils/constants';
import SlidePreviewMini from '../SlidePreview/SlidePreviewMini';
import './TemplateGallery.css';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

// Role to style mapping
const roleStyles: Record<string, Partial<TextElement>> = {
  title: { fontSize: 48, bold: true, color: '#1e293b' },
  subtitle: { fontSize: 24, color: '#64748b' },
  headingLg: { fontSize: 36, bold: true, color: '#1e293b' },
  headingMd: { fontSize: 24, bold: true, color: '#334155' },
  body: { fontSize: 18, color: '#475569' },
  caption: { fontSize: 14, color: '#64748b' },
};

// Convert template element to slide element
const convertTemplateElement = (el: TemplateElement, zIndex: number): SlideElement => {
  const basePosition = {
    x: (el.left / 1920) * 100,
    y: (el.top / 1080) * 100,
    width: ((el.width || 400) / 1920) * 100,
    height: ((el.height || 200) / 1080) * 100,
  };

  switch (el.type) {
    case 'text': {
      const style = el.role ? roleStyles[el.role] : {};
      return {
        id: uuidv4(),
        type: 'text',
        position: {
          ...basePosition,
          height: 10, // Text height is auto-calculated
        },
        zIndex,
        content: el.text || '',
        ...DEFAULT_TEXT_ELEMENT,
        fontSize: style.fontSize || 18,
        color: style.color || '#000000',
        bold: style.bold || false,
        align: el.textAlign || 'left',
      } as TextElement;
    }

    case 'chart': {
      return {
        id: uuidv4(),
        type: 'chart',
        position: basePosition,
        zIndex,
        chartType: el.chartType || 'bar',
        title: el.chartTitle || 'Chart',
        labels: el.chartLabels || ['A', 'B', 'C', 'D'],
        series: el.chartSeries || [{ name: 'Series 1', values: [10, 20, 30, 40], color: '#6366f1' }],
        showLegend: el.showLegend ?? true,
        showTitle: el.showTitle ?? true,
      } as ChartElement;
    }

    case 'table': {
      // Convert template table cells to TableCell format
      const cells: TableCell[][] = el.tableCells?.map(row =>
        row.map(cell => ({
          text: cell.text || '',
          bold: cell.bold,
          fontSize: cell.fontSize,
          color: cell.color,
          fillColor: cell.fillColor,
          align: cell.align,
        }))
      ) || [];

      // If no cells provided, create default empty cells
      const rows = el.rows || 3;
      const cols = el.cols || 3;
      const defaultCells: TableCell[][] = cells.length > 0 ? cells :
        Array(rows).fill(null).map(() =>
          Array(cols).fill(null).map(() => ({
            text: '',
            align: 'center' as const,
          }))
        );

      return {
        id: uuidv4(),
        type: 'table',
        position: basePosition,
        zIndex,
        rows: el.rows || defaultCells.length,
        cols: el.cols || (defaultCells[0]?.length || 3),
        cells: defaultCells,
        borderColor: el.borderColor || '#e5e7eb',
        borderWidth: el.borderWidth || 1,
        headerRow: el.headerRow ?? true,
      } as TableElement;
    }

    default: {
      // Fallback to text placeholder for unsupported types
      return {
        id: uuidv4(),
        type: 'text',
        position: basePosition,
        zIndex,
        content: `[${el.type}]`,
        ...DEFAULT_TEXT_ELEMENT,
        fontSize: 14,
        color: '#9ca3af',
        align: 'center',
      } as TextElement;
    }
  }
};

// Convert template elements to slide elements for preview
const createPreviewSlide = (layoutId: string): Slide => {
  const layoutElements = getSlideLayout(layoutId);

  const elements: SlideElement[] = layoutElements.map((el: TemplateElement, index: number) =>
    convertTemplateElement(el, index + 1)
  );

  return {
    id: uuidv4(),
    order: 0,
    elements,
    background: '#ffffff',
  };
};

function TemplateGallery({ isOpen, onClose }: TemplateGalleryProps) {
  const { actions } = usePresentation();
  const [activeCategory, setActiveCategory] = useState('general');
  const [selectedPack, setSelectedPack] = useState<TemplatePack | null>(null);

  // Memoize preview slides for selected pack - must be before conditional return
  const previewSlides = useMemo(() => {
    if (!selectedPack) return [];
    return selectedPack.slides.map(slideConfig => ({
      ...slideConfig,
      preview: createPreviewSlide(slideConfig.layoutId),
    }));
  }, [selectedPack]);

  if (!isOpen) return null;

  const currentCategory = templateCategories.find(c => c.id === activeCategory);

  const handleSelectPack = (pack: TemplatePack) => {
    setSelectedPack(pack);
  };

  const handleUsePack = () => {
    if (!selectedPack) return;

    // Create slides from template pack
    const slides: Slide[] = selectedPack.slides.map((slideConfig, index) => {
      const layoutElements = getSlideLayout(slideConfig.layoutId);

      // Convert template elements to slide elements using shared function
      const elements: SlideElement[] = layoutElements.map((el, elIndex) =>
        convertTemplateElement(el, elIndex + 1)
      );

      return {
        id: uuidv4(),
        order: index,
        elements,
        background: '#ffffff',
      };
    });

    // Create new presentation with template slides
    actions.createNewPresentation(selectedPack.name + ' Presentation');

    // Replace the default slide with template slides
    slides.forEach((slide, index) => {
      if (index === 0) {
        // Update first slide
        actions.updateSlide(slide);
      } else {
        // Add additional slides
        actions.addSlideWithTemplate(slide.elements, slide.background, '');
      }
    });

    onClose();
  };

  const handleBack = () => {
    setSelectedPack(null);
  };

  return (
    <div className="template-gallery-overlay" onClick={onClose}>
      <div className="template-gallery-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="template-gallery-header">
          {selectedPack ? (
            <button className="template-gallery-back" onClick={handleBack}>
              <span>←</span>
              Back to Templates
            </button>
          ) : (
            <h2 className="template-gallery-title">Template Gallery</h2>
          )}
          <button className="template-gallery-close" onClick={onClose}>×</button>
        </div>

        {selectedPack ? (
          // Pack Detail View
          <div className="template-gallery-detail">
            <div className="template-pack-info">
              <h3>{selectedPack.name}</h3>
              <p>{selectedPack.description}</p>
              <p className="template-slide-count">{selectedPack.slides.length} slides</p>
              <button className="template-use-btn" onClick={handleUsePack}>
                Use this template
              </button>
            </div>
            <div className="template-slides-preview">
              <h4>Included Slides</h4>
              <div className="template-slides-list">
                {previewSlides.map((slide, index) => (
                  <div key={index} className="template-slide-item">
                    <div className="template-slide-thumb">
                      <SlidePreviewMini slide={slide.preview} width={160} height={90} />
                      <span className="template-slide-number">{index + 1}</span>
                    </div>
                    <span className="template-slide-name">{slide.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Gallery View
          <>
            {/* Category Tabs */}
            <div className="template-gallery-tabs">
              {templateCategories.map(category => (
                <button
                  key={category.id}
                  className={`template-tab ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="template-gallery-content">
              <div className="template-grid">
                {(currentCategory?.packs || templatePacks).map(pack => {
                  const firstSlide = pack.slides[0];
                  const previewSlide = firstSlide ? createPreviewSlide(firstSlide.layoutId) : null;

                  return (
                    <div
                      key={pack.id}
                      className="template-card"
                      onClick={() => handleSelectPack(pack)}
                    >
                      <div className="template-card-preview">
                        {previewSlide ? (
                          <SlidePreviewMini slide={previewSlide} width={220} height={124} />
                        ) : (
                          <div className="template-card-thumb">
                            <span className="template-card-icon">□</span>
                          </div>
                        )}
                      </div>
                      <div className="template-card-info">
                        <h4>{pack.name}</h4>
                        <p>{pack.description}</p>
                        <span className="template-card-slides">{pack.slides.length} slides</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TemplateGallery;
