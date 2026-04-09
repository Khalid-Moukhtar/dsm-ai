// Blog / content site layout mockup.
// ALL interactive elements have tabIndex={-1} — this is inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PAGES = ['Home', 'Article', 'About']

const POSTS = [
  {
    title: 'Building a Design System from Scratch',
    excerpt: 'A practical guide to creating consistent, scalable UI components that your team will actually use.',
    tag: 'Design',
    date: 'Apr 7, 2026',
    readTime: '8 min read',
  },
  {
    title: 'The Art of Typography in Web Design',
    excerpt: 'How type choices shape user experience — and the rules that make text readable at scale.',
    tag: 'Typography',
    date: 'Apr 3, 2026',
    readTime: '6 min read',
  },
  {
    title: 'Color Theory for Developers',
    excerpt: "You don't need a design degree. These principles are enough to make your UI look professional.",
    tag: 'Color',
    date: 'Mar 28, 2026',
    readTime: '5 min read',
  },
]

const TAGS = ['Design', 'Typography', 'Color', 'Layout', 'CSS', 'React']

function HomePage() {
  return (
    <div className="blog-layout__body">
      <div className="blog-posts">
        {POSTS.map(post => (
          <article key={post.title} className="blog-post-card">
            <div className="blog-post-card__image" aria-hidden="true" />
            <div className="blog-post-card__content">
              <span className="blog-tag">{post.tag}</span>
              <h2 className="blog-post-card__title">{post.title}</h2>
              <p className="blog-post-card__excerpt">{post.excerpt}</p>
              <div className="blog-post-card__meta">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="blog-sidebar">
        <div className="blog-sidebar__section">
          <p className="blog-sidebar__heading">Topics</p>
          <div className="blog-sidebar__tags">
            {TAGS.map(tag => (
              <span key={tag} className="blog-tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="blog-sidebar__section">
          <p className="blog-sidebar__heading">Recent Posts</p>
          {POSTS.slice(0, 2).map(post => (
            <p key={post.title} className="blog-sidebar__recent-post">{post.title}</p>
          ))}
        </div>
      </aside>
    </div>
  )
}

function ArticlePage() {
  return (
    <div className="blog-article">
      <div className="blog-article__header">
        <span className="blog-tag">Design</span>
        <h1 className="blog-article__title">Building a Design System from Scratch</h1>
        <div className="blog-article__meta">Apr 7, 2026 · 8 min read</div>
      </div>
      <div className="blog-article__image" aria-hidden="true" />
      <div className="blog-article__body">
        <p>A design system is more than a component library. It's a shared language between designers and developers — a set of decisions encoded into reusable patterns.</p>
        <h2>Start with tokens</h2>
        <p>Design tokens are the atomic units of your system: colors, spacing, typography, and border radius. Get these right and everything else follows naturally.</p>
        <h2>Build primitives, then compositions</h2>
        <p>Primitives are your buttons, inputs, and badges. Compositions are your cards, modals, and navigation patterns built from those primitives.</p>
        <blockquote className="blog-article__quote">
          "The best design systems are boring. They solve the same problem in exactly the same way, every time."
        </blockquote>
      </div>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="blog-about">
      <div className="blog-about__hero">
        <div className="blog-about__avatar" aria-hidden="true">J</div>
        <h1 className="blog-about__name">Jordan Ellis</h1>
        <p className="blog-about__bio">
          Product designer and writer. I write about design systems, visual hierarchy, and the craft of building software that feels good to use.
        </p>
      </div>
      <div className="blog-about__links">
        {['Twitter / X', 'GitHub', 'LinkedIn', 'Newsletter'].map(link => (
          <button key={link} className="blog-about__link-btn" tabIndex={-1} aria-hidden="true">
            {link}
          </button>
        ))}
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [HomePage, ArticlePage, AboutPage]

export function BlogLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? HomePage

  return (
    <div className="blog-layout">
      {/* Header */}
      <header className="blog-header">
        <div className="blog-header__brand">
          <span className="blog-header__title">The Craft</span>
        </div>
        <nav className="blog-header__nav">
          {['Home', 'Articles', 'About', 'Newsletter'].map(item => (
            <button key={item} className="blog-header__nav-item" tabIndex={-1} aria-hidden="true">
              {item}
            </button>
          ))}
        </nav>
      </header>

      {/* Page tabs */}
      <div className="layout-tabs" role="tablist" aria-label="Blog pages">
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

      <div role="tabpanel">
        <PageComponent />
      </div>
    </div>
  )
}
