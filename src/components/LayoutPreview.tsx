import { useMemo, useState } from 'react'
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

interface Props {
  theme: Theme
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

  // Reset page when layout type changes
  const prevLayoutType = useMemo(() => theme.layoutType, [theme.layoutType])

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
      }) as React.CSSProperties,
    [theme.colors, theme.typography, theme.spacing, theme.borderRadius],
  )

  // Reset page index when layout type changes
  if (prevLayoutType !== theme.layoutType) {
    setActivePage(0)
  }

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
        <span className="layout-preview__label">{theme.name}</span>
        <div className="layout-preview__header-actions">
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
        {LayoutComponent
          ? <LayoutComponent activePage={activePage} onPageChange={setActivePage} />
          : <LayoutPlaceholder layoutType={theme.layoutType} activePage={activePage} onPageChange={setActivePage} />
        }
      </div>
    </div>
  )
}
