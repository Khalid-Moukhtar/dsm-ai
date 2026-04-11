// OKLCH-based palette generator.
// Converts a single seed hex color into a complete 15-token ColorPalette.
// OKLCH is perceptually uniform — equal numerical changes produce equal perceived changes.
// Zero new dependencies — pure inline math.
//
// SECURITY: RE_HEX_6 is defined locally (6-char only, rejects 3-char shorthand).
// All 15 output hex values are validated before returning.

import type { ColorPalette } from '../types/theme'
import { contrastRatio } from './contrast'

// Only 6-char hex accepted — 3-char shorthand is rejected.
const RE_HEX_6 = /^#[0-9A-Fa-f]{6}$/

// ── sRGB ↔ linear ────────────────────────────────────────────────────────────

function toLinear(c: number): number {
  const s = c / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

function toSrgb(c: number): number {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055
}

// ── XYZ D65 helpers ──────────────────────────────────────────────────────────

function linearToXyz(r: number, g: number, b: number): [number, number, number] {
  return [
    0.4124564 * r + 0.3575761 * g + 0.1804375 * b,
    0.2126729 * r + 0.7151522 * g + 0.0721750 * b,
    0.0193339 * r + 0.1191920 * g + 0.9503041 * b,
  ]
}

function xyzToLinear(x: number, y: number, z: number): [number, number, number] {
  return [
     3.2404542 * x - 1.5371385 * y - 0.4985314 * z,
    -0.9692660 * x + 1.8760108 * y + 0.0415560 * z,
     0.0556434 * x - 0.2040259 * y + 1.0572252 * z,
  ]
}

// ── OKLAB helpers ────────────────────────────────────────────────────────────

function xyzToOklab(x: number, y: number, z: number): [number, number, number] {
  const lc = 0.4122214708 * x + 0.5363325363 * y + 0.0514459929 * z
  const mc = 0.2119034982 * x + 0.6806995451 * y + 0.1073969566 * z
  const sc = 0.0883024619 * x + 0.2817188376 * y + 0.6299787005 * z

  const l_ = Math.cbrt(lc)
  const m_ = Math.cbrt(mc)
  const s_ = Math.cbrt(sc)

  return [
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_,
  ]
}

function oklabToXyz(L: number, a: number, b: number): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b

  const lc = l_ ** 3
  const mc = m_ ** 3
  const sc = s_ ** 3

  return [
     4.0767416621 * lc - 3.3077115913 * mc + 0.2309699292 * sc,
    -1.2684380046 * lc + 2.6097574011 * mc - 0.3413193965 * sc,
    -0.0041960863 * lc - 0.7034186147 * mc + 1.7076147010 * sc,
  ]
}

// ── Public conversion helpers ─────────────────────────────────────────────────

/** hex → { L, C, h } or null if input is invalid. */
export function hexToOklch(hex: string): { L: number; C: number; h: number } | null {
  if (!RE_HEX_6.test(hex)) return null

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  const [rLin, gLin, bLin] = [toLinear(r), toLinear(g), toLinear(b)]
  const [x, y, z] = linearToXyz(rLin, gLin, bLin)
  const [L, a, bOk] = xyzToOklab(x, y, z)

  const C = Math.sqrt(a * a + bOk * bOk)
  let h = Math.atan2(bOk, a) * (180 / Math.PI)
  if (h < 0) h += 360

  return { L, C, h }
}

/** { L, C, h } → 6-char hex (all channels clamped to valid range). */
export function oklchToHex(L: number, C: number, h: number): string {
  // Clamp to valid OKLCH ranges
  const Lc = Math.max(0, Math.min(1, L))
  const Cc = Math.max(0, Math.min(0.37, C))
  const hc = ((h % 360) + 360) % 360

  const rad = hc * (Math.PI / 180)
  const a = Cc * Math.cos(rad)
  const bOk = Cc * Math.sin(rad)

  const [x, y, z] = oklabToXyz(Lc, a, bOk)
  const [rLin, gLin, bLin] = xyzToLinear(x, y, z)

  const toChannel = (c: number): number =>
    Math.round(Math.max(0, Math.min(1, toSrgb(Math.max(0, c)))) * 255)

  const r = toChannel(rLin)
  const g = toChannel(gLin)
  const b = toChannel(bLin)

  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')
}

// ── WCAG helpers ──────────────────────────────────────────────────────────────

function passes45(fg: string, bg: string): boolean {
  const ratio = contrastRatio(fg, bg)
  return ratio !== null && ratio >= 4.5
}

/** Choose a foreground (dark or light) that passes 4.5:1 against bg.
 *  Starts with the candidate based on bg lightness, then tries opposite,
 *  then nudges in steps of 0.05 (max 10 iterations). */
function chooseForeground(bgHex: string, bgOklch: { L: number; C: number; h: number }): string {
  // Start: if bg is relatively light (L > 0.55) use dark fg, else light fg
  const candidates = bgOklch.L > 0.55
    ? [{ L: 0.12, C: 0.01, h: bgOklch.h }, { L: 0.98, C: 0.01, h: bgOklch.h }]
    : [{ L: 0.98, C: 0.01, h: bgOklch.h }, { L: 0.12, C: 0.01, h: bgOklch.h }]

  for (const cand of candidates) {
    const hex = oklchToHex(cand.L, cand.C, cand.h)
    if (passes45(hex, bgHex)) return hex
  }

  // Both extremes failed — nudge toward pure white or pure black
  const isDarkFg = bgOklch.L > 0.55
  for (let i = 0; i <= 10; i++) {
    const L = isDarkFg ? Math.max(0, 0.12 - i * 0.05) : Math.min(1, 0.98 + i * 0.05)
    const hex = oklchToHex(L, 0.005, bgOklch.h)
    if (passes45(hex, bgHex)) return hex
  }

  // Absolute fallback
  return bgOklch.L > 0.55 ? '#000000' : '#FFFFFF'
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Generate a 15-token ColorPalette from a single seed hex color.
 * Returns null if:
 *   - seedHex fails RE_HEX_6 (3-char hex, empty string, non-hex)
 *   - any internal conversion produces an invalid hex value
 */
export function generatePalette(seedHex: string): ColorPalette | null {
  if (!RE_HEX_6.test(seedHex)) return null

  const seed = hexToOklch(seedHex)
  if (!seed) return null

  // ── 1. Primary — keep seed hue and chroma, clamp L ──────────────────────────
  const primaryL = Math.max(0.40, Math.min(0.65, seed.L))
  const primaryOklch = { L: primaryL, C: seed.C, h: seed.h }
  const primary = oklchToHex(primaryOklch.L, primaryOklch.C, primaryOklch.h)

  // ── 2. Primary foreground ────────────────────────────────────────────────────
  const primaryForeground = chooseForeground(primary, primaryOklch)

  // ── 3. Secondary — rotate h+60°, reduce C by 35%, L=0.55 ────────────────────
  const secondaryOklch = { L: 0.55, C: seed.C * 0.65, h: (seed.h + 60) % 360 }
  const secondary = oklchToHex(secondaryOklch.L, secondaryOklch.C, secondaryOklch.h)

  // ── 4. Secondary foreground ──────────────────────────────────────────────────
  const secondaryForeground = chooseForeground(secondary, secondaryOklch)

  // ── 5. Neutrals — barely tinted (C≈0.01), L varies ─────────────────────────
  const bgOklch     = { L: 0.98, C: 0.01, h: seed.h }
  const surfaceOklch = { L: 0.95, C: 0.01, h: seed.h }
  const borderOklch  = { L: 0.85, C: 0.01, h: seed.h }

  const background = oklchToHex(bgOklch.L, bgOklch.C, bgOklch.h)
  const surface    = oklchToHex(surfaceOklch.L, surfaceOklch.C, surfaceOklch.h)
  const border     = oklchToHex(borderOklch.L, borderOklch.C, borderOklch.h)

  // ── 6. Text — nudge L until it passes WCAG AA on bg and surface ─────────────
  let textL = 0.12
  const textH = seed.h
  const textC = 0.01
  for (let i = 0; i < 20; i++) {
    const hex = oklchToHex(textL, textC, textH)
    if (passes45(hex, background) && passes45(hex, surface)) break
    textL = Math.max(0, textL - 0.03)
  }
  const text = oklchToHex(textL, textC, textH)

  // ── 7. Text muted — slightly lighter than text ───────────────────────────────
  const textMutedL = textL + 0.33
  const textMuted = oklchToHex(Math.min(0.55, textMutedL), 0.01, seed.h)

  // ── 8. Accent — rotate h–30°, same C and L as primary ───────────────────────
  const accent = oklchToHex(primaryL, seed.C, ((seed.h - 30) % 360 + 360) % 360)

  // ── 9. Semantic colors — fixed OKLCH values ──────────────────────────────────
  const error    = oklchToHex(0.55, 0.19, 27)
  const success  = oklchToHex(0.55, 0.15, 142)
  const warning  = oklchToHex(0.60, 0.16, 75)
  const info     = oklchToHex(0.52, 0.15, 250)

  // ── 10. Focus ring — primary at L+0.15 (clamped 0.85) ───────────────────────
  // WCAG 2.2 SC 3.3 requires 3:1 for focus indicators — NOT 4.5:1 text contrast.
  // Do NOT apply text contrast validation here.
  const focusRing = oklchToHex(Math.min(primaryL + 0.15, 0.85), seed.C, seed.h)

  // ── 11. Final validation — all 15 values must be valid 6-char hex ─────────────
  const palette: ColorPalette = {
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    background,
    surface,
    text,
    textMuted,
    border,
    accent,
    error,
    success,
    warning,
    focusRing,
    info,
  }

  for (const val of Object.values(palette)) {
    if (!RE_HEX_6.test(val)) return null
  }

  return palette
}
