import { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { LayoutGallery } from './components/LayoutGallery'
import { LayoutPreview } from './components/LayoutPreview'
import { TokenEditor } from './components/TokenEditor'
import { ExportPreview } from './components/ExportPreview'
import { STYLE_VARIANTS, VARIANTS } from './data/variants'
import type { StyleVariant, ColorMode } from './types/theme'

export default function App() {
  const [isDsmDark, setIsDsmDark] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dsm-dark', isDsmDark)
    return () => { document.body.classList.remove('dsm-dark') }
  }, [isDsmDark])

  const {
    layoutType,
    variant,
    colorMode,
    selectedTheme,
    setLayoutType,
    setVariant,
    setColorMode,
    setName,
    updateSection,
    resetToVariant,
  } = useTheme()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo" aria-hidden="true">◈</span>
            <h1 className="app-header__title">DSM</h1>
          </div>
          <p className="app-header__subtitle">Pick a vibe. Export to AI.</p>
          <button
            className="app-header__dark-toggle"
            onClick={() => setIsDsmDark(d => !d)}
            type="button"
            aria-label={isDsmDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDsmDark ? 'Light mode' : 'Dark mode'}
          >
            {isDsmDark ? '☀' : '☽'}
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* Layout type gallery — 8 cards */}
        <section aria-label="Layout types">
          <h2 className="section-heading">What are you building?</h2>
          <LayoutGallery
            selectedLayoutType={layoutType}
            onSelect={setLayoutType}
          />
        </section>

        {/* 3-column workspace — shown once a layout type is selected */}
        {selectedTheme && (
          <section className="workspace" aria-label="Theme editor">
            {/* Variant + mode controls bar */}
            <div className="workspace-controls">
              <div className="workspace-controls__group">
                <label className="workspace-controls__label" htmlFor="variant-select">
                  Style
                </label>
                <select
                  id="variant-select"
                  className="workspace-controls__select"
                  value={variant}
                  onChange={e => setVariant(e.target.value as StyleVariant)}
                  aria-label="Select style variant"
                >
                  {STYLE_VARIANTS.map(v => (
                    <option key={v} value={v}>
                      {VARIANTS[v].meta.label} — {VARIANTS[v].meta.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="workspace-controls__group workspace-controls__group--name">
                <label className="workspace-controls__label" htmlFor="theme-name-input">
                  Name
                </label>
                <input
                  id="theme-name-input"
                  type="text"
                  className="workspace-controls__name-input"
                  value={selectedTheme.name}
                  onChange={e => setName(e.target.value)}
                  aria-label="Theme name"
                  spellCheck={false}
                />
              </div>

              <div className="workspace-controls__group">
                <span className="workspace-controls__label" aria-hidden="true">Mode</span>
                <div className="mode-toggle" role="group" aria-label="Color mode">
                  <button
                    className={`mode-toggle__btn${colorMode === 'light' ? ' mode-toggle__btn--active' : ''}`}
                    onClick={() => setColorMode('light' as ColorMode)}
                    type="button"
                    aria-pressed={colorMode === 'light'}
                  >
                    ☀ Light
                  </button>
                  <button
                    className={`mode-toggle__btn${colorMode === 'dark' ? ' mode-toggle__btn--active' : ''}`}
                    onClick={() => setColorMode('dark' as ColorMode)}
                    type="button"
                    aria-pressed={colorMode === 'dark'}
                  >
                    ☽ Dark
                  </button>
                </div>
              </div>
            </div>

            {/* 3-column layout */}
            <div className="workspace__columns">
              <div className="workspace__preview">
                <LayoutPreview theme={selectedTheme} />
              </div>
              <div className="workspace__editor">
                <TokenEditor
                  theme={selectedTheme}
                  updateSection={updateSection}
                  onReset={resetToVariant}
                />
              </div>
              <div className="workspace__export">
                <ExportPreview theme={selectedTheme} />
              </div>
            </div>
          </section>
        )}

        {!selectedTheme && (
          <p className="app-empty-hint">
            Select a layout type above to start.
          </p>
        )}
      </main>

      <footer className="app-footer">
        <p>
          <a
            href="https://github.com/Khalid-Moukhtar/dsm-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            DSM on GitHub
          </a>
          {' '}· MIT License
        </p>
      </footer>
    </div>
  )
}
