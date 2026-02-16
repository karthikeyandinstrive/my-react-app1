// Font Theme definitions for presentation text styles
// Each theme defines font families and sizes for different text roles

export interface FontTheme {
  id: string;
  name: string;
  category: string;
  description: string;
  fonts: {
    heading: string;
    body: string;
  };
  // Text style presets for this theme
  styles: {
    title: { font: string; size: number; weight: number };
    subtitle: { font: string; size: number; weight: number };
    headingLarge: { font: string; size: number; weight: number };
    headingMedium: { font: string; size: number; weight: number };
    headingSmall: { font: string; size: number; weight: number };
    body: { font: string; size: number; weight: number };
    quote: { font: string; size: number; weight: number; italic: boolean };
    caption: { font: string; size: number; weight: number };
  };
}

export const fontThemes: FontTheme[] = [
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    category: 'Minimal',
    description: 'Clean sans-serif typography for modern presentations',
    fonts: { heading: 'Inter', body: 'Inter' },
    styles: {
      title: { font: 'Inter', size: 48, weight: 700 },
      subtitle: { font: 'Inter', size: 32, weight: 500 },
      headingLarge: { font: 'Inter', size: 36, weight: 600 },
      headingMedium: { font: 'Inter', size: 28, weight: 600 },
      headingSmall: { font: 'Inter', size: 24, weight: 500 },
      body: { font: 'Inter', size: 20, weight: 400 },
      quote: { font: 'Inter', size: 24, weight: 400, italic: true },
      caption: { font: 'Inter', size: 16, weight: 400 },
    },
  },
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    category: 'Traditional',
    description: 'Elegant serif fonts for formal presentations',
    fonts: { heading: 'Georgia', body: 'Georgia' },
    styles: {
      title: { font: 'Georgia', size: 52, weight: 700 },
      subtitle: { font: 'Georgia', size: 30, weight: 400 },
      headingLarge: { font: 'Georgia', size: 38, weight: 700 },
      headingMedium: { font: 'Georgia', size: 28, weight: 700 },
      headingSmall: { font: 'Georgia', size: 22, weight: 600 },
      body: { font: 'Georgia', size: 18, weight: 400 },
      quote: { font: 'Georgia', size: 22, weight: 400, italic: true },
      caption: { font: 'Georgia', size: 14, weight: 400 },
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    category: 'Business',
    description: 'Arial-based fonts for corporate presentations',
    fonts: { heading: 'Arial', body: 'Arial' },
    styles: {
      title: { font: 'Arial', size: 44, weight: 700 },
      subtitle: { font: 'Arial', size: 28, weight: 500 },
      headingLarge: { font: 'Arial', size: 32, weight: 700 },
      headingMedium: { font: 'Arial', size: 26, weight: 600 },
      headingSmall: { font: 'Arial', size: 22, weight: 600 },
      body: { font: 'Arial', size: 18, weight: 400 },
      quote: { font: 'Arial', size: 20, weight: 400, italic: true },
      caption: { font: 'Arial', size: 14, weight: 400 },
    },
  },
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    category: 'Creative',
    description: 'High-impact typography for attention-grabbing slides',
    fonts: { heading: 'Arial', body: 'Verdana' },
    styles: {
      title: { font: 'Arial', size: 56, weight: 700 },
      subtitle: { font: 'Verdana', size: 28, weight: 600 },
      headingLarge: { font: 'Arial', size: 42, weight: 700 },
      headingMedium: { font: 'Arial', size: 32, weight: 700 },
      headingSmall: { font: 'Arial', size: 26, weight: 600 },
      body: { font: 'Verdana', size: 18, weight: 400 },
      quote: { font: 'Verdana', size: 22, weight: 500, italic: true },
      caption: { font: 'Verdana', size: 14, weight: 400 },
    },
  },
  {
    id: 'elegant-contrast',
    name: 'Elegant Contrast',
    category: 'Mixed',
    description: 'Serif headings with sans-serif body for visual contrast',
    fonts: { heading: 'Times New Roman', body: 'Arial' },
    styles: {
      title: { font: 'Times New Roman', size: 52, weight: 700 },
      subtitle: { font: 'Arial', size: 26, weight: 400 },
      headingLarge: { font: 'Times New Roman', size: 40, weight: 700 },
      headingMedium: { font: 'Times New Roman', size: 30, weight: 700 },
      headingSmall: { font: 'Times New Roman', size: 24, weight: 600 },
      body: { font: 'Arial', size: 18, weight: 400 },
      quote: { font: 'Times New Roman', size: 24, weight: 400, italic: true },
      caption: { font: 'Arial', size: 14, weight: 400 },
    },
  },
  {
    id: 'tech-modern',
    name: 'Tech Modern',
    category: 'Technology',
    description: 'Monospace accents for tech and developer presentations',
    fonts: { heading: 'Inter', body: 'Courier New' },
    styles: {
      title: { font: 'Inter', size: 48, weight: 700 },
      subtitle: { font: 'Courier New', size: 24, weight: 400 },
      headingLarge: { font: 'Inter', size: 36, weight: 600 },
      headingMedium: { font: 'Inter', size: 28, weight: 600 },
      headingSmall: { font: 'Inter', size: 22, weight: 500 },
      body: { font: 'Courier New', size: 16, weight: 400 },
      quote: { font: 'Courier New', size: 18, weight: 400, italic: true },
      caption: { font: 'Courier New', size: 13, weight: 400 },
    },
  },
  {
    id: 'friendly-casual',
    name: 'Friendly Casual',
    category: 'Casual',
    description: 'Warm and approachable typography for informal presentations',
    fonts: { heading: 'Verdana', body: 'Verdana' },
    styles: {
      title: { font: 'Verdana', size: 44, weight: 700 },
      subtitle: { font: 'Verdana', size: 26, weight: 500 },
      headingLarge: { font: 'Verdana', size: 34, weight: 600 },
      headingMedium: { font: 'Verdana', size: 26, weight: 600 },
      headingSmall: { font: 'Verdana', size: 22, weight: 500 },
      body: { font: 'Verdana', size: 18, weight: 400 },
      quote: { font: 'Verdana', size: 20, weight: 400, italic: true },
      caption: { font: 'Verdana', size: 14, weight: 400 },
    },
  },
  {
    id: 'newspaper',
    name: 'Newspaper',
    category: 'Editorial',
    description: 'Classic newspaper-style typography',
    fonts: { heading: 'Times New Roman', body: 'Georgia' },
    styles: {
      title: { font: 'Times New Roman', size: 54, weight: 700 },
      subtitle: { font: 'Georgia', size: 24, weight: 400 },
      headingLarge: { font: 'Times New Roman', size: 38, weight: 700 },
      headingMedium: { font: 'Times New Roman', size: 28, weight: 700 },
      headingSmall: { font: 'Times New Roman', size: 22, weight: 600 },
      body: { font: 'Georgia', size: 17, weight: 400 },
      quote: { font: 'Georgia', size: 20, weight: 400, italic: true },
      caption: { font: 'Georgia', size: 13, weight: 400 },
    },
  },
];

// Get a theme by ID
export const getThemeById = (id: string): FontTheme | undefined => {
  return fontThemes.find(theme => theme.id === id);
};

// Get default theme
export const getDefaultTheme = (): FontTheme => {
  return fontThemes[0]; // Modern Clean
};

// Convert theme styles to text style array for TextPanel
export const getTextStylesFromTheme = (theme: FontTheme) => {
  return [
    { name: 'Title', font: theme.styles.title.font, size: theme.styles.title.size, weight: theme.styles.title.weight },
    { name: 'Subtitle', font: theme.styles.subtitle.font, size: theme.styles.subtitle.size, weight: theme.styles.subtitle.weight },
    { name: 'Heading Large', font: theme.styles.headingLarge.font, size: theme.styles.headingLarge.size, weight: theme.styles.headingLarge.weight },
    { name: 'Heading Medium', font: theme.styles.headingMedium.font, size: theme.styles.headingMedium.size, weight: theme.styles.headingMedium.weight },
    { name: 'Heading Small', font: theme.styles.headingSmall.font, size: theme.styles.headingSmall.size, weight: theme.styles.headingSmall.weight },
    { name: 'Body Text', font: theme.styles.body.font, size: theme.styles.body.size, weight: theme.styles.body.weight },
    { name: 'Quote', font: theme.styles.quote.font, size: theme.styles.quote.size, weight: theme.styles.quote.weight, italic: theme.styles.quote.italic },
    { name: 'Caption', font: theme.styles.caption.font, size: theme.styles.caption.size, weight: theme.styles.caption.weight },
  ];
};
