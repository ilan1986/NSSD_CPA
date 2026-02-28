import type { AdminPartnerLevel, PartnerFeatures } from '../admin/types'
import type { User } from '../types'

type HomePageProps = {
  user: User
  partnerName: string | null
  partnerLevel: AdminPartnerLevel
  partnerStatus: 'active' | 'blocked'
  features: PartnerFeatures
}

function levelLabel(level: AdminPartnerLevel) {
  if (level === 'base') return 'Базовый'
  if (level === 'extended') return 'Расширенный'
  return 'Максимальный'
}

export function HomePage({ user, partnerName, partnerLevel, partnerStatus, features }: HomePageProps) {
  const stats = [
    { label: 'Лиды', value: '12', note: 'в работе и верификации' },
    { label: 'Принято', value: '4', note: 'подтвержденные заявки' },
    { label: 'Начислено', value: '4 500 ₽', note: 'тестовые данные' },
  ]

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Главная</span>
          <h1>Рабочий сценарий партнера</h1>
          <p>
            Передавайте лиды, контролируйте статусы, проходите обучение и отслеживайте доход в одном
            интерфейсе.
          </p>
        </div>
        <div className="page-card highlight">
          <span className="badge">Профиль</span>
          <h3>{partnerName ?? user.contact}</h3>
          <p>Текущий уровень: {levelLabel(partnerLevel)}</p>
          <p>Статус: {partnerStatus === 'active' ? 'Активен' : 'Заблокирован'}</p>
          <button className="secondary-button">Заполнить карточку партнера</button>
        </div>
      </header>

      {partnerStatus === 'blocked' ? (
        <div className="form-error">Доступ ограничен администратором. Обратитесь в поддержку.</div>
      ) : null}

      <section className="stats-grid">
        {stats.map((item) => (
          <div key={item.label} className="stat-card">
            <span className="stat-label">{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.note}</small>
          </div>
        ))}
      </section>

      <section className="grid-2">
        <div className="page-card">
          <h3>Как партнер зарабатывает</h3>
          <ul className="steps">
            <li>Добавляет лид через форму или реферальную ссылку.</li>
            <li>Отслеживает статус: новый, в работе, принят или отклонен.</li>
            <li>По принятым лидам получает начисления в разделе выплат.</li>
            <li>Подает запрос на вывод при достаточном балансе.</li>
          </ul>
        </div>
        <div className="page-card">
          <h3>Доступные функции</h3>
          <div className="toggle-grid">
            <div className="switch-row">Расширенная отчетность: {features.advancedReporting ? 'Включено' : 'Выключено'}</div>
            <div className="switch-row">Массовая загрузка лидов: {features.bulkLeadUpload ? 'Включено' : 'Выключено'}</div>
            <div className="switch-row">API-интеграция: {features.apiIntegration ? 'Включено' : 'Выключено'}</div>
            <div className="switch-row">Несколько ссылок: {features.multiReferralLinks ? 'Включено' : 'Выключено'}</div>
          </div>
        </div>
      </section>
    </div>
  )
}
