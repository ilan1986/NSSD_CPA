import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAdmin } from '../context'
import type { AdminPartnerLevel, AdminPartnerStatus } from '../types'

const levelLabel: Record<AdminPartnerLevel, string> = {
  base: 'Базовый',
  extended: 'Расширенный',
  max: 'Максимальный',
}

const statusLabel: Record<AdminPartnerStatus, string> = {
  active: 'Активен',
  blocked: 'Заблокирован',
}

export function PartnersPage() {
  const { adminUser, data } = useAdmin()
  const [levelFilter, setLevelFilter] = useState<'all' | AdminPartnerLevel>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | AdminPartnerStatus>('all')

  if (adminUser?.role !== 'admin') {
    return <Navigate to="/admin/leads" replace />
  }

  const partners = useMemo(
    () =>
      data.partners.filter((partner) => {
        if (levelFilter !== 'all' && partner.level !== levelFilter) return false
        if (statusFilter !== 'all' && partner.status !== statusFilter) return false
        return true
      }),
    [data.partners, levelFilter, statusFilter],
  )

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Партнеры</span>
          <h1>Управление партнерами</h1>
          <p>Выбирайте партнера и настройте уровень, функции и модель вознаграждения.</p>
        </div>
      </header>

      <section className="page-card filters-row">
        <label className="field compact-field">
          Уровень
          <select
            value={levelFilter}
            onChange={(event) => setLevelFilter(event.target.value as 'all' | AdminPartnerLevel)}
          >
            <option value="all">Все</option>
            <option value="base">Базовый</option>
            <option value="extended">Расширенный</option>
            <option value="max">Максимальный</option>
          </select>
        </label>

        <label className="field compact-field">
          Статус
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | AdminPartnerStatus)}
          >
            <option value="all">Все</option>
            <option value="active">Активен</option>
            <option value="blocked">Заблокирован</option>
          </select>
        </label>
      </section>

      <div className="table-card">
        <div className="table-header admin-partners-table">
          <span>Дата регистрации</span>
          <span>Имя партнера</span>
          <span>Контакты</span>
          <span>Уровень</span>
          <span>Статус</span>
          <span>Действие</span>
        </div>

        {partners.map((partner) => (
          <div key={partner.id} className="table-row admin-partners-table">
            <span>{partner.registeredAt}</span>
            <strong>{partner.name}</strong>
            <span>{partner.contact}</span>
            <span>{levelLabel[partner.level]}</span>
            <span className="status">{statusLabel[partner.status]}</span>
            <Link className="secondary-button" to={`/admin/partners/${partner.id}`}>
              Открыть
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
