// WCAG 2.1 contrast ratio calculation.
// Formula: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio

function hexToRgb(hex: string): [number, number, number] | null {
  const cleaned = hex.replace('#', '')
  if (!/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleaned)) return null

  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map(c => c + c)
          .join('')
      : cleaned

  return [
    parseInt(full.substring(0, 2), 16),
    parseInt(full.substring(2, 4), 16),
    parseInt(full.substring(4, 6), 16),
  ]
}

function toLinear(channel: number): number {
  const sRGB = channel / 255
  return sRGB <= 0.04045
    ? sRGB / 12.92
    : ((sRGB + 0.055) / 1.055) ** 2.4
}

function relativeLuminance(hex: string): number | null {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const [r, g, b] = rgb
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** Returns the WCAG contrast ratio (1–21) between two hex colors, or null if either is invalid. */
export function contrastRatio(foreground: string, background: string): number | null {
  const L1 = relativeLuminance(foreground)
  const L2 = relativeLuminance(background)
  if (L1 === null || L2 === null) return null
  const lighter = Math.max(L1, L2)
  const darker = Math.min(L1, L2)
  return parseFloat(((lighter + 0.05) / (darker + 0.05)).toFixed(2))
}

/** Returns true if the pair passes WCAG AA (4.5:1 normal text, 3:1 large text). */
export function passesWcagAA(
  foreground: string,
  background: string,
  isLargeText = false,
): boolean {
  const ratio = contrastRatio(foreground, background)
  if (ratio === null) return false
  return isLargeText ? ratio >= 3 : ratio >= 4.5
}

// ── HSL helpers for suggestPassingColor ─────────────────────────────────────

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === rn)      h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    else if (max === gn) h = ((bn - rn) / d + 2) / 6
    else                 h = ((rn - gn) / d + 4) / 6
  }

  return [h * 360, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  const hn = h / 360, sn = s / 100, ln = l / 100
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = ln
  } else {
    const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn
    const p = 2 * ln - q
    const hue2rgb = (p2: number, q2: number, t: number): number => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t
      if (t < 1 / 2) return q2
      if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6
      return p2
    }
    r = hue2rgb(p, q, hn + 1 / 3)
    g = hue2rgb(p, q, hn)
    b = hue2rgb(p, q, hn - 1 / 3)
  }

  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Returns the nearest hex color to `fg` that passes WCAG AA against `bg`,
 * found by binary-searching lightness in HSL space toward black or white.
 * Returns null if inputs are invalid. Returns `fg` unchanged if it already passes.
 */
export function suggestPassingColor(fg: string, bg: string): string | null {
  const fgRgb = hexToRgb(fg)
  const bgLum = relativeLuminance(bg)
  if (!fgRgb || bgLum === null) return null
  if (passesWcagAA(fg, bg)) return fg

  const [h, s, l] = rgbToHsl(fgRgb[0], fgRgb[1], fgRgb[2])

  // Decide direction: darken fg against a light bg, lighten against a dark bg.
  // 0.179 ≈ luminance of #555 — splits light/dark perception.
  const bgIsLight = bgLum > 0.179

  // Binary search: find the NEAREST passing lightness (closest to original `l`).
  // bgIsLight → search lo=0…l for max passing (closer to l = more similar to original)
  // bgIsDark  → search l…100 for min passing
  let lo = bgIsLight ? 0 : l
  let hi = bgIsLight ? l : 100

  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (bgIsLight) {
      if (passesWcagAA(hslToHex(h, s, mid), bg)) lo = mid
      else hi = mid
    } else {
      if (passesWcagAA(hslToHex(h, s, mid), bg)) hi = mid
      else lo = mid
    }
  }

  const result = hslToHex(h, s, bgIsLight ? lo : hi)
  // Fallback to pure black/white for edge cases (e.g. very low saturation)
  if (!passesWcagAA(result, bg)) return bgIsLight ? '#000000' : '#ffffff'
  return result
}
