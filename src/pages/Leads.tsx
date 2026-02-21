import type { User } from '../types'

type LeadsPageProps = {
  user: User
}

const leads = [
  {
    name: 'Иван П.',
    source: 'Реферальная ссылка',
    status: 'Ожидает проверки',
    value: '—',
  },
  {
    name: 'Мария К.',
    source: 'Форма заявки',
    status: 'Принят',
    value: '—',
  },
  {
    name: 'Алексей С.',
    source: 'Реферальная ссылка',
    status: 'На связи',
    value: '—',
  },
]

export function LeadsPage({ user }: LeadsPageProps) {
  const levelLabel =
    user.level === 'base' ? 'Базовый' : user.level === 'pro' ? 'Про' : 'Эксперт'

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Лиды</span>
          <h1>Список лидов</h1>
          <p>{levelLabel} уровень: просмотр статусов и карточек.</p>
        </div>
        <button className="primary-button">Добавить лид</button>
      </header>

      <div className="table-card">
        <div className="table-header">
          <span>Клиент</span>
          <span>Источник</span>
          <span>Статус</span>
          <span>Начисление</span>
        </div>
        {leads.map((lead) => (
          <div className="table-row" key={lead.name}>
            <strong>{lead.name}</strong>
            <span>{lead.source}</span>
            <span className="status">{lead.status}</span>
            <span>{lead.value}</span>
          </div>
        ))}
        <div className="table-footer">
          Данные демонстрационные, реальные лиды появятся после интеграции.
        </div>
      </div>

      <section className="grid-2">
        <div className="page-card">
          <h3>Фильтры и теги</h3>
          <p className="muted">
            Готова архитектура для фильтров. Доступ будет расширяться при
            повышении уровня.
          </p>
          <div className="pill-row">
            <span className="pill">Новый</span>
            <span className="pill">В работе</span>
            <span className="pill">Принят</span>
          </div>
        </div>
        <div className="page-card locked">
          <h3>Экспорт лидов</h3>
          <p>Доступно на уровне Про.</p>
          <div className="lock-tag">Требуется уровень Про</div>
        </div>
      </section>
    </div>
  )
}
