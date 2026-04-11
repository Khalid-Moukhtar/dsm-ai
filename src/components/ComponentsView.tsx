// ComponentsView — interactive component showcase using live CSS vars.
// Rendered inside the aria-hidden scene — all interactive elements have tabIndex={-1}.
// All colors, typography, spacing, and radius come from CSS custom properties.
// .cv-* class prefix to avoid collisions with layout component classes.

import type { Theme } from '../types/theme'

interface Props {
  theme: Theme
}

export function ComponentsView({ theme }: Props) {
  return (
    <div className="cv-root">
      <h3 className="cv-heading">{theme.name} — Components</h3>

      <div className="cv-grid">

      {/* ── Buttons — full width ────────────────────────────────────────── */}
      <section className="cv-section cv-section--full">
        <h4 className="cv-section-title">Buttons</h4>
        <div className="cv-row">
          <button type="button" tabIndex={-1} className="cv-btn cv-btn--primary">Primary</button>
          <button type="button" tabIndex={-1} className="cv-btn cv-btn--secondary">Secondary</button>
          <button type="button" tabIndex={-1} className="cv-btn cv-btn--outline">Outline</button>
          <button type="button" tabIndex={-1} className="cv-btn cv-btn--ghost">Ghost</button>
          <button type="button" tabIndex={-1} className="cv-btn cv-btn--primary" disabled aria-disabled="true">Disabled</button>
        </div>
      </section>

      {/* ── Inputs ──────────────────────────────────────────────────────── */}
      <section className="cv-section">
        <h4 className="cv-section-title">Inputs</h4>
        <div className="cv-col">
          <input
            type="text"
            tabIndex={-1}
            className="cv-input"
            placeholder="Default input"
            readOnly
            aria-label="Default input example"
          />
          <input
            type="text"
            tabIndex={-1}
            className="cv-input cv-input--focus"
            placeholder="Focused input"
            readOnly
            aria-label="Focused input example"
          />
          <input
            type="text"
            tabIndex={-1}
            className="cv-input cv-input--error"
            placeholder="Error state"
            readOnly
            aria-label="Error input example"
            aria-invalid="true"
          />
        </div>
      </section>

      {/* ── Card ────────────────────────────────────────────────────────── */}
      <section className="cv-section">
        <h4 className="cv-section-title">Card</h4>
        <div className="cv-card">
          <div className="cv-card__header">
            <span className="cv-card__title">Card title</span>
            <span className="cv-badge cv-badge--primary">New</span>
          </div>
          <p className="cv-card__body">
            A surface-elevated card component with a header and body area.
            Uses <code className="cv-code">--color-surface</code> and <code className="cv-code">--color-border</code>.
          </p>
        </div>
      </section>

      {/* ── Badges ──────────────────────────────────────────────────────── */}
      <section className="cv-section">
        <h4 className="cv-section-title">Badges</h4>
        <div className="cv-row cv-row--wrap">
          <span className="cv-badge cv-badge--primary">Primary</span>
          <span className="cv-badge cv-badge--secondary">Secondary</span>
          <span className="cv-badge cv-badge--success">Success</span>
          <span className="cv-badge cv-badge--error">Error</span>
          <span className="cv-badge cv-badge--warning">Warning</span>
          <span className="cv-badge cv-badge--info">Info</span>
          <span className="cv-badge cv-badge--accent">Accent</span>
        </div>
      </section>

      {/* ── Alerts — full width ─────────────────────────────────────────── */}
      <section className="cv-section cv-section--full">
        <h4 className="cv-section-title">Alerts</h4>
        <div className="cv-col">
          <div className="cv-alert cv-alert--info" role="status">
            <span className="cv-alert__icon" aria-hidden="true">ℹ</span>
            <span className="cv-alert__text">Informational alert — uses <code>--color-info</code></span>
          </div>
          <div className="cv-alert cv-alert--success" role="status">
            <span className="cv-alert__icon" aria-hidden="true">✓</span>
            <span className="cv-alert__text">Success — operation completed.</span>
          </div>
          <div className="cv-alert cv-alert--error" role="alert">
            <span className="cv-alert__icon" aria-hidden="true">✕</span>
            <span className="cv-alert__text">Error — something went wrong.</span>
          </div>
          <div className="cv-alert cv-alert--warning" role="status">
            <span className="cv-alert__icon" aria-hidden="true">⚠</span>
            <span className="cv-alert__text">Warning — review before proceeding.</span>
          </div>
        </div>
      </section>

      {/* ── Focus ring demo ─────────────────────────────────────────────── */}
      <section className="cv-section">
        <h4 className="cv-section-title">Focus ring</h4>
        <p className="cv-hint">Keyboard focus outline — uses <code className="cv-code">--color-focus-ring</code></p>
        <div className="cv-focus-demo">
          <button type="button" tabIndex={-1} className="cv-btn cv-btn--primary cv-focus-demo__btn">
            Focused button
          </button>
        </div>
      </section>
      </div>{/* end cv-grid */}

    </div>
  )
}
