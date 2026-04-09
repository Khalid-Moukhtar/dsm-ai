import { useState, useCallback } from 'react'
import type { Theme, ExportFormat, EditableSection } from '../types/theme'
import { templates } from '../data/templates'
import { downloadTheme } from '../utils/export'

export interface UseThemeReturn {
  themes: Theme[]
  selectedTheme: Theme | null
  selectTemplate: (id: string) => void
  updateSection: <K extends EditableSection>(section: K, patch: Partial<Theme[K]>) => void
  exportTheme: (format: ExportFormat) => void
  resetToTemplate: () => void
}

export function useTheme(): UseThemeReturn {
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null)

  const selectTemplate = useCallback((id: string) => {
    const template = templates.find(t => t.id === id) ?? null
    setSelectedTheme(template)
  }, [])

  const updateSection = useCallback(
    <K extends EditableSection>(section: K, patch: Partial<Theme[K]>) => {
      setSelectedTheme(prev => {
        if (!prev) return prev
        return {
          ...prev,
          [section]: { ...(prev[section] as object), ...patch },
        } as Theme
      })
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

  const resetToTemplate = useCallback(() => {
    if (!selectedTheme) return
    const original = templates.find(t => t.id === selectedTheme.id)
    if (original) setSelectedTheme(original)
  }, [selectedTheme])

  return {
    themes: templates,
    selectedTheme,
    selectTemplate,
    updateSection,
    exportTheme,
    resetToTemplate,
  }
}
