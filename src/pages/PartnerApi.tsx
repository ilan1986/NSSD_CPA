import { useState } from 'react'
import { SupportCta } from '../components/SupportCta'

type PartnerApiPageProps = {
  enabled: boolean
  apiKey: string | null
  apiKeyActive: boolean
  supportLink: string
}

function maskApiKey(value: string) {
  if (value.length < 8) return value
  return `${value.slice(0, 4)}••••••${value.slice(-4)}`
}

export function PartnerApiPage({ enabled, apiKey, apiKeyActive, supportLink }: PartnerApiPageProps) {
  const [revealed, setRevealed] = useState(false)

  if (!enabled) {
    return (
      <div className="page">
        <header className="page-header compact">
          <div>
            <span className="eyebrow">Интеграция API</span>
            <h1>API-доступ недоступен</h1>
            <p>API-доступ доступен по запросу через поддержку.</p>
          </div>
        </header>
        <SupportCta message="Для подключения API обратитесь в поддержку" href={supportLink} />
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Интеграция API</span>
          <h1>API для автоматической передачи лидов</h1>
          <p>Используйте API для передачи лидов автоматически.</p>
        </div>
      </header>

      <section className="page-card">
        <h3>API-ключ</h3>
        {apiKey && apiKeyActive ? (
          <>
            <div className="copy-row">
              <input readOnly value={revealed ? apiKey : maskApiKey(apiKey)} />
              <button className="secondary-button" onClick={() => setRevealed((prev) => !prev)}>
                {revealed ? 'Скрыть' : 'Показать'}
              </button>
            </div>
            <p className="muted">Ключ активен. Используйте его для интеграции с вашим CRM/сайтом.</p>
          </>
        ) : (
          <div className="form-info">API включен, но ключ еще не создан. Обратитесь в поддержку.</div>
        )}
      </section>
    </div>
  )
}
