import type { User } from '../types'

type HomePageProps = {
  user: User
}

const stats = [
  { label: 'Лиды', value: '0', note: 'ожидают загрузки' },
  { label: 'Принято', value: '0', note: 'после проверки' },
  { label: 'Начислено', value: '0 ₽', note: 'по итогам месяца' },
]

export function HomePage({ user }: HomePageProps) {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Главная</span>
          <h1>Добро пожаловать, партнёр</h1>
          <p>
            Здесь вы сможете управлять лидами, отслеживать статусы и получать
            выплаты. Сейчас доступен базовый уровень.
          </p>
        </div>
        <div className="page-card highlight">
          <span className="badge">Профиль</span>
          <h3>{user.contact}</h3>
          <p>Уровень: Базовый</p>
          <button className="secondary-button">Заполнить карточку партнёра</button>
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
          <h3>Как начать работать</h3>
          <ul className="steps">
            <li>Скопируйте вашу реферальную ссылку</li>
            <li>Отправляйте лиды через форму или API</li>
            <li>Отслеживайте статус каждого лида</li>
            <li>Получайте выплаты по итогам периода</li>
          </ul>
        </div>
        <div className="page-card">
          <h3>Уровни партнёров</h3>
          <div className="levels">
            <div className="level-pill active">Базовый</div>
            <div className="level-pill">Про</div>
            <div className="level-pill">Эксперт</div>
          </div>
          <p className="muted">
            Продвинутые функции и повышенные ставки будут доступны после
            подтверждения объёма лидов.
          </p>
          <div className="lock-card">
            <span>Расширенная аналитика</span>
            <span className="lock-tag">Требуется уровень Про</span>
          </div>
        </div>
      </section>
    </div>
  )
}
