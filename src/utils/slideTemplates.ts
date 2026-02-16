import type { SlideMaster, TextElement, SlideElement } from '../types/presentation';
import { v4 as uuidv4 } from 'uuid';

// Default Slide Masters/Templates
export const DEFAULT_SLIDE_MASTERS: SlideMaster[] = [
  {
    id: 'blank',
    title: 'BLANK',
    displayName: 'Blank',
    background: { color: '#FFFFFF' },
    objects: [],
    placeholders: [],
  },
  {
    id: 'title-slide',
    title: 'TITLE_SLIDE',
    displayName: 'Title Slide',
    background: { color: '#1a365d' },
    objects: [
      {
        type: 'rect',
        options: {
          x: 0, y: 70, w: 100, h: 30,
          fill: '#2c5282',
        },
      },
    ],
    placeholders: [
      {
        name: 'title',
        type: 'title',
        position: { x: 10, y: 30, width: 80, height: 20 },
        defaultText: 'Click to add title',
        defaultStyle: {
          fontSize: 44,
          color: '#FFFFFF',
          bold: true,
          align: 'center',
        },
      },
      {
        name: 'subtitle',
        type: 'subtitle',
        position: { x: 15, y: 55, width: 70, height: 10 },
        defaultText: 'Click to add subtitle',
        defaultStyle: {
          fontSize: 24,
          color: '#E2E8F0',
          align: 'center',
        },
      },
    ],
  },
  {
    id: 'title-content',
    title: 'TITLE_CONTENT',
    displayName: 'Title and Content',
    background: { color: '#FFFFFF' },
    objects: [
      {
        type: 'rect',
        options: {
          x: 0, y: 0, w: 100, h: 15,
          fill: '#3182ce',
        },
      },
    ],
    placeholders: [
      {
        name: 'title',
        type: 'title',
        position: { x: 5, y: 2, width: 90, height: 10 },
        defaultText: 'Click to add title',
        defaultStyle: {
          fontSize: 32,
          color: '#FFFFFF',
          bold: true,
          align: 'left',
        },
      },
      {
        name: 'body',
        type: 'body',
        position: { x: 5, y: 18, width: 90, height: 75 },
        defaultText: 'Click to add content',
        defaultStyle: {
          fontSize: 18,
          color: '#2D3748',
          align: 'left',
        },
      },
    ],
  },
  {
    id: 'two-column',
    title: 'TWO_COLUMN',
    displayName: 'Two Columns',
    background: { color: '#FFFFFF' },
    objects: [
      {
        type: 'rect',
        options: {
          x: 0, y: 0, w: 100, h: 15,
          fill: '#38a169',
        },
      },
      {
        type: 'line',
        options: {
          x: 50, y: 18, w: 0, h: 75,
          line: { color: '#E2E8F0', width: 2 },
        },
      },
    ],
    placeholders: [
      {
        name: 'title',
        type: 'title',
        position: { x: 5, y: 2, width: 90, height: 10 },
        defaultText: 'Click to add title',
        defaultStyle: {
          fontSize: 32,
          color: '#FFFFFF',
          bold: true,
          align: 'left',
        },
      },
      {
        name: 'left',
        type: 'content',
        position: { x: 3, y: 18, width: 44, height: 75 },
        defaultText: 'Left column content',
        defaultStyle: {
          fontSize: 16,
          color: '#2D3748',
          align: 'left',
        },
      },
      {
        name: 'right',
        type: 'content',
        position: { x: 53, y: 18, width: 44, height: 75 },
        defaultText: 'Right column content',
        defaultStyle: {
          fontSize: 16,
          color: '#2D3748',
          align: 'left',
        },
      },
    ],
  },
  {
    id: 'section-header',
    title: 'SECTION_HEADER',
    displayName: 'Section Header',
    background: { color: '#553c9a' },
    objects: [
      {
        type: 'rect',
        options: {
          x: 0, y: 85, w: 100, h: 15,
          fill: '#6b46c1',
        },
      },
    ],
    placeholders: [
      {
        name: 'title',
        type: 'title',
        position: { x: 10, y: 35, width: 80, height: 20 },
        defaultText: 'Section Title',
        defaultStyle: {
          fontSize: 48,
          color: '#FFFFFF',
          bold: true,
          align: 'center',
        },
      },
      {
        name: 'subtitle',
        type: 'subtitle',
        position: { x: 15, y: 58, width: 70, height: 10 },
        defaultText: 'Section description',
        defaultStyle: {
          fontSize: 20,
          color: '#D6BCFA',
          align: 'center',
        },
      },
    ],
  },
  {
    id: 'title-image',
    title: 'TITLE_IMAGE',
    displayName: 'Title and Image',
    background: { color: '#FFFFFF' },
    objects: [
      {
        type: 'rect',
        options: {
          x: 0, y: 0, w: 100, h: 15,
          fill: '#dd6b20',
        },
      },
    ],
    placeholders: [
      {
        name: 'title',
        type: 'title',
        position: { x: 5, y: 2, width: 90, height: 10 },
        defaultText: 'Click to add title',
        defaultStyle: {
          fontSize: 32,
          color: '#FFFFFF',
          bold: true,
          align: 'left',
        },
      },
      {
        name: 'content',
        type: 'body',
        position: { x: 3, y: 18, width: 45, height: 75 },
        defaultText: 'Add your content here',
        defaultStyle: {
          fontSize: 16,
          color: '#2D3748',
          align: 'left',
        },
      },
      {
        name: 'image',
        type: 'image',
        position: { x: 52, y: 18, width: 45, height: 75 },
        defaultText: 'Image placeholder',
      },
    ],
  },
  {
    id: 'comparison',
    title: 'COMPARISON',
    displayName: 'Comparison',
    background: { color: '#FFFFFF' },
    objects: [
      {
        type: 'rect',
        options: {
          x: 0, y: 0, w: 100, h: 15,
          fill: '#e53e3e',
        },
      },
      {
        type: 'rect',
        options: {
          x: 3, y: 18, w: 44, h: 8,
          fill: '#FED7D7',
        },
      },
      {
        type: 'rect',
        options: {
          x: 53, y: 18, w: 44, h: 8,
          fill: '#C6F6D5',
        },
      },
    ],
    placeholders: [
      {
        name: 'title',
        type: 'title',
        position: { x: 5, y: 2, width: 90, height: 10 },
        defaultText: 'Comparison Title',
        defaultStyle: {
          fontSize: 32,
          color: '#FFFFFF',
          bold: true,
          align: 'center',
        },
      },
      {
        name: 'left_title',
        type: 'subtitle',
        position: { x: 3, y: 18, width: 44, height: 8 },
        defaultText: 'Option A',
        defaultStyle: {
          fontSize: 20,
          color: '#C53030',
          bold: true,
          align: 'center',
          valign: 'middle',
        },
      },
      {
        name: 'right_title',
        type: 'subtitle',
        position: { x: 53, y: 18, width: 44, height: 8 },
        defaultText: 'Option B',
        defaultStyle: {
          fontSize: 20,
          color: '#276749',
          bold: true,
          align: 'center',
          valign: 'middle',
        },
      },
      {
        name: 'left',
        type: 'content',
        position: { x: 3, y: 28, width: 44, height: 65 },
        defaultText: 'Left content',
        defaultStyle: {
          fontSize: 16,
          color: '#2D3748',
          align: 'left',
        },
      },
      {
        name: 'right',
        type: 'content',
        position: { x: 53, y: 28, width: 44, height: 65 },
        defaultText: 'Right content',
        defaultStyle: {
          fontSize: 16,
          color: '#2D3748',
          align: 'left',
        },
      },
    ],
  },
  {
    id: 'content-caption',
    title: 'CONTENT_CAPTION',
    displayName: 'Content with Caption',
    background: { color: '#F7FAFC' },
    objects: [
      {
        type: 'rect',
        options: {
          x: 0, y: 85, w: 100, h: 15,
          fill: '#2D3748',
        },
      },
    ],
    placeholders: [
      {
        name: 'title',
        type: 'title',
        position: { x: 5, y: 3, width: 90, height: 10 },
        defaultText: 'Click to add title',
        defaultStyle: {
          fontSize: 32,
          color: '#2D3748',
          bold: true,
          align: 'left',
        },
      },
      {
        name: 'content',
        type: 'body',
        position: { x: 5, y: 15, width: 90, height: 65 },
        defaultText: 'Main content area',
        defaultStyle: {
          fontSize: 18,
          color: '#4A5568',
          align: 'left',
        },
      },
      {
        name: 'caption',
        type: 'footer',
        position: { x: 5, y: 87, width: 90, height: 10 },
        defaultText: 'Add caption or footer text',
        defaultStyle: {
          fontSize: 14,
          color: '#FFFFFF',
          align: 'center',
          valign: 'middle',
        },
      },
    ],
  },
];

// Create elements from a slide master template
export function createElementsFromMaster(master: SlideMaster): SlideElement[] {
  const elements: SlideElement[] = [];

  // Create placeholder elements as text boxes
  master.placeholders.forEach((placeholder) => {
    const textElement: TextElement = {
      id: uuidv4(),
      type: 'text',
      position: { ...placeholder.position },
      zIndex: elements.length + 1,
      content: placeholder.defaultText || '',
      fontSize: placeholder.defaultStyle?.fontSize || 18,
      fontFamily: placeholder.defaultStyle?.fontFamily || 'Arial',
      color: placeholder.defaultStyle?.color || '#000000',
      bold: placeholder.defaultStyle?.bold || false,
      italic: placeholder.defaultStyle?.italic || false,
      underline: placeholder.defaultStyle?.underline || false,
      strike: false,
      superscript: false,
      subscript: false,
      align: placeholder.defaultStyle?.align || 'left',
      valign: placeholder.defaultStyle?.valign || 'top',
    };
    elements.push(textElement);
  });

  return elements;
}

// Get master by title
export function getMasterByTitle(title: string): SlideMaster | undefined {
  return DEFAULT_SLIDE_MASTERS.find(m => m.title === title);
}

// Get master by id
export function getMasterById(id: string): SlideMaster | undefined {
  return DEFAULT_SLIDE_MASTERS.find(m => m.id === id);
}

// Get background color from master
export function getMasterBackground(master: SlideMaster): string {
  return master.background.color || '#FFFFFF';
}
