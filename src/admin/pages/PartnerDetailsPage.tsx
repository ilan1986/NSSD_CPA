import { Navigate, useParams } from 'react-router-dom'
import { useAdmin } from '../context'
import type { AdminPartnerLevel, AdminPartnerStatus, PartnerExtraFields, PartnerFeatures } from '../types'

const levelOptions: { value: AdminPartnerLevel; label: string }[] = [
  { value: 'base', label: 'Базовый' },
  { value: 'extended', label: 'Расширенный' },
  { value: 'max', label: 'Максимальный' },
]

const featureLabels: Record<keyof PartnerFeatures, string> = {
  advancedReporting: 'Расширенная отчетность',
  bulkLeadUpload: 'Массовая загрузка лидов',
  apiIntegration: 'API-интеграция',
  multiReferralLinks: 'Несколько реферальных ссылок',
  customRewardModel: 'Индивидуальная модель вознаграждения',
}

const extraFieldLabels: Record<keyof PartnerExtraFields, string> = {
  companyName: 'Название компании',
  trafficSource: 'Источник трафика',
  telegram: 'Telegram',
  contractNumber: 'Номер договора',
}

export function PartnerDetailsPage() {
  const { partnerId } = useParams()
  const {
    data,
    setPartnerComment,
    setPartnerFeature,
    setPartnerExtraField,
    setPartnerLevel,
    setPartnerStatus,
    setPartnerRewardModel,
    setPartnerRewardOverride,
  } = useAdmin()

  const partner = data.partners.find((item) => item.id === partnerId)

  if (!partner) {
    return <Navigate to="/admin/partners" replace />
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Карточка партнера</span>
          <h1>{partner.name}</h1>
          <p>Через эту карточку определяется, какие функции видит партнер в личном кабинете.</p>
        </div>
      </header>

      <section className="page-card">
        <h3>Общая информация</h3>
        <div className="details-list">
          <div>
            <span className="muted">Контакты</span>
            <strong>{partner.contact}</strong>
          </div>
          <div>
            <span className="muted">Дата регистрации</span>
            <strong>{partner.registeredAt}</strong>
          </div>
          <label className="field">
            Комментарий администратора
            <textarea
              rows={4}
              value={partner.adminComment}
              onChange={(event) => setPartnerComment(partner.id, event.target.value)}
            />
          </label>
        </div>
      </section>

      <section className="grid-2">
        <div className="page-card">
          <h3>Уровень партнера</h3>
          <div className="toggle-grid">
            {levelOptions.map((option) => (
              <label className="switch-row" key={option.value}>
                <input
                  type="radio"
                  name="level"
                  checked={partner.level === option.value}
                  onChange={() => setPartnerLevel(partner.id, option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>

          <label className="field compact-field">
            Статус
            <select
              value={partner.status}
              onChange={(event) => setPartnerStatus(partner.id, event.target.value as AdminPartnerStatus)}
            >
              <option value="active">Активен</option>
              <option value="blocked">Заблокирован</option>
            </select>
          </label>
        </div>

        <div className="page-card">
          <h3>Модель вознаграждения</h3>
          <label className="field compact-field">
            Модель
            <select
              value={partner.rewardModelId}
              onChange={(event) => setPartnerRewardModel(partner.id, event.target.value)}
            >
              {data.rewardModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.amountPerLead} ₽)
                </option>
              ))}
            </select>
          </label>

          <label className="field compact-field">
            Переопределение суммы вручную
            <input
              type="number"
              value={partner.rewardOverride ?? ''}
              onChange={(event) => {
                const raw = event.target.value
                setPartnerRewardOverride(partner.id, raw ? Number(raw) : null)
              }}
              placeholder="Например: 5200"
            />
          </label>
        </div>
      </section>

      <section className="page-card">
        <h3>Управление функционалом</h3>
        <div className="toggle-grid">
          {Object.keys(featureLabels).map((rawKey) => {
            const key = rawKey as keyof PartnerFeatures
            return (
              <label key={key} className="switch-row">
                <input
                  type="checkbox"
                  checked={partner.features[key]}
                  onChange={(event) => setPartnerFeature(partner.id, key, event.target.checked)}
                />
                {featureLabels[key]}
              </label>
            )
          })}
        </div>
      </section>

      <section className="page-card">
        <h3>Дополнительные поля профиля</h3>
        <p className="muted">Эти поля отсутствуют при регистрации и появляются только после включения.</p>
        <div className="toggle-grid">
          {Object.keys(extraFieldLabels).map((rawKey) => {
            const key = rawKey as keyof PartnerExtraFields
            return (
              <label key={key} className="switch-row">
                <input
                  type="checkbox"
                  checked={partner.extraFields[key]}
                  onChange={(event) => setPartnerExtraField(partner.id, key, event.target.checked)}
                />
                {extraFieldLabels[key]}
              </label>
            )
          })}
        </div>
      </section>
    </div>
  )
}
