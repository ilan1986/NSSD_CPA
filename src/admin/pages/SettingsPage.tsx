import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context'

export function SettingsPage() {
  const { adminUser, data, setSupportLink } = useAdmin()

  if (adminUser?.role !== 'admin') {
    return <Navigate to="/admin/leads" replace />
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Настройки</span>
          <h1>Базовые настройки платформы</h1>
          <p>Минимальные параметры, доступные для управления без разработчика.</p>
        </div>
      </header>

      <section className="page-card">
        <h3>Информация о платформе</h3>
        <div className="details-list">
          <div>
            <span className="muted">Название</span>
            <strong>{data.settings.platformName}</strong>
          </div>
          <div>
            <span className="muted">Описание</span>
            <strong>{data.settings.platformNote}</strong>
          </div>
        </div>
      </section>

      <section className="page-card">
        <h3>Контакт поддержки</h3>
        <label className="field">
          Ссылка
          <input
            type="url"
            value={data.settings.supportLink}
            onChange={(event) => setSupportLink(event.target.value)}
          />
        </label>
      </section>
    </div>
  )
}
