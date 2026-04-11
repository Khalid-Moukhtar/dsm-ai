// Export preview — format tabs, live content preview, copy + download buttons.
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
  const [copied, setCopied] = useState(false)

  const exportString = useMemo(
    () => exportTheme(theme, activeFormat),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.colors, theme.typography, theme.spacing, theme.borderRadius, theme.name, theme.variant, theme.colorMode, activeFormat],
  )

  const fileName = getFileName(theme, activeFormat)

  const lineCount = exportString.split('\n').length
  const byteSize = new TextEncoder().encode(exportString).byteLength
  const sizeLabel = byteSize < 1024
    ? `${byteSize} B`
    : `${(byteSize / 1024).toFixed(1)} KB`

  function handleDownload() {
    downloadTheme(theme, activeFormat)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(exportString)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
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

      {/* File name + stats */}
      <div className="export-preview__meta">
        <span className="export-preview__filename">{fileName}</span>
        <span className="export-preview__stats">{lineCount} lines · {sizeLabel}</span>
      </div>

      {/* Content preview */}
      <div
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(activeFormat)}
        className="export-preview__panel"
      >
        <pre className="export-preview__pre">{exportString}</pre>
      </div>

      {/* Actions row */}
      <div className="export-actions">
        <button
          className="export-copy-btn"
          onClick={handleCopy}
          type="button"
          aria-label="Copy to clipboard"
        >
          {copied ? '✓ Copied!' : '⎘ Copy'}
        </button>
        <button
          className="export-download-btn"
          onClick={handleDownload}
          aria-label={`Download ${fileName}`}
          type="button"
        >
          ↓ Download
        </button>
      </div>
    </div>
  )
}
