/**
 * Template Packs - Collections of slide templates
 */

import type { TemplatePack, TemplateElement, GridDefinition, TemplateCategory } from './templateTypes';

// Standard layout constants (based on 1920x1080 canvas)
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

// Professional margins (following 8pt grid system)
const MARGIN_LEFT = 120;        // Left margin
const MARGIN_RIGHT = 120;       // Right margin
const MARGIN_TOP = 100;         // Top margin for title
const MARGIN_BOTTOM = 80;       // Bottom margin

// Content area dimensions
const CONTENT_WIDTH = CANVAS_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;  // 1680px
const CONTENT_LEFT = MARGIN_LEFT;

// Vertical spacing
const TITLE_HEIGHT = 60;        // Title text height
const CONTENT_GAP = 64;         // Gap between title area and content
const HEADING_BODY_GAP = 48;    // Gap between heading and body text

// Column calculations
const COL_GAP = 48;             // Gap between columns
const TWO_COL_WIDTH = (CONTENT_WIDTH - COL_GAP) / 2;              // ~816px each
const THREE_COL_WIDTH = (CONTENT_WIDTH - COL_GAP * 2) / 3;        // ~528px each
const FOUR_COL_WIDTH = (CONTENT_WIDTH - COL_GAP * 3) / 4;         // ~384px each

// Vertical positioning helpers
const CONTENT_START = MARGIN_TOP + TITLE_HEIGHT + CONTENT_GAP;    // Where content begins after title
const CENTER_Y = CANVAS_HEIGHT / 2;                                // Vertical center

/**
 * Grid Definitions for layouts
 */
export const SLIDE_GRIDS: Record<string, GridDefinition> = {
  'blank': {
    rows: [{ height: 'auto' }],
    cols: [{ width: 'fr' }],
    outerMargin: 80,
    innerGap: 0,
  },
  'title-slide': {
    rows: [
      { height: 300 },
      { height: 160 },
      { height: 100 },
      { height: 'auto' },
      { height: 80 },
    ],
    cols: [{ width: 'fr' }],
    outerMargin: 100,
    innerGap: 20,
  },
  'title-content': {
    rows: [
      { height: 120 },
      { height: 'auto' },
    ],
    cols: [{ width: 'fr' }],
    outerMargin: 100,
    innerGap: 40,
  },
  'section-header': {
    rows: [
      { height: 'auto' },
      { height: 140 },
      { height: 80 },
      { height: 'auto' },
    ],
    cols: [{ width: 'fr' }],
    outerMargin: 100,
    innerGap: 20,
  },
  'two-column': {
    rows: [
      { height: 140 },
      { height: 'auto' },
    ],
    cols: [
      { width: 'fr' },
      { width: 'fr' },
    ],
    outerMargin: 100,
    innerGap: 60,
  },
  'three-column': {
    rows: [
      { height: 140 },
      { height: 'auto' },
    ],
    cols: [
      { width: 'fr' },
      { width: 'fr' },
      { width: 'fr' },
    ],
    outerMargin: 80,
    innerGap: 40,
  },
};

/**
 * Slide Layout Definitions
 */
export const SLIDE_LAYOUTS: Record<string, TemplateElement[]> = {
  'blank': [],

  // Title slide - centered vertically with golden ratio positioning
  'title-slide': [
    { type: 'text', role: 'title', left: CONTENT_LEFT, top: CENTER_Y - 120, width: CONTENT_WIDTH, text: 'Presentation Title', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'subtitle', left: CONTENT_LEFT, top: CENTER_Y + 40, width: CONTENT_WIDTH, text: 'Subtitle or tagline goes here', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT, top: CANVAS_HEIGHT - MARGIN_BOTTOM - 40, width: CONTENT_WIDTH, text: 'Presenter Name  |  Date  |  Company', textAlign: 'center', placeholder: true },
  ],

  // Title + content layout
  'title-content': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Slide Title', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT, top: CONTENT_START, width: CONTENT_WIDTH, text: 'Add your content here. This could be text, an image placeholder, or a chart.', textAlign: 'left', placeholder: true },
  ],

  // Section header - vertically centered
  'section-header': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: CENTER_Y - 80, width: CONTENT_WIDTH, text: 'Section Title', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'subtitle', left: CONTENT_LEFT, top: CENTER_Y + 40, width: CONTENT_WIDTH, text: 'Brief description of this section', textAlign: 'center', placeholder: true },
  ],

  // Content body with bullet points
  'content-body': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Slide Title', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT, top: CONTENT_START, width: CONTENT_WIDTH, text: '• First point goes here\n• Second point with more detail\n• Third point to consider\n• Additional information as needed', textAlign: 'left', placeholder: true },
  ],

  // Two column layout with proper spacing
  'two-column': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Comparison Title', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT, top: CONTENT_START, width: TWO_COL_WIDTH, text: 'Left Column', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT, top: CONTENT_START + HEADING_BODY_GAP, width: TWO_COL_WIDTH, text: '• Point one\n• Point two\n• Point three', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP, top: CONTENT_START, width: TWO_COL_WIDTH, text: 'Right Column', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP, top: CONTENT_START + HEADING_BODY_GAP, width: TWO_COL_WIDTH, text: '• Point one\n• Point two\n• Point three', textAlign: 'left', placeholder: true },
  ],

  // Three column layout
  'three-column': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Three Options', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT, top: CONTENT_START, width: THREE_COL_WIDTH, text: 'Option A', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT, top: CONTENT_START + HEADING_BODY_GAP, width: THREE_COL_WIDTH, text: 'Description of the first option', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + THREE_COL_WIDTH + COL_GAP, top: CONTENT_START, width: THREE_COL_WIDTH, text: 'Option B', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT + THREE_COL_WIDTH + COL_GAP, top: CONTENT_START + HEADING_BODY_GAP, width: THREE_COL_WIDTH, text: 'Description of the second option', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + (THREE_COL_WIDTH + COL_GAP) * 2, top: CONTENT_START, width: THREE_COL_WIDTH, text: 'Option C', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT + (THREE_COL_WIDTH + COL_GAP) * 2, top: CONTENT_START + HEADING_BODY_GAP, width: THREE_COL_WIDTH, text: 'Description of the third option', textAlign: 'center', placeholder: true },
  ],

  // Quote layout - centered with proper padding
  'quote': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT + 100, top: CENTER_Y - 100, width: CONTENT_WIDTH - 200, text: '"Innovation distinguishes between a leader and a follower."', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'subtitle', left: CONTENT_LEFT + 100, top: CENTER_Y + 80, width: CONTENT_WIDTH - 200, text: '— Steve Jobs', textAlign: 'center', placeholder: true },
  ],

  // Stats/metrics with 4 columns
  'stats-metrics': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Key Metrics', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'title', left: CONTENT_LEFT, top: CENTER_Y - 100, width: FOUR_COL_WIDTH, text: '95%', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT, top: CENTER_Y + 60, width: FOUR_COL_WIDTH, text: 'Customer Satisfaction', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'title', left: CONTENT_LEFT + FOUR_COL_WIDTH + COL_GAP, top: CENTER_Y - 100, width: FOUR_COL_WIDTH, text: '2.5M', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + FOUR_COL_WIDTH + COL_GAP, top: CENTER_Y + 60, width: FOUR_COL_WIDTH, text: 'Active Users', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'title', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 2, top: CENTER_Y - 100, width: FOUR_COL_WIDTH, text: '$12M', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 2, top: CENTER_Y + 60, width: FOUR_COL_WIDTH, text: 'Revenue Growth', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'title', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 3, top: CENTER_Y - 100, width: FOUR_COL_WIDTH, text: '150+', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 3, top: CENTER_Y + 60, width: FOUR_COL_WIDTH, text: 'Team Members', textAlign: 'center', placeholder: true },
  ],

  // Comparison layout
  'comparison': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Option A vs Option B', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT, top: CONTENT_START, width: TWO_COL_WIDTH, text: 'Option A', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT, top: CONTENT_START + HEADING_BODY_GAP, width: TWO_COL_WIDTH, text: '+ Advantage one\n+ Advantage two\n- Disadvantage one', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP, top: CONTENT_START, width: TWO_COL_WIDTH, text: 'Option B', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP, top: CONTENT_START + HEADING_BODY_GAP, width: TWO_COL_WIDTH, text: '+ Advantage one\n- Disadvantage one\n- Disadvantage two', textAlign: 'left', placeholder: true },
  ],

  // Agenda layout
  'agenda': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Agenda', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT, top: CONTENT_START, width: CONTENT_WIDTH, text: '1. Introduction\n2. Key Topics\n3. Discussion\n4. Next Steps\n5. Q&A', textAlign: 'left', placeholder: true },
  ],

  // Team bio with 3 columns
  'team-bio': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Meet the Team', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT, top: CENTER_Y - 60, width: THREE_COL_WIDTH, text: 'John Doe', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT, top: CENTER_Y + 40, width: THREE_COL_WIDTH, text: 'CEO & Founder', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + THREE_COL_WIDTH + COL_GAP, top: CENTER_Y - 60, width: THREE_COL_WIDTH, text: 'Jane Smith', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + THREE_COL_WIDTH + COL_GAP, top: CENTER_Y + 40, width: THREE_COL_WIDTH, text: 'CTO', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + (THREE_COL_WIDTH + COL_GAP) * 2, top: CENTER_Y - 60, width: THREE_COL_WIDTH, text: 'Mike Johnson', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + (THREE_COL_WIDTH + COL_GAP) * 2, top: CENTER_Y + 40, width: THREE_COL_WIDTH, text: 'Head of Product', textAlign: 'center', placeholder: true },
  ],

  // Timeline with 4 phases
  'timeline': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Project Timeline', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT, top: CENTER_Y - 60, width: FOUR_COL_WIDTH, text: 'Phase 1', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT, top: CENTER_Y + 40, width: FOUR_COL_WIDTH, text: 'Q1 2025', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + FOUR_COL_WIDTH + COL_GAP, top: CENTER_Y - 60, width: FOUR_COL_WIDTH, text: 'Phase 2', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + FOUR_COL_WIDTH + COL_GAP, top: CENTER_Y + 40, width: FOUR_COL_WIDTH, text: 'Q2 2025', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 2, top: CENTER_Y - 60, width: FOUR_COL_WIDTH, text: 'Phase 3', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 2, top: CENTER_Y + 40, width: FOUR_COL_WIDTH, text: 'Q3 2025', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 3, top: CENTER_Y - 60, width: FOUR_COL_WIDTH, text: 'Phase 4', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 3, top: CENTER_Y + 40, width: FOUR_COL_WIDTH, text: 'Q4 2025', textAlign: 'center', placeholder: true },
  ],

  // Thank you - centered
  'thank-you': [
    { type: 'text', role: 'title', left: CONTENT_LEFT, top: CENTER_Y - 80, width: CONTENT_WIDTH, text: 'Thank You', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT, top: CENTER_Y + 60, width: CONTENT_WIDTH, text: 'Contact: email@example.com', textAlign: 'center', placeholder: true },
  ],

  // Chart layouts - full width chart
  'chart-bar': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Sales Performance', textAlign: 'left', placeholder: true },
    {
      type: 'chart',
      chartType: 'bar',
      left: CONTENT_LEFT,
      top: CONTENT_START,
      width: CONTENT_WIDTH,
      height: CANVAS_HEIGHT - CONTENT_START - MARGIN_BOTTOM,
      chartTitle: 'Quarterly Sales',
      chartLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
      chartSeries: [
        { name: 'Product A', values: [120, 150, 180, 200], color: '#6366f1' },
        { name: 'Product B', values: [80, 110, 140, 160], color: '#8b5cf6' },
      ],
      showLegend: true,
      showTitle: true,
    },
  ],

  // Centered pie chart
  'chart-pie': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Market Share Analysis', textAlign: 'center', placeholder: true },
    {
      type: 'chart',
      chartType: 'pie',
      left: (CANVAS_WIDTH - 900) / 2,
      top: CONTENT_START,
      width: 900,
      height: CANVAS_HEIGHT - CONTENT_START - MARGIN_BOTTOM,
      chartTitle: 'Market Distribution',
      chartLabels: ['Product A', 'Product B', 'Product C', 'Others'],
      chartSeries: [
        { name: 'Share', values: [35, 28, 22, 15], color: '#6366f1' },
      ],
      showLegend: true,
      showTitle: false,
    },
  ],

  // Full width line chart
  'chart-line': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Growth Trends', textAlign: 'left', placeholder: true },
    {
      type: 'chart',
      chartType: 'line',
      left: CONTENT_LEFT,
      top: CONTENT_START,
      width: CONTENT_WIDTH,
      height: CANVAS_HEIGHT - CONTENT_START - MARGIN_BOTTOM,
      chartTitle: 'Monthly Revenue',
      chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      chartSeries: [
        { name: '2024', values: [50, 65, 80, 95, 110, 130], color: '#6366f1' },
        { name: '2025', values: [60, 85, 100, 125, 150, 180], color: '#10b981' },
      ],
      showLegend: true,
      showTitle: true,
    },
  ],

  // Centered doughnut chart
  'chart-doughnut': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Budget Allocation', textAlign: 'center', placeholder: true },
    {
      type: 'chart',
      chartType: 'doughnut',
      left: (CANVAS_WIDTH - 900) / 2,
      top: CONTENT_START,
      width: 900,
      height: CANVAS_HEIGHT - CONTENT_START - MARGIN_BOTTOM,
      chartTitle: 'Department Budget',
      chartLabels: ['Marketing', 'Engineering', 'Sales', 'Operations', 'HR'],
      chartSeries: [
        { name: 'Budget', values: [30, 35, 20, 10, 5], color: '#6366f1' },
      ],
      showLegend: true,
      showTitle: false,
    },
  ],

  // Chart with text - two column layout
  'chart-with-text': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Performance Overview', textAlign: 'left', placeholder: true },
    {
      type: 'chart',
      chartType: 'bar',
      left: CONTENT_LEFT,
      top: CONTENT_START,
      width: TWO_COL_WIDTH,
      height: CANVAS_HEIGHT - CONTENT_START - MARGIN_BOTTOM,
      chartTitle: 'Metrics',
      chartLabels: ['Q1', 'Q2', 'Q3', 'Q4'],
      chartSeries: [
        { name: 'Revenue', values: [100, 120, 140, 180], color: '#6366f1' },
      ],
      showLegend: false,
      showTitle: false,
    },
    { type: 'text', role: 'headingMd', left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP, top: CONTENT_START, width: TWO_COL_WIDTH, text: 'Key Insights', textAlign: 'left', placeholder: true },
    { type: 'text', role: 'body', left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP, top: CONTENT_START + 56, width: TWO_COL_WIDTH, text: '• Strong growth in Q4\n• 80% increase from Q1\n• Above target by 15%\n• Projected to continue', textAlign: 'left', placeholder: true },
  ],

  // Table layouts - full width table
  'table-simple': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Data Overview', textAlign: 'left', placeholder: true },
    {
      type: 'table',
      left: CONTENT_LEFT,
      top: CONTENT_START,
      width: CONTENT_WIDTH,
      height: 480,
      rows: 5,
      cols: 4,
      headerRow: true,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      tableCells: [
        [
          { text: 'Category', bold: true, fillColor: '#6366f1', color: '#ffffff', align: 'center' },
          { text: 'Q1', bold: true, fillColor: '#6366f1', color: '#ffffff', align: 'center' },
          { text: 'Q2', bold: true, fillColor: '#6366f1', color: '#ffffff', align: 'center' },
          { text: 'Q3', bold: true, fillColor: '#6366f1', color: '#ffffff', align: 'center' },
        ],
        [
          { text: 'Product A', align: 'left' },
          { text: '$12,000', align: 'right' },
          { text: '$15,000', align: 'right' },
          { text: '$18,000', align: 'right' },
        ],
        [
          { text: 'Product B', align: 'left' },
          { text: '$8,500', align: 'right' },
          { text: '$9,200', align: 'right' },
          { text: '$11,000', align: 'right' },
        ],
        [
          { text: 'Product C', align: 'left' },
          { text: '$6,000', align: 'right' },
          { text: '$7,800', align: 'right' },
          { text: '$9,500', align: 'right' },
        ],
        [
          { text: 'Total', bold: true, fillColor: '#f3f4f6', align: 'left' },
          { text: '$26,500', bold: true, fillColor: '#f3f4f6', align: 'right' },
          { text: '$32,000', bold: true, fillColor: '#f3f4f6', align: 'right' },
          { text: '$38,500', bold: true, fillColor: '#f3f4f6', align: 'right' },
        ],
      ],
    },
  ],

  // Centered comparison table
  'table-comparison': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Feature Comparison', textAlign: 'center', placeholder: true },
    {
      type: 'table',
      left: CONTENT_LEFT,
      top: CONTENT_START,
      width: CONTENT_WIDTH,
      height: 560,
      rows: 6,
      cols: 4,
      headerRow: true,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      tableCells: [
        [
          { text: 'Feature', bold: true, fillColor: '#1e293b', color: '#ffffff', align: 'center' },
          { text: 'Basic', bold: true, fillColor: '#1e293b', color: '#ffffff', align: 'center' },
          { text: 'Pro', bold: true, fillColor: '#1e293b', color: '#ffffff', align: 'center' },
          { text: 'Enterprise', bold: true, fillColor: '#1e293b', color: '#ffffff', align: 'center' },
        ],
        [
          { text: 'Users', align: 'left' },
          { text: '1', align: 'center' },
          { text: '10', align: 'center' },
          { text: 'Unlimited', align: 'center' },
        ],
        [
          { text: 'Storage', align: 'left' },
          { text: '5 GB', align: 'center' },
          { text: '100 GB', align: 'center' },
          { text: '1 TB', align: 'center' },
        ],
        [
          { text: 'Support', align: 'left' },
          { text: 'Email', align: 'center' },
          { text: '24/7 Chat', align: 'center' },
          { text: 'Dedicated', align: 'center' },
        ],
        [
          { text: 'Analytics', align: 'left' },
          { text: 'Basic', align: 'center' },
          { text: 'Advanced', align: 'center' },
          { text: 'Custom', align: 'center' },
        ],
        [
          { text: 'Price', bold: true, fillColor: '#f3f4f6', align: 'left' },
          { text: '$9/mo', bold: true, fillColor: '#f3f4f6', align: 'center' },
          { text: '$29/mo', bold: true, fillColor: '#f3f4f6', align: 'center' },
          { text: 'Contact', bold: true, fillColor: '#f3f4f6', align: 'center' },
        ],
      ],
    },
  ],

  // Table with chart - two column layout
  'table-with-chart': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP, width: CONTENT_WIDTH, text: 'Sales Report', textAlign: 'left', placeholder: true },
    {
      type: 'table',
      left: CONTENT_LEFT,
      top: CONTENT_START,
      width: TWO_COL_WIDTH,
      height: 480,
      rows: 5,
      cols: 3,
      headerRow: true,
      borderColor: '#e5e7eb',
      borderWidth: 1,
      tableCells: [
        [
          { text: 'Region', bold: true, fillColor: '#6366f1', color: '#ffffff', align: 'center' },
          { text: 'Sales', bold: true, fillColor: '#6366f1', color: '#ffffff', align: 'center' },
          { text: 'Growth', bold: true, fillColor: '#6366f1', color: '#ffffff', align: 'center' },
        ],
        [
          { text: 'North', align: 'left' },
          { text: '$45,000', align: 'right' },
          { text: '+12%', color: '#10b981', align: 'center' },
        ],
        [
          { text: 'South', align: 'left' },
          { text: '$38,000', align: 'right' },
          { text: '+8%', color: '#10b981', align: 'center' },
        ],
        [
          { text: 'East', align: 'left' },
          { text: '$52,000', align: 'right' },
          { text: '+15%', color: '#10b981', align: 'center' },
        ],
        [
          { text: 'West', align: 'left' },
          { text: '$41,000', align: 'right' },
          { text: '+5%', color: '#f59e0b', align: 'center' },
        ],
      ],
    },
    {
      type: 'chart',
      chartType: 'pie',
      left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP,
      top: CONTENT_START,
      width: TWO_COL_WIDTH,
      height: CANVAS_HEIGHT - CONTENT_START - MARGIN_BOTTOM,
      chartTitle: 'Regional Distribution',
      chartLabels: ['North', 'South', 'East', 'West'],
      chartSeries: [
        { name: 'Sales', values: [45, 38, 52, 41], color: '#6366f1' },
      ],
      showLegend: true,
      showTitle: false,
    },
  ],

  // Dashboard layout with metrics and charts
  'data-dashboard': [
    { type: 'text', role: 'headingLg', left: CONTENT_LEFT, top: MARGIN_TOP - 40, width: CONTENT_WIDTH, text: 'Dashboard', textAlign: 'left', placeholder: true },
    // KPI row using 4 columns
    { type: 'text', role: 'title', left: CONTENT_LEFT, top: 120, width: FOUR_COL_WIDTH, text: '12.5K', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT, top: 200, width: FOUR_COL_WIDTH, text: 'Total Users', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'title', left: CONTENT_LEFT + FOUR_COL_WIDTH + COL_GAP, top: 120, width: FOUR_COL_WIDTH, text: '$85K', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + FOUR_COL_WIDTH + COL_GAP, top: 200, width: FOUR_COL_WIDTH, text: 'Revenue', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'title', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 2, top: 120, width: FOUR_COL_WIDTH, text: '94%', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 2, top: 200, width: FOUR_COL_WIDTH, text: 'Satisfaction', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'title', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 3, top: 120, width: FOUR_COL_WIDTH, text: '+23%', textAlign: 'center', placeholder: true },
    { type: 'text', role: 'caption', left: CONTENT_LEFT + (FOUR_COL_WIDTH + COL_GAP) * 3, top: 200, width: FOUR_COL_WIDTH, text: 'Growth', textAlign: 'center', placeholder: true },
    // Charts row
    {
      type: 'chart',
      chartType: 'line',
      left: CONTENT_LEFT,
      top: 280,
      width: TWO_COL_WIDTH,
      height: CANVAS_HEIGHT - 280 - MARGIN_BOTTOM,
      chartTitle: 'Monthly Trend',
      chartLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      chartSeries: [
        { name: 'Users', values: [8000, 9200, 10500, 11200, 11800, 12500], color: '#6366f1' },
      ],
      showLegend: false,
      showTitle: true,
    },
    {
      type: 'chart',
      chartType: 'doughnut',
      left: CONTENT_LEFT + TWO_COL_WIDTH + COL_GAP,
      top: 280,
      width: TWO_COL_WIDTH,
      height: CANVAS_HEIGHT - 280 - MARGIN_BOTTOM,
      chartTitle: 'Traffic Sources',
      chartLabels: ['Organic', 'Direct', 'Referral', 'Social'],
      chartSeries: [
        { name: 'Traffic', values: [45, 25, 18, 12], color: '#6366f1' },
      ],
      showLegend: true,
      showTitle: true,
    },
  ],
};

/**
 * Template Packs
 */
export const templatePacks: TemplatePack[] = [
  {
    id: 'blank',
    name: 'Blank',
    description: 'Start from scratch',
    slides: [
      { layoutId: 'blank', name: 'Blank Slide' },
    ],
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean and elegant design for professional presentations',
    background: '#f8fafc',
    slides: [
      { layoutId: 'title-slide', name: 'Title', background: '#1e293b' },
      { layoutId: 'agenda', name: 'Agenda' },
      { layoutId: 'section-header', name: 'Section', background: '#e2e8f0' },
      { layoutId: 'title-content', name: 'Content' },
      { layoutId: 'two-column', name: 'Two Column' },
      { layoutId: 'quote', name: 'Quote', background: '#f1f5f9' },
      { layoutId: 'thank-you', name: 'Thank You', background: '#1e293b' },
    ],
  },
  {
    id: 'pitch-deck',
    name: 'Pitch Deck',
    description: 'Perfect for startup and investor presentations',
    background: '#ffffff',
    slides: [
      { layoutId: 'title-slide', name: 'Cover', background: '#4f46e5' },
      { layoutId: 'content-body', name: 'Problem' },
      { layoutId: 'content-body', name: 'Solution' },
      { layoutId: 'three-column', name: 'Features' },
      { layoutId: 'stats-metrics', name: 'Traction', background: '#f5f3ff' },
      { layoutId: 'comparison', name: 'Competition' },
      { layoutId: 'team-bio', name: 'Team', background: '#faf5ff' },
      { layoutId: 'thank-you', name: 'Contact', background: '#4f46e5' },
    ],
  },
  {
    id: 'business-report',
    name: 'Business Report',
    description: 'Data-driven reports and analysis',
    slides: [
      { layoutId: 'title-slide', name: 'Cover' },
      { layoutId: 'agenda', name: 'Contents' },
      { layoutId: 'section-header', name: 'Section' },
      { layoutId: 'stats-metrics', name: 'Key Metrics' },
      { layoutId: 'two-column', name: 'Analysis' },
      { layoutId: 'comparison', name: 'Comparison' },
      { layoutId: 'timeline', name: 'Timeline' },
      { layoutId: 'thank-you', name: 'Summary' },
    ],
  },
  {
    id: 'project-proposal',
    name: 'Project Proposal',
    description: 'Present your project ideas effectively',
    slides: [
      { layoutId: 'title-slide', name: 'Title' },
      { layoutId: 'content-body', name: 'Overview' },
      { layoutId: 'content-body', name: 'Objectives' },
      { layoutId: 'three-column', name: 'Approach' },
      { layoutId: 'timeline', name: 'Timeline' },
      { layoutId: 'team-bio', name: 'Team' },
      { layoutId: 'stats-metrics', name: 'Budget' },
      { layoutId: 'thank-you', name: 'Next Steps' },
    ],
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Showcase your creative work',
    background: '#fafafa',
    slides: [
      { layoutId: 'title-slide', name: 'Intro', background: '#18181b' },
      { layoutId: 'section-header', name: 'About Me', background: '#27272a' },
      { layoutId: 'two-column', name: 'Work' },
      { layoutId: 'quote', name: 'Philosophy', background: '#f4f4f5' },
      { layoutId: 'three-column', name: 'Services' },
      { layoutId: 'thank-you', name: 'Contact', background: '#18181b' },
    ],
  },
  {
    id: 'educational',
    name: 'Educational',
    description: 'Teaching and training presentations',
    slides: [
      { layoutId: 'title-slide', name: 'Course Title' },
      { layoutId: 'agenda', name: 'Outline' },
      { layoutId: 'section-header', name: 'Topic' },
      { layoutId: 'content-body', name: 'Content' },
      { layoutId: 'two-column', name: 'Compare' },
      { layoutId: 'quote', name: 'Key Point' },
      { layoutId: 'thank-you', name: 'Summary' },
    ],
  },
  {
    id: 'data-charts',
    name: 'Data & Charts',
    description: 'Data visualization and analytics presentations',
    slides: [
      { layoutId: 'title-slide', name: 'Cover' },
      { layoutId: 'data-dashboard', name: 'Dashboard' },
      { layoutId: 'chart-bar', name: 'Bar Chart' },
      { layoutId: 'chart-line', name: 'Line Chart' },
      { layoutId: 'chart-pie', name: 'Pie Chart' },
      { layoutId: 'chart-with-text', name: 'Chart + Text' },
      { layoutId: 'table-with-chart', name: 'Table + Chart' },
      { layoutId: 'thank-you', name: 'Summary' },
    ],
  },
  {
    id: 'tables-data',
    name: 'Tables & Data',
    description: 'Data tables and comparison presentations',
    slides: [
      { layoutId: 'title-slide', name: 'Cover' },
      { layoutId: 'table-simple', name: 'Data Table' },
      { layoutId: 'table-comparison', name: 'Comparison' },
      { layoutId: 'stats-metrics', name: 'Key Metrics' },
      { layoutId: 'table-with-chart', name: 'Table + Chart' },
      { layoutId: 'thank-you', name: 'Summary' },
    ],
  },
  {
    id: 'sales-report',
    name: 'Sales Report',
    description: 'Quarterly sales and revenue reports',
    slides: [
      { layoutId: 'title-slide', name: 'Report Cover' },
      { layoutId: 'stats-metrics', name: 'Key Metrics' },
      { layoutId: 'chart-bar', name: 'Sales Performance' },
      { layoutId: 'chart-line', name: 'Growth Trend' },
      { layoutId: 'table-simple', name: 'Regional Data' },
      { layoutId: 'chart-pie', name: 'Market Share' },
      { layoutId: 'comparison', name: 'YoY Compare' },
      { layoutId: 'thank-you', name: 'Summary' },
    ],
  },
];

/**
 * Template Categories
 */
export const templateCategories: TemplateCategory[] = [
  {
    id: 'general',
    name: 'General',
    packs: templatePacks.filter(p => ['blank', 'modern-minimal'].includes(p.id)),
  },
  {
    id: 'business',
    name: 'Business',
    packs: templatePacks.filter(p => ['pitch-deck', 'business-report', 'project-proposal', 'sales-report'].includes(p.id)),
  },
  {
    id: 'data',
    name: 'Data & Charts',
    packs: templatePacks.filter(p => ['data-charts', 'tables-data', 'sales-report'].includes(p.id)),
  },
  {
    id: 'creative',
    name: 'Creative',
    packs: templatePacks.filter(p => ['creative-portfolio'].includes(p.id)),
  },
  {
    id: 'education',
    name: 'Education',
    packs: templatePacks.filter(p => ['educational'].includes(p.id)),
  },
];

/**
 * Helper functions
 */
export const getTemplatePackById = (id: string): TemplatePack | undefined => {
  return templatePacks.find(p => p.id === id);
};

export const getSlideLayout = (layoutId: string): TemplateElement[] => {
  return SLIDE_LAYOUTS[layoutId] || [];
};

export const getLayoutGrid = (layoutId: string): GridDefinition | undefined => {
  return SLIDE_GRIDS[layoutId];
};
