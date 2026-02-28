import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdmin } from '../context'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { adminUser, login } = useAdmin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (adminUser) {
    return <Navigate to={adminUser.role === 'admin' ? '/admin/partners' : '/admin/leads'} replace />
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const user = login(email, password)
    if (!user) {
      setError('Введите email и пароль для входа')
      return
    }
    navigate(user.role === 'admin' ? '/admin/partners' : '/admin/leads')
  }

  return (
    <div className="auth-layout admin-auth-layout">
      <section className="auth-hero">
        <h1>Вход в административную панель</h1>
        <p>Администраторы управляют партнерами и настройками. Операторы работают только с лидами.</p>
        <div className="hero-note">Демо: если в email есть слово operator, вход будет как Оператор</div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-header">
            <span className="eyebrow">Admin Login</span>
            <h2>Авторизация</h2>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="field">
              Email
              <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@test.ru" />
            </label>
            <label className="field">
              Пароль
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Введите пароль"
              />
            </label>
            {error ? <div className="form-error">{error}</div> : null}
            <button className="primary-button" type="submit">
              Войти
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

