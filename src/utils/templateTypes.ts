/**
 * Template Types for Slide Builder
 */

export interface GridRow {
  height: number | 'auto';
}

export interface GridCol {
  width: number | 'fr';
}

export interface GridDefinition {
  rows: GridRow[];
  cols: GridCol[];
  outerMargin: number;
  innerGap: number;
}

export interface TemplateChartSeries {
  name: string;
  values: number[];
  color?: string;
}

export interface TemplateTableCell {
  text: string;
  bold?: boolean;
  fontSize?: number;
  color?: string;
  fillColor?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TemplateElement {
  type: 'text' | 'image' | 'chart' | 'table' | 'icon' | 'shape';
  role?: 'title' | 'subtitle' | 'headingLg' | 'headingMd' | 'body' | 'caption';
  left: number;
  top: number;
  width?: number;
  height?: number;
  text?: string;
  textAlign?: 'left' | 'center' | 'right';
  placeholder?: boolean;
  // Chart specific
  chartType?: 'pie' | 'bar' | 'line' | 'scatter' | 'doughnut' | 'area' | 'column' | 'radar';
  chartTitle?: string;
  chartLabels?: string[];
  chartSeries?: TemplateChartSeries[];
  showLegend?: boolean;
  showTitle?: boolean;
  // Table specific
  rows?: number;
  cols?: number;
  tableThemeId?: string;
  tableCells?: TemplateTableCell[][];
  headerRow?: boolean;
  borderColor?: string;
  borderWidth?: number;
  // Icon specific
  iconName?: string;
  iconColor?: string;
  iconSize?: number;
}

export interface SlideTemplate {
  id: string;
  name: string;
  category: 'core' | 'business' | 'creative' | 'data';
  grid?: GridDefinition;
  elements: TemplateElement[];
}

export interface TemplatePack {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  slides: {
    layoutId: string;
    name: string;
  }[];
}

export interface TemplateCategory {
  id: string;
  name: string;
  packs: TemplatePack[];
}
