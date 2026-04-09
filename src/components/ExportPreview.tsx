// Export preview — format tabs, live content preview, download button.
// Tab state is local. Export string is memoized per theme + format.

import { useState, useMemo } from 'react'
import type { Theme, ExportFormat } from '../types/theme'
import { exportTheme, getFileName, downloadTheme } from '../utils/export'

interface Props {
  theme: Theme
}

const FORMATS: { id: ExportFormat; label: string }[] = [
  { id: 'markdown', label: 'MD' },
  { id: 'json', label: 'JSON' },
  { id: 'css', label: 'CSS' },
]

export function ExportPreview({ theme }: Props) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('markdown')

  const exportString = useMemo(
    () => exportTheme(theme, activeFormat),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.colors, theme.typography, theme.spacing, theme.borderRadius, theme.name, theme.variant, theme.colorMode, activeFormat],
  )

  const fileName = getFileName(theme, activeFormat)

  function handleDownload() {
    downloadTheme(theme, activeFormat)
  }

  const tabId = (format: ExportFormat) => `export-tab-${format}`
  const panelId = 'export-panel'

  return (
    <div className="export-preview">
      <h2 className="export-preview__title">Export</h2>

      {/* Format tabs */}
      <div
        className="export-tabs"
        role="tablist"
        aria-label="Export format"
      >
        {FORMATS.map(({ id, label }) => (
          <button
            key={id}
            id={tabId(id)}
            role="tab"
            aria-selected={activeFormat === id}
            aria-controls={panelId}
            className={`export-tab${activeFormat === id ? ' export-tab--active' : ''}`}
            onClick={() => setActiveFormat(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* File name hint */}
      <p className="export-preview__filename">{fileName}</p>

      {/* Content preview */}
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(activeFormat)}
        className="export-preview__panel"
      >
        <pre className="export-preview__pre">{exportString}</pre>
      </div>

      {/* Download */}
      <button
        className="export-download-btn"
        onClick={handleDownload}
        aria-label={`Download ${fileName}`}
        type="button"
      >
        ↓ Download {fileName}
      </button>
    </div>
  )
}
