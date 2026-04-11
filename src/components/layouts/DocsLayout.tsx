// Documentation layout mockup — Guide, API, Changelog pages.
// ALL interactive elements have tabIndex={-1} — inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PAGES = ['Guide', 'API', 'Changelog']

const NAV_SECTIONS = [
  {
    title: 'Getting Started',
    items: ['Introduction', 'Installation', 'Quick Start', 'Configuration'],
  },
  {
    title: 'Core Concepts',
    items: ['Tokens', 'Themes', 'Variants', 'Export'],
  },
  {
    title: 'Advanced',
    items: ['Custom Variants', 'CLI Usage', 'Integrations'],
  },
]

const API_ENDPOINTS = [
  { method: 'GET', path: '/themes', desc: 'List all available themes', status: 200 },
  { method: 'GET', path: '/themes/:id', desc: 'Get a theme by ID', status: 200 },
  { method: 'POST', path: '/themes', desc: 'Create a new theme', status: 201 },
  { method: 'PATCH', path: '/themes/:id', desc: 'Update theme tokens', status: 200 },
  { method: 'DELETE', path: '/themes/:id', desc: 'Delete a theme', status: 204 },
]

const CHANGELOG_ENTRIES = [
  {
    version: '2.4.0',
    date: 'Apr 2026',
    tag: 'minor',
    changes: ['Added 8 layout type previews', 'New Airbnb and Vercel style variants', 'Improved dark mode contrast ratios'],
  },
  {
    version: '2.3.0',
    date: 'Mar 2026',
    tag: 'minor',
    changes: ['Semantic token controls (sliders, presets)', 'Google Fonts CDN integration'],
  },
  {
    version: '2.2.1',
    date: 'Feb 2026',
    tag: 'patch',
    changes: ['Fixed fontFamily injection vulnerability', 'CSS export escaping'],
  },
]

function GuidePage() {
  return (
    <div className="docs-layout">
      {/* Sidebar nav */}
      <aside className="docs-sidebar">
        <div className="docs-search" aria-hidden="true">
          <span className="docs-search__icon">⊙</span>
          <span className="docs-search__placeholder">Search docs…</span>
          <span className="docs-search__shortcut">⌘K</span>
        </div>
        {NAV_SECTIONS.map(section => (
          <div key={section.title} className="docs-nav-section">
            <p className="docs-nav-section__title">{section.title}</p>
            <ul className="docs-nav-section__list">
              {section.items.map((item, i) => (
                <li key={item}>
                  <button
                    className={`docs-nav-item${section.title === 'Getting Started' && i === 2 ? ' docs-nav-item--active' : ''}`}
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Content */}
      <article className="docs-content">
        <nav className="docs-breadcrumb" aria-label="breadcrumb">
          <span className="docs-breadcrumb__item">Docs</span>
          <span className="docs-breadcrumb__sep" aria-hidden="true">/</span>
          <span className="docs-breadcrumb__item">Getting Started</span>
          <span className="docs-breadcrumb__sep" aria-hidden="true">/</span>
          <span className="docs-breadcrumb__item docs-breadcrumb__item--current">Quick Start</span>
        </nav>

        <h1 className="docs-h1">Quick Start</h1>
        <p className="docs-lead">
          Get your design system up and running in under five minutes. Choose a layout,
          pick a style variant, and export tokens directly to your project.
        </p>

        <h2 className="docs-h2">1. Install</h2>
        <div className="docs-code-block">
          <div className="docs-code-block__header">
            <span>bash</span>
            <button className="docs-code-block__copy" tabIndex={-1} aria-hidden="true">Copy</button>
          </div>
          <pre className="docs-code-block__pre">pnpm add @dsm/tokens</pre>
        </div>

        <h2 className="docs-h2">2. Import your tokens</h2>
        <div className="docs-code-block">
          <div className="docs-code-block__header">
            <span>ts</span>
            <button className="docs-code-block__copy" tabIndex={-1} aria-hidden="true">Copy</button>
          </div>
          <pre className="docs-code-block__pre">{`import tokens from './dsm-tokens.json'\nimport { applyTokens } from '@dsm/tokens'\n\napplyTokens(tokens)`}</pre>
        </div>

        <div className="docs-callout docs-callout--tip">
          <span className="docs-callout__icon" aria-hidden="true">◈</span>
          <div>
            <p className="docs-callout__title">Tip</p>
            <p className="docs-callout__body">
              Paste the exported Markdown file into your AI coding agent before starting a project.
              It acts as a visual contract for your entire UI.
            </p>
          </div>
        </div>

        <h2 className="docs-h2">3. Apply CSS variables</h2>
        <p className="docs-body">
          All 38 design tokens are exported as CSS custom properties. Apply them once at the root:
        </p>
        <div className="docs-code-block">
          <div className="docs-code-block__header">
            <span>css</span>
            <button className="docs-code-block__copy" tabIndex={-1} aria-hidden="true">Copy</button>
          </div>
          <pre className="docs-code-block__pre">{`:root {\n  --color-primary: #635BFF;\n  --font-family: 'Inter', sans-serif;\n  /* ... */\n}`}</pre>
        </div>

        <div className="docs-pagination">
          <button className="docs-pagination__btn" tabIndex={-1} aria-hidden="true">
            ← Installation
          </button>
          <button className="docs-pagination__btn docs-pagination__btn--next" tabIndex={-1} aria-hidden="true">
            Configuration →
          </button>
        </div>
      </article>
    </div>
  )
}

function ApiPage() {
  const METHOD_COLORS: Record<string, string> = {
    GET: 'docs-method--get',
    POST: 'docs-method--post',
    PATCH: 'docs-method--patch',
    DELETE: 'docs-method--delete',
  }

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <p className="docs-nav-section__title" style={{ padding: '0 var(--spacing-sm)' }}>API Reference</p>
        <ul className="docs-nav-section__list">
          {['Authentication', 'Themes', 'Tokens', 'Export', 'Webhooks'].map((item, i) => (
            <li key={item}>
              <button
                className={`docs-nav-item${i === 1 ? ' docs-nav-item--active' : ''}`}
                tabIndex={-1}
                aria-hidden="true"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <article className="docs-content">
        <h1 className="docs-h1">Themes API</h1>
        <p className="docs-lead">Manage design themes via REST. All endpoints require a Bearer token.</p>

        <div className="docs-endpoint-list">
          {API_ENDPOINTS.map(ep => (
            <div key={ep.path} className="docs-endpoint">
              <div className="docs-endpoint__header">
                <span className={`docs-method ${METHOD_COLORS[ep.method] ?? ''}`}>{ep.method}</span>
                <code className="docs-endpoint__path">{ep.path}</code>
                <span className="docs-endpoint__status">{ep.status}</span>
              </div>
              <p className="docs-endpoint__desc">{ep.desc}</p>
            </div>
          ))}
        </div>

        <h2 className="docs-h2">Example Request</h2>
        <div className="docs-code-block">
          <div className="docs-code-block__header">
            <span>bash</span>
            <button className="docs-code-block__copy" tabIndex={-1} aria-hidden="true">Copy</button>
          </div>
          <pre className="docs-code-block__pre">{`curl https://api.dsm.app/themes \\
  -H "Authorization: Bearer {token}"`}</pre>
        </div>
      </article>
    </div>
  )
}

function ChangelogPage() {
  const TAG_CLASS: Record<string, string> = {
    minor: 'docs-tag--minor',
    patch: 'docs-tag--patch',
    major: 'docs-tag--major',
  }

  return (
    <div className="docs-changelog">
      <h1 className="docs-h1">Changelog</h1>
      <p className="docs-lead">All notable changes to DSM.</p>
      <div className="docs-changelog-list">
        {CHANGELOG_ENTRIES.map(entry => (
          <div key={entry.version} className="docs-changelog-entry">
            <div className="docs-changelog-entry__meta">
              <span className="docs-changelog-entry__version">{entry.version}</span>
              <span className={`docs-tag ${TAG_CLASS[entry.tag] ?? ''}`}>{entry.tag}</span>
              <span className="docs-changelog-entry__date">{entry.date}</span>
            </div>
            <ul className="docs-changelog-entry__list">
              {entry.changes.map(change => (
                <li key={change} className="docs-changelog-entry__item">{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [GuidePage, ApiPage, ChangelogPage]

export function DocsLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? GuidePage

  return (
    <div className="docs-shell">
      {/* Top bar */}
      <header className="docs-topbar">
        <div className="docs-topbar__brand">
          <span className="docs-topbar__logo" aria-hidden="true">◈</span>
          <span className="docs-topbar__name">DSM Docs</span>
        </div>
        <div className="layout-tabs" role="tablist" aria-label="Docs pages">
          {PAGES.map((page, i) => (
            <button
              key={page}
              role="tab"
              aria-selected={activePage === i}
              className={`layout-tab${activePage === i ? ' layout-tab--active' : ''}`}
              onClick={() => onPageChange(i)}
              tabIndex={-1}
            >
              {page}
            </button>
          ))}
        </div>
        <div className="docs-topbar__actions">
          <button className="docs-topbar__btn" tabIndex={-1} aria-hidden="true">GitHub</button>
        </div>
      </header>

      <div role="tabpanel">
        <PageComponent />
      </div>
    </div>
  )
}
