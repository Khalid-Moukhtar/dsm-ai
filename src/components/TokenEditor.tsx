// Token editor — semantic controls for non-designers.
// Controls use plain language, not CSS values. Values are computed internally.
// Receives theme + updateSection as props — does NOT call useTheme() directly.
// Color inputs: color picker + hex field (colors are universally understood).
// All other controls: sliders, presets, dropdowns — NEVER freeform text.

import { useRef, useEffect, useState } from 'react'
import type { Theme, EditableSection, ColorPalette, Shadow } from '../types/theme'
import { contrastRatio, passesWcagAA, suggestPassingColor } from '../utils/contrast'

export interface TokenEditorProps {
  theme: Theme
  updateSection: <K extends EditableSection>(section: K, patch: Partial<Theme[K]>) => void
  onReset: () => void
}

// ── Color validation ────────────────────────────────────────────────────────────
const RE_HEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
function validateHex(v: string): boolean { return RE_HEX.test(v.trim()) }

// ── Font family options (curated — non-designer friendly) ─────────────────────
// fontFamily allowlist: only safe characters for CSS. Literal space [ ] not \s
// (security: \s matches \n which is an injection vector — see export.ts note).
const FONT_STACKS: { label: string; value: string }[] = [
  { label: 'Inter — Clean & Modern',         value: 'Inter, system-ui, -apple-system, sans-serif' },
  { label: 'Space Grotesk — Geometric',       value: '"Space Grotesk", system-ui, sans-serif' },
  { label: 'DM Sans — Friendly & Readable',  value: '"DM Sans", system-ui, -apple-system, sans-serif' },
  { label: 'Nunito — Warm & Rounded',        value: 'Nunito, system-ui, -apple-system, sans-serif' },
  { label: 'Playfair — Elegant & Editorial', value: '"Playfair Display", Georgia, serif' },
]

function matchFontStack(fontFamily: string): string {
  const match = FONT_STACKS.find(s => s.value === fontFamily)
  return match ? match.value : FONT_STACKS[0].value
}

// ── Text scale presets ─────────────────────────────────────────────────────────
const TEXT_SCALE_STOPS = [
  { label: 'Compact',  sizes: { base: '13px', sm: '11px', lg: '15px', xl: '18px', x2: '20px', x3: '24px' } },
  { label: 'Normal',   sizes: { base: '16px', sm: '14px', lg: '18px', xl: '20px', x2: '24px', x3: '30px' } },
  { label: 'Spacious', sizes: { base: '18px', sm: '15px', lg: '20px', xl: '24px', x2: '28px', x3: '36px' } },
  { label: 'Large',    sizes: { base: '20px', sm: '17px', lg: '22px', xl: '26px', x2: '32px', x3: '42px' } },
]

function getTextScaleIndex(fontSizeBase: string): number {
  const px = parseInt(fontSizeBase, 10)
  if (px <= 14) return 0
  if (px <= 16) return 1
  if (px <= 18) return 2
  return 3
}

// ── Font weight presets ────────────────────────────────────────────────────────
const WEIGHT_PRESETS = [
  { label: 'Light',   normal: 300, medium: 400, bold: 600 },
  { label: 'Regular', normal: 400, medium: 500, bold: 700 },
  { label: 'Heavy',   normal: 500, medium: 700, bold: 900 },
]

function getWeightPresetIndex(fontWeightNormal: number): number {
  if (fontWeightNormal <= 350) return 0
  if (fontWeightNormal <= 450) return 1
  return 2
}

// ── Line height presets ────────────────────────────────────────────────────────
const LINE_HEIGHT_STOPS = [
  { label: 'Tight',   value: 1.2 },
  { label: 'Normal',  value: 1.5 },
  { label: 'Relaxed', value: 1.7 },
  { label: 'Loose',   value: 2.0 },
]

function getLineHeightIndex(lineHeightBase: number): number {
  if (lineHeightBase <= 1.35) return 0
  if (lineHeightBase <= 1.55) return 1
  if (lineHeightBase <= 1.8)  return 2
  return 3
}

// ── Letter spacing presets ─────────────────────────────────────────────────────
const LETTER_SPACING_STOPS = [
  { label: 'Tight',  value: '-0.03em' },
  { label: 'Normal', value: '0em' },
  { label: 'Wide',   value: '0.05em' },
]

function getLetterSpacingIndex(letterSpacingBase: string): number {
  if (letterSpacingBase.startsWith('-')) return 0
  if (letterSpacingBase === '0em' || letterSpacingBase === '0') return 1
  return 2
}

// ── Density (spacing scale) presets ───────────────────────────────────────────
const DENSITY_STOPS = [
  { label: 'Compact',  spacing: { xs: '3px',  sm: '6px',  md: '12px', lg: '18px', xl: '24px', xxl: '36px', xxxl: '48px' } },
  { label: 'Normal',   spacing: { xs: '4px',  sm: '8px',  md: '16px', lg: '24px', xl: '32px', xxl: '48px', xxxl: '64px' } },
  { label: 'Spacious', spacing: { xs: '6px',  sm: '10px', md: '20px', lg: '30px', xl: '40px', xxl: '64px', xxxl: '80px' } },
  { label: 'Airy',     spacing: { xs: '8px',  sm: '12px', md: '24px', lg: '36px', xl: '48px', xxl: '80px', xxxl: '96px' } },
]

function getDensityIndex(spacingMd: string): number {
  const px = parseInt(spacingMd, 10)
  if (px <= 13) return 0
  if (px <= 17) return 1
  if (px <= 22) return 2
  return 3
}

// ── Border radius presets ──────────────────────────────────────────────────────
const RADIUS_PRESETS = [
  { label: 'Sharp',   id: 'sharp',   radius: { none: '0px', sm: '1px',  md: '2px',  lg: '4px',  xl: '6px',  full: '9999px' } },
  { label: 'Subtle',  id: 'subtle',  radius: { none: '0px', sm: '3px',  md: '6px',  lg: '10px', xl: '14px', full: '9999px' } },
  { label: 'Rounded', id: 'rounded', radius: { none: '0px', sm: '6px',  md: '12px', lg: '18px', xl: '24px', full: '9999px' } },
]

function getRadiusPresetId(borderRadiusMd: string): string {
  const px = parseInt(borderRadiusMd, 10)
  if (px <= 2) return 'sharp'
  if (px <= 8) return 'subtle'
  return 'rounded'
}

// ── Shadow / elevation presets ─────────────────────────────────────────────────
const SHADOW_PRESETS: { id: string; label: string; shadows: Shadow }[] = [
  {
    id: 'flat',
    label: 'Flat',
    shadows: { sm: 'none', md: 'none', lg: 'none', xl: 'none' },
  },
  {
    id: 'subtle',
    label: 'Subtle',
    shadows: {
      sm: '0 1px 2px rgba(0,0,0,0.06)',
      md: '0 1px 4px rgba(0,0,0,0.08)',
      lg: '0 4px 12px rgba(0,0,0,0.08)',
      xl: '0 8px 24px rgba(0,0,0,0.08)',
    },
  },
  {
    id: 'elevated',
    label: 'Elevated',
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.1)',
      md: '0 4px 8px rgba(0,0,0,0.1)',
      lg: '0 8px 24px rgba(0,0,0,0.12)',
      xl: '0 16px 48px rgba(0,0,0,0.12)',
    },
  },
  {
    id: 'dramatic',
    label: 'Dramatic',
    shadows: {
      sm: '0 2px 6px rgba(0,0,0,0.18)',
      md: '0 8px 20px rgba(0,0,0,0.18)',
      lg: '0 16px 40px rgba(0,0,0,0.22)',
      xl: '0 24px 64px rgba(0,0,0,0.22)',
    },
  },
]

function getShadowPresetId(shadowMd: string): string {
  return SHADOW_PRESETS.find(p => p.shadows.md === shadowMd)?.id ?? 'subtle'
}

// ── Color row ──────────────────────────────────────────────────────────────────

interface ColorRowProps {
  id: string
  label: string
  value: string
  onChange: (hex: string) => void
  tooltip?: string
}

function ColorRow({ id, label, value, onChange, tooltip }: ColorRowProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const [draft, setDraft] = useState(value)
  const [error, setError] = useState('')

  const prevValue = useRef(value)
  if (prevValue.current !== value) {
    prevValue.current = value
    setDraft(value)
    setError('')
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handlePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value
    setDraft(hex)
    setError('')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      if (validateHex(hex)) onChange(hex)
    }, 80)
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setDraft(e.target.value)
    setError('')
  }

  function handleTextBlur() {
    const trimmed = draft.trim()
    if (validateHex(trimmed)) {
      setDraft(trimmed)
      onChange(trimmed)
    } else {
      setDraft(value)
      setError('Invalid hex color')
    }
  }

  return (
    <div className="te-color-row">
      <label className="te-color-label" htmlFor={`${id}-text`} data-tooltip={tooltip}>{label}</label>
      <div className="te-color-controls">
        <label className="te-swatch-label" htmlFor={`${id}-picker`}>
          <input
            id={`${id}-picker`}
            type="color"
            className="te-color-picker"
            value={validateHex(value) ? value : '#000000'}
            onChange={handlePickerChange}
            aria-label={`${label} color picker`}
          />
          <span
            className="te-swatch"
            style={{ backgroundColor: validateHex(value) ? value : '#000000' }}
            aria-hidden="true"
          />
        </label>
        <input
          id={`${id}-text`}
          type="text"
          className={`te-hex-input${error ? ' te-hex-input--error' : ''}`}
          value={draft}
          maxLength={7}
          onChange={handleTextChange}
          onBlur={handleTextBlur}
          aria-describedby={error ? `${id}-err` : undefined}
          spellCheck={false}
        />
      </div>
      {error && <p id={`${id}-err`} className="te-field-error" role="alert">{error}</p>}
    </div>
  )
}

// ── WCAG contrast badge ────────────────────────────────────────────────────────

interface ContrastBadgeProps {
  label: string
  fg: string
  bg: string
  /** Called with the suggested hex when the user clicks "Fix →" on a FAIL badge. */
  onFix?: (hex: string) => void
}

function ContrastBadge({ label, fg, bg, onFix }: ContrastBadgeProps) {
  const ratio = contrastRatio(fg, bg)
  const passes = ratio !== null && passesWcagAA(fg, bg)
  const fix = !passes && onFix ? suggestPassingColor(fg, bg) : null

  return (
    <div className="te-contrast-row">
      <span className="te-contrast-label">{label}</span>
      <div className="te-contrast-badge-wrap">
        <span className={`te-contrast-badge${passes ? ' te-contrast-badge--pass' : ' te-contrast-badge--fail'}`}>
          {ratio !== null ? `${ratio}:1` : 'N/A'} {passes ? '✓ AA' : '✗ FAIL'}
        </span>
        {fix && onFix && (
          <button
            className="te-contrast-fix-btn"
            onClick={() => onFix(fix)}
            type="button"
            aria-label={`Auto-fix: change to ${fix}`}
            title={`Nearest passing color: ${fix}`}
          >
            Fix →
          </button>
        )}
      </div>
    </div>
  )
}

// ── Slider control ─────────────────────────────────────────────────────────────

interface SliderControlProps {
  id: string
  label: string
  stops: { label: string }[]
  value: number
  onChange: (index: number) => void
  tooltip?: string
}

function SliderControl({ id, label, stops, value, onChange, tooltip }: SliderControlProps) {
  return (
    <div className="te-slider-row">
      <div className="te-slider-header">
        <label className="te-slider-label" htmlFor={id} data-tooltip={tooltip}>{label}</label>
        <span className="te-slider-value">{stops[value]?.label ?? ''}</span>
      </div>
      <input
        id={id}
        type="range"
        className="te-slider"
        min={0}
        max={stops.length - 1}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        aria-valuetext={stops[value]?.label ?? String(value)}
      />
      <div className="te-slider-ticks" aria-hidden="true">
        {stops.map(s => (
          <span key={s.label} className="te-slider-tick">{s.label}</span>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export function TokenEditor({ theme, updateSection, onReset }: TokenEditorProps) {
  const { colors, typography, spacing, borderRadius, shadows } = theme

  function setColor(key: keyof ColorPalette) {
    return (hex: string) => updateSection('colors', { [key]: hex } as Partial<ColorPalette>)
  }

  const textScaleIdx = getTextScaleIndex(typography.fontSizeBase)
  function handleTextScale(idx: number) {
    const stop = TEXT_SCALE_STOPS[idx]
    updateSection('typography', {
      fontSizeBase: stop.sizes.base,
      fontSizeSm:   stop.sizes.sm,
      fontSizeLg:   stop.sizes.lg,
      fontSizeXl:   stop.sizes.xl,
      fontSize2xl:  stop.sizes.x2,
      fontSize3xl:  stop.sizes.x3,
    })
  }

  const fontFamilyValue = matchFontStack(typography.fontFamily)
  function handleFontFamily(e: React.ChangeEvent<HTMLSelectElement>) {
    updateSection('typography', { fontFamily: e.target.value })
  }

  const weightIdx = getWeightPresetIndex(typography.fontWeightNormal)
  function handleWeightPreset(idx: number) {
    const preset = WEIGHT_PRESETS[idx]
    updateSection('typography', {
      fontWeightNormal: preset.normal,
      fontWeightMedium: preset.medium,
      fontWeightBold:   preset.bold,
    })
  }

  const lineHeightIdx = getLineHeightIndex(typography.lineHeightBase)
  function handleLineHeight(idx: number) {
    updateSection('typography', { lineHeightBase: LINE_HEIGHT_STOPS[idx].value })
  }

  const letterSpacingIdx = getLetterSpacingIndex(typography.letterSpacingBase)
  function handleLetterSpacing(idx: number) {
    updateSection('typography', { letterSpacingBase: LETTER_SPACING_STOPS[idx].value })
  }

  const densityIdx = getDensityIndex(spacing.md)
  function handleDensity(idx: number) {
    updateSection('spacing', { ...DENSITY_STOPS[idx].spacing })
  }

  const radiusPresetId = getRadiusPresetId(borderRadius.md)
  function handleRadiusPreset(id: string) {
    const preset = RADIUS_PRESETS.find(r => r.id === id)
    if (preset) updateSection('borderRadius', { ...preset.radius })
  }

  const shadowPresetId = getShadowPresetId(shadows.md)
  function handleShadowPreset(id: string) {
    const preset = SHADOW_PRESETS.find(p => p.id === id)
    if (preset) updateSection('shadows', { ...preset.shadows })
  }

  return (
    <div className="token-editor">
      <div className="token-editor__header">
        <h2 className="token-editor__title">Customize</h2>
        <button className="te-reset-btn" onClick={onReset} type="button">
          ↺ Reset
        </button>
      </div>

      {/* Colors */}
      <details className="te-section" open>
        <summary className="te-section__summary">Colors</summary>
        <div className="te-section__body">
          <div className="te-color-group">
            <p className="te-color-group__label" data-tooltip="Your core brand colors — the most prominent colors in your UI.">Brand</p>
            <ColorRow id="color-primary"       label="Primary"        value={colors.primary}             onChange={setColor('primary')}
              tooltip="Your main brand color — used for primary buttons, links, and key actions." />
            <ColorRow id="color-primary-fg"    label="Primary text"   value={colors.primaryForeground}   onChange={setColor('primaryForeground')}
              tooltip="Text or icons shown on top of the primary color, e.g. a button label. Must be readable against it." />
            <ColorRow id="color-secondary"     label="Secondary"      value={colors.secondary}           onChange={setColor('secondary')}
              tooltip="A supporting color for less prominent actions and elements — think secondary buttons or tags." />
            <ColorRow id="color-secondary-fg"  label="Secondary text" value={colors.secondaryForeground} onChange={setColor('secondaryForeground')}
              tooltip="Text shown on top of the secondary color. Must be readable against it." />
          </div>
          <div className="te-color-group">
            <p className="te-color-group__label" data-tooltip="Background and surface colors that form the 'stage' behind all your content.">Canvas</p>
            <ColorRow id="color-background" label="Background"   value={colors.background}        onChange={setColor('background')}
              tooltip="The page canvas — the base color sitting behind all other content." />
            <ColorRow id="color-surface"    label="Surface"      value={colors.surface}           onChange={setColor('surface')}
              tooltip="Cards, panels, and dialogs sit on this color — slightly distinct from the page background." />
            <ColorRow id="color-border"     label="Border"       value={colors.border}            onChange={setColor('border')}
              tooltip="Lines that define the edges of cards, inputs, and section dividers." />
          </div>
          <div className="te-color-group">
            <p className="te-color-group__label" data-tooltip="Colors used for readable text throughout the interface.">Text</p>
            <ColorRow id="color-text"       label="Body text"    value={colors.text}              onChange={setColor('text')}
              tooltip="The main readable text color — used for paragraphs, headings, and body content." />
            <ColorRow id="color-text-muted" label="Muted text"   value={colors.textMuted}         onChange={setColor('textMuted')}
              tooltip="Dimmer text for captions, timestamps, labels, and secondary information." />
          </div>
          <div className="te-color-group">
            <p className="te-color-group__label" data-tooltip="Status and highlight colors that communicate meaning at a glance.">Accents</p>
            <ColorRow id="color-accent"     label="Accent"       value={colors.accent}            onChange={setColor('accent')}
              tooltip="A highlight color for hover states, active links, and decorative emphasis." />
            <ColorRow id="color-error"      label="Error"        value={colors.error}             onChange={setColor('error')}
              tooltip="Signals something went wrong — form errors, failed actions, and destructive buttons." />
            <ColorRow id="color-success"    label="Success"      value={colors.success}           onChange={setColor('success')}
              tooltip="Confirms a completed action — saved, sent, or uploaded successfully." />
            <ColorRow id="color-warning"    label="Warning"      value={colors.warning}           onChange={setColor('warning')}
              tooltip="Draws attention to something that needs review but isn't a critical error." />
          </div>

          <div className="te-contrast-summary">
            <p className="te-contrast-summary__title">WCAG AA Contrast</p>
            <ContrastBadge
              label="Primary button"
              fg={colors.primaryForeground}
              bg={colors.primary}
              onFix={hex => updateSection('colors', { primaryForeground: hex })}
            />
            <ContrastBadge
              label="Secondary text on secondary"
              fg={colors.secondaryForeground}
              bg={colors.secondary}
              onFix={hex => updateSection('colors', { secondaryForeground: hex })}
            />
            <ContrastBadge
              label="Body text"
              fg={colors.text}
              bg={colors.background}
              onFix={hex => updateSection('colors', { text: hex })}
            />
            <ContrastBadge
              label="Muted text"
              fg={colors.textMuted}
              bg={colors.background}
              onFix={hex => updateSection('colors', { textMuted: hex })}
            />
          </div>
        </div>
      </details>

      {/* Typography */}
      <details className="te-section">
        <summary className="te-section__summary">Typography</summary>
        <div className="te-section__body">
          <div className="te-dropdown-row">
            <label className="te-dropdown-label" htmlFor="te-font-family" data-tooltip="The typeface used across your whole design system — sets the overall personality of your text.">Font</label>
            <select
              id="te-font-family"
              className="te-dropdown"
              value={fontFamilyValue}
              onChange={handleFontFamily}
            >
              {FONT_STACKS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <SliderControl
            id="te-text-scale"
            label="Text scale"
            stops={TEXT_SCALE_STOPS}
            value={textScaleIdx}
            onChange={handleTextScale}
            tooltip="Overall text sizing — Compact for dense UIs, Large for readability and accessibility."
          />

          <div className="te-toggle-row">
            <span className="te-toggle-label" data-tooltip="Stroke thickness of text — Light feels airy and delicate, Heavy feels bold and strong.">Weight</span>
            <div className="te-toggle-group" role="group" aria-label="Font weight">
              {WEIGHT_PRESETS.map((preset, idx) => (
                <button
                  key={preset.label}
                  className={`te-toggle-btn${weightIdx === idx ? ' te-toggle-btn--active' : ''}`}
                  onClick={() => handleWeightPreset(idx)}
                  type="button"
                  aria-pressed={weightIdx === idx}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <SliderControl
            id="te-line-height"
            label="Line height"
            stops={LINE_HEIGHT_STOPS}
            value={lineHeightIdx}
            onChange={handleLineHeight}
            tooltip="Vertical space between text lines — Tight feels compact, Loose feels airy and relaxed."
          />

          <SliderControl
            id="te-letter-spacing"
            label="Letter spacing"
            stops={LETTER_SPACING_STOPS}
            value={letterSpacingIdx}
            onChange={handleLetterSpacing}
            tooltip="Horizontal space between characters — Tight looks sleek and modern, Wide looks editorial."
          />
        </div>
      </details>

      {/* Spacing */}
      <details className="te-section">
        <summary className="te-section__summary">Spacing</summary>
        <div className="te-section__body">
          <SliderControl
            id="te-density"
            label="Density"
            stops={DENSITY_STOPS}
            value={densityIdx}
            onChange={handleDensity}
            tooltip="Space between elements — Compact for data-dense dashboards, Airy for marketing pages."
          />
        </div>
      </details>

      {/* Border radius */}
      <details className="te-section">
        <summary className="te-section__summary">Corners</summary>
        <div className="te-section__body">
          <div className="te-toggle-row">
            <span className="te-toggle-label" data-tooltip="Corner style — Sharp feels precise and professional, Rounded feels friendly and approachable.">Style</span>
            <div className="te-toggle-group te-toggle-group--radius" role="group" aria-label="Corner style">
              {RADIUS_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  className={`te-toggle-btn te-toggle-btn--radius${radiusPresetId === preset.id ? ' te-toggle-btn--active' : ''}`}
                  onClick={() => handleRadiusPreset(preset.id)}
                  type="button"
                  aria-pressed={radiusPresetId === preset.id}
                  title={preset.label}
                >
                  <span
                    className="te-radius-preview"
                    style={{ borderRadius: preset.radius.md }}
                    aria-hidden="true"
                  />
                  <span className="te-radius-label">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* Shadows */}
      <details className="te-section">
        <summary className="te-section__summary">Shadows</summary>
        <div className="te-section__body">
          <div className="te-toggle-row">
            <span className="te-toggle-label" data-tooltip="How 'raised' elements appear — Flat is minimal and modern, Dramatic creates strong depth and hierarchy.">Elevation</span>
            <div className="te-toggle-group te-toggle-group--shadow" role="group" aria-label="Shadow elevation">
              {SHADOW_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  className={`te-toggle-btn te-toggle-btn--shadow${shadowPresetId === preset.id ? ' te-toggle-btn--active' : ''}`}
                  onClick={() => handleShadowPreset(preset.id)}
                  type="button"
                  aria-pressed={shadowPresetId === preset.id}
                  title={preset.label}
                >
                  <span
                    className={`te-shadow-preview${preset.id === 'flat' ? ' te-shadow-preview--flat' : ''}`}
                    aria-hidden="true"
                    style={{ boxShadow: preset.shadows.md }}
                  />
                  <span className="te-shadow-label">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}
