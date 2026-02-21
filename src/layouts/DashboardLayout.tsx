import { NavLink, Outlet } from 'react-router-dom'
import type { User } from '../types'

type DashboardLayoutProps = {
  user: User
  onLogout: () => void
}

const menu = [
  { to: '/app/home', label: 'Главная' },
  { to: '/app/leads', label: 'Лиды' },
  { to: '/app/education', label: 'Обучение' },
  { to: '/app/referral', label: 'Реферальная ссылка' },
  { to: '/app/payouts', label: 'Выплаты' },
  { to: '/app/support', label: 'Поддержка' },
]

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="brand compact">
            <div className="brand-mark">CPA</div>
            <div className="brand-text">
              <span>Личный кабинет</span>
              <strong>Партнёр</strong>
            </div>
          </div>
          <div className="level-card">
            <span className="badge">Уровень</span>
            <strong>Базовый</strong>
            <p>Доступ к ключевым разделам и аналитике.</p>
            <div className="level-track">
              <div className="level-dot active">Базовый</div>
              <div className="level-dot">Про</div>
              <div className="level-dot">Эксперт</div>
            </div>
          </div>
        </div>
        <nav className="menu">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'menu-link active' : 'menu-link'
              }
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
              <small>Партнёр с {new Date(user.createdAt).toLocaleDateString()}</small>
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
