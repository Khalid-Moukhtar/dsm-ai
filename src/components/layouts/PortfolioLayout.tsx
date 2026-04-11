// Portfolio site layout mockup.
// ALL interactive elements have tabIndex={-1} — this is inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PROJECTS = [
  {
    title: 'Orbit Design System',
    category: 'Design Systems',
    desc: 'A comprehensive component library and token system built for a fintech startup. Reduced design-to-code time by 60%.',
    tags: ['Figma', 'React', 'TypeScript'],
    year: '2025',
  },
  {
    title: 'Pulse Analytics',
    category: 'Product Design',
    desc: 'End-to-end UX design for a B2B analytics dashboard. Improved data comprehension scores by 40% in user testing.',
    tags: ['UX Research', 'Figma', 'Prototyping'],
    year: '2025',
  },
  {
    title: 'Bloom Mobile App',
    category: 'Mobile Design',
    desc: 'iOS and Android wellness app with 50k downloads in first month. Featured on App Store front page.',
    tags: ['iOS', 'Android', 'Motion'],
    year: '2024',
  },
  {
    title: 'Nova Brand Identity',
    category: 'Branding',
    desc: 'Full visual identity system for a tech startup: logo, color system, typography, and brand guidelines.',
    tags: ['Branding', 'Illustration', 'Print'],
    year: '2024',
  },
]

const SKILLS = ['Product Design', 'Design Systems', 'Figma', 'React', 'TypeScript', 'Motion Design', 'UX Research', 'Branding']

function HomePage() {
  return (
    <div className="portfolio-home">
      {/* Hero */}
      <section className="portfolio-hero">
        <div className="portfolio-hero__avatar" aria-hidden="true">A</div>
        <div className="portfolio-hero__text">
          <div className="portfolio-hero__eyebrow">Available for work</div>
          <h1 className="portfolio-hero__name">Alex Rivera</h1>
          <p className="portfolio-hero__role">Product Designer & Front-end Developer</p>
          <p className="portfolio-hero__bio">
            I design and build digital products that people love to use.
            6 years of experience working with early-stage startups and scale-ups across fintech, healthtech, and SaaS.
          </p>
          <div className="portfolio-hero__actions">
            <button className="portfolio-btn portfolio-btn--primary" tabIndex={-1} aria-hidden="true">
              View my work
            </button>
            <button className="portfolio-btn portfolio-btn--ghost" tabIndex={-1} aria-hidden="true">
              Download CV
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="portfolio-stats">
        {[
          { value: '6+', label: 'Years experience' },
          { value: '40+', label: 'Projects shipped' },
          { value: '12', label: 'Happy clients' },
          { value: '3', label: 'Awards won' },
        ].map(s => (
          <div key={s.label} className="portfolio-stat">
            <div className="portfolio-stat__value">{s.value}</div>
            <div className="portfolio-stat__label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Featured projects (2) */}
      <section className="portfolio-featured">
        <h2 className="portfolio-section-title">Featured Work</h2>
        <div className="portfolio-featured__grid">
          {PROJECTS.slice(0, 2).map(p => (
            <div key={p.title} className="portfolio-project-card portfolio-project-card--large">
              <div className="portfolio-project-card__image" aria-hidden="true" />
              <div className="portfolio-project-card__content">
                <div className="portfolio-project-card__meta">
                  <span className="portfolio-tag">{p.category}</span>
                  <span className="portfolio-project-card__year">{p.year}</span>
                </div>
                <h3 className="portfolio-project-card__title">{p.title}</h3>
                <p className="portfolio-project-card__desc">{p.desc}</p>
                <div className="portfolio-project-card__tags">
                  {p.tags.map(t => <span key={t} className="portfolio-chip">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="portfolio-skills">
        <h2 className="portfolio-section-title">Skills & Tools</h2>
        <div className="portfolio-skills__list">
          {SKILLS.map(s => <span key={s} className="portfolio-skill-tag">{s}</span>)}
        </div>
      </section>
    </div>
  )
}

function ProjectsPage() {
  return (
    <div className="portfolio-projects">
      <div className="portfolio-projects__header">
        <h1 className="portfolio-section-title">All Projects</h1>
        <div className="portfolio-projects__filters">
          {['All', 'Design Systems', 'Product Design', 'Mobile', 'Branding'].map(f => (
            <button
              key={f}
              className={`portfolio-filter-btn${f === 'All' ? ' portfolio-filter-btn--active' : ''}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="portfolio-projects__grid">
        {PROJECTS.map(p => (
          <div key={p.title} className="portfolio-project-card">
            <div className="portfolio-project-card__image" aria-hidden="true" />
            <div className="portfolio-project-card__content">
              <div className="portfolio-project-card__meta">
                <span className="portfolio-tag">{p.category}</span>
                <span className="portfolio-project-card__year">{p.year}</span>
              </div>
              <h3 className="portfolio-project-card__title">{p.title}</h3>
              <p className="portfolio-project-card__desc">{p.desc}</p>
              <div className="portfolio-project-card__tags">
                {p.tags.map(t => <span key={t} className="portfolio-chip">{t}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="portfolio-contact">
      <div className="portfolio-contact__layout">
        <div className="portfolio-contact__left">
          <h1 className="portfolio-contact__title">Let's work together</h1>
          <p className="portfolio-contact__sub">
            I'm currently available for freelance projects and full-time roles. Let's build something great.
          </p>
          <div className="portfolio-contact__links">
            {[
              { label: 'Email', value: 'alex@alexrivera.design' },
              { label: 'LinkedIn', value: '/in/alexrivera' },
              { label: 'GitHub', value: '/alexrivera' },
              { label: 'Dribbble', value: '/alexrivera' },
            ].map(link => (
              <div key={link.label} className="portfolio-contact__link-row">
                <span className="portfolio-contact__link-label">{link.label}</span>
                <span className="portfolio-contact__link-value">{link.value}</span>
              </div>
            ))}
          </div>
          <div className="portfolio-contact__availability">
            <div className="portfolio-contact__availability-dot" aria-hidden="true" />
            <span>Available for new projects</span>
          </div>
        </div>
        <div className="portfolio-contact__right">
          <div className="portfolio-form">
            {['Your name', 'Your email', 'Project type'].map(field => (
              <div key={field} className="portfolio-form__field">
                <label className="portfolio-form__label">{field}</label>
                <div className="portfolio-form__input-mock" />
              </div>
            ))}
            <div className="portfolio-form__field">
              <label className="portfolio-form__label">Tell me about your project</label>
              <div className="portfolio-form__textarea-mock" />
            </div>
            <button className="portfolio-btn portfolio-btn--primary portfolio-btn--full" tabIndex={-1} aria-hidden="true">
              Send message
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [HomePage, ProjectsPage, ContactPage]

// Nav labels → page mapping: Work=0(Home), Projects=1, Contact=2
const NAV_ITEMS = ['Work', 'Projects', 'Contact']

export function PortfolioLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? HomePage

  return (
    <div className="portfolio-layout">
      {/* Header — nav items are the page switcher */}
      <header className="portfolio-header">
        <div className="portfolio-header__brand">
          <div className="portfolio-header__avatar" aria-hidden="true">A</div>
          <span className="portfolio-header__name">Alex Rivera</span>
        </div>
        <nav className="portfolio-header__nav">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              className={`portfolio-header__nav-item${activePage === i ? ' portfolio-header__nav-item--active' : ''}`}
              onClick={() => onPageChange(i)}
              tabIndex={-1}
            >
              {item}
            </button>
          ))}
        </nav>
        <button className="portfolio-btn portfolio-btn--primary portfolio-btn--sm" tabIndex={-1} aria-hidden="true">
          Hire me
        </button>
      </header>

      <div role="tabpanel">
        <PageComponent />
      </div>
    </div>
  )
}
