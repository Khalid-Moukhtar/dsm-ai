import { useState, useCallback, useMemo, useEffect } from 'react'
import type {
  Theme,
  ExportFormat,
  EditableSection,
  LayoutType,
  StyleVariant,
  ColorMode,
  ColorPalette,
} from '../types/theme'
import { VARIANTS, LAYOUT_TYPE_META, LAYOUT_TYPES, STYLE_VARIANTS } from '../data/variants'
import { downloadTheme } from '../utils/export'

// Overrides are user tweaks layered on top of the base variant values.
type Overrides = { [K in EditableSection]?: Partial<Theme[K]> }

// Derive a full Theme object from the three user selections + any overrides.
// variant and colorMode are UI-state — they must NOT appear in export output.
function computeTheme(
  layoutType: LayoutType,
  variant: StyleVariant,
  colorMode: ColorMode,
  overrides: Overrides,
): Theme {
  const def = VARIANTS[variant]
  const baseColors = colorMode === 'light' ? def.lightColors : def.darkColors
  return {
    id: `${layoutType}-${variant}-${colorMode}`,
    name: `${def.meta.label} — ${LAYOUT_TYPE_META[layoutType].label}`,
    description: def.meta.description,
    variant,
    colorMode,
    layoutType,
    colors: { ...baseColors, ...(overrides.colors ?? {}) },
    typography: { ...def.typography, ...(overrides.typography ?? {}) },
    spacing: { ...def.spacing, ...(overrides.spacing ?? {}) },
    borderRadius: { ...def.borderRadius, ...(overrides.borderRadius ?? {}) },
    shadows: { ...def.shadows, ...(overrides.shadows ?? {}) },
  }
}

// ── localStorage persistence ─────────────────────────────────────────────────
const STORAGE_KEY = 'dsm-v1'

interface PersistedState {
  layoutType: LayoutType | null
  variant: StyleVariant
  colorMode: ColorMode
  overrides: Overrides
  nameOverride: string | null
}

function loadState(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const p = JSON.parse(raw)
    return typeof p === 'object' && p !== null ? p : {}
  } catch {
    return {}
  }
}

function saveState(state: PersistedState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private browsing, storage full) — fail silently
  }
}

// ── URL state sharing ────────────────────────────────────────────────────────
// UrlState is a strict subset of PersistedState:
//   - nameOverride excluded (avoids btoa() non-ASCII crash)
//   - only color overrides preserved (typography/spacing/radius/shadow are dropped)
// This is an explicit trade-off: colors are the primary sharing motivation.

// 6-char hex only — 3-char shorthand rejected (consistent with palette.ts)
const RE_HEX_6 = /^#[0-9A-Fa-f]{6}$/

interface UrlState {
  layoutType: LayoutType | null
  variant: StyleVariant
  colorMode: ColorMode
  colorOverrides: Partial<ColorPalette>
}

function encodeUrlState(state: PersistedState): string {
  const urlState: UrlState = {
    layoutType: state.layoutType,
    variant: state.variant,
    colorMode: state.colorMode,
    colorOverrides: (state.overrides.colors ?? {}) as Partial<ColorPalette>,
  }
  return btoa(JSON.stringify(urlState))
}

function decodeUrlState(encoded: string): Partial<PersistedState> | null {
  try {
    const parsed: unknown = JSON.parse(atob(encoded))
    if (typeof parsed !== 'object' || parsed === null) return null

    const raw = parsed as Record<string, unknown>

    const variant: StyleVariant =
      typeof raw['variant'] === 'string' && STYLE_VARIANTS.includes(raw['variant'] as StyleVariant)
        ? (raw['variant'] as StyleVariant)
        : 'stripe'

    const colorMode: ColorMode =
      raw['colorMode'] === 'light' || raw['colorMode'] === 'dark'
        ? (raw['colorMode'] as ColorMode)
        : 'light'

    const layoutType: LayoutType | null =
      typeof raw['layoutType'] === 'string' && LAYOUT_TYPES.includes(raw['layoutType'] as LayoutType)
        ? (raw['layoutType'] as LayoutType)
        : null

    // Validate each color override — drop any that fail RE_HEX_6
    const rawColorOverrides = typeof raw['colorOverrides'] === 'object' && raw['colorOverrides'] !== null
      ? (raw['colorOverrides'] as Record<string, unknown>)
      : {}

    const validColorOverrides: Partial<ColorPalette> = {}
    for (const [key, val] of Object.entries(rawColorOverrides)) {
      if (typeof val === 'string' && RE_HEX_6.test(val)) {
        ;(validColorOverrides as Record<string, string>)[key] = val
      }
    }

    return {
      variant,
      colorMode,
      layoutType,
      overrides: Object.keys(validColorOverrides).length > 0
        ? { colors: validColorOverrides }
        : {},
      nameOverride: null,
    }
  } catch {
    return null
  }
}

function parseUrlHash(): Partial<PersistedState> | null {
  try {
    const hash = window.location.hash
    if (!hash.startsWith('#state=')) return null
    const encoded = hash.slice('#state='.length)
    if (!encoded) return null
    return decodeUrlState(encoded)
  } catch {
    return null
  }
}

// Priority: URL hash > localStorage > defaults
function loadInitialState(): Partial<PersistedState> {
  const fromUrl = parseUrlHash()
  if (fromUrl !== null) return fromUrl
  return loadState()
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export interface UseThemeReturn {
  layoutType: LayoutType | null
  variant: StyleVariant
  colorMode: ColorMode
  selectedTheme: Theme | null
  setLayoutType: (layout: LayoutType) => void
  setVariant: (v: StyleVariant) => void
  setColorMode: (mode: ColorMode) => void
  setName: (name: string) => void
  updateSection: <K extends EditableSection>(section: K, patch: Partial<Theme[K]>) => void
  exportTheme: (format: ExportFormat) => void
  resetToVariant: () => void
}

export function useTheme(): UseThemeReturn {
  const initial = useMemo(loadInitialState, [])

  const [layoutType, setLayoutTypeState] = useState<LayoutType | null>(() =>
    initial.layoutType && LAYOUT_TYPES.includes(initial.layoutType) ? initial.layoutType : null,
  )
  const [variant, setVariantState] = useState<StyleVariant>(() =>
    initial.variant && STYLE_VARIANTS.includes(initial.variant) ? initial.variant : 'stripe',
  )
  const [colorMode, setColorModeState] = useState<ColorMode>(() =>
    initial.colorMode === 'light' || initial.colorMode === 'dark' ? initial.colorMode : 'light',
  )
  const [overrides, setOverrides] = useState<Overrides>(() =>
    initial.overrides && typeof initial.overrides === 'object' ? initial.overrides : {},
  )
  const [nameOverride, setNameOverride] = useState<string | null>(() =>
    typeof initial.nameOverride === 'string' ? initial.nameOverride : null,
  )

  // Persist all state and update URL hash whenever any piece changes
  useEffect(() => {
    const state: PersistedState = { layoutType, variant, colorMode, overrides, nameOverride }
    saveState(state)
    // Use replaceState (not window.location.hash =) to avoid scroll jump on hash change
    history.replaceState(null, '', '#state=' + encodeUrlState(state))
  }, [layoutType, variant, colorMode, overrides, nameOverride])

  const selectedTheme = useMemo(() => {
    if (!layoutType) return null
    const t = computeTheme(layoutType, variant, colorMode, overrides)
    return nameOverride !== null ? { ...t, name: nameOverride } : t
  }, [layoutType, variant, colorMode, overrides, nameOverride])

  const setLayoutType = useCallback((layout: LayoutType) => {
    setLayoutTypeState(layout)
    // Keep variant/colorMode but reset token overrides and name when switching layout
    setOverrides({})
    setNameOverride(null)
  }, [])

  const setVariant = useCallback((v: StyleVariant) => {
    setVariantState(v)
    // Reset overrides and name when switching to a different brand variant
    setOverrides({})
    setNameOverride(null)
  }, [])

  const setName = useCallback((name: string) => {
    setNameOverride(name)
  }, [])

  const setColorMode = useCallback((mode: ColorMode) => {
    setColorModeState(mode)
    // Preserve overrides on light/dark toggle — user may have tweaked non-color tokens
  }, [])

  const updateSection = useCallback(
    <K extends EditableSection>(section: K, patch: Partial<Theme[K]>) => {
      setOverrides(prev => ({
        ...prev,
        [section]: { ...(prev[section] as object ?? {}), ...patch },
      }))
    },
    [],
  )

  const exportTheme = useCallback(
    (format: ExportFormat) => {
      if (!selectedTheme) return
      downloadTheme(selectedTheme, format)
    },
    [selectedTheme],
  )

  const resetToVariant = useCallback(() => {
    setOverrides({})
  }, [])

  return {
    layoutType,
    variant,
    colorMode,
    selectedTheme,
    setLayoutType,
    setVariant,
    setColorMode,
    setName,
    updateSection,
    exportTheme,
    resetToVariant,
  }
}
