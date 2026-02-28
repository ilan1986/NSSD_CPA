import { useState } from 'react'
import type { User } from '../types'

type ReferralPageProps = {
  user: User
}

type PartnerLink = {
  id: string
  label: string
  value: string
}

export function ReferralPage({ user }: ReferralPageProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const links: PartnerLink[] = [
    {
      id: 'main',
      label: 'Основная реферальная ссылка',
      value: `https://partner.bankrotstvo.ru/ref/${user.id.slice(0, 8)}`,
    },
  ]

  async function handleCopy(link: PartnerLink) {
    try {
      await navigator.clipboard.writeText(link.value)
      setCopiedId(link.id)
      setTimeout(() => setCopiedId(null), 1800)
    } catch {
      setCopiedId(null)
    }
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Реферальная ссылка</span>
          <h1>Привлечение лидов</h1>
          <p>Используйте ссылку в рекламе и на своих площадках для передачи лидов.</p>
        </div>
      </header>

      <section className="page-card links-list">
        {links.map((link) => (
          <article key={link.id} className="link-item">
            <div>
              <h3>{link.label}</h3>
              <div className="copy-row">
                <input type="text" readOnly value={link.value} />
                <button className="secondary-button" onClick={() => handleCopy(link)}>
                  Скопировать
                </button>
              </div>
              {copiedId === link.id ? <div className="form-info">Ссылка скопирована</div> : null}
            </div>
          </article>
        ))}
      </section>

      <section className="grid-2">
        <div className="page-card">
          <h3>Правила размещения</h3>
          <ul className="steps">
            <li>Используйте корректные формулировки о процедуре банкротства.</li>
            <li>Проверяйте актуальность информации перед публикацией.</li>
            <li>Не обещайте гарантированный результат без проверки клиента.</li>
          </ul>
        </div>
        <div className="page-card locked">
          <h3>Готовность к расширению</h3>
          <p>В будущем вам будут доступны дополнительные ссылки, интеграции и расширенная аналитика</p>
          <div className="lock-tag">Расширяемо без переделки экрана</div>
        </div>
      </section>
    </div>
  )
}
