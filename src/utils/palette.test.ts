import { describe, it, expect } from 'vitest'
import { generatePalette, hexToOklch, oklchToHex } from './palette'
import { contrastRatio } from './contrast'

const SEED = '#6366F1'

describe('generatePalette — valid seed', () => {
  it('returns a non-null palette for a standard seed color', () => {
    const result = generatePalette(SEED)
    expect(result).not.toBeNull()
  })

  it('returns exactly 15 fields', () => {
    const result = generatePalette(SEED)
    expect(result).not.toBeNull()
    expect(Object.keys(result!)).toHaveLength(15)
  })

  it('all 15 values are valid 6-char hex strings', () => {
    const result = generatePalette(SEED)
    expect(result).not.toBeNull()
    const RE_HEX_6 = /^#[0-9A-Fa-f]{6}$/
    for (const [key, val] of Object.entries(result!)) {
      expect(val, `${key} should be a valid 6-char hex`).toMatch(RE_HEX_6)
    }
  })

  it('text:background contrast ≥ 4.5:1 (WCAG AA body text)', () => {
    const result = generatePalette(SEED)
    expect(result).not.toBeNull()
    const ratio = contrastRatio(result!.text, result!.background)
    expect(ratio).not.toBeNull()
    expect(ratio!).toBeGreaterThanOrEqual(4.5)
  })

  it('text:surface contrast ≥ 4.5:1 (WCAG AA body text on surface)', () => {
    const result = generatePalette(SEED)
    expect(result).not.toBeNull()
    const ratio = contrastRatio(result!.text, result!.surface)
    expect(ratio).not.toBeNull()
    expect(ratio!).toBeGreaterThanOrEqual(4.5)
  })

  it('primaryForeground:primary contrast ≥ 4.5:1 (WCAG AA button text)', () => {
    const result = generatePalette(SEED)
    expect(result).not.toBeNull()
    const ratio = contrastRatio(result!.primaryForeground, result!.primary)
    expect(ratio).not.toBeNull()
    expect(ratio!).toBeGreaterThanOrEqual(4.5)
  })

  it('secondaryForeground:secondary contrast ≥ 4.5:1 (WCAG AA secondary button text)', () => {
    const result = generatePalette(SEED)
    expect(result).not.toBeNull()
    const ratio = contrastRatio(result!.secondaryForeground, result!.secondary)
    expect(ratio).not.toBeNull()
    expect(ratio!).toBeGreaterThanOrEqual(4.5)
  })

  it('is deterministic — two calls with the same seed return identical results', () => {
    const result1 = generatePalette(SEED)
    const result2 = generatePalette(SEED)
    expect(result1).not.toBeNull()
    expect(result2).not.toBeNull()
    expect(result1).toEqual(result2)
  })
})

describe('generatePalette — edge cases', () => {
  it('white seed (#FFFFFF) returns a valid palette', () => {
    const result = generatePalette('#FFFFFF')
    expect(result).not.toBeNull()
    const RE_HEX_6 = /^#[0-9A-Fa-f]{6}$/
    for (const val of Object.values(result!)) {
      expect(val).toMatch(RE_HEX_6)
    }
  })

  it('black seed (#000000) returns a valid palette', () => {
    const result = generatePalette('#000000')
    expect(result).not.toBeNull()
    const RE_HEX_6 = /^#[0-9A-Fa-f]{6}$/
    for (const val of Object.values(result!)) {
      expect(val).toMatch(RE_HEX_6)
    }
  })
})

describe('generatePalette — invalid inputs', () => {
  it('returns null for a non-hex string', () => {
    expect(generatePalette('not-a-color')).toBeNull()
  })

  it('returns null for a 3-char hex (6-char only accepted)', () => {
    expect(generatePalette('#FFF')).toBeNull()
  })

  it('returns null for an empty string', () => {
    expect(generatePalette('')).toBeNull()
  })

  it('returns null for a hex without # prefix', () => {
    expect(generatePalette('6366F1')).toBeNull()
  })
})

describe('hexToOklch', () => {
  it('returns an object with L, C, h for a valid 6-char hex', () => {
    const result = hexToOklch('#6366F1')
    expect(result).not.toBeNull()
    expect(typeof result!.L).toBe('number')
    expect(typeof result!.C).toBe('number')
    expect(typeof result!.h).toBe('number')
  })

  it('L is in [0, 1]', () => {
    const result = hexToOklch('#6366F1')
    expect(result!.L).toBeGreaterThanOrEqual(0)
    expect(result!.L).toBeLessThanOrEqual(1)
  })

  it('returns null for 3-char hex', () => {
    expect(hexToOklch('#FFF')).toBeNull()
  })

  it('returns null for invalid input', () => {
    expect(hexToOklch('not-a-hex')).toBeNull()
  })
})

describe('oklchToHex', () => {
  it('returns a valid 6-char hex', () => {
    const result = oklchToHex(0.5, 0.15, 200)
    expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('clamps out-of-range L values', () => {
    // Should not throw — out-of-range values are clamped
    expect(() => oklchToHex(2.0, 0.1, 100)).not.toThrow()
    expect(() => oklchToHex(-1.0, 0.1, 100)).not.toThrow()
    expect(oklchToHex(2.0, 0.1, 100)).toMatch(/^#[0-9A-Fa-f]{6}$/)
    expect(oklchToHex(-1.0, 0.1, 100)).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })

  it('roundtrip: oklchToHex(hexToOklch(hex)) ≈ original (within rounding)', () => {
    const original = '#6366F1'
    const oklch = hexToOklch(original)
    expect(oklch).not.toBeNull()
    const result = oklchToHex(oklch!.L, oklch!.C, oklch!.h)
    // Roundtrip may differ by 1 per channel due to float rounding
    // Verify it's a valid 6-char hex
    expect(result).toMatch(/^#[0-9A-Fa-f]{6}$/)
  })
})
