// Default values and constants

export const DEFAULT_SLIDE_WIDTH = 10; // inches
export const DEFAULT_SLIDE_HEIGHT = 7.5; // inches (16:9 aspect ratio)

export const DEFAULT_TEXT_ELEMENT = {
  fontSize: 18,
  fontFamily: 'Arial',
  color: '#000000',
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  superscript: false,
  subscript: false,
  align: 'left' as const,
  valign: 'top' as const,
  listType: 'none' as const,
  listStyle: 'disc' as const,
  // Text effects - optional, undefined by default
  outlineColor: undefined as string | undefined,
  outlineWidth: undefined as number | undefined,
  glowColor: undefined as string | undefined,
  glowSize: undefined as number | undefined,
  shadowColor: undefined as string | undefined,
  shadowBlur: undefined as number | undefined,
  shadowOffsetX: undefined as number | undefined,
  shadowOffsetY: undefined as number | undefined,
  backgroundColor: undefined as string | undefined,
  highlight: undefined as string | undefined,
};

export const DEFAULT_SHAPE_ELEMENT = {
  fillColor: '#4A90E2',
  borderColor: '#2E5C8A',
  borderWidth: 2,
};

export const DEFAULT_TABLE_ELEMENT = {
  borderColor: '#000000',
  borderWidth: 1,
  headerRow: true,
};

export const DEFAULT_TABLE_CELL = {
  text: '',
  bold: false,
  italic: false,
  fontSize: 12,
  color: '#000000',
  fillColor: '#FFFFFF',
  align: 'left' as const,
  valign: 'middle' as const,
};

export const DEFAULT_CHART_ELEMENT = {
  showLegend: true,
  showTitle: true,
};

export const SAMPLE_CHART_DATA = {
  bar: {
    title: 'Sample Bar Chart',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Sales', values: [65, 59, 80, 81], color: '#4A90E2' },
      { name: 'Revenue', values: [45, 49, 60, 71], color: '#50C878' },
    ],
  },
  column: {
    title: 'Sample Column Chart',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [
      { name: 'Sales', values: [65, 59, 80, 81], color: '#4A90E2' },
      { name: 'Revenue', values: [45, 49, 60, 71], color: '#50C878' },
    ],
  },
  line: {
    title: 'Sample Line Chart',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    series: [
      { name: 'Product A', values: [30, 45, 35, 50, 55, 60], color: '#4A90E2' },
      { name: 'Product B', values: [20, 30, 25, 40, 45, 50], color: '#50C878' },
    ],
  },
  pie: {
    title: 'Sample Pie Chart',
    labels: ['Category A', 'Category B', 'Category C', 'Category D'],
    series: [
      { name: 'Value', values: [30, 25, 20, 25], color: '#4A90E2' },
    ],
  },
  doughnut: {
    title: 'Sample Doughnut Chart',
    labels: ['Category A', 'Category B', 'Category C', 'Category D'],
    series: [
      { name: 'Value', values: [30, 25, 20, 25], color: '#4A90E2' },
    ],
  },
  area: {
    title: 'Sample Area Chart',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    series: [
      { name: 'Metric', values: [40, 50, 45, 60], color: '#4A90E2' },
    ],
  },
  scatter: {
    title: 'Sample Scatter Chart',
    labels: ['Point 1', 'Point 2', 'Point 3', 'Point 4'],
    series: [
      { name: 'Series A', values: [15, 25, 35, 45], color: '#4A90E2' },
    ],
  },
  bubble: {
    title: 'Sample Bubble Chart',
    labels: ['Point 1', 'Point 2', 'Point 3', 'Point 4'],
    series: [
      { name: 'Series A', values: [15, 25, 35, 45], color: '#4A90E2' },
    ],
  },
  radar: {
    title: 'Sample Radar Chart',
    labels: ['Metric 1', 'Metric 2', 'Metric 3', 'Metric 4', 'Metric 5'],
    series: [
      { name: 'Performance', values: [65, 59, 80, 81, 56], color: '#4A90E2' },
    ],
  },
};

export const DEFAULT_SLIDE_BACKGROUND = '#FFFFFF';

export const AUTO_SAVE_DELAY = 2000; // milliseconds
