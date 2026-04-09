// Theme entity — matches docs/data-maps/THEME_DATA_MAP.md exactly.
// Do not add or rename fields without updating the data map first.

export type ThemeCategory = 'modern' | 'corporate' | 'dark' | 'glassmorphism'

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
  category: ThemeCategory
  colors: ColorPalette
  typography: Typography
  spacing: SpacingScale
  borderRadius: BorderRadius
}

export type ExportFormat = 'markdown' | 'json' | 'css'
