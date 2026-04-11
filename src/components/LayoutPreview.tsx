import { useMemo, useState, useEffect } from 'react'
import type { Theme, LayoutType } from '../types/theme'
import { LAYOUT_TYPE_META } from '../data/variants'
import { SaasLayout } from './layouts/SaasLayout'
import { BlogLayout } from './layouts/BlogLayout'
import { LandingLayout } from './layouts/LandingLayout'
import { PortfolioLayout } from './layouts/PortfolioLayout'
import { EcommerceLayout } from './layouts/EcommerceLayout'
import { DocsLayout } from './layouts/DocsLayout'
import { CommunityLayout } from './layouts/CommunityLayout'
import { MobileLayout } from './layouts/MobileLayout'
import { SystemTokensView } from './SystemTokensView'
import { ComponentsView } from './ComponentsView'

interface Props {
  theme: Theme
}

// Google Fonts link map — keyed by exact FONT_STACKS.value string from TokenEditor.
// Security: href is ALWAYS from this hardcoded map — never from user input.
// Only these 5 fonts are ever requested; any other fontFamily value is silently skipped.
const GOOGLE_FONT_LINKS: Record<string, string> = {
  'Inter, system-ui, -apple-system, sans-serif':
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  '"Space Grotesk", system-ui, sans-serif':
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap',
  '"DM Sans", system-ui, -apple-system, sans-serif':
    'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,700&display=swap',
  'Nunito, system-ui, -apple-system, sans-serif':
    'https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap',
  '"Playfair Display", Georgia, serif':
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap',
}

// Placeholder for layout types not yet built.
// Shows the layout's name and incoming page list with token-driven styling.
interface PlaceholderProps {
  layoutType: LayoutType
  activePage: number
  onPageChange: (page: number) => void
}

function LayoutPlaceholder({ layoutType, activePage, onPageChange }: PlaceholderProps) {
  const meta = LAYOUT_TYPE_META[layoutType]
  const pages = ['Home', 'Browse', 'Detail']
  return (
    <div className="placeholder-layout">
      <div className="placeholder-layout__topbar">
        {pages.map((p, i) => (
          <button
            key={p}
            className={`placeholder-layout__tab${activePage === i ? ' placeholder-layout__tab--active' : ''}`}
            onClick={() => onPageChange(i)}
            tabIndex={-1}
            type="button"
          >
            {p}
          </button>
        ))}
      </div>
      <div className="placeholder-layout__body">
        <div className="placeholder-layout__symbol" aria-hidden="true">{meta.symbol}</div>
        <p className="placeholder-layout__name">{meta.label}</p>
        <p className="placeholder-layout__desc">{meta.description}</p>
        <p className="placeholder-layout__badge">Coming soon</p>
      </div>
    </div>
  )
}

export function LayoutPreview({ theme }: Props) {
  const [activePage, setActivePage] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [scale, setScale] = useState<75 | 100>(75)
  const [viewMode, setViewMode] = useState<'layout' | 'components' | 'tokens'>('layout')

  // Font loading: inject Google Fonts <link> on font family change.
  // Security: href is always from GOOGLE_FONT_LINKS (hardcoded allowlist).
  // No cleanup return — removing the link on unmount causes FOUT. Link is idempotent (guarded by id).
  useEffect(() => {
    const fontFamily = theme.typography.fontFamily
    const href = GOOGLE_FONT_LINKS[fontFamily]
    if (!href) return // Font not in allowlist — skip (system fonts need no loading)
    // Derive a valid HTML id: strip quotes, replace spaces with hyphens
    const cleanName = fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '')
    const linkId = 'gsf-' + cleanName.replace(/\s+/g, '-')
    if (document.getElementById(linkId)) return // Already loaded
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.id = linkId
    link.href = href
    document.head.appendChild(link)
  }, [theme.typography.fontFamily])

  // Reset page when layout type changes
  useEffect(() => {
    setActivePage(0)
  }, [theme.layoutType])

  // Memoize CSS vars on token sections only — not on id/name/variant to avoid
  // unnecessary re-renders when metadata changes without token changes.
  const cssVars = useMemo(
    () =>
      ({
        '--color-primary':             theme.colors.primary,
        '--color-primary-foreground':  theme.colors.primaryForeground,
        '--color-secondary':           theme.colors.secondary,
        '--color-secondary-foreground':theme.colors.secondaryForeground,
        '--color-background':          theme.colors.background,
        '--color-surface':             theme.colors.surface,
        '--color-text':                theme.colors.text,
        '--color-text-muted':          theme.colors.textMuted,
        '--color-border':              theme.colors.border,
        '--color-accent':              theme.colors.accent,
        '--color-error':               theme.colors.error,
        '--color-success':             theme.colors.success,
        '--color-warning':             theme.colors.warning,
        '--color-focus-ring':          theme.colors.focusRing,
        '--color-info':                theme.colors.info,
        '--font-family':               theme.typography.fontFamily,
        '--font-size-base':            theme.typography.fontSizeBase,
        '--font-size-sm':              theme.typography.fontSizeSm,
        '--font-size-lg':              theme.typography.fontSizeLg,
        '--font-size-xl':              theme.typography.fontSizeXl,
        '--font-size-2xl':             theme.typography.fontSize2xl,
        '--font-size-3xl':             theme.typography.fontSize3xl,
        '--font-weight-normal':        String(theme.typography.fontWeightNormal),
        '--font-weight-medium':        String(theme.typography.fontWeightMedium),
        '--font-weight-bold':          String(theme.typography.fontWeightBold),
        '--line-height-base':          String(theme.typography.lineHeightBase),
        '--letter-spacing-base':       theme.typography.letterSpacingBase,
        '--spacing-xs':                theme.spacing.xs,
        '--spacing-sm':                theme.spacing.sm,
        '--spacing-md':                theme.spacing.md,
        '--spacing-lg':                theme.spacing.lg,
        '--spacing-xl':                theme.spacing.xl,
        '--spacing-xxl':               theme.spacing.xxl,
        '--spacing-xxxl':              theme.spacing.xxxl,
        '--border-radius-none':        theme.borderRadius.none,
        '--border-radius-sm':          theme.borderRadius.sm,
        '--border-radius-md':          theme.borderRadius.md,
        '--border-radius-lg':          theme.borderRadius.lg,
        '--border-radius-xl':          theme.borderRadius.xl,
        '--border-radius-full':        theme.borderRadius.full,
        '--shadow-sm':                 theme.shadows.sm,
        '--shadow-md':                 theme.shadows.md,
        '--shadow-lg':                 theme.shadows.lg,
        '--shadow-xl':                 theme.shadows.xl,
      }) as React.CSSProperties,
    [theme.colors, theme.typography, theme.spacing, theme.borderRadius, theme.shadows],
  )

  const IMPLEMENTED: Partial<Record<LayoutType, React.ComponentType<{ activePage: number; onPageChange: (p: number) => void }>>> = {
    saas:      SaasLayout,
    blog:      BlogLayout,
    landing:   LandingLayout,
    portfolio: PortfolioLayout,
    ecommerce: EcommerceLayout,
    docs:      DocsLayout,
    community: CommunityLayout,
    mobile:    MobileLayout,
  }

  const LayoutComponent = IMPLEMENTED[theme.layoutType]

  return (
    <div
      className={`layout-preview${isExpanded ? ' layout-preview--expanded' : ''}`}
      style={cssVars}
    >
      {/* Header: label + scale toggle + expand button — NOT aria-hidden, keyboard accessible */}
      <div className="layout-preview__header">
        <div className="layout-preview__header-left">
          <span className="layout-preview__label">{theme.name}</span>
          <span className="layout-preview__preview-badge" aria-hidden="true">Preview</span>
        </div>
        <div className="layout-preview__header-actions">
          <div className="layout-preview__view-toggle" role="group" aria-label="Preview mode">
            <button
              className={`layout-preview__view-btn${viewMode === 'layout' ? ' layout-preview__view-btn--active' : ''}`}
              onClick={() => setViewMode('layout')}
              type="button"
              aria-pressed={viewMode === 'layout'}
              data-tooltip="A realistic page mockup showing your design system applied in context."
            >
              Layout
            </button>
            <button
              className={`layout-preview__view-btn${viewMode === 'components' ? ' layout-preview__view-btn--active' : ''}`}
              onClick={() => setViewMode('components')}
              type="button"
              aria-pressed={viewMode === 'components'}
              data-tooltip="Individual UI components — buttons, inputs, cards — styled in your theme."
            >
              Components
            </button>
            <button
              className={`layout-preview__view-btn${viewMode === 'tokens' ? ' layout-preview__view-btn--active' : ''}`}
              onClick={() => setViewMode('tokens')}
              type="button"
              aria-pressed={viewMode === 'tokens'}
              data-tooltip="The raw design values (colors, sizes, spacing) that make up your theme."
            >
              Tokens
            </button>
          </div>
          <div className="layout-preview__scale-toggle" role="group" aria-label="Preview scale">
            {([75, 100] as const).map(s => (
              <button
                key={s}
                className={`layout-preview__scale-btn${scale === s ? ' layout-preview__scale-btn--active' : ''}`}
                onClick={() => setScale(s)}
                type="button"
                aria-pressed={scale === s}
              >
                {s}%
              </button>
            ))}
          </div>
          <button
            className="layout-preview__expand-btn"
            onClick={() => setIsExpanded(e => !e)}
            type="button"
            aria-label={isExpanded ? 'Collapse preview' : 'Expand preview'}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '✕' : '⤢'}
          </button>
        </div>
      </div>

      {/* Scene: decorative — ALL interactive elements inside must have tabIndex={-1} */}
      <div
        className="layout-preview__scene"
        aria-hidden="true"
        style={scale !== 100 ? { zoom: scale / 100 } as React.CSSProperties : undefined}
      >
        {viewMode === 'tokens'
          ? <SystemTokensView theme={theme} />
          : viewMode === 'components'
            ? <ComponentsView theme={theme} />
            : LayoutComponent
              ? <LayoutComponent activePage={activePage} onPageChange={setActivePage} />
              : <LayoutPlaceholder layoutType={theme.layoutType} activePage={activePage} onPageChange={setActivePage} />
        }
      </div>
    </div>
  )
}
