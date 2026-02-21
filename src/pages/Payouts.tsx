import type { User } from '../types'

type PayoutsPageProps = {
  user: User
}

export function PayoutsPage({ user }: PayoutsPageProps) {
  const levelLabel =
    user.level === 'base' ? 'Базовый' : user.level === 'pro' ? 'Про' : 'Эксперт'

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Выплаты</span>
          <h1>История начислений</h1>
          <p>Уровень доступа: {levelLabel}. Здесь будет история выплат.</p>
        </div>
        <button className="primary-button">Запросить выплату</button>
      </header>

      <div className="table-card">
        <div className="table-header">
          <span>Период</span>
          <span>Сумма</span>
          <span>Статус</span>
          <span>Комментарий</span>
        </div>
        <div className="table-row">
          <strong>Февраль 2026</strong>
          <span>—</span>
          <span className="status muted">Ожидает данных</span>
          <span>Начисления появятся после первых лидов</span>
        </div>
        <div className="table-footer">
          Данные демонстрационные, реальные выплаты будут после подключения
          биллинга.
        </div>
      </div>

      <section className="grid-2">
        <div className="page-card">
          <h3>График выплат</h3>
          <p className="muted">
            Выплаты проводятся 1 и 15 числа каждого месяца.
          </p>
          <div className="pill-row">
            <span className="pill">Минимум 10 000 ₽</span>
            <span className="pill">Договор оферты</span>
          </div>
        </div>
        <div className="page-card locked">
          <h3>Автовыплаты</h3>
          <p>Планируется для уровней Про и Эксперт.</p>
          <div className="lock-tag">Требуется уровень Про</div>
        </div>
      </section>
    </div>
  )
}
