// Mobile app layout mockup — shown as a phone frame within the preview.
// ALL interactive elements have tabIndex={-1} — inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PAGES = ['Home', 'Browse', 'Profile']

const FEED_ITEMS = [
  {
    id: 1,
    user: 'Aria C.',
    avatar: 'A',
    avatarColor: '#E8D5C4',
    time: '2m',
    image: '#C8D5E8',
    caption: 'New design system drop — Stripe-inspired tokens 🎨',
    likes: 142,
    comments: 18,
  },
  {
    id: 2,
    user: 'Mateo R.',
    avatar: 'M',
    avatarColor: '#C4D5E8',
    time: '15m',
    image: '#D4E8C4',
    caption: 'Shipped a landing page in 45 min with Claude + DSM export',
    likes: 89,
    comments: 7,
  },
  {
    id: 3,
    user: 'Priya N.',
    avatar: 'P',
    avatarColor: '#E8C4D5',
    time: '1h',
    image: '#E8D4C4',
    caption: 'Dark mode contrast ratios — a thread on WCAG compliance 🔍',
    likes: 213,
    comments: 44,
  },
]

const CATEGORIES = [
  { icon: '◈', label: 'Design', color: '#E8D5C4' },
  { icon: '⊙', label: 'Dev', color: '#C4D5E8' },
  { icon: '◫', label: 'Products', color: '#D4E8C4' },
  { icon: '⬡', label: 'Community', color: '#E8C4D5' },
  { icon: '✦', label: 'Trending', color: '#C4C4E8' },
  { icon: '◷', label: 'Recent', color: '#E8E8C4' },
]

const STORIES = [
  { name: 'Aria', avatar: 'A', color: '#E8D5C4', hasStory: true },
  { name: 'Mateo', avatar: 'M', color: '#C4D5E8', hasStory: true },
  { name: 'Soren', avatar: 'S', color: '#D4E8C4', hasStory: false },
  { name: 'Priya', avatar: 'P', color: '#E8C4D5', hasStory: true },
  { name: 'Jin', avatar: 'J', color: '#C4C4E8', hasStory: false },
]

// page: null = decorative; number = page index to navigate to
const BOTTOM_NAV = [
  { icon: '⊞', label: 'Home',     page: 0 },
  { icon: '⊙', label: 'Browse',   page: 1 },
  { icon: '+', label: 'Create',   page: null },
  { icon: '◫', label: 'Activity', page: null },
  { icon: '◑', label: 'Profile',  page: 2 },
]

function HomePage() {
  return (
    <div className="mobile-content">
      {/* Stories row */}
      <div className="mobile-stories">
        <div className="mobile-story mobile-story--add" aria-hidden="true">
          <div className="mobile-story__ring mobile-story__ring--add">
            <div className="mobile-story__avatar mobile-story__avatar--you">+</div>
          </div>
          <span className="mobile-story__label">Your story</span>
        </div>
        {STORIES.map(story => (
          <div key={story.name} className="mobile-story" aria-hidden="true">
            <div className={`mobile-story__ring${story.hasStory ? ' mobile-story__ring--active' : ''}`}>
              <div
                className="mobile-story__avatar"
                style={{ background: story.color }}
              >
                {story.avatar}
              </div>
            </div>
            <span className="mobile-story__label">{story.name}</span>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="mobile-feed">
        {FEED_ITEMS.map(item => (
          <article key={item.id} className="mobile-post">
            <div className="mobile-post__header">
              <div
                className="mobile-post__avatar"
                style={{ background: item.avatarColor }}
                aria-hidden="true"
              >
                {item.avatar}
              </div>
              <div className="mobile-post__author-info">
                <span className="mobile-post__author">{item.user}</span>
                <span className="mobile-post__time">{item.time} ago</span>
              </div>
              <button className="mobile-post__more" tabIndex={-1} aria-hidden="true">⋯</button>
            </div>
            <div
              className="mobile-post__image"
              style={{ background: item.image }}
              aria-hidden="true"
            />
            <div className="mobile-post__actions">
              <div className="mobile-post__actions-left">
                <button className="mobile-icon-btn" tabIndex={-1} aria-hidden="true">♡</button>
                <button className="mobile-icon-btn" tabIndex={-1} aria-hidden="true">◷</button>
                <button className="mobile-icon-btn" tabIndex={-1} aria-hidden="true">↗</button>
              </div>
              <button className="mobile-icon-btn" tabIndex={-1} aria-hidden="true">◫</button>
            </div>
            <div className="mobile-post__likes">{item.likes} likes</div>
            <div className="mobile-post__caption">
              <span className="mobile-post__author">{item.user}</span>
              {' '}{item.caption}
            </div>
            <button className="mobile-post__view-comments" tabIndex={-1} aria-hidden="true">
              View all {item.comments} comments
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

function BrowsePage() {
  return (
    <div className="mobile-content">
      <div className="mobile-browse-search" aria-hidden="true">
        <span className="mobile-browse-search__icon">⊙</span>
        <span className="mobile-browse-search__placeholder">Search</span>
      </div>

      <p className="mobile-section-label">Explore</p>
      <div className="mobile-category-grid">
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            className="mobile-category-card"
            style={{ background: cat.color }}
            tabIndex={-1}
            aria-hidden="true"
          >
            <span className="mobile-category-card__icon" aria-hidden="true">{cat.icon}</span>
            <span className="mobile-category-card__label">{cat.label}</span>
          </button>
        ))}
      </div>

      <p className="mobile-section-label">Trending</p>
      <div className="mobile-trending-list">
        {FEED_ITEMS.map(item => (
          <div key={item.id} className="mobile-trending-row">
            <div
              className="mobile-trending-thumb"
              style={{ background: item.image }}
              aria-hidden="true"
            />
            <div className="mobile-trending-info">
              <p className="mobile-trending-caption">{item.caption}</p>
              <p className="mobile-trending-meta">{item.likes} likes · {item.user}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage() {
  return (
    <div className="mobile-content">
      <div className="mobile-profile-header">
        <div
          className="mobile-profile-avatar"
          style={{ background: '#E8D5C4' }}
          aria-hidden="true"
        >
          A
        </div>
        <p className="mobile-profile-name">Aria Chen</p>
        <p className="mobile-profile-bio">Designer · Building things with AI. Based in SF.</p>
        <div className="mobile-profile-stats">
          {[
            { value: 142, label: 'Posts' },
            { value: '2.4K', label: 'Followers' },
            { value: 187, label: 'Following' },
          ].map(stat => (
            <div key={stat.label} className="mobile-profile-stat">
              <span className="mobile-profile-stat__value">{stat.value}</span>
              <span className="mobile-profile-stat__label">{stat.label}</span>
            </div>
          ))}
        </div>
        <div className="mobile-profile-actions">
          <button className="mobile-profile-btn mobile-profile-btn--primary" tabIndex={-1} aria-hidden="true">
            Edit Profile
          </button>
          <button className="mobile-profile-btn" tabIndex={-1} aria-hidden="true">
            Share
          </button>
        </div>
      </div>

      {/* Grid of posts */}
      <div className="mobile-profile-grid">
        {['#C8D5E8', '#E8D5C4', '#D4E8C4', '#E8C4D5', '#C4C4E8', '#E8E8C4', '#C4D5E8', '#E8D4C4', '#D4C4E8'].map((color, i) => (
          <div
            key={i}
            className="mobile-profile-grid-item"
            style={{ background: color }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [HomePage, BrowsePage, ProfilePage]

export function MobileLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? HomePage

  return (
    <div className="mobile-shell">
      {/* Phone frame */}
      <div className="mobile-frame">
        {/* Status bar */}
        <div className="mobile-status-bar" aria-hidden="true">
          <span className="mobile-status-bar__time">9:41</span>
          <div className="mobile-status-bar__icons">
            <span>●●●</span>
            <span>WiFi</span>
            <span>⬛</span>
          </div>
        </div>

        {/* App header — title shows current page; nav via bottom bar */}
        <div className="mobile-app-header">
          <span className="mobile-app-header__logo" aria-hidden="true">◈</span>
          <span className="mobile-app-header__page-title">{PAGES[activePage]}</span>
          <button className="mobile-app-header__action" tabIndex={-1} aria-hidden="true">◫</button>
        </div>

        {/* Scrollable content area */}
        <div className="mobile-viewport" role="tabpanel">
          <PageComponent />
        </div>

        {/* Bottom nav — primary page navigation */}
        <nav className="mobile-bottom-nav">
          {BOTTOM_NAV.map(item => (
            <button
              key={item.label}
              className={`mobile-bottom-nav__item${item.page === activePage ? ' mobile-bottom-nav__item--active' : ''}`}
              onClick={item.page !== null ? () => onPageChange(item.page as number) : undefined}
              tabIndex={-1}
            >
              <span className="mobile-bottom-nav__icon">{item.icon}</span>
              <span className="mobile-bottom-nav__label">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Home indicator */}
        <div className="mobile-home-indicator" aria-hidden="true" />
      </div>
    </div>
  )
}
