import { useState, useEffect } from 'react'
import { useTheme } from './hooks/useTheme'
import { LayoutGallery } from './components/LayoutGallery'
import { LayoutPreview } from './components/LayoutPreview'
import { TokenEditor } from './components/TokenEditor'
import { ExportPreview } from './components/ExportPreview'
import { STYLE_VARIANTS, VARIANTS, LAYOUT_TYPES } from './data/variants'
import type { StyleVariant, ColorMode, LayoutType } from './types/theme'

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

  function handleRandomize() {
    const randLayout = LAYOUT_TYPES[Math.floor(Math.random() * LAYOUT_TYPES.length)] as LayoutType
    const randVariant = STYLE_VARIANTS[Math.floor(Math.random() * STYLE_VARIANTS.length)] as StyleVariant
    const randMode: ColorMode = Math.random() > 0.5 ? 'dark' : 'light'
    setLayoutType(randLayout)
    setVariant(randVariant)
    setColorMode(randMode)
  }

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

        {/* Variant gallery — always visible */}
        <section aria-label="Style variants">
          <div className="section-heading-row">
            <h2 className="section-heading">Pick your style</h2>
            <button
              className="randomize-btn"
              onClick={handleRandomize}
              type="button"
              title="Randomize layout, style, and mode"
            >
              ⚄ Randomize
            </button>
          </div>
          <div className="variant-gallery" role="group" aria-label="Style variant">
            {STYLE_VARIANTS.map(v => {
              const def = VARIANTS[v]
              const swatchColors = [
                def.lightColors.primary,
                def.lightColors.surface,
                def.lightColors.accent,
              ]
              return (
                <button
                  key={v}
                  className={`variant-card${variant === v ? ' variant-card--selected' : ''}`}
                  onClick={() => setVariant(v as StyleVariant)}
                  type="button"
                  aria-pressed={variant === v}
                >
                  <div className="variant-card__swatches" aria-hidden="true">
                    {swatchColors.map(color => (
                      <span key={color} className="variant-card__swatch" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                  <span className="variant-card__name">{def.meta.label}</span>
                  <span className="variant-card__desc">{def.meta.description}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* 3-column workspace — shown once a layout type is selected */}
        {selectedTheme && (
          <section className="workspace" aria-label="Theme editor">
            {/* Name + mode controls bar */}
            <div className="workspace-controls">
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
          <div className="app-empty-state" role="status">
            <div className="app-empty-state__steps">
              <div className="app-empty-step">
                <span className="app-empty-step__num">1</span>
                <div className="app-empty-step__text">
                  <strong>Pick a layout</strong>
                  <p>Choose what type of app or site you're building.</p>
                </div>
              </div>
              <span className="app-empty-step__arrow" aria-hidden="true">→</span>
              <div className="app-empty-step">
                <span className="app-empty-step__num">2</span>
                <div className="app-empty-step__text">
                  <strong>Choose a style</strong>
                  <p>Pick the brand vibe that feels right.</p>
                </div>
              </div>
              <span className="app-empty-step__arrow" aria-hidden="true">→</span>
              <div className="app-empty-step">
                <span className="app-empty-step__num">3</span>
                <div className="app-empty-step__text">
                  <strong>Export to AI</strong>
                  <p>Paste the file into Claude, Cursor, or your coding agent.</p>
                </div>
              </div>
            </div>
          </div>
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
