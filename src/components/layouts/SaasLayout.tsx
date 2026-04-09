// SaaS Dashboard layout mockup.
// ALL interactive elements have tabIndex={-1} — this is inside aria-hidden LayoutPreview.

interface Props {
  activePage: number
  onPageChange: (page: number) => void
}

const PAGES = ['Dashboard', 'Users', 'Settings']

const NAV_ITEMS = [
  { icon: '⊞', label: 'Dashboard' },
  { icon: '⊙', label: 'Analytics' },
  { icon: '◫', label: 'Projects' },
  { icon: '≡', label: 'Users' },
  { icon: '◈', label: 'Settings' },
]

const STATS = [
  { label: 'Total Revenue', value: '$48,295', delta: '+12.5%', up: true },
  { label: 'Active Users', value: '3,842', delta: '+8.2%', up: true },
  { label: 'New Signups', value: '284', delta: '+3.1%', up: true },
  { label: 'Churn Rate', value: '2.4%', delta: '-0.3%', up: false },
]

const TABLE_ROWS = [
  { name: 'Aria Chen', email: 'aria@acme.io', plan: 'Pro', status: 'Active' },
  { name: 'Mateo Rivera', email: 'mateo@co.dev', plan: 'Team', status: 'Active' },
  { name: 'Soren Larsen', email: 'soren@nord.io', plan: 'Starter', status: 'Trial' },
  { name: 'Priya Nair', email: 'priya@labs.ai', plan: 'Pro', status: 'Active' },
]

function DashboardPage() {
  return (
    <div className="saas-main">
      <div className="saas-main__header">
        <div>
          <h1 className="saas-main__title">Dashboard</h1>
          <p className="saas-main__subtitle">Welcome back — here's what's happening.</p>
        </div>
        <button className="saas-btn saas-btn--primary" tabIndex={-1} aria-hidden="true">
          + New Project
        </button>
      </div>

      <div className="saas-stats">
        {STATS.map(stat => (
          <div key={stat.label} className="saas-stat-card">
            <p className="saas-stat-card__label">{stat.label}</p>
            <p className="saas-stat-card__value">{stat.value}</p>
            <p className={`saas-stat-card__delta saas-stat-card__delta--${stat.up ? 'up' : 'down'}`}>
              {stat.delta}
            </p>
          </div>
        ))}
      </div>

      <div className="saas-chart-placeholder">
        <p className="saas-chart-placeholder__label">Revenue Overview</p>
        <div className="saas-chart-bars">
          {[40, 65, 55, 80, 70, 90, 75, 95, 85, 100, 88, 92].map((h, i) => (
            <div key={i} className="saas-chart-bar" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div className="saas-table-section">
        <p className="saas-table-section__heading">Recent Users</p>
        <table className="saas-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Plan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(row => (
              <tr key={row.email}>
                <td>{row.name}</td>
                <td className="saas-table__muted">{row.email}</td>
                <td>{row.plan}</td>
                <td>
                  <span className={`saas-badge saas-badge--${row.status === 'Trial' ? 'trial' : 'active'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersPage() {
  return (
    <div className="saas-main">
      <div className="saas-main__header">
        <h1 className="saas-main__title">Users</h1>
        <button className="saas-btn saas-btn--primary" tabIndex={-1} aria-hidden="true">
          + Invite User
        </button>
      </div>
      <div className="saas-table-section">
        <table className="saas-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Plan</th><th>Status</th></tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(row => (
              <tr key={row.email}>
                <td>{row.name}</td>
                <td className="saas-table__muted">{row.email}</td>
                <td>{row.plan}</td>
                <td>
                  <span className={`saas-badge saas-badge--${row.status === 'Trial' ? 'trial' : 'active'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="saas-main">
      <h1 className="saas-main__title">Settings</h1>
      <div className="saas-settings">
        {['General', 'Team', 'Billing', 'Notifications', 'Security'].map(section => (
          <div key={section} className="saas-settings-row">
            <div>
              <p className="saas-settings-row__title">{section}</p>
              <p className="saas-settings-row__desc">Manage your {section.toLowerCase()} preferences</p>
            </div>
            <button className="saas-btn saas-btn--outline" tabIndex={-1} aria-hidden="true">
              Configure
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

const PAGE_COMPONENTS = [DashboardPage, UsersPage, SettingsPage]

export function SaasLayout({ activePage, onPageChange }: Props) {
  const PageComponent = PAGE_COMPONENTS[activePage] ?? DashboardPage

  return (
    <div className="saas-layout">
      {/* Sidebar */}
      <aside className="saas-sidebar">
        <div className="saas-sidebar__brand">
          <span className="saas-sidebar__logo" aria-hidden="true">◈</span>
          <span className="saas-sidebar__name">Acme</span>
        </div>
        <nav className="saas-sidebar__nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.label}
              className="saas-sidebar__nav-item"
              tabIndex={-1}
              aria-hidden="true"
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="saas-sidebar__user">
          <div className="saas-sidebar__avatar" aria-hidden="true">A</div>
          <div>
            <p className="saas-sidebar__user-name">Admin User</p>
            <p className="saas-sidebar__user-role">Owner</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="saas-content">
        {/* Page tab bar */}
        <div className="layout-tabs" role="tablist" aria-label="Dashboard pages">
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
    </div>
  )
}
