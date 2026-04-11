// Theme entity — matches docs/data-maps/THEME_DATA_MAP.md exactly.
// Do not add or rename fields without updating the data map first.

// Style variants — brand-inspired design personalities (Level 2 in the hierarchy).
// This replaces the old ThemeCategory which incoherently mixed layout and style axes.
export type StyleVariant = 'stripe' | 'linear' | 'notion' | 'vercel' | 'airbnb' | 'custom'

// Color mode toggle — NOT a hierarchy level, just a palette switch within a variant.
// colorMode is UI-state only — excluded from all export formats.
export type ColorMode = 'light' | 'dark'

// layoutType is UI-routing only — excluded from all export formats.
// Determines which layout component renders. The toHaveLength(38) test in
// export.test.ts enforces that layoutType, variant, and colorMode are all excluded.
export type LayoutType =
  | 'saas'
  | 'landing'
  | 'blog'
  | 'ecommerce'
  | 'portfolio'
  | 'docs'
  | 'community'
  | 'mobile'

export type EditableSection = 'colors' | 'typography' | 'spacing' | 'borderRadius'

export interface ColorPalette {
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  background: string
  surface: string
  text: string
  textMuted: string
  border: string
  accent: string
  error: string
  success: string
  warning: string
}

export interface Typography {
  fontFamily: string
  fontSizeBase: string
  fontSizeSm: string
  fontSizeLg: string
  fontSizeXl: string
  fontSize2xl: string
  fontSize3xl: string
  fontWeightNormal: number
  fontWeightMedium: number
  fontWeightBold: number
  lineHeightBase: number
  letterSpacingBase: string
}

export interface SpacingScale {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  xxl: string
  xxxl: string
}

export interface BorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  full: string
}

export interface Theme {
  id: string
  name: string
  description: string
  // variant: style personality (replaces old category field)
  // UI metadata — excluded from all export formats.
  variant: StyleVariant
  // colorMode: light or dark palette toggle.
  // UI metadata — excluded from all export formats.
  colorMode: ColorMode
  // layoutType: which layout component renders.
  // UI metadata — excluded from all export formats.
  layoutType: LayoutType
  colors: ColorPalette
  typography: Typography
  spacing: SpacingScale
  borderRadius: BorderRadius
}

export type ExportFormat = 'markdown' | 'json' | 'css'
