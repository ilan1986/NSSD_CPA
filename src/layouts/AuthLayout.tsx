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
            <span>Партнёрская платформа</span>
            <strong>Банкротство физлиц</strong>
          </div>
        </div>
        <h1>Личный кабинет партнёра</h1>
        <p>
          Отправляйте лиды, отслеживайте статус и выплаты. Все партнёры
          стартуют с базового уровня и могут повышаться по мере результатов.
        </p>
        <div className="hero-cards">
          <div className="hero-card">
            <span className="hero-label">Быстрый старт</span>
            <strong>3 минуты на регистрацию</strong>
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
        <div className="hero-note">
          MVP • Этап 1 • UI и сценарии
        </div>
      </section>
      <section className="auth-panel">{children}</section>
    </div>
  )
}
