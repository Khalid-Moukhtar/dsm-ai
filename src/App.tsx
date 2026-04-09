import { useTheme } from './hooks/useTheme'
import { TemplateGallery } from './components/TemplateGallery'
import { ThemePreview } from './components/ThemePreview'
import { ExportPanel } from './components/ExportPanel'

export default function App() {
  const { themes, selectedTheme, selectTemplate, exportTheme, resetToTemplate } =
    useTheme()

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <span className="app-header__logo" aria-hidden="true">◈</span>
            <h1 className="app-header__title">DSM</h1>
          </div>
          <p className="app-header__subtitle">
            Pick a vibe. Export to AI.
          </p>
        </div>
      </header>

      <main className="app-main">
        <section className="gallery-section" aria-label="Design system templates">
          <h2 className="section-heading">Templates</h2>
          <p className="section-subheading">
            Select a template to preview it and export your design rules.
          </p>
          <TemplateGallery
            themes={themes}
            selectedId={selectedTheme?.id ?? null}
            onSelect={selectTemplate}
          />
        </section>

        {selectedTheme && (
          <section className="workspace-section" aria-label="Theme preview and export">
            <div className="workspace">
              <div className="workspace__preview">
                <ThemePreview theme={selectedTheme} />
              </div>
              <div className="workspace__sidebar">
                <ExportPanel
                  theme={selectedTheme}
                  onExport={exportTheme}
                  onReset={resetToTemplate}
                />
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>
          <a
            href="https://github.com/k-sni/dsm-ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            DSM on GitHub
          </a>{' '}
          · MIT License
        </p>
      </footer>
    </div>
  )
}
