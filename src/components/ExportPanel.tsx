import { useState, useMemo } from 'react'
import type { Theme, ExportFormat } from '../types/theme'
import { contrastRatio, passesWcagAA } from '../utils/contrast'

interface Props {
  theme: Theme
  onExport: (format: ExportFormat) => void
  onReset: () => void
}

const FORMATS: { value: ExportFormat; label: string }[] = [
  { value: 'markdown', label: 'MD' },
  { value: 'json', label: 'JSON' },
  { value: 'css', label: 'CSS' },
]

interface ContrastCheck {
  label: string
  foreground: string
  background: string
  largeText?: boolean
}

export function ExportPanel({ theme, onExport, onReset }: Props) {
  const [format, setFormat] = useState<ExportFormat>('markdown')

  const contrastChecks: ContrastCheck[] = useMemo(
    () => [
      {
        label: 'Primary button',
        foreground: theme.colors.primaryForeground,
        background: theme.colors.primary,
      },
      {
        label: 'Body text',
        foreground: theme.colors.text,
        background: theme.colors.background,
      },
      {
        label: 'Muted text',
        foreground: theme.colors.textMuted,
        background: theme.colors.background,
      },
    ],
    [theme.colors],
  )

  const FILE_NAMES: Record<ExportFormat, string> = {
    markdown: 'design_rules.md',
    json: 'design_tokens.json',
    css: 'variables.css',
  }

  return (
    <div className="export-panel">
      <div>
        <p className="export-panel__title">Export</p>
        <p className="export-panel__desc">Download your design rules as {FILE_NAMES[format]}</p>
      </div>

      {/* Format selector */}
      <div className="export-panel__format-group" role="group" aria-label="Export format">
        {FORMATS.map(f => (
          <button
            key={f.value}
            className={`export-panel__format-btn${format === f.value ? ' export-panel__format-btn--active' : ''}`}
            onClick={() => setFormat(f.value)}
            aria-pressed={format === f.value}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Download */}
      <button
        className="export-panel__download"
        onClick={() => onExport(format)}
      >
        ↓ Download {FILE_NAMES[format]}
      </button>

      {/* Reset */}
      <button className="export-panel__reset" onClick={onReset}>
        Reset to template defaults
      </button>

      {/* Contrast summary */}
      <div className="contrast-summary" aria-label="WCAG contrast summary">
        <p className="contrast-summary__title">Contrast (WCAG AA)</p>
        {contrastChecks.map(check => {
          const ratio = contrastRatio(check.foreground, check.background)
          const passes = passesWcagAA(check.foreground, check.background, check.largeText)
          return (
            <div key={check.label} className="contrast-row">
              <span className="contrast-row__label">{check.label}</span>
              <span className="contrast-row__value">
                {ratio !== null ? `${ratio}:1` : '—'}
                <span
                  className={`contrast-badge contrast-badge--${passes ? 'pass' : 'fail'}`}
                  aria-label={passes ? 'Passes WCAG AA' : 'Fails WCAG AA'}
                >
                  {passes ? 'AA' : 'FAIL'}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
