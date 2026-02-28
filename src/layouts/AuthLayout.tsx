import type { ReactNode } from 'react'

type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <div className="brand">
          <div className="brand-mark">CPA</div>
          <div className="brand-text">
            <span>Партнерская платформа</span>
            <strong>Банкротство физлиц</strong>
          </div>
        </div>
        <h1>Личный кабинет партнера</h1>
        <p>
          Отправляйте лиды, отслеживайте статусы и выплаты. Все партнеры стартуют с базового
          уровня и могут расширять доступ по мере результатов.
        </p>
        <div className="hero-cards">
          <div className="hero-card">
            <span className="hero-label">Быстрый старт</span>
            <strong>Регистрация за 3 минуты</strong>
          </div>
          <div className="hero-card">
            <span className="hero-label">Прозрачность</span>
            <strong>Статусы лидов и начисления</strong>
          </div>
          <div className="hero-card">
            <span className="hero-label">Поддержка</span>
            <strong>Всегда на связи</strong>
          </div>
        </div>
        <div className="hero-note">MVP • Неделя 2 • Пользовательский сценарий</div>
      </section>
      <section className="auth-panel">{children}</section>
    </div>
  )
}
