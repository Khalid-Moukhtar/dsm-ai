import { useState, useCallback, useMemo } from 'react'
import type {
  Theme,
  ExportFormat,
  EditableSection,
  LayoutType,
  StyleVariant,
  ColorMode,
} from '../types/theme'
import { VARIANTS, LAYOUT_TYPE_META } from '../data/variants'
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
  }
}

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
  const [layoutType, setLayoutTypeState] = useState<LayoutType | null>(null)
  const [variant, setVariantState] = useState<StyleVariant>('stripe')
  const [colorMode, setColorModeState] = useState<ColorMode>('light')
  const [overrides, setOverrides] = useState<Overrides>({})
  const [nameOverride, setNameOverride] = useState<string | null>(null)

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
