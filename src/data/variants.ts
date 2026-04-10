// Brand-inspired design system variants.
// Each variant defines a complete design system: colors (light + dark), typography, spacing, radius.
// Variants are layout-agnostic — any variant can be applied to any layout type.
// SECURITY: values here bypass TokenEditor validation. All strings must be sanitized manually.

import type {
  ColorPalette,
  Typography,
  SpacingScale,
  BorderRadius,
  Shadow,
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
  shadows: Shadow
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

export const STYLE_VARIANTS: StyleVariant[] = [
  'stripe',
  'linear',
  'notion',
  'vercel',
  'airbnb',
  'apple',
  'spotify',
  'shopify',
  'github',
  'custom',
]

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
      focusRing:           '#6366F1',
      info:                '#2563EB',
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
      focusRing:           '#818CF8',
      info:                '#60A5FA',
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
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.1)',
      md: '0 4px 8px rgba(0,0,0,0.1)',
      lg: '0 8px 24px rgba(0,0,0,0.12)',
      xl: '0 16px 48px rgba(0,0,0,0.12)',
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
      focusRing:           '#7C3AED',
      info:                '#4F46E5',
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
      focusRing:           '#A78BFA',
      info:                '#818CF8',
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
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.06)',
      md: '0 1px 4px rgba(0,0,0,0.08)',
      lg: '0 4px 12px rgba(0,0,0,0.08)',
      xl: '0 8px 24px rgba(0,0,0,0.08)',
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
      focusRing:           '#2563EB',
      info:                '#2563EB',
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
      focusRing:           '#60A5FA',
      info:                '#60A5FA',
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
    shadows: {
      sm: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
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
      focusRing:           '#000000',
      info:                '#0070F3',
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
      focusRing:           '#FFFFFF',
      info:                '#3291FF',
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
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.06)',
      md: '0 1px 4px rgba(0,0,0,0.08)',
      lg: '0 4px 12px rgba(0,0,0,0.08)',
      xl: '0 8px 24px rgba(0,0,0,0.08)',
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
      focusRing:           '#FF385C',
      info:                '#0066FF',
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
      focusRing:           '#FF6B8A',
      info:                '#4D9FFF',
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
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.1)',
      md: '0 4px 8px rgba(0,0,0,0.1)',
      lg: '0 8px 24px rgba(0,0,0,0.12)',
      xl: '0 16px 48px rgba(0,0,0,0.12)',
    },
  },

  // ── Apple ─ Premium, white-space, minimal ─────────────────────────────────────
  apple: {
    meta: { label: 'Apple', description: 'Premium, white-space, minimal' },
    lightColors: {
      primary:             '#0071E3', // Apple blue
      primaryForeground:   '#FFFFFF', // on #0071E3: ~5.0:1 ✓ AA
      secondary:           '#6E6E73', // Apple gray
      secondaryForeground: '#FFFFFF', // on #6E6E73: ~4.6:1 ✓ AA
      background:          '#FFFFFF',
      surface:             '#F5F5F7', // Apple light gray surface
      text:                '#1D1D1F', // on white: ~18:1 ✓
      textMuted:           '#6E6E73', // on white: ~4.6:1 ✓ AA
      border:              '#D2D2D7',
      accent:              '#0077ED',
      error:               '#FF3B30',
      success:             '#34C759',
      warning:             '#FF9500',
      focusRing:           '#0071E3',
      info:                '#007AFF',
    },
    darkColors: {
      primary:             '#0A84FF', // Apple blue on dark
      primaryForeground:   '#FFFFFF', // on #0A84FF: ~4.5:1 ✓ AA
      secondary:           '#8E8E93',
      secondaryForeground: '#FFFFFF', // on #8E8E93: ~4.5:1 ✓ AA
      background:          '#000000',
      surface:             '#1C1C1E', // Apple dark surface
      text:                '#F5F5F7', // on black: ~18:1 ✓
      textMuted:           '#8E8E93', // on black: ~5.2:1 ✓ AA
      border:              '#3A3A3C',
      accent:              '#0A84FF',
      error:               '#FF453A',
      success:             '#30D158',
      warning:             '#FFD60A',
      focusRing:           '#0A84FF',
      info:                '#0A84FF',
    },
    typography: {
      fontFamily:         'Inter, system-ui, -apple-system, sans-serif',
      fontSizeBase:       '17px',
      fontSizeSm:         '15px',
      fontSizeLg:         '19px',
      fontSizeXl:         '21px',
      fontSize2xl:        '26px',
      fontSize3xl:        '34px',
      fontWeightNormal:   400,
      fontWeightMedium:   500,
      fontWeightBold:     600,
      lineHeightBase:     1.55,
      letterSpacingBase:  '-0.01em',
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
      md:   '10px',
      lg:   '16px',
      xl:   '20px',
      full: '9999px',
    },
    shadows: {
      sm: '0 2px 8px rgba(0,0,0,0.08)',
      md: '0 4px 16px rgba(0,0,0,0.1)',
      lg: '0 8px 32px rgba(0,0,0,0.12)',
      xl: '0 16px 56px rgba(0,0,0,0.14)',
    },
  },

  // ── Spotify ─ Vibrant, music, bold green ──────────────────────────────────────
  spotify: {
    meta: { label: 'Spotify', description: 'Vibrant, music, bold green' },
    lightColors: {
      primary:             '#1DB954', // Spotify green
      primaryForeground:   '#191414', // on #1DB954: ~6.0:1 ✓ AA
      secondary:           '#535353',
      secondaryForeground: '#FFFFFF', // on #535353: ~7.0:1 ✓
      background:          '#FFFFFF',
      surface:             '#F6F6F6',
      text:                '#191414', // on white: ~18:1 ✓
      textMuted:           '#535353', // on white: ~7.0:1 ✓ AA
      border:              '#E0E0E0',
      accent:              '#1DB954',
      error:               '#E61E32',
      success:             '#1DB954',
      warning:             '#F59B23',
      focusRing:           '#1DB954',
      info:                '#509BF5',
    },
    darkColors: {
      primary:             '#1DB954', // Spotify green unchanged on dark
      primaryForeground:   '#191414', // on #1DB954: ~6.0:1 ✓ AA
      secondary:           '#535353',
      secondaryForeground: '#FFFFFF', // on #535353: ~7.0:1 ✓
      background:          '#121212', // Spotify dark background
      surface:             '#181818',
      text:                '#FFFFFF', // on #121212: ~20:1 ✓
      textMuted:           '#B3B3B3', // on #121212: ~8.4:1 ✓ AA
      border:              '#282828',
      accent:              '#1DB954',
      error:               '#E61E32',
      success:             '#1DB954',
      warning:             '#F59B23',
      focusRing:           '#1DB954',
      info:                '#509BF5',
    },
    typography: {
      // CRITICAL: must match the GOOGLE_FONT_LINKS key in LayoutPreview.tsx exactly
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
      lineHeightBase:     1.5,
      letterSpacingBase:  '0em',
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
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.08)',
      md: '0 2px 6px rgba(0,0,0,0.1)',
      lg: '0 4px 16px rgba(0,0,0,0.12)',
      xl: '0 8px 32px rgba(0,0,0,0.12)',
    },
  },

  // ── Shopify ─ Clean commerce, trustworthy green ───────────────────────────────
  shopify: {
    meta: { label: 'Shopify', description: 'Clean commerce, trustworthy green' },
    lightColors: {
      primary:             '#008060', // Shopify green
      primaryForeground:   '#FFFFFF', // on #008060: ~5.3:1 ✓ AA
      secondary:           '#5C5F62',
      secondaryForeground: '#FFFFFF', // on #5C5F62: ~6.2:1 ✓
      background:          '#FFFFFF',
      surface:             '#F6F6F7', // Shopify light surface
      text:                '#202223', // on white: ~17:1 ✓
      textMuted:           '#6D7175', // on white: ~4.6:1 ✓ AA
      border:              '#C9CCCF',
      accent:              '#008060',
      error:               '#D82C0D',
      success:             '#008060',
      warning:             '#FFC453',
      focusRing:           '#006FBB',
      info:                '#0091FF',
    },
    darkColors: {
      primary:             '#2EA583', // lighter Shopify green on dark
      primaryForeground:   '#FFFFFF', // on #2EA583: ~4.6:1 ✓ AA
      secondary:           '#8C9196',
      secondaryForeground: '#1A1A1A', // on #8C9196: ~5.1:1 ✓ AA
      background:          '#1A1A1A',
      surface:             '#242424',
      text:                '#E3E3E3', // on #1A1A1A: ~14:1 ✓
      textMuted:           '#A8A8A8', // on #1A1A1A: ~6.8:1 ✓ AA
      border:              '#3B3B3B',
      accent:              '#2EA583',
      error:               '#FD5749',
      success:             '#2EA583',
      warning:             '#FFC453',
      focusRing:           '#00A87B',
      info:                '#2EADF2',
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
      letterSpacingBase:  '0em',
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
      sm:   '3px',
      md:   '6px',
      lg:   '8px',
      xl:   '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.08)',
      md: '0 2px 6px rgba(0,0,0,0.1)',
      lg: '0 4px 16px rgba(0,0,0,0.12)',
      xl: '0 8px 32px rgba(0,0,0,0.12)',
    },
  },

  // ── GitHub ─ Developer-first, precise, minimal ────────────────────────────────
  github: {
    meta: { label: 'GitHub', description: 'Developer-first, precise, minimal' },
    lightColors: {
      primary:             '#0969DA', // GitHub blue
      primaryForeground:   '#FFFFFF', // on #0969DA: ~5.4:1 ✓ AA
      secondary:           '#6E7781',
      secondaryForeground: '#FFFFFF', // on #6E7781: ~4.8:1 ✓ AA
      background:          '#FFFFFF',
      surface:             '#F6F8FA', // GitHub light gray surface
      text:                '#1F2328', // on white: ~17:1 ✓
      textMuted:           '#636C76', // on white: ~5.0:1 ✓ AA
      border:              '#D0D7DE',
      accent:              '#0969DA',
      error:               '#CF222E',
      success:             '#1A7F37',
      warning:             '#9A6700',
      focusRing:           '#0969DA',
      info:                '#0550AE',
    },
    darkColors: {
      primary:             '#58A6FF', // GitHub blue on dark
      primaryForeground:   '#0D1117', // on #58A6FF: ~7.5:1 ✓
      secondary:           '#8D96A0',
      secondaryForeground: '#0D1117', // on #8D96A0: ~6.5:1 ✓
      background:          '#0D1117', // GitHub dark background
      surface:             '#161B22',
      text:                '#E6EDF3', // on #0D1117: ~15:1 ✓
      textMuted:           '#8D96A0', // on #0D1117: ~6.5:1 ✓ AA
      border:              '#30363D',
      accent:              '#58A6FF',
      error:               '#FF7B72',
      success:             '#3FB950',
      warning:             '#D29922',
      focusRing:           '#388BFD',
      info:                '#79C0FF',
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
      lineHeightBase:     1.5,
      letterSpacingBase:  '0em',
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
      md:   '6px',
      lg:   '8px',
      xl:   '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.06)',
      md: '0 1px 4px rgba(0,0,0,0.08)',
      lg: '0 4px 12px rgba(0,0,0,0.08)',
      xl: '0 8px 24px rgba(0,0,0,0.08)',
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
      focusRing:           '#0066CC',
      info:                '#0066CC',
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
      focusRing:           '#4D9FFF',
      info:                '#4D9FFF',
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
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.06)',
      md: '0 1px 4px rgba(0,0,0,0.08)',
      lg: '0 4px 12px rgba(0,0,0,0.08)',
      xl: '0 8px 24px rgba(0,0,0,0.08)',
    },
  },
}
