import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context'
import type { AdminRole } from '../types'

export function UsersPage() {
  const { adminUser, data, addOperator, setOperatorRole, setOperatorStatus } = useAdmin()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminRole>('operator')

  if (adminUser?.role !== 'admin') {
    return <Navigate to="/admin/leads" replace />
  }

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !email.trim()) return
    addOperator(name.trim(), email.trim(), role)
    setName('')
    setEmail('')
    setRole('operator')
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Пользователи</span>
          <h1>Операторы и доступы</h1>
          <p>Создание операторов, назначение роли и блокировка доступа.</p>
        </div>
      </header>

      <section className="page-card">
        <h3>Создать оператора</h3>
        <form className="filters-row" onSubmit={handleCreate}>
          <label className="field compact-field">
            Имя
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="field compact-field">
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field compact-field">
            Роль
            <select value={role} onChange={(event) => setRole(event.target.value as AdminRole)}>
              <option value="operator">Оператор</option>
              <option value="admin">Администратор</option>
            </select>
          </label>
          <button className="primary-button" type="submit">
            Создать
          </button>
        </form>
      </section>

      <div className="table-card">
        <div className="table-header admin-users-table">
          <span>Имя</span>
          <span>Email</span>
          <span>Роль</span>
          <span>Статус</span>
          <span>Действия</span>
        </div>
        {data.operators.map((operator) => (
          <div className="table-row admin-users-table" key={operator.id}>
            <strong>{operator.name}</strong>
            <span>{operator.email}</span>
            <select
              value={operator.role}
              onChange={(event) => setOperatorRole(operator.id, event.target.value as AdminRole)}
            >
              <option value="operator">Оператор</option>
              <option value="admin">Администратор</option>
            </select>
            <span className="status">{operator.status === 'active' ? 'Активен' : 'Заблокирован'}</span>
            <button
              className="secondary-button"
              onClick={() =>
                setOperatorStatus(operator.id, operator.status === 'active' ? 'blocked' : 'active')
              }
            >
              {operator.status === 'active' ? 'Заблокировать' : 'Разблокировать'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
