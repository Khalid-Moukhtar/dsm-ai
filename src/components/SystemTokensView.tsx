/**
 * SystemTokensView — universal token reference panel
 *
 * Renders every semantic token in actual UI context so users can see and feel
 * changes as they tweak the token editor. All visual values come from CSS custom
 * properties injected by LayoutPreview (live updates). The theme prop provides
 * raw values for the spec strips (size labels, px values, etc.).
 *
 * Visualization patterns (based on Carbon, Material 3, Atlassian, USWDS research):
 *  - Typography: actual text sample at correct size/weight + spec strip (size · weight · lh)
 *  - Body row: two lines rendered so line-height is actually visible
 *  - Weights: same glyph side-by-side at all three weights
 *  - Letter spacing: uppercase ABCDEFG at actual tracking (caps make tracking perceptible)
 *  - Spacing: proportional bars where width = var(--spacing-{token}) — updates live
 *
 * Lives inside the aria-hidden scene — all interactive elements carry tabIndex={-1}.
 */
import type { Theme } from '../types/theme'

interface Props {
  theme: Theme
}

export function SystemTokensView({ theme }: Props) {
  const { typography, spacing } = theme

  return (
    <div className="stv">

      {/* ── Color palette ───────────────────────────────────── */}
      <section className="stv-section">
        <h2 className="stv-heading">Color palette</h2>
        <div className="stv-swatches">
          {([
            ['primary',              'Primary'],
            ['primary-foreground',   'Primary text'],
            ['secondary',            'Secondary'],
            ['secondary-foreground', 'Secondary text'],
            ['accent',               'Accent'],
            ['background',           'Background'],
            ['surface',              'Surface'],
            ['border',               'Border'],
            ['text',                 'Text'],
            ['text-muted',           'Text muted'],
            ['error',                'Error'],
            ['success',              'Success'],
            ['warning',              'Warning'],
            ['info',                 'Info'],
            ['focus-ring',           'Focus ring'],
          ] as [string, string][]).map(([token, label]) => (
            <div key={token} className="stv-swatch-group">
              <div className="stv-swatch" style={{ background: `var(--color-${token})` }} />
              <span className="stv-swatch-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="stv-grid">

      {/* ── Buttons ─────────────────────────────────────────── */}
      <section className="stv-section">
        <h2 className="stv-heading">Buttons</h2>
        <div className="stv-row stv-row--wrap">
          <button className="stv-btn stv-btn--primary" type="button" tabIndex={-1}>Primary</button>
          <button className="stv-btn stv-btn--secondary" type="button" tabIndex={-1}>Secondary</button>
          <button className="stv-btn stv-btn--outline" type="button" tabIndex={-1}>Outline</button>
          <button className="stv-btn stv-btn--ghost" type="button" tabIndex={-1}>Ghost</button>
          <button className="stv-btn stv-btn--primary" type="button" tabIndex={-1} disabled>Disabled</button>
        </div>
      </section>

      {/* ── Status alerts ───────────────────────────────────── */}
      <section className="stv-section">
        <h2 className="stv-heading">Status</h2>
        <div className="stv-alerts">
          <div className="stv-alert stv-alert--error">
            <span className="stv-alert__icon" aria-hidden="true">✕</span>
            <div className="stv-alert__body">
              <strong className="stv-alert__title">Error</strong>
              <p className="stv-alert__msg">Something went wrong. Please check your input and try again.</p>
            </div>
          </div>
          <div className="stv-alert stv-alert--success">
            <span className="stv-alert__icon" aria-hidden="true">✓</span>
            <div className="stv-alert__body">
              <strong className="stv-alert__title">Success</strong>
              <p className="stv-alert__msg">Your changes have been saved successfully.</p>
            </div>
          </div>
          <div className="stv-alert stv-alert--warning">
            <span className="stv-alert__icon" aria-hidden="true">⚠</span>
            <div className="stv-alert__body">
              <strong className="stv-alert__title">Warning</strong>
              <p className="stv-alert__msg">This action will affect all team members and cannot be undone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Badges ──────────────────────────────────────────── */}
      <section className="stv-section">
        <h2 className="stv-heading">Badges</h2>
        <div className="stv-row stv-row--wrap">
          <span className="stv-badge stv-badge--primary">Primary</span>
          <span className="stv-badge stv-badge--secondary">Secondary</span>
          <span className="stv-badge stv-badge--accent">Accent</span>
          <span className="stv-badge stv-badge--error">Error</span>
          <span className="stv-badge stv-badge--success">Success</span>
          <span className="stv-badge stv-badge--warning">Warning</span>
          <span className="stv-badge stv-badge--outline">Neutral</span>
        </div>
      </section>

      {/* ── Form states ─────────────────────────────────────── */}
      <section className="stv-section">
        <h2 className="stv-heading">Form states</h2>
        <div className="stv-form-row">
          <div className="stv-field">
            <label className="stv-label">Default</label>
            <input className="stv-input" placeholder="Enter your email" readOnly tabIndex={-1} />
          </div>
          <div className="stv-field">
            <label className="stv-label">Error state</label>
            <input className="stv-input stv-input--error" defaultValue="invalid@" readOnly tabIndex={-1} />
            <span className="stv-field-msg stv-field-msg--error">Please enter a valid email address</span>
          </div>
          <div className="stv-field">
            <label className="stv-label">Success state</label>
            <input className="stv-input stv-input--success" defaultValue="user@example.com" readOnly tabIndex={-1} />
            <span className="stv-field-msg stv-field-msg--success">Looks good!</span>
          </div>
        </div>
      </section>

      {/* ── Typography scale (full width) ───────────────────── */}
      {/*
        Pattern: each row = spec strip (token name + size · weight) + sample text at
        actual size/weight. Body row renders two lines so line-height is VISIBLE.
        Weights subsection: same glyph at all three weights side-by-side.
        Tracking: uppercase sample — caps make tracking differences perceptible.
      */}
      <section className="stv-section stv-section--full">
        <h2 className="stv-heading">Typography</h2>

        <div className="stv-type-scale">
          {/* Display / heading rows — single line each */}
          <div className="stv-type-row">
            <div className="stv-type-spec">
              <span className="stv-type-token">3xl</span>
              <span className="stv-type-values">{typography.fontSize3xl} · {typography.fontWeightBold}</span>
            </div>
            <span className="stv-type--3xl">Display heading</span>
          </div>
          <div className="stv-type-row">
            <div className="stv-type-spec">
              <span className="stv-type-token">2xl</span>
              <span className="stv-type-values">{typography.fontSize2xl} · {typography.fontWeightBold}</span>
            </div>
            <span className="stv-type--2xl">Section heading</span>
          </div>
          <div className="stv-type-row">
            <div className="stv-type-spec">
              <span className="stv-type-token">xl</span>
              <span className="stv-type-values">{typography.fontSizeXl} · {typography.fontWeightMedium}</span>
            </div>
            <span className="stv-type--xl">Page heading</span>
          </div>
          <div className="stv-type-row">
            <div className="stv-type-spec">
              <span className="stv-type-token">lg</span>
              <span className="stv-type-values">{typography.fontSizeLg} · {typography.fontWeightMedium}</span>
            </div>
            <span className="stv-type--lg">Subsection title</span>
          </div>

          {/* Body — TWO LINES so line-height is actually visible */}
          <div className="stv-type-row stv-type-row--top">
            <div className="stv-type-spec">
              <span className="stv-type-token">base</span>
              <span className="stv-type-values">{typography.fontSizeBase} · {typography.fontWeightNormal}</span>
              <span className="stv-type-values stv-type-lh">lh {typography.lineHeightBase}</span>
            </div>
            <span className="stv-type--base">
              Body text — The quick brown fox jumps over the lazy dog.<br />
              Second line shows the actual {typography.lineHeightBase}× line height gap between lines.
            </span>
          </div>

          {/* Caption */}
          <div className="stv-type-row stv-type-row--top">
            <div className="stv-type-spec">
              <span className="stv-type-token">sm</span>
              <span className="stv-type-values">{typography.fontSizeSm} · {typography.fontWeightNormal}</span>
            </div>
            <span className="stv-type--sm stv-text-muted">Caption and helper text — Supporting content, timestamps, metadata, and descriptions.</span>
          </div>
        </div>

        {/* Font weight comparison — same glyph at all 3 weights */}
        <div className="stv-weights-demo">
          {([
            ['Normal', typography.fontWeightNormal],
            ['Medium', typography.fontWeightMedium],
            ['Bold',   typography.fontWeightBold],
          ] as [string, number][]).map(([label, weight]) => (
            <div key={label} className="stv-weight-item">
              <span
                className="stv-weight-sample"
                style={{ fontFamily: 'var(--font-family)', fontWeight: weight }}
              >
                Ag
              </span>
              <span className="stv-weight-label">{label} · {weight}</span>
            </div>
          ))}
        </div>

        {/* Letter tracking — uppercase makes tiny differences visible */}
        <div className="stv-tracking-row">
          <div className="stv-type-spec">
            <span className="stv-type-token">tracking</span>
            <span className="stv-type-values">{typography.letterSpacingBase}</span>
          </div>
          <span
            className="stv-tracking-sample"
            style={{ letterSpacing: 'var(--letter-spacing-base)', fontFamily: 'var(--font-family)' }}
          >
            ABCDEFGHIJ KLMNOPQRST
          </span>
        </div>
      </section>

      {/* ── Spacing scale ────────────────────────────────────── */}
      {/*
        Pattern (Carbon / USWDS): bar width = var(--spacing-{token}) directly from
        the CSS custom property. Bars scale proportionally and update live as the
        user moves the Density slider. The px label comes from the theme prop.
      */}
      <section className="stv-section">
        <h2 className="stv-heading">Spacing scale</h2>
        <div className="stv-spacing-scale">
          {([
            ['xs',   spacing.xs,   '--spacing-xs'],
            ['sm',   spacing.sm,   '--spacing-sm'],
            ['md',   spacing.md,   '--spacing-md'],
            ['lg',   spacing.lg,   '--spacing-lg'],
            ['xl',   spacing.xl,   '--spacing-xl'],
            ['xxl',  spacing.xxl,  '--spacing-xxl'],
            ['xxxl', spacing.xxxl, '--spacing-xxxl'],
          ] as [string, string, string][]).map(([token, value, cssVar]) => (
            <div key={token} className="stv-spacing-row">
              <span className="stv-spacing-token">{token}</span>
              <div className="stv-spacing-bar-track">
                <div className="stv-spacing-bar" style={{ width: `var(${cssVar})` }} />
              </div>
              <span className="stv-spacing-value">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Surfaces ────────────────────────────────────────── */}
      <section className="stv-section">
        <h2 className="stv-heading">Surfaces</h2>
        <div className="stv-surfaces">
          <div className="stv-surface stv-surface--background">
            <span className="stv-surface-label">Background</span>
            <div className="stv-surface-card stv-surface-card--on-bg">
              <p className="stv-surface-card-title">Card on background</p>
              <p className="stv-surface-card-text">Surface color used for elevated elements</p>
            </div>
          </div>
          <div className="stv-surface stv-surface--surface">
            <span className="stv-surface-label">Surface</span>
            <div className="stv-surface-card stv-surface-card--on-surface">
              <p className="stv-surface-card-title">Card on surface</p>
              <p className="stv-surface-card-text">Background color used for inner contrast</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Border radius scale (full width) ───────────────── */}
      <section className="stv-section stv-section--full">
        <h2 className="stv-heading">Border radius</h2>
        <div className="stv-radius-row">
          {([
            ['none', 'None'],
            ['sm',   'sm'],
            ['md',   'md'],
            ['lg',   'lg'],
            ['xl',   'xl'],
            ['full', 'Full'],
          ] as [string, string][]).map(([token, label]) => (
            <div key={token} className="stv-radius-item">
              <div
                className="stv-radius-box"
                style={{ borderRadius: `var(--border-radius-${token})` }}
              />
              <span className="stv-radius-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      </div>{/* end stv-grid */}

    </div>
  )
}
