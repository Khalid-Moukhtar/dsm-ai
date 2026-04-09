// Community / Forum layout mockup — Feed, Members, Profile pages.
// ALL interactive elements have tabIndex={-1} — inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PAGES = ['Feed', 'Members', 'Profile']

const POSTS = [
  {
    id: 1,
    author: 'Aria Chen',
    handle: '@aria',
    avatar: 'A',
    avatarColor: '#E8D5C4',
    time: '2h ago',
    tag: 'Design',
    title: 'How do you handle dark mode contrast in complex data tables?',
    body: "I've been wrestling with accessible contrast in dark mode — especially for alternating row colors and muted text. WCAG AA requires 4.5:1 but it feels really limiting...",
    likes: 34,
    replies: 12,
    pinned: true,
  },
  {
    id: 2,
    author: 'Mateo Rivera',
    handle: '@mateo',
    avatar: 'M',
    avatarColor: '#C4D5E8',
    time: '5h ago',
    tag: 'Dev',
    title: 'CSS custom properties vs. Tailwind for design token delivery',
    body: "Curious what people are shipping in 2026. I've moved to pure CSS vars + a JSON source of truth. No more JIT class explosions in your HTML...",
    likes: 28,
    replies: 9,
    pinned: false,
  },
  {
    id: 3,
    author: 'Soren Larsen',
    handle: '@soren',
    avatar: 'S',
    avatarColor: '#D4E8C4',
    time: '1d ago',
    tag: 'Show & Tell',
    title: 'I built a landing page using only AI + DSM export in 45 min',
    body: "Here's my workflow: export the MD file from DSM, paste it into Claude with a brief, then iterate on the design tokens until it looks right. Total time: 45 min start to deploy...",
    likes: 87,
    replies: 31,
    pinned: false,
  },
]

const MEMBERS = [
  { name: 'Aria Chen', role: 'Design', avatar: 'A', color: '#E8D5C4', posts: 142, joined: 'Jan 2025' },
  { name: 'Mateo Rivera', role: 'Dev', avatar: 'M', color: '#C4D5E8', posts: 98, joined: 'Mar 2025' },
  { name: 'Soren Larsen', role: 'Founder', avatar: 'S', color: '#D4E8C4', posts: 305, joined: 'Nov 2024' },
  { name: 'Priya Nair', role: 'Design', avatar: 'P', color: '#E8C4D5', posts: 77, joined: 'Feb 2025' },
  { name: 'Jin Park', role: 'Dev', avatar: 'J', color: '#C4C4E8', posts: 211, joined: 'Dec 2024' },
  { name: 'Lena Wolf', role: 'Product', avatar: 'L', color: '#E8E8C4', posts: 56, joined: 'Apr 2025' },
]

const TAG_COLORS: Record<string, string> = {
  Design: 'community-tag--design',
  Dev: 'community-tag--dev',
  'Show & Tell': 'community-tag--show',
  Product: 'community-tag--product',
}

function FeedPage() {
  return (
    <div className="community-feed-layout">
      {/* Left sidebar */}
      <aside className="community-sidebar">
        <div className="community-sidebar__section">
          <p className="community-sidebar__heading">Channels</p>
          {['All Posts', 'Design', 'Dev', 'Show & Tell', 'Product'].map((ch, i) => (
            <button
              key={ch}
              className={`community-sidebar__channel${i === 0 ? ' community-sidebar__channel--active' : ''}`}
              tabIndex={-1}
              aria-hidden="true"
            >
              # {ch}
            </button>
          ))}
        </div>
        <div className="community-sidebar__section">
          <p className="community-sidebar__heading">Members Online</p>
          <div className="community-online-list">
            {MEMBERS.slice(0, 4).map(m => (
              <div key={m.name} className="community-online-item">
                <div className="community-avatar community-avatar--sm" style={{ background: m.color }} aria-hidden="true">
                  {m.avatar}
                </div>
                <span className="community-online-item__name">{m.name}</span>
                <span className="community-online-dot" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Feed */}
      <main className="community-feed">
        <div className="community-feed__toolbar">
          <div className="community-search" aria-hidden="true">
            <span>⊙</span>
            <span className="community-search__text">Search posts…</span>
          </div>
          <button className="community-btn-new" tabIndex={-1} aria-hidden="true">
            + New Post
          </button>
        </div>

        <div className="community-post-list">
          {POSTS.map(post => (
            <article key={post.id} className={`community-post${post.pinned ? ' community-post--pinned' : ''}`}>
              {post.pinned && (
                <div className="community-post__pin" aria-hidden="true">📌 Pinned</div>
              )}
              <div className="community-post__header">
                <div
                  className="community-avatar"
                  style={{ background: post.avatarColor }}
                  aria-hidden="true"
                >
                  {post.avatar}
                </div>
                <div className="community-post__author-info">
                  <span className="community-post__author">{post.author}</span>
                  <span className="community-post__handle">{post.handle}</span>
                  <span className="community-post__time">{post.time}</span>
                </div>
                <span className={`community-tag ${TAG_COLORS[post.tag] ?? ''}`}>{post.tag}</span>
              </div>
              <h3 className="community-post__title">{post.title}</h3>
              <p className="community-post__body">{post.body}</p>
              <div className="community-post__actions">
                <button className="community-post__action" tabIndex={-1} aria-hidden="true">
                  ♡ {post.likes}
                </button>
                <button className="community-post__action" tabIndex={-1} aria-hidden="true">
                  ◷ {post.replies} replies
                </button>
                <button className="community-post__action" tabIndex={-1} aria-hidden="true">
                  Share
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

function MembersPage() {
  return (
    <div className="community-members">
      <div className="community-members__header">
        <h2 className="community-members__title">Members ({MEMBERS.length})</h2>
        <div className="community-search" aria-hidden="true">
          <span>⊙</span>
          <span className="community-search__text">Search members…</span>
        </div>
      </div>
      <div className="community-member-grid">
        {MEMBERS.map(member => (
          <div key={member.name} className="community-member-card">
            <div
              className="community-avatar community-avatar--lg"
              style={{ background: member.color }}
              aria-hidden="true"
            >
              {member.avatar}
            </div>
            <p className="community-member-card__name">{member.name}</p>
            <span className={`community-tag ${TAG_COLORS[member.role] ?? ''}`}>{member.role}</span>
            <div className="community-member-card__stats">
              <span>{member.posts} posts</span>
              <span>·</span>
              <span>Since {member.joined}</span>
            </div>
            <button className="community-member-card__follow" tabIndex={-1} aria-hidden="true">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProfilePage() {
  const user = MEMBERS[2] // Soren — most active
  return (
    <div className="community-profile">
      <div className="community-profile__header">
        <div
          className="community-avatar community-avatar--xl"
          style={{ background: user.color }}
          aria-hidden="true"
        >
          {user.avatar}
        </div>
        <div className="community-profile__info">
          <h2 className="community-profile__name">{user.name}</h2>
          <p className="community-profile__bio">
            Founder · Building tools for non-designers. DSM creator.
            Shipping things with Claude + Cursor.
          </p>
          <div className="community-profile__meta">
            <span className={`community-tag ${TAG_COLORS[user.role] ?? ''}`}>{user.role}</span>
            <span className="community-profile__joined">Joined {user.joined}</span>
          </div>
        </div>
        <button className="community-member-card__follow" tabIndex={-1} aria-hidden="true">
          Follow
        </button>
      </div>

      <div className="community-profile__stats">
        {[
          { label: 'Posts', value: user.posts },
          { label: 'Followers', value: 284 },
          { label: 'Following', value: 61 },
          { label: 'Likes received', value: 1204 },
        ].map(stat => (
          <div key={stat.label} className="community-profile__stat">
            <p className="community-profile__stat-value">{stat.value}</p>
            <p className="community-profile__stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="community-profile__posts">
        <p className="community-members__title" style={{ marginBottom: 'var(--spacing-md)' }}>Recent Posts</p>
        {POSTS.map(post => (
          <div key={post.id} className="community-profile__post-row">
            <div className="community-profile__post-meta">
              <span className={`community-tag ${TAG_COLORS[post.tag] ?? ''}`}>{post.tag}</span>
              <span className="community-post__time">{post.time}</span>
            </div>
            <p className="community-profile__post-title">{post.title}</p>
            <div className="community-post__actions">
              <span className="community-post__action">♡ {post.likes}</span>
              <span className="community-post__action">◷ {post.replies}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [FeedPage, MembersPage, ProfilePage]

export function CommunityLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? FeedPage

  return (
    <div className="community-layout">
      {/* Top nav */}
      <header className="community-header">
        <div className="community-header__brand">
          <span className="community-header__logo" aria-hidden="true">⬡</span>
          <span className="community-header__name">Community</span>
        </div>
        <div className="layout-tabs" role="tablist" aria-label="Community pages">
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
        <div className="community-header__user">
          <div
            className="community-avatar community-avatar--sm"
            style={{ background: MEMBERS[0].color }}
            aria-hidden="true"
          >
            {MEMBERS[0].avatar}
          </div>
        </div>
      </header>

      <div role="tabpanel">
        <PageComponent />
      </div>
    </div>
  )
}
