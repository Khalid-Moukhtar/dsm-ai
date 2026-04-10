// Token editor — semantic controls for non-designers.
// Controls use plain language, not CSS values. Values are computed internally.
// Receives theme + updateSection as props — does NOT call useTheme() directly.
// Color inputs: color picker + hex field (colors are universally understood).
// All other controls: sliders, presets, dropdowns — NEVER freeform text.

import { useRef, useEffect, useState } from 'react'
import type { Theme, EditableSection, ColorPalette } from '../types/theme'
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

// ── Color row ──────────────────────────────────────────────────────────────────

interface ColorRowProps {
  id: string
  label: string
  value: string
  onChange: (hex: string) => void
}

function ColorRow({ id, label, value, onChange }: ColorRowProps) {
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
      <label className="te-color-label" htmlFor={`${id}-text`}>{label}</label>
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
}

function SliderControl({ id, label, stops, value, onChange }: SliderControlProps) {
  return (
    <div className="te-slider-row">
      <div className="te-slider-header">
        <label className="te-slider-label" htmlFor={id}>{label}</label>
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
  const { colors, typography, spacing, borderRadius } = theme

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
          <ColorRow id="color-primary"    label="Primary"      value={colors.primary}           onChange={setColor('primary')} />
          <ColorRow id="color-primary-fg" label="Primary text" value={colors.primaryForeground} onChange={setColor('primaryForeground')} />
          <ColorRow id="color-secondary"  label="Secondary"    value={colors.secondary}         onChange={setColor('secondary')} />
          <ColorRow id="color-background" label="Background"   value={colors.background}        onChange={setColor('background')} />
          <ColorRow id="color-surface"    label="Surface"      value={colors.surface}           onChange={setColor('surface')} />
          <ColorRow id="color-text"       label="Body text"    value={colors.text}              onChange={setColor('text')} />
          <ColorRow id="color-text-muted" label="Muted text"   value={colors.textMuted}         onChange={setColor('textMuted')} />
          <ColorRow id="color-border"     label="Border"       value={colors.border}            onChange={setColor('border')} />
          <ColorRow id="color-accent"     label="Accent"       value={colors.accent}            onChange={setColor('accent')} />
          <ColorRow id="color-error"      label="Error"        value={colors.error}             onChange={setColor('error')} />
          <ColorRow id="color-success"    label="Success"      value={colors.success}           onChange={setColor('success')} />
          <ColorRow id="color-warning"    label="Warning"      value={colors.warning}           onChange={setColor('warning')} />

          <div className="te-contrast-summary">
            <p className="te-contrast-summary__title">WCAG AA Contrast</p>
            <ContrastBadge
              label="Primary button"
              fg={colors.primaryForeground}
              bg={colors.primary}
              onFix={hex => updateSection('colors', { primaryForeground: hex })}
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
            <label className="te-dropdown-label" htmlFor="te-font-family">Font</label>
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
          />

          <div className="te-toggle-row">
            <span className="te-toggle-label">Weight</span>
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
          />

          <SliderControl
            id="te-letter-spacing"
            label="Letter spacing"
            stops={LETTER_SPACING_STOPS}
            value={letterSpacingIdx}
            onChange={handleLetterSpacing}
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
          />
        </div>
      </details>

      {/* Border radius */}
      <details className="te-section">
        <summary className="te-section__summary">Corners</summary>
        <div className="te-section__body">
          <div className="te-toggle-row">
            <span className="te-toggle-label">Style</span>
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
    </div>
  )
}
