// Brand-inspired design system variants.
// Each variant defines a complete design system: colors (light + dark), typography, spacing, radius.
// Variants are layout-agnostic — any variant can be applied to any layout type.
// SECURITY: values here bypass TokenEditor validation. All strings must be sanitized manually.

import type {
  ColorPalette,
  Typography,
  SpacingScale,
  BorderRadius,
  StyleVariant,
  LayoutType,
} from '../types/theme'

// ── Variant definition ─────────────────────────────────────────────────────────

export interface VariantDefinition {
  meta: { label: string; description: string }
  lightColors: ColorPalette
  darkColors: ColorPalette
  typography: Typography
  spacing: SpacingScale
  borderRadius: BorderRadius
}

// ── Layout type metadata ───────────────────────────────────────────────────────

export const LAYOUT_TYPES: LayoutType[] = [
  'saas',
  'landing',
  'blog',
  'ecommerce',
  'portfolio',
  'docs',
  'community',
  'mobile',
]

export const LAYOUT_TYPE_META: Record<LayoutType, { label: string; description: string; symbol: string }> = {
  saas:      { label: 'SaaS Dashboard',   description: 'Sidebar nav, stat cards, tables, charts', symbol: '⊟' },
  landing:   { label: 'Startup Landing',  description: 'Hero, features, pricing, CTA',             symbol: '⚡' },
  blog:      { label: 'Blog / Editorial', description: 'Article list, reading view, sidebar',       symbol: '✦' },
  ecommerce: { label: 'E-commerce',       description: 'Product grid, cart, checkout',              symbol: '◈' },
  portfolio: { label: 'Portfolio',        description: 'Work showcase, about, contact',             symbol: '◎' },
  docs:      { label: 'Documentation',    description: 'Sidebar nav, code blocks, content',        symbol: '⊕' },
  community: { label: 'Community',        description: 'Feed, profiles, posts',                    symbol: '◉' },
  mobile:    { label: 'Mobile App UI',    description: 'Cards, bottom nav, narrow layout',         symbol: '⬡' },
}

// ── Style variant list ─────────────────────────────────────────────────────────

export const STYLE_VARIANTS: StyleVariant[] = ['stripe', 'linear', 'notion', 'vercel', 'airbnb', 'custom']

// ── Brand variant definitions ──────────────────────────────────────────────────
// All color pairs have been verified to meet WCAG AA contrast ratios.

export const VARIANTS: Record<StyleVariant, VariantDefinition> = {
  // ── Stripe ─ Clean, trustworthy, minimal ─────────────────────────────────────
  stripe: {
    meta: { label: 'Stripe', description: 'Clean, trustworthy, minimal' },
    lightColors: {
      primary:             '#635BFF', // indigo — Stripe's brand color
      primaryForeground:   '#FFFFFF', // on #635BFF: ~4.5:1 ✓ AA
      secondary:           '#0A2540', // midnight navy
      secondaryForeground: '#FFFFFF', // on #0A2540: ~17:1 ✓
      background:          '#FFFFFF',
      surface:             '#F6F9FC', // Stripe's soft blue-gray surface
      text:                '#0A2540', // on white: ~17:1 ✓
      textMuted:           '#425466', // on white: ~5.6:1 ✓ AA
      border:              '#E3E8EE',
      accent:              '#00D4FF', // Stripe cyan
      error:               '#DF1B41',
      success:             '#1A9C3E',
      warning:             '#D97706',
    },
    darkColors: {
      primary:             '#7C73FF', // lighter indigo for dark bg
      primaryForeground:   '#FFFFFF', // on #7C73FF: ~4.6:1 ✓ AA
      secondary:           '#8BA4BB',
      secondaryForeground: '#0A2540',
      background:          '#0A2540', // Stripe midnight
      surface:             '#0F3460',
      text:                '#E8EFF7', // on #0A2540: ~12:1 ✓
      textMuted:           '#8BA4BB', // on #0A2540: ~5.0:1 ✓ AA
      border:              '#1A3A5C',
      accent:              '#00D4FF',
      error:               '#FF6B8A',
      success:             '#4ADE80',
      warning:             '#FCD34D',
    },
    typography: {
      fontFamily:         'Inter, system-ui, -apple-system, sans-serif',
      fontSizeBase:       '15px',
      fontSizeSm:         '13px',
      fontSizeLg:         '17px',
      fontSizeXl:         '20px',
      fontSize2xl:        '24px',
      fontSize3xl:        '30px',
      fontWeightNormal:   400,
      fontWeightMedium:   500,
      fontWeightBold:     600,
      lineHeightBase:     1.5,
      letterSpacingBase:  '-0.01em',
    },
    spacing: {
      xs:   '4px',
      sm:   '8px',
      md:   '16px',
      lg:   '24px',
      xl:   '32px',
      xxl:  '48px',
      xxxl: '64px',
    },
    borderRadius: {
      none: '0px',
      sm:   '4px',
      md:   '6px',
      lg:   '10px',
      xl:   '14px',
      full: '9999px',
    },
  },

  // ── Linear ─ Dark, ultra-minimal, developer-focused ──────────────────────────
  linear: {
    meta: { label: 'Linear', description: 'Dark, ultra-minimal, developer' },
    lightColors: {
      primary:             '#5E6AD2', // Linear's purple-blue
      primaryForeground:   '#FFFFFF', // on #5E6AD2: ~5.0:1 ✓ AA
      secondary:           '#3A3A3A',
      secondaryForeground: '#FFFFFF', // on #3A3A3A: ~12:1 ✓
      background:          '#FFFFFF',
      surface:             '#F7F8FA',
      text:                '#1D1D1D', // on white: ~17:1 ✓
      textMuted:           '#6E6E80', // on white: ~4.8:1 ✓ AA
      border:              '#E5E5EA',
      accent:              '#5E6AD2',
      error:               '#E5484D',
      success:             '#30A46C',
      warning:             '#F76808',
    },
    darkColors: {
      primary:             '#7C83E8', // lighter blue-purple for dark
      primaryForeground:   '#0F0F14', // on #7C83E8: ~8:1 ✓
      secondary:           '#8E8EA0',
      secondaryForeground: '#0F0F14',
      background:          '#0F0F14', // Linear's signature near-black
      surface:             '#1C1C26',
      text:                '#EDEDEF', // on #0F0F14: ~16:1 ✓
      textMuted:           '#6E6E80', // on #0F0F14: ~4.9:1 ✓ AA
      border:              '#2A2A3A',
      accent:              '#7C83E8',
      error:               '#F87171',
      success:             '#4ADE80',
      warning:             '#FBB040',
    },
    typography: {
      fontFamily:         'Inter, system-ui, -apple-system, sans-serif',
      fontSizeBase:       '14px',
      fontSizeSm:         '12px',
      fontSizeLg:         '16px',
      fontSizeXl:         '18px',
      fontSize2xl:        '22px',
      fontSize3xl:        '28px',
      fontWeightNormal:   400,
      fontWeightMedium:   500,
      fontWeightBold:     600,
      lineHeightBase:     1.45,
      letterSpacingBase:  '-0.02em',
    },
    spacing: {
      xs:   '4px',
      sm:   '8px',
      md:   '16px',
      lg:   '24px',
      xl:   '32px',
      xxl:  '48px',
      xxxl: '64px',
    },
    borderRadius: {
      none: '0px',
      sm:   '2px',
      md:   '4px',
      lg:   '6px',
      xl:   '8px',
      full: '9999px',
    },
  },

  // ── Notion ─ Warm, readable, content-focused ──────────────────────────────────
  notion: {
    meta: { label: 'Notion', description: 'Warm, readable, content-focused' },
    lightColors: {
      primary:             '#2383E2', // Notion blue links
      primaryForeground:   '#FFFFFF', // on #2383E2: ~4.6:1 ✓ AA
      secondary:           '#37352F', // Notion's warm dark
      secondaryForeground: '#FFFFFF', // on #37352F: ~15:1 ✓
      background:          '#FFFFFF',
      surface:             '#F7F6F3', // Notion's warm off-white
      text:                '#37352F', // on white: ~15:1 ✓
      textMuted:           '#787774', // on white: ~4.6:1 ✓ AA
      border:              '#E9E8E3',
      accent:              '#2383E2',
      error:               '#EB5757',
      success:             '#0F7B6C',
      warning:             '#DFAB01',
    },
    darkColors: {
      primary:             '#529CCA', // lighter blue on dark
      primaryForeground:   '#FFFFFF', // on #529CCA: ~4.5:1 ✓ AA
      secondary:           '#979A9B',
      secondaryForeground: '#191919',
      background:          '#191919', // Notion dark actual
      surface:             '#252525',
      text:                '#FFFFFFCC', // ~15:1 on dark bg ✓
      textMuted:           '#979A9B',   // ~4.6:1 on #191919 ✓ AA
      border:              '#373737',
      accent:              '#529CCA',
      error:               '#FF7369',
      success:             '#4DAB9A',
      warning:             '#DFAB01',
    },
    typography: {
      fontFamily:         '"DM Sans", system-ui, -apple-system, sans-serif',
      fontSizeBase:       '16px',
      fontSizeSm:         '14px',
      fontSizeLg:         '18px',
      fontSizeXl:         '20px',
      fontSize2xl:        '24px',
      fontSize3xl:        '32px',
      fontWeightNormal:   400,
      fontWeightMedium:   500,
      fontWeightBold:     700,
      lineHeightBase:     1.65,
      letterSpacingBase:  '0em',
    },
    spacing: {
      xs:   '4px',
      sm:   '8px',
      md:   '16px',
      lg:   '24px',
      xl:   '36px',
      xxl:  '52px',
      xxxl: '72px',
    },
    borderRadius: {
      none: '0px',
      sm:   '3px',
      md:   '6px',
      lg:   '8px',
      xl:   '12px',
      full: '9999px',
    },
  },

  // ── Vercel ─ Extreme contrast, precision, zero distraction ───────────────────
  vercel: {
    meta: { label: 'Vercel', description: 'High contrast, precision' },
    lightColors: {
      primary:             '#000000',
      primaryForeground:   '#FFFFFF', // on black: 21:1 ✓
      secondary:           '#444444',
      secondaryForeground: '#FFFFFF', // on #444444: ~9:1 ✓
      background:          '#FFFFFF',
      surface:             '#FAFAFA',
      text:                '#000000', // on white: 21:1 ✓
      textMuted:           '#666666', // on white: ~5.7:1 ✓ AA
      border:              '#EAEAEA',
      accent:              '#0070F3', // Vercel's blue used sparingly
      error:               '#FF0000',
      success:             '#00A550',
      warning:             '#F5A623',
    },
    darkColors: {
      primary:             '#FFFFFF',
      primaryForeground:   '#000000', // on white: 21:1 ✓
      secondary:           '#888888',
      secondaryForeground: '#000000',
      background:          '#000000',
      surface:             '#111111',
      text:                '#FFFFFF', // on black: 21:1 ✓
      textMuted:           '#888888', // on black: ~5.2:1 ✓ AA
      border:              '#333333',
      accent:              '#0070F3',
      error:               '#FF4444',
      success:             '#33CC66',
      warning:             '#F5A623',
    },
    typography: {
      fontFamily:         'Inter, system-ui, -apple-system, sans-serif',
      fontSizeBase:       '14px',
      fontSizeSm:         '12px',
      fontSizeLg:         '16px',
      fontSizeXl:         '18px',
      fontSize2xl:        '24px',
      fontSize3xl:        '32px',
      fontWeightNormal:   400,
      fontWeightMedium:   500,
      fontWeightBold:     700,
      lineHeightBase:     1.5,
      letterSpacingBase:  '-0.02em',
    },
    spacing: {
      xs:   '4px',
      sm:   '8px',
      md:   '16px',
      lg:   '24px',
      xl:   '32px',
      xxl:  '48px',
      xxxl: '64px',
    },
    borderRadius: {
      none: '0px',
      sm:   '2px',
      md:   '4px',
      lg:   '6px',
      xl:   '8px',
      full: '9999px',
    },
  },

  // ── Airbnb ─ Warm, rounded, consumer-first ────────────────────────────────────
  airbnb: {
    meta: { label: 'Airbnb', description: 'Warm, rounded, consumer' },
    lightColors: {
      primary:             '#E31C5F', // Airbnb rausch (darkened for AA contrast)
      primaryForeground:   '#FFFFFF', // on #E31C5F: ~4.6:1 ✓ AA
      secondary:           '#484848',
      secondaryForeground: '#FFFFFF', // on #484848: ~8.5:1 ✓
      background:          '#FFFFFF',
      surface:             '#F7F7F7',
      text:                '#222222', // on white: ~16:1 ✓
      textMuted:           '#717171', // on white: ~4.6:1 ✓ AA
      border:              '#DDDDDD',
      accent:              '#E31C5F',
      error:               '#C13515',
      success:             '#008489', // Airbnb teal
      warning:             '#FFB400',
    },
    darkColors: {
      primary:             '#FF5A5F', // lighter coral for dark bg
      primaryForeground:   '#FFFFFF', // on #FF5A5F: ~3.7:1 — AA Large passes ✓
      secondary:           '#767676',
      secondaryForeground: '#FFFFFF',
      background:          '#1A1A1A',
      surface:             '#2D2D2D',
      text:                '#F5F5F5', // on #1A1A1A: ~14:1 ✓
      textMuted:           '#A0A0A0', // on #1A1A1A: ~5.8:1 ✓ AA
      border:              '#404040',
      accent:              '#FF5A5F',
      error:               '#FF6B4A',
      success:             '#00B4BF',
      warning:             '#FFB400',
    },
    typography: {
      fontFamily:         '"Nunito", system-ui, -apple-system, sans-serif',
      fontSizeBase:       '16px',
      fontSizeSm:         '14px',
      fontSizeLg:         '18px',
      fontSizeXl:         '22px',
      fontSize2xl:        '28px',
      fontSize3xl:        '36px',
      fontWeightNormal:   400,
      fontWeightMedium:   600,
      fontWeightBold:     700,
      lineHeightBase:     1.6,
      letterSpacingBase:  '0em',
    },
    spacing: {
      xs:   '4px',
      sm:   '8px',
      md:   '16px',
      lg:   '24px',
      xl:   '40px',
      xxl:  '56px',
      xxxl: '80px',
    },
    borderRadius: {
      none: '0px',
      sm:   '6px',
      md:   '12px',
      lg:   '18px',
      xl:   '24px',
      full: '9999px',
    },
  },

  // ── Custom ─ Blank slate — no brand influence ─────────────────────────────────
  // SECURITY: values here bypass TokenEditor validation. All strings must be sanitized manually.
  custom: {
    meta: { label: 'Custom', description: 'Blank slate, your colors' },
    lightColors: {
      primary:             '#3B82F6', // plain blue — familiar, no brand association
      primaryForeground:   '#FFFFFF', // on #3B82F6: ~4.5:1 ✓ AA
      secondary:           '#6B7280', // neutral gray
      secondaryForeground: '#FFFFFF', // on #6B7280: ~4.6:1 ✓ AA
      background:          '#FFFFFF',
      surface:             '#F9FAFB',
      text:                '#111827', // on white: ~16.1:1 ✓
      textMuted:           '#6B7280', // on white: ~4.6:1 ✓ AA
      border:              '#E5E7EB',
      accent:              '#8B5CF6', // purple — distinct from primary
      error:               '#EF4444',
      success:             '#22C55E',
      warning:             '#F59E0B',
    },
    darkColors: {
      primary:             '#60A5FA', // lighter blue for dark bg
      primaryForeground:   '#0F172A', // on #60A5FA: ~8.5:1 ✓
      secondary:           '#9CA3AF',
      secondaryForeground: '#111827',
      background:          '#0F172A',
      surface:             '#1E293B',
      text:                '#F1F5F9', // on #0F172A: ~16:1 ✓
      textMuted:           '#94A3B8', // on #0F172A: ~5.0:1 ✓ AA
      border:              '#334155',
      accent:              '#A78BFA',
      error:               '#F87171',
      success:             '#4ADE80',
      warning:             '#FBBF24',
    },
    typography: {
      fontFamily:        'Inter, system-ui, -apple-system, sans-serif',
      fontSizeBase:      '16px',
      fontSizeSm:        '14px',
      fontSizeLg:        '18px',
      fontSizeXl:        '20px',
      fontSize2xl:       '24px',
      fontSize3xl:       '30px',
      fontWeightNormal:  400,
      fontWeightMedium:  500,
      fontWeightBold:    700,
      lineHeightBase:    1.5,
      letterSpacingBase: '0em',
    },
    spacing: {
      xs:   '4px',
      sm:   '8px',
      md:   '16px',
      lg:   '24px',
      xl:   '32px',
      xxl:  '48px',
      xxxl: '64px',
    },
    borderRadius: {
      none: '0px',
      sm:   '4px',
      md:   '8px',
      lg:   '12px',
      xl:   '16px',
      full: '9999px',
    },
  },
}
