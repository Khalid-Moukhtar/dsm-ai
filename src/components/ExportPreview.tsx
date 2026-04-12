// Export preview — format tabs, live content preview, copy + download buttons.
// Tab state is local. Export string is memoized per theme + format.

import { useState, useMemo } from 'react'

const HANDOFF_PROMPT = `I have a design system in the attached file. Use these tokens for all UI — never hardcode colors, spacing, or typography values. When I ask to change something visual, update the token, not individual instances.`
import type { Theme, ExportFormat } from '../types/theme'
import { exportTheme, getFileName, downloadTheme } from '../utils/export'
import { trackExportCopy, trackExportDownload } from '../utils/analytics'

interface Props {
  theme: Theme
}

const FORMATS: { id: ExportFormat; label: string; tooltip: string }[] = [
  { id: 'markdown',    label: 'MD',    tooltip: 'Markdown file ready to paste into Claude, Cursor, or any AI coding assistant.' },
  { id: 'json',        label: 'JSON',  tooltip: 'Machine-readable design tokens for design tools and code generators.' },
  { id: 'css',         label: 'CSS',   tooltip: 'CSS custom properties to paste directly into any stylesheet.' },
  { id: 'tailwind',    label: 'TW v3', tooltip: 'Tailwind CSS v3 configuration file with your design tokens.' },
  { id: 'tailwind-v4', label: 'TW v4', tooltip: 'Tailwind CSS v4 theme file using the new @theme block format.' },
]

export function ExportPreview({ theme }: Props) {
  const [activeFormat, setActiveFormat] = useState<ExportFormat>('markdown')
  const [copied, setCopied] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)

  const exportString = useMemo(
    () => exportTheme(theme, activeFormat),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.colors, theme.typography, theme.spacing, theme.borderRadius, theme.shadows, theme.name, theme.variant, theme.colorMode, activeFormat],
  )

  const fileName = getFileName(theme, activeFormat)

  const lineCount = exportString.split('\n').length
  const byteSize = new TextEncoder().encode(exportString).byteLength
  const sizeLabel = byteSize < 1024
    ? `${byteSize} B`
    : `${(byteSize / 1024).toFixed(1)} KB`

  function handleDownload() {
    downloadTheme(theme, activeFormat)
    trackExportDownload(activeFormat)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(exportString)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
    trackExportCopy(activeFormat)
  }

  async function handleCopyPrompt() {
    await navigator.clipboard.writeText(HANDOFF_PROMPT)
    setPromptCopied(true)
    setTimeout(() => setPromptCopied(false), 1500)
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
        {FORMATS.map(({ id, label, tooltip }) => (
          <button
            key={id}
            id={tabId(id)}
            role="tab"
            aria-selected={activeFormat === id}
            aria-controls={panelId}
            className={`export-tab${activeFormat === id ? ' export-tab--active' : ''}`}
            onClick={() => setActiveFormat(id)}
            data-tooltip={tooltip}
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

      {/* Post-export guidance — shown only on markdown tab (the AI agent handoff format) */}
      {activeFormat === 'markdown' && (
        <div className="export-handoff">
          <p className="export-handoff__title">Now what?</p>
          <p className="export-handoff__desc">
            Paste this prompt + the file into Claude, Cursor, or your AI agent:
          </p>
          <div className="export-handoff__prompt">{HANDOFF_PROMPT}</div>
          <button
            className="export-handoff__copy-btn"
            onClick={handleCopyPrompt}
            type="button"
            aria-label="Copy AI agent prompt to clipboard"
          >
            {promptCopied ? '✓ Copied!' : '⎘ Copy prompt'}
          </button>
        </div>
      )}
    </div>
  )
}
