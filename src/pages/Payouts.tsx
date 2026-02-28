import { SupportCta } from '../components/SupportCta'
import type { User } from '../types'

type PayoutsPageProps = {
  user: User
}

type Accrual = {
  id: string
  date: string
  lead: string
  status: 'Начислено' | 'Ожидает' | 'Отклонено'
  amount: number
}

const accruals: Accrual[] = [
  { id: 'A-1', date: '2026-02-26', lead: 'Елена Котова', status: 'Начислено', amount: 4500 },
  { id: 'A-2', date: '2026-02-28', lead: 'Мария Смирнова', status: 'Ожидает', amount: 0 },
  { id: 'A-3', date: '2026-03-01', lead: 'Иван Петров', status: 'Отклонено', amount: 0 },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'
}

export function PayoutsPage({ user }: PayoutsPageProps) {
  const levelLabel = user.level === 'base' ? 'Базовый' : user.level === 'pro' ? 'Про' : 'Эксперт'
  const currentBalance = accruals
    .filter((item) => item.status === 'Начислено')
    .reduce((sum, item) => sum + item.amount, 0)
  const availableToWithdraw = currentBalance >= 10000 ? currentBalance : 0

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Выплаты</span>
          <h1>Доход и выплаты</h1>
          <p>Уровень доступа: {levelLabel}. Здесь отражаются начисления по лидам и доступный вывод.</p>
        </div>
        <div className="balance-cards">
          <div className="stat-card">
            <span className="stat-label">Текущий баланс</span>
            <strong>{formatMoney(currentBalance)}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Доступно к выводу</span>
            <strong>{formatMoney(availableToWithdraw)}</strong>
          </div>
        </div>
      </header>

      <section className="page-card">
        <div className="card-actions-top">
          <h3>Запрос выплаты</h3>
          <button className="primary-button" disabled={availableToWithdraw === 0}>
            Запросить выплату
          </button>
        </div>
        {availableToWithdraw === 0 ? (
          <div className="form-error">Недостаточно средств для вывода</div>
        ) : (
          <div className="form-info">Средства доступны. После запроса выплата уйдет в обработку.</div>
        )}
      </section>

      <div className="table-card">
        <div className="table-header payouts-table">
          <span>Дата</span>
          <span>Лид</span>
          <span>Статус</span>
          <span>Сумма</span>
        </div>
        {accruals.map((item) => (
          <div className="table-row payouts-table" key={item.id}>
            <span>{item.date}</span>
            <strong>{item.lead}</strong>
            <span className="status">{item.status}</span>
            <span>{formatMoney(item.amount)}</span>
          </div>
        ))}
      </div>

      <section className="grid-2">
        <SupportCta />
        <div className="page-card locked">
          <h3>Будущие расширения</h3>
          <p>Автовыплаты, API и детальная финансовая аналитика будут доступны позже.</p>
          <div className="lock-tag">Требуется уровень Про</div>
        </div>
      </section>
    </div>
  )
}
