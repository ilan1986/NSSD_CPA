import type { User } from '../types'

type SupportPageProps = {
  user: User
}

export function SupportPage({ user }: SupportPageProps) {
  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Поддержка</span>
          <h1>Мы рядом</h1>
          <p>Оставьте заявку, и менеджер свяжется с вами.</p>
        </div>
      </header>

      <section className="grid-2">
        <div className="page-card">
          <h3>Новая заявка</h3>
          <form className="support-form">
            <label className="field">
              Тема
              <input type="text" placeholder="Например: вопрос по лидам" />
            </label>
            <label className="field">
              Сообщение
              <textarea rows={5} placeholder="Опишите запрос" />
            </label>
            <button className="primary-button" type="button">
              Отправить
            </button>
          </form>
        </div>
        <div className="page-card highlight">
          <span className="badge">Контакты</span>
          <h3>Персональный менеджер</h3>
          <p>Ответим в течение рабочего дня.</p>
          <div className="contact-list">
            <div>
              <span className="label">Email</span>
              <strong>support@bankrotstvo.ru</strong>
            </div>
            <div>
              <span className="label">Телефон</span>
              <strong>8 800 000-00-00</strong>
            </div>
          </div>
          <div className="muted">Текущий партнёр: {user.contact}</div>
        </div>
      </section>
    </div>
  )
}
