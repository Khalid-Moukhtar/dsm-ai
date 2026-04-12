import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useTheme } from './hooks/useTheme'
import { LayoutGallery } from './components/LayoutGallery'
import { LayoutPreview } from './components/LayoutPreview'
import { TokenEditor } from './components/TokenEditor'
import { ExportPreview } from './components/ExportPreview'
import { ShareButton } from './components/ShareButton'
import { STYLE_VARIANTS, VARIANTS, LAYOUT_TYPES } from './data/variants'
import type { StyleVariant, ColorMode, LayoutType } from './types/theme'
import {
  trackLayoutSelect,
  trackVariantSelect,
  trackColorModeToggle,
  trackRandomize,
  trackTutorialSkip,
  trackTutorialComplete,
} from './utils/analytics'

const TUTORIAL_STEPS = [
  { title: "Pick a layout", body: "Choose what you're building — SaaS, landing page, blog, and more." },
  { title: "Pick a style", body: "Find your vibe — Stripe, Linear, Notion, GitHub, and 6 more." },
  { title: "Customize (optional)", body: "Adjust colors, fonts, and spacing in the token editor." },
  { title: "Toggle Light / Dark", body: "Preview your design system in both color modes." },
  { title: "Export", body: "Copy or download your tokens to use with Claude, Cursor, or any AI agent." },
]

type ArrowDir = 'left' | 'down' | 'up'

interface TooltipPos {
  top: number
  left: number
  arrowDir: ArrowDir
  transform: string
}

export default function App() {
  const [isDsmDark, setIsDsmDark] = useState(false)
  const [tutorialStep, setTutorialStep] = useState<number | null>(1)
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null)

  // Refs for the 5 tutorial target elements
  const layoutSectionRef = useRef<HTMLDivElement>(null)
  const styleSectionRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const modeGroupRef = useRef<HTMLDivElement>(null)
  const exportRef = useRef<HTMLDivElement>(null)

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

  // Calculate tooltip position after DOM updates
  useLayoutEffect(() => {
    if (tutorialStep === null) {
      setTooltipPos(null)
      return
    }

    const refMap: Record<number, React.RefObject<HTMLDivElement | null>> = {
      1: layoutSectionRef,
      2: styleSectionRef,
      3: editorRef,
      4: modeGroupRef,
      5: exportRef,
    }

    const ref = refMap[tutorialStep]
    if (!ref?.current) return

    const rect = ref.current.getBoundingClientRect()
    if (rect.width === 0) return // element not yet in DOM

    if (tutorialStep <= 2) {
      // Sidebar sections → tooltip to the right, arrow points left
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 14,
        arrowDir: 'left',
        transform: 'translateY(-50%)',
      })
    } else if (tutorialStep === 4) {
      // Mode toggle → tooltip below, arrow points up
      setTooltipPos({
        top: rect.bottom + 12,
        left: rect.left + rect.width / 2,
        arrowDir: 'up',
        transform: 'translateX(-50%)',
      })
    } else {
      // Editor (3) and Export (5) panels → tooltip above, arrow points down
      setTooltipPos({
        top: rect.top - 12,
        left: rect.left + rect.width / 2,
        arrowDir: 'down',
        transform: 'translateX(-50%) translateY(-100%)',
      })
    }
  }, [tutorialStep, selectedTheme])

  function handleSelectLayout(lt: LayoutType) {
    setLayoutType(lt)
    setTutorialStep(prev => prev === 1 ? 2 : prev)
    trackLayoutSelect(lt)
  }

  function handleSelectVariant(v: StyleVariant) {
    setVariant(v)
    setTutorialStep(prev => (prev === 2 && layoutType !== null) ? 3 : prev)
    trackVariantSelect(v)
  }

  function handleToggleColorMode(mode: ColorMode) {
    setColorMode(mode)
    setTutorialStep(prev => prev === 4 ? 5 : prev)
    trackColorModeToggle(mode)
  }

  function handleRandomize() {
    const randLayout = LAYOUT_TYPES[Math.floor(Math.random() * LAYOUT_TYPES.length)] as LayoutType
    const randVariant = STYLE_VARIANTS[Math.floor(Math.random() * STYLE_VARIANTS.length)] as StyleVariant
    const randMode: ColorMode = Math.random() > 0.5 ? 'dark' : 'light'
    setLayoutType(randLayout)
    setVariant(randVariant)
    setColorMode(randMode)
    setTutorialStep(prev => (prev !== null && prev < 3) ? 3 : prev)
    trackRandomize()
  }

  const step = tutorialStep
  const stepData = step !== null ? TUTORIAL_STEPS[step - 1] : null

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo" aria-hidden="true">◈</span>
            <h1 className="app-header__title">motif</h1>
            <p className="app-header__subtitle">Pick a vibe. Export to AI.</p>
          </div>
          <div className="app-header__actions">
            <ShareButton hasTheme={selectedTheme !== null} />
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
        </div>
      </header>

      <div className="app-body">
        {/* Dark sidebar — layout type + style variant selectors */}
        <aside className="app-sidebar" aria-label="Design controls">
          <div
            ref={layoutSectionRef}
            className={`sidebar-section${tutorialStep === 1 ? ' tutorial-highlight' : ''}`}
          >
            <div className="sidebar-label-row">
              <p className="sidebar-label">Layout</p>
              <span className="sidebar-preview-hint">preview only</span>
            </div>
            <LayoutGallery
              selectedLayoutType={layoutType}
              onSelect={handleSelectLayout}
            />
          </div>

          <div
            ref={styleSectionRef}
            className={`sidebar-section${tutorialStep === 2 ? ' tutorial-highlight' : ''}`}
          >
            <div className="sidebar-section__header">
              <p className="sidebar-label">Style</p>
              <button
                type="button"
                className="sidebar-randomize-btn"
                onClick={handleRandomize}
                title="Randomize layout, style, and mode"
                aria-label="Randomize"
              >
                ⚄
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
                    className={`variant-card${v === 'custom' ? ' variant-card--custom' : ''}${variant === v ? ' variant-card--selected' : ''}`}
                    onClick={() => handleSelectVariant(v as StyleVariant)}
                    type="button"
                    aria-pressed={variant === v}
                  >
                    <div className="variant-card__swatches" aria-hidden="true">
                      {swatchColors.map((color, i) => (
                        <span key={i} className="variant-card__swatch" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <span className="variant-card__name">{def.meta.label}</span>
                    <span className="variant-card__desc">{def.meta.description}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>

        {/* Light canvas — workspace or empty state */}
        <main className="app-content">
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

                <div
                  ref={modeGroupRef}
                  className={`workspace-controls__group${tutorialStep === 4 ? ' tutorial-highlight' : ''}`}
                >
                  <span className="workspace-controls__label" aria-hidden="true">Mode</span>
                  <div className="mode-toggle" role="group" aria-label="Color mode">
                    <button
                      className={`mode-toggle__btn${colorMode === 'light' ? ' mode-toggle__btn--active' : ''}`}
                      onClick={() => handleToggleColorMode('light' as ColorMode)}
                      type="button"
                      aria-pressed={colorMode === 'light'}
                    >
                      ☀ Light
                    </button>
                    <button
                      className={`mode-toggle__btn${colorMode === 'dark' ? ' mode-toggle__btn--active' : ''}`}
                      onClick={() => handleToggleColorMode('dark' as ColorMode)}
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
                <div
                  ref={editorRef}
                  className={`workspace__editor${tutorialStep === 3 ? ' tutorial-highlight' : ''}`}
                >
                  <TokenEditor
                    theme={selectedTheme}
                    updateSection={updateSection}
                    onReset={resetToVariant}
                  />
                </div>
                <div
                  ref={exportRef}
                  className={`workspace__export${tutorialStep === 5 ? ' tutorial-highlight' : ''}`}
                >
                  <ExportPreview theme={selectedTheme} />
                </div>
              </div>
            </section>
          )}

          {!selectedTheme && (
            <div className="app-empty-state" role="status">
              <div className="app-empty-state__card">
                <h2 className="app-empty-state__title">How it works</h2>
                <div className="app-empty-state__steps">
                  <div className="app-empty-step">
                    <span className="app-empty-step__num">1</span>
                    <div className="app-empty-step__text">
                      <strong>Pick a layout</strong>
                      <p>Choose what you&apos;re building — SaaS app, landing page, blog, and more.</p>
                    </div>
                  </div>
                  <div className="app-empty-step">
                    <span className="app-empty-step__num">2</span>
                    <div className="app-empty-step__text">
                      <strong>Pick a style</strong>
                      <p>Find a vibe: Stripe, Linear, Notion, GitHub, and 6 more brand-inspired stacks.</p>
                    </div>
                  </div>
                  <div className="app-empty-step">
                    <span className="app-empty-step__num">3</span>
                    <div className="app-empty-step__text">
                      <strong>Customize</strong>
                      <p>Adjust colors, fonts, and spacing using the editor on the right.</p>
                    </div>
                  </div>
                  <div className="app-empty-step">
                    <span className="app-empty-step__num">4</span>
                    <div className="app-empty-step__text">
                      <strong>Export + paste</strong>
                      <p>Download the file and drop it into Claude, Cursor, or your AI coding agent.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p>
          <a
            href="https://github.com/Khalid-Moukhtar/motif"
            target="_blank"
            rel="noopener noreferrer"
          >
            motif on GitHub
          </a>
          {' '}· MIT License ·{' '}
          <a
            href="https://github.com/Khalid-Moukhtar/motif/blob/main/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          {' '}(anonymous analytics, no cookies)
        </p>
      </footer>

      {/* Floating tour tooltip — position: fixed, tracks target element */}
      {step !== null && tooltipPos && stepData && (
        <div
          className={`tour-tooltip tour-tooltip--${tooltipPos.arrowDir}`}
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: tooltipPos.transform,
          }}
          role="status"
          aria-live="polite"
        >
          <div className="tour-tooltip__header">
            <span className="tour-tooltip__badge">{step} / 5</span>
            <button
              type="button"
              className="tour-tooltip__close"
              onClick={() => { setTutorialStep(null); trackTutorialSkip(step) }}
              aria-label="Skip tutorial"
            >
              ✕
            </button>
          </div>
          <strong className="tour-tooltip__title">{stepData.title}</strong>
          <p className="tour-tooltip__body">{stepData.body}</p>
          {(step === 3 || step === 4) && (
            <button
              type="button"
              className="tour-tooltip__next"
              onClick={() => setTutorialStep(s => s !== null ? s + 1 : null)}
            >
              Next →
            </button>
          )}
          {step === 5 && (
            <button
              type="button"
              className="tour-tooltip__next"
              onClick={() => { setTutorialStep(null); trackTutorialComplete() }}
            >
              Done ✓
            </button>
          )}
        </div>
      )}
    </div>
  )
}
