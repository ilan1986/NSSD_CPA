import type { User } from '../types'

type ReferralPageProps = {
  user: User
}

export function ReferralPage({ user }: ReferralPageProps) {
  const referralLink = `https://partner.bankrotstvo.ru/ref/${user.id.slice(0, 6)}`

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Реферальная ссылка</span>
          <h1>Привлекайте клиентов</h1>
          <p>Используйте ссылку и отслеживайте источник лидов.</p>
        </div>
      </header>

      <section className="page-card">
        <h3>Ваша ссылка</h3>
        <div className="copy-row">
          <input type="text" readOnly value={referralLink} />
          <button className="secondary-button">Скопировать</button>
        </div>
        <p className="muted">Установите ссылку на сайт, в соцсети или рекламу.</p>
      </section>

      <section className="grid-2">
        <div className="page-card">
          <h3>Правила размещения</h3>
          <ul className="steps">
            <li>Указывайте корректную информацию о процедуре.</li>
            <li>Не используйте вводящие в заблуждение обещания.</li>
            <li>Соблюдайте требования рекламных площадок.</li>
          </ul>
        </div>
        <div className="page-card locked">
          <h3>Промо-материалы</h3>
          <p>Готовые баннеры и тексты будут доступны позже.</p>
          <div className="lock-tag">Требуется уровень Про</div>
        </div>
      </section>
    </div>
  )
}
