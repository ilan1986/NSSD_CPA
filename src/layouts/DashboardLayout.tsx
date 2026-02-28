import { NavLink, Outlet } from 'react-router-dom'
import type { AdminPartnerLevel, PartnerFeatures } from '../admin/types'
import type { User } from '../types'

type DashboardLayoutProps = {
  user: User
  onLogout: () => void
  partnerLevel: AdminPartnerLevel
  partnerStatus: 'active' | 'blocked'
  features: PartnerFeatures
}

function levelLabel(level: AdminPartnerLevel) {
  if (level === 'base') return 'Базовый'
  if (level === 'extended') return 'Расширенный'
  return 'Максимальный'
}

export function DashboardLayout({
  user,
  onLogout,
  partnerLevel,
  partnerStatus,
  features,
}: DashboardLayoutProps) {
  const menu = [
    { to: '/app/home', label: 'Главная' },
    { to: '/app/leads', label: 'Лиды' },
    { to: '/app/education', label: 'Обучение' },
    { to: '/app/referral', label: 'Реферальная ссылка' },
    { to: '/app/payouts', label: 'Выплаты' },
    ...(features.advancedReporting ? [{ to: '/app/reports', label: 'Отчеты' }] : []),
    ...(features.apiIntegration ? [{ to: '/app/api', label: 'Интеграция / API' }] : []),
    { to: '/app/support', label: 'Поддержка' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand compact">
            <div className="brand-mark">CPA</div>
            <div className="brand-text">
              <span>Личный кабинет</span>
              <strong>Партнер</strong>
            </div>
          </div>

          <div className="level-card">
            <span className="badge">Уровень</span>
            <strong>{levelLabel(partnerLevel)}</strong>
            <p>Статус: {partnerStatus === 'active' ? 'Активен' : 'Заблокирован'}</p>
            <div className="level-track">
              <div className={`level-dot ${partnerLevel === 'base' ? 'active' : ''}`}>Базовый</div>
              <div className={`level-dot ${partnerLevel === 'extended' ? 'active' : ''}`}>Расширенный</div>
              <div className={`level-dot ${partnerLevel === 'max' ? 'active' : ''}`}>Максимальный</div>
            </div>
          </div>
        </div>

        <nav className="menu">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'menu-link active' : 'menu-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <div className="user-avatar">{user.contact.charAt(0).toUpperCase()}</div>
            <div className="user-meta">
              <span>{user.contact}</span>
              <small>Партнер с {new Date(user.createdAt).toLocaleDateString('ru-RU')}</small>
            </div>
          </div>
          <button className="ghost-button" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

      <NavLink className="support-fab" to="/app/support">
        Написать в поддержку
      </NavLink>
    </div>
  )
}
