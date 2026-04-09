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
