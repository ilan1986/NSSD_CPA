import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { isSupabaseEnabled } from '../lib/supabase'
import { createPartner } from '../services/partners'
import type { User } from '../types'

type RegisterPageProps = {
  auth: {
    login: (user: User) => void
  }
}

export function RegisterPage({ auth }: RegisterPageProps) {
  const navigate = useNavigate()
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const isValid = useMemo(
    () => contact.trim().length > 3 && password.trim().length >= 6 && agree,
    [contact, password, agree],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) {
      setError('Заполните обязательные поля и подтвердите согласие с условиями')
      return
    }

    const nextUser: User = {
      id: crypto.randomUUID(),
      contact: contact.trim(),
      level: 'base',
      createdAt: new Date().toISOString(),
    }

    auth.login(nextUser)

    if (isSupabaseEnabled) {
      const result = await createPartner(nextUser)
      if (!result.ok) {
        setInfo('Профиль сохранен локально. Запись в БД будет повторена после настройки сервера.')
      }
    }

    navigate('/app/home')
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="eyebrow">Регистрация</span>
        <h2>Создайте аккаунт партнера</h2>
        <p>Все новые партнеры получают базовый уровень доступа.</p>
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
        <label className="checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={(event) => setAgree(event.target.checked)}
          />
          Согласен с условиями партнерской программы
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        {info ? <div className="form-info">{info}</div> : null}
        <button className="primary-button" type="submit" disabled={!isValid}>
          Создать аккаунт
        </button>
      </form>
      <div className="auth-footer">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </div>
    </div>
  )
}
