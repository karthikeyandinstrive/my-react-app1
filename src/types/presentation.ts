// Core type definitions for the presentation builder

export type ElementType = 'text' | 'image' | 'shape' | 'table' | 'chart';

export interface Position {
  x: number;        // Percentage (0-100)
  y: number;        // Percentage (0-100)
  width: number;    // Percentage (0-100)
  height: number;   // Percentage (0-100)
}

export interface BaseElement {
  id: string;
  type: ElementType;
  position: Position;
  zIndex: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  superscript: boolean;
  subscript: boolean;
  align: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  listType?: 'none' | 'bullets' | 'numbers';
  listStyle?: 'disc' | 'circle' | 'square' | 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman';
  // Text effects
  outlineColor?: string;
  outlineWidth?: number;
  glowColor?: string;
  glowSize?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  // Fill
  backgroundColor?: string;
  highlight?: string;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;          // URL or base64
  alt: string;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'line';
  fillColor: string;
  borderColor: string;
  borderWidth: number;
}

export interface TableCell {
  text: string;
  bold?: boolean;
  italic?: boolean;
  fontSize?: number;
  color?: string;
  fillColor?: string;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  colspan?: number;
  rowspan?: number;
}

export interface TableElement extends BaseElement {
  type: 'table';
  rows: number;
  cols: number;
  cells: TableCell[][];
  borderColor: string;
  borderWidth: number;
  headerRow: boolean;
}

export type ChartType = 'bar' | 'column' | 'line' | 'area' | 'pie' | 'doughnut' | 'scatter' | 'bubble' | 'radar';

export interface ChartSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface ChartElement extends BaseElement {
  type: 'chart';
  chartType: ChartType;
  title: string;
  labels: string[];
  series: ChartSeries[];
  showLegend: boolean;
  showTitle: boolean;
}

export type SlideElement = TextElement | ImageElement | ShapeElement | TableElement | ChartElement;

export interface Slide {
  id: string;
  order: number;
  elements: SlideElement[];
  background: string;    // Color (hex) or image URL
  thumbnail?: string;    // Generated preview (optional)
}

export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
  metadata: {
    slideWidth: number;  // Default 10 inches
    slideHeight: number; // Default 7.5 inches
    theme?: string;
  };
}

export interface PresentationState {
  presentation: Presentation | null;
  currentSlideIndex: number;
  selectedElementId: string | null;
  isPreviewMode: boolean;
  isSaving: boolean;
  lastSaved: string | null;
  copiedElement: SlideElement | null;
}

// API request/response types
export interface SavePresentationRequest {
  presentation: Presentation;
}

export interface SavePresentationResponse {
  id: string;
  success: boolean;
  message: string;
}

export interface LoadPresentationResponse {
  presentation: Presentation;
}
