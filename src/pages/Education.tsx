import type { User } from '../types'

type EducationPageProps = {
  user: User
}

const modules = [
  {
    title: 'Как работать с лидами',
    description: 'Базовые сценарии и правила обработки.',
    status: 'Доступно',
  },
  {
    title: 'Скрипты общения',
    description: 'Как повышать конверсию на первом касании.',
    status: 'Доступно',
  },
  {
    title: 'Продвинутые воронки',
    description: 'Доступно после повышения уровня.',
    status: 'Скоро',
  },
]

export function EducationPage({ user }: EducationPageProps) {
  const levelLabel =
    user.level === 'base' ? 'Базовый' : user.level === 'pro' ? 'Про' : 'Эксперт'

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Обучение</span>
          <h1>Материалы для партнёров</h1>
          <p>Ваш уровень: {levelLabel}. Часть модулей откроется позже.</p>
        </div>
        <div className="page-card highlight">
          <span className="badge">Прогресс</span>
          <h3>0% пройдено</h3>
          <p>Начните с базовых модулей.</p>
        </div>
      </header>

      <div className="card-grid">
        {modules.map((item) => (
          <div
            key={item.title}
            className={`page-card ${item.status !== 'Доступно' ? 'locked' : ''}`}
          >
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <div className="tag-row">
              <span className="tag">{item.status}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="page-card">
        <h3>Сессии с куратором</h3>
        <p className="muted">
          Персональные разборы доступны после подтверждения уровня Про.
        </p>
        <button className="secondary-button">Запросить консультацию</button>
      </section>
    </div>
  )
}
