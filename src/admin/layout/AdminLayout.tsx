import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../context'

const adminMenu = [
  { to: '/admin/partners', label: 'Партнеры' },
  { to: '/admin/leads', label: 'Лиды' },
  { to: '/admin/rewards', label: 'Вознаграждения' },
  { to: '/admin/users', label: 'Пользователи' },
  { to: '/admin/settings', label: 'Настройки' },
]

const operatorMenu = [{ to: '/admin/leads', label: 'Лиды' }]

export function AdminLayout() {
  const { adminUser, logout } = useAdmin()

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />
  }

  const menu = adminUser.role === 'admin' ? adminMenu : operatorMenu

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div>
          <strong>NSSD CPA Admin</strong>
        </div>
        <div className="admin-user-meta">
          <span>{adminUser.name}</span>
          <span className="tag">{adminUser.role === 'admin' ? 'Администратор' : 'Оператор'}</span>
          <button className="ghost-button" onClick={logout}>
            Выйти
          </button>
        </div>
      </header>

      <div className="admin-content-wrap">
        <aside className="admin-sidebar">
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
        </aside>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
