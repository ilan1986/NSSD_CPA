import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../types'
import { loadUser } from '../utils/auth'

type LoginPageProps = {
  auth: {
    login: (user: User) => void
  }
}

export function LoginPage({ auth }: LoginPageProps) {
  const navigate = useNavigate()
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const isValid = useMemo(
    () => contact.trim().length > 3 && password.trim().length >= 6,
    [contact, password],
  )

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) {
      setError('Введите корректный email или телефон и пароль')
      return
    }

    const existing = loadUser()
    const nextUser: User =
      existing && existing.contact === contact.trim()
        ? existing
        : {
            id: crypto.randomUUID(),
            contact: contact.trim(),
            level: 'base',
            createdAt: new Date().toISOString(),
          }

    auth.login(nextUser)
    navigate('/app/home')
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="eyebrow">Вход</span>
        <h2>Вход в кабинет партнера</h2>
        <p>Введите данные аккаунта, чтобы продолжить работу с лидами и выплатами.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          Email или телефон
          <input
            type="text"
            placeholder="partner@email.ru или +7 900 000-00-00"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
          />
        </label>
        <label className="field">
          Пароль
          <input
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        <button className="primary-button" type="submit" disabled={!isValid}>
          Войти
        </button>
      </form>
      <div className="auth-footer">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </div>
    </div>
  )
}
