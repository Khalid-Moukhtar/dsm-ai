// Landing page layout mockup.
// ALL interactive elements have tabIndex={-1} — this is inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PAGES = ['Home', 'Pricing', 'Contact']

const FEATURES = [
  {
    icon: '⚡',
    title: 'Lightning Fast',
    desc: 'Built on modern infrastructure with sub-100ms response times globally.',
  },
  {
    icon: '🔒',
    title: 'Secure by Default',
    desc: 'End-to-end encryption and SOC 2 compliance out of the box.',
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    desc: 'Real-time dashboards to track every metric that matters to your team.',
  },
]

const PLANS = [
  {
    name: 'Starter',
    price: '$0',
    period: '/month',
    desc: 'Perfect for side projects and solo founders.',
    features: ['Up to 3 projects', '1 team member', '1 GB storage', 'Community support'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    desc: 'For growing teams that need more power.',
    features: ['Unlimited projects', 'Up to 10 members', '50 GB storage', 'Priority support', 'Advanced analytics'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '$99',
    period: '/month',
    desc: 'Custom solutions for large organizations.',
    features: ['Unlimited everything', 'Unlimited members', '500 GB storage', 'Dedicated support', 'SLA guarantee', 'SSO & SAML'],
    cta: 'Contact sales',
    highlight: false,
  },
]

function HomePage() {
  return (
    <div className="landing-home">
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero__eyebrow">Now in public beta</div>
        <h1 className="landing-hero__headline">
          Build faster.<br />Ship with confidence.
        </h1>
        <p className="landing-hero__sub">
          The all-in-one platform for modern product teams. From idea to production in days, not months.
        </p>
        <div className="landing-hero__cta">
          <button className="landing-btn landing-btn--primary" tabIndex={-1} aria-hidden="true">
            Start for free
          </button>
          <button className="landing-btn landing-btn--ghost" tabIndex={-1} aria-hidden="true">
            Watch demo →
          </button>
        </div>
        <p className="landing-hero__note">No credit card required · Free forever plan</p>
      </section>

      {/* Social proof strip */}
      <div className="landing-social">
        <span className="landing-social__label">Trusted by teams at</span>
        {['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map(co => (
          <span key={co} className="landing-social__logo">{co}</span>
        ))}
      </div>

      {/* Features */}
      <section className="landing-features">
        <h2 className="landing-section-title">Everything you need, nothing you don't</h2>
        <p className="landing-section-sub">Simple, powerful, and built for how modern teams actually work.</p>
        <div className="landing-features__grid">
          {FEATURES.map(f => (
            <div key={f.title} className="landing-feature-card">
              <div className="landing-feature-card__icon" aria-hidden="true">{f.icon}</div>
              <h3 className="landing-feature-card__title">{f.title}</h3>
              <p className="landing-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="landing-testimonial">
        <blockquote className="landing-testimonial__quote">
          "We cut our deployment time by 80% in the first week. This is the tool we've been waiting for."
        </blockquote>
        <div className="landing-testimonial__author">
          <div className="landing-testimonial__avatar" aria-hidden="true">S</div>
          <div>
            <div className="landing-testimonial__name">Sarah Chen</div>
            <div className="landing-testimonial__role">CTO at Acme Corp</div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PricingPage() {
  return (
    <div className="landing-pricing">
      <h1 className="landing-section-title">Simple, transparent pricing</h1>
      <p className="landing-section-sub">No hidden fees. Cancel anytime. Start free.</p>
      <div className="landing-pricing__grid">
        {PLANS.map(plan => (
          <div
            key={plan.name}
            className={`landing-plan-card${plan.highlight ? ' landing-plan-card--highlight' : ''}`}
          >
            {plan.highlight && <div className="landing-plan-card__badge">Most popular</div>}
            <h3 className="landing-plan-card__name">{plan.name}</h3>
            <div className="landing-plan-card__price">
              <span className="landing-plan-card__amount">{plan.price}</span>
              <span className="landing-plan-card__period">{plan.period}</span>
            </div>
            <p className="landing-plan-card__desc">{plan.desc}</p>
            <ul className="landing-plan-card__features">
              {plan.features.map(f => (
                <li key={f} className="landing-plan-card__feature">
                  <span aria-hidden="true">✓</span> {f}
                </li>
              ))}
            </ul>
            <button
              className={`landing-btn landing-btn--full${plan.highlight ? ' landing-btn--primary' : ' landing-btn--outline'}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ContactPage() {
  return (
    <div className="landing-contact">
      <div className="landing-contact__layout">
        <div className="landing-contact__info">
          <h1 className="landing-contact__title">Let's talk</h1>
          <p className="landing-contact__sub">
            Have questions about our product or pricing? We'd love to hear from you.
          </p>
          <div className="landing-contact__items">
            {[
              { icon: '📧', label: 'Email', value: 'hello@product.io' },
              { icon: '💬', label: 'Live chat', value: 'Available 9am–6pm ET' },
              { icon: '📍', label: 'Office', value: 'New York, NY' },
            ].map(item => (
              <div key={item.label} className="landing-contact__item">
                <span className="landing-contact__item-icon" aria-hidden="true">{item.icon}</span>
                <div>
                  <div className="landing-contact__item-label">{item.label}</div>
                  <div className="landing-contact__item-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="landing-contact__form">
          <div className="landing-form-row">
            <div className="landing-form-field">
              <label className="landing-form-label">Name</label>
              <div className="landing-form-input-mock" />
            </div>
            <div className="landing-form-field">
              <label className="landing-form-label">Email</label>
              <div className="landing-form-input-mock" />
            </div>
          </div>
          <div className="landing-form-field">
            <label className="landing-form-label">Subject</label>
            <div className="landing-form-input-mock" />
          </div>
          <div className="landing-form-field">
            <label className="landing-form-label">Message</label>
            <div className="landing-form-textarea-mock" />
          </div>
          <button className="landing-btn landing-btn--primary landing-btn--full" tabIndex={-1} aria-hidden="true">
            Send message
          </button>
        </div>
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [HomePage, PricingPage, ContactPage]

export function LandingLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? HomePage

  return (
    <div className="landing-layout">
      {/* Header — nav items are the page switcher */}
      <header className="landing-header">
        <div className="landing-header__brand">
          <div className="landing-header__logo" aria-hidden="true" />
          <span className="landing-header__name">ProductName</span>
        </div>
        <nav className="landing-header__nav">
          {PAGES.map((page, i) => (
            <button
              key={page}
              className={`landing-header__nav-item${activePage === i ? ' landing-header__nav-item--active' : ''}`}
              onClick={() => onPageChange(i)}
              tabIndex={-1}
            >
              {page}
            </button>
          ))}
        </nav>
        <div className="landing-header__actions">
          <button className="landing-btn landing-btn--ghost landing-btn--sm" tabIndex={-1} aria-hidden="true">
            Log in
          </button>
          <button className="landing-btn landing-btn--primary landing-btn--sm" tabIndex={-1} aria-hidden="true">
            Sign up
          </button>
        </div>
      </header>

      <div role="tabpanel">
        <PageComponent />
      </div>
    </div>
  )
}
