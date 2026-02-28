import type { User } from '../types'

type HomePageProps = {
  user: User
}

const stats = [
  { label: 'Лиды', value: '12', note: 'в работе и верификации' },
  { label: 'Принято', value: '4', note: 'подтвержденные заявки' },
  { label: 'Начислено', value: '4 500 ₽', note: 'тестовые данные' },
]

export function HomePage({ user }: HomePageProps) {
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
          <h3>{user.contact}</h3>
          <p>Текущий уровень: Базовый</p>
          <button className="secondary-button">Заполнить карточку партнера</button>
        </div>
      </header>

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
          <h3>Расширение функций</h3>
          <p className="muted">
            Архитектура подготовлена для API, массовой загрузки и расширенной аналитики без переделки
            текущих экранов.
          </p>
          <div className="lock-card">
            <span>API и массовая загрузка</span>
            <span className="lock-tag">Требуется уровень Про</span>
          </div>
        </div>
      </section>
    </div>
  )
}
