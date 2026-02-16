import pptxgen from 'pptxgenjs';
import type { Presentation, Slide, SlideElement, TextElement, ImageElement, ShapeElement, TableElement, ChartElement } from '../types/presentation';
import { DEFAULT_SLIDE_MASTERS } from '../utils/slideTemplates';

export class PPTXGenerator {
  private pres: pptxgen;
  private slideWidth: number = 10;
  private slideHeight: number = 7.5;

  constructor(presentation: Presentation) {
    this.pres = new pptxgen();
    this.setupPresentation(presentation);
  }

  private setupPresentation(presentation: Presentation): void {
    this.pres.author = 'Slide Builder';
    this.pres.title = presentation.title;
    this.pres.subject = 'Generated Presentation';

    // Set custom slide dimensions if specified
    if (presentation.metadata.slideWidth && presentation.metadata.slideHeight) {
      this.slideWidth = presentation.metadata.slideWidth;
      this.slideHeight = presentation.metadata.slideHeight;
      this.pres.defineLayout({
        name: 'CUSTOM',
        width: presentation.metadata.slideWidth,
        height: presentation.metadata.slideHeight,
      });
      this.pres.layout = 'CUSTOM';
    }

    // Define slide masters from templates
    this.defineSlideMasters();

    // Add all slides in order
    presentation.slides
      .sort((a, b) => a.order - b.order)
      .forEach(slide => this.addSlide(slide, presentation.metadata.slideWidth, presentation.metadata.slideHeight));
  }

  private defineSlideMasters(): void {
    // Define each slide master from our templates
    DEFAULT_SLIDE_MASTERS.forEach(master => {
      const masterObjects: any[] = [];

      // Convert our master objects to PptxGenJS format
      master.objects.forEach(obj => {
        if (obj.type === 'rect') {
          const x = typeof obj.options.x === 'string' ? parseFloat(obj.options.x) / 100 * this.slideWidth : (obj.options.x / 100) * this.slideWidth;
          const y = typeof obj.options.y === 'string' ? parseFloat(obj.options.y) / 100 * this.slideHeight : (obj.options.y / 100) * this.slideHeight;
          const w = obj.options.w ? (typeof obj.options.w === 'string' ? parseFloat(obj.options.w) / 100 * this.slideWidth : (obj.options.w as number / 100) * this.slideWidth) : this.slideWidth;
          const h = obj.options.h ? (typeof obj.options.h === 'string' ? parseFloat(obj.options.h) / 100 * this.slideHeight : (obj.options.h as number / 100) * this.slideHeight) : 1;

          masterObjects.push({
            rect: {
              x, y, w, h,
              fill: { color: obj.options.fill?.replace('#', '') || 'FFFFFF' },
            },
          });
        }
      });

      // Define the slide master
      try {
        this.pres.defineSlideMaster({
          title: master.title,
          background: { color: master.background.color?.replace('#', '') || 'FFFFFF' },
          objects: masterObjects,
        });
      } catch (e) {
        // Master already defined or error, skip
        console.warn(`Could not define master ${master.title}:`, e);
      }
    });
  }

  private addSlide(slide: Slide, slideWidth: number, slideHeight: number): void {
    // Create slide with master if specified
    const slideOptions: any = {};
    if (slide.masterName) {
      slideOptions.masterName = slide.masterName;
    }

    const pptxSlide = this.pres.addSlide(slideOptions);

    // Set background (only if not using a master, or overriding)
    if (slide.background && !slide.masterName) {
      if (slide.background.startsWith('#')) {
        pptxSlide.background = { color: slide.background.replace('#', '') };
      } else if (slide.background.startsWith('http') || slide.background.startsWith('data:')) {
        pptxSlide.background = { path: slide.background };
      }
    }

    // Add elements sorted by z-index
    slide.elements
      .sort((a, b) => a.zIndex - b.zIndex)
      .forEach(element => this.addElement(pptxSlide, element, slideWidth, slideHeight));
  }

  private addElement(slide: pptxgen.Slide, element: SlideElement, slideWidth: number, slideHeight: number): void {
    const { position } = element;

    // Convert percentage to inches
    const x = (position.x / 100) * slideWidth;
    const y = (position.y / 100) * slideHeight;
    const w = (position.width / 100) * slideWidth;
    const h = (position.height / 100) * slideHeight;

    switch (element.type) {
      case 'text':
        this.addTextElement(slide, element as TextElement, x, y, w, h);
        break;

      case 'image':
        this.addImageElement(slide, element as ImageElement, x, y, w, h);
        break;

      case 'shape':
        this.addShapeElement(slide, element as ShapeElement, x, y, w, h);
        break;

      case 'table':
        this.addTableElement(slide, element as TableElement, x, y, w, h);
        break;

      case 'chart':
        this.addChartElement(slide, element as ChartElement, x, y, w, h);
        break;
    }
  }

  private addTextElement(slide: pptxgen.Slide, element: TextElement, x: number, y: number, w: number, h: number): void {
    const listType = element.listType || 'none';

    if (listType === 'none') {
      // Regular text without bullets
      slide.addText(element.content, {
        x,
        y,
        w,
        h,
        fontSize: element.fontSize,
        fontFace: element.fontFamily,
        color: element.color.replace('#', ''),
        bold: element.bold,
        italic: element.italic,
        underline: element.underline ? { style: 'sng' } : undefined,
        align: element.align,
        valign: 'top',
      });
    } else {
      // Text with bullets or numbering
      const lines = element.content.split('\n').filter(line => line.trim() !== '');
      const listStyle = element.listStyle || (listType === 'bullets' ? 'disc' : 'decimal');

      // Map list styles to PptxGenJS bullet types
      let bulletOptions: any = { bullet: true };

      if (listType === 'bullets') {
        // Bullet types: https://gitbrent.github.io/PptxGenJS/docs/api-text.html
        bulletOptions = { bullet: { type: listStyle === 'circle' ? 'bullet' : listStyle === 'square' ? 'bullet' : 'bullet' } };
      } else {
        // Number types
        bulletOptions = { bullet: {
          type: 'number',
          style: listStyle === 'lower-alpha' ? 'alphaLcPeriod' :
                 listStyle === 'upper-alpha' ? 'alphaUcPeriod' :
                 listStyle === 'lower-roman' ? 'romanLcPeriod' :
                 listStyle === 'upper-roman' ? 'romanUcPeriod' :
                 'arabicPeriod'
        }};
      }

      // Create text array with bullet options for each line
      const textArray = lines.map(line => ({
        text: line,
        options: {
          fontSize: element.fontSize,
          fontFace: element.fontFamily,
          color: element.color.replace('#', ''),
          bold: element.bold,
          italic: element.italic,
          underline: element.underline ? { style: 'sng' } : undefined,
          align: element.align,
          ...bulletOptions,
        }
      }));

      slide.addText(textArray, {
        x,
        y,
        w,
        h,
        valign: 'top',
      });
    }
  }

  private addImageElement(slide: pptxgen.Slide, element: ImageElement, x: number, y: number, w: number, h: number): void {
    slide.addImage({
      path: element.src,
      x,
      y,
      w,
      h,
    });
  }

  private addShapeElement(slide: pptxgen.Slide, element: ShapeElement, x: number, y: number, w: number, h: number): void {
    const shapeType = this.getShapeType(element.shapeType);

    slide.addShape(shapeType, {
      x,
      y,
      w,
      h,
      fill: { color: element.fillColor.replace('#', '') },
      line: {
        color: element.borderColor.replace('#', ''),
        width: element.borderWidth,
      },
    });
  }

  private getShapeType(shapeType: string): pptxgen.ShapeType {
    const shapeMap: Record<string, pptxgen.ShapeType> = {
      rectangle: this.pres.ShapeType.rect,
      circle: this.pres.ShapeType.ellipse,
      line: this.pres.ShapeType.line,
    };
    return shapeMap[shapeType] || this.pres.ShapeType.rect;
  }

  private addTableElement(slide: pptxgen.Slide, element: TableElement, x: number, y: number, w: number, h: number): void {
    // Convert cells to PptxGenJS format
    const rows = element.cells.map((row, rowIdx) =>
      row.map(cell => ({
        text: cell.text || '',
        options: {
          fontSize: cell.fontSize || 12,
          color: cell.color?.replace('#', '') || '000000',
          fill: cell.fillColor?.replace('#', '') || (rowIdx === 0 && element.headerRow ? 'F0F0F0' : 'FFFFFF'),
          bold: cell.bold || (rowIdx === 0 && element.headerRow),
          italic: cell.italic,
          align: cell.align || 'left',
          valign: cell.valign || 'middle',
          colspan: cell.colspan,
          rowspan: cell.rowspan,
        },
      }))
    );

    slide.addTable(rows, {
      x,
      y,
      w,
      h,
      border: {
        type: 'solid',
        pt: element.borderWidth,
        color: element.borderColor.replace('#', ''),
      },
    });
  }

  private addChartElement(slide: pptxgen.Slide, element: ChartElement, x: number, y: number, w: number, h: number): void {
    const chartType = this.getChartType(element.chartType);

    // Prepare chart data
    const chartData = element.series.map(series => ({
      name: series.name,
      labels: element.labels,
      values: series.values,
    }));

    const chartOptions: any = {
      x,
      y,
      w,
      h,
      showTitle: element.showTitle,
      title: element.title,
      showLegend: element.showLegend,
      chartColors: element.series.map(s => s.color?.replace('#', '') || '4A90E2'),
    };

    // Add chart type specific options
    if (['pie', 'doughnut'].includes(element.chartType)) {
      chartOptions.showPercent = true;
      chartOptions.showValue = false;
    } else {
      chartOptions.catAxisTitle = element.labels[0] || '';
      chartOptions.valAxisTitle = 'Values';
    }

    slide.addChart(chartType, chartData, chartOptions);
  }

  private getChartType(chartType: string): pptxgen.ChartType {
    const chartTypeMap: Record<string, pptxgen.ChartType> = {
      bar: this.pres.ChartType.bar,
      column: this.pres.ChartType.bar, // PptxGenJS uses 'bar' for both
      line: this.pres.ChartType.line,
      area: this.pres.ChartType.area,
      pie: this.pres.ChartType.pie,
      doughnut: this.pres.ChartType.doughnut,
      scatter: this.pres.ChartType.scatter,
      bubble: this.pres.ChartType.bubble,
      radar: this.pres.ChartType.radar,
    };
    return chartTypeMap[chartType] || this.pres.ChartType.bar;
  }

  async download(fileName: string = 'presentation.pptx'): Promise<void> {
    await this.pres.writeFile({ fileName });
  }

  async getBlob(): Promise<Blob> {
    return (await this.pres.write({ outputType: 'blob' })) as Blob;
  }
}

export const generateAndDownloadPPTX = async (presentation: Presentation, fileName?: string): Promise<void> => {
  const generator = new PPTXGenerator(presentation);
  await generator.download(fileName || `${presentation.title}.pptx`);
};
