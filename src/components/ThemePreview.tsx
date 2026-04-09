import { useMemo } from 'react'
import type { Theme } from '../types/theme'
import { contrastRatio } from '../utils/contrast'

interface Props {
  theme: Theme
}

const SWATCH_COLORS: { key: keyof Theme['colors']; label: string }[] = [
  { key: 'primary', label: 'Primary' },
  { key: 'secondary', label: 'Secondary' },
  { key: 'background', label: 'BG' },
  { key: 'surface', label: 'Surface' },
  { key: 'text', label: 'Text' },
  { key: 'textMuted', label: 'Muted' },
  { key: 'border', label: 'Border' },
  { key: 'accent', label: 'Accent' },
  { key: 'error', label: 'Error' },
  { key: 'success', label: 'Success' },
  { key: 'warning', label: 'Warning' },
]

export function ThemePreview({ theme }: Props) {
  // Inject all CSS custom properties into the preview container.
  // These match exactly the variable names produced by the CSS export.
  const cssVars = useMemo(
    () =>
      ({
        '--color-primary': theme.colors.primary,
        '--color-primary-foreground': theme.colors.primaryForeground,
        '--color-secondary': theme.colors.secondary,
        '--color-secondary-foreground': theme.colors.secondaryForeground,
        '--color-background': theme.colors.background,
        '--color-surface': theme.colors.surface,
        '--color-text': theme.colors.text,
        '--color-text-muted': theme.colors.textMuted,
        '--color-border': theme.colors.border,
        '--color-accent': theme.colors.accent,
        '--color-error': theme.colors.error,
        '--color-success': theme.colors.success,
        '--color-warning': theme.colors.warning,
        '--font-family': theme.typography.fontFamily,
        '--font-size-base': theme.typography.fontSizeBase,
        '--font-size-sm': theme.typography.fontSizeSm,
        '--font-size-lg': theme.typography.fontSizeLg,
        '--font-size-xl': theme.typography.fontSizeXl,
        '--font-size-2xl': theme.typography.fontSize2xl,
        '--font-size-3xl': theme.typography.fontSize3xl,
        '--font-weight-normal': theme.typography.fontWeightNormal,
        '--font-weight-medium': theme.typography.fontWeightMedium,
        '--font-weight-bold': theme.typography.fontWeightBold,
        '--line-height-base': theme.typography.lineHeightBase,
        '--letter-spacing-base': theme.typography.letterSpacingBase,
        '--spacing-xs': theme.spacing.xs,
        '--spacing-sm': theme.spacing.sm,
        '--spacing-md': theme.spacing.md,
        '--spacing-lg': theme.spacing.lg,
        '--spacing-xl': theme.spacing.xl,
        '--spacing-xxl': theme.spacing.xxl,
        '--spacing-xxxl': theme.spacing.xxxl,
        '--border-radius-none': theme.borderRadius.none,
        '--border-radius-sm': theme.borderRadius.sm,
        '--border-radius-md': theme.borderRadius.md,
        '--border-radius-lg': theme.borderRadius.lg,
        '--border-radius-xl': theme.borderRadius.xl,
        '--border-radius-full': theme.borderRadius.full,
      }) as React.CSSProperties,
    [theme],
  )

  const primaryContrast = useMemo(
    () => contrastRatio(theme.colors.primaryForeground, theme.colors.primary),
    [theme.colors.primaryForeground, theme.colors.primary],
  )

  const textContrast = useMemo(
    () => contrastRatio(theme.colors.text, theme.colors.background),
    [theme.colors.text, theme.colors.background],
  )

  return (
    <div className="theme-preview">
      <div className="theme-preview__label" aria-hidden="true">
        Live Preview — {theme.name}
        {primaryContrast !== null && primaryContrast < 4.5 && (
          <span style={{ marginLeft: '0.5rem', color: '#DC2626', fontWeight: 600 }}>
            ⚠ Primary contrast {primaryContrast}:1
          </span>
        )}
      </div>

      {/* All child elements use var(--color-*) etc. from this container */}
      <div className="preview-scene" style={cssVars}>

        {/* Card with typography samples and interactive elements */}
        <div className="preview-card">
          <h2 className="preview-card__heading">
            The quick brown fox
          </h2>
          <p className="preview-card__body">
            A design system gives your AI agent the visual contract it needs to build consistent,
            polished interfaces without guesswork.
          </p>
          <p className="preview-card__muted">
            Text contrast on background: {textContrast ?? '—'}:1 · Primary contrast: {primaryContrast ?? '—'}:1
          </p>
          <div className="preview-actions">
            <button className="preview-btn preview-btn--primary" tabIndex={-1} aria-hidden="true">
              Primary action
            </button>
            <button className="preview-btn preview-btn--secondary" tabIndex={-1} aria-hidden="true">
              Secondary
            </button>
          </div>
        </div>

        {/* Input demo */}
        <input
          className="preview-input"
          value="Search or enter a value…"
          readOnly
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Status pills */}
        <div className="preview-status-row" aria-hidden="true">
          <span className="preview-status preview-status--success">✓ Success</span>
          <span className="preview-status preview-status--error">✕ Error</span>
          <span className="preview-status preview-status--warning">! Warning</span>
        </div>

        {/* Full color palette swatches */}
        <div className="preview-swatches" aria-hidden="true">
          {SWATCH_COLORS.map(({ key, label }) => (
            <div key={key} className="preview-swatch-item">
              <div
                className="preview-swatch"
                style={{ backgroundColor: theme.colors[key] }}
              />
              <span className="preview-swatch-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
