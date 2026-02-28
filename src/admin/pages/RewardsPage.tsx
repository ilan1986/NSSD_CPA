import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context'

export function RewardsPage() {
  const { adminUser, data, setPartnerRewardModel, setPartnerRewardOverride } = useAdmin()
  const [partnerId, setPartnerId] = useState(data.partners[0]?.id ?? '')
  const [modelId, setModelId] = useState(data.rewardModels[0]?.id ?? '')
  const [overrideValue, setOverrideValue] = useState('')

  if (adminUser?.role !== 'admin') {
    return <Navigate to="/admin/leads" replace />
  }

  function applySettings() {
    if (!partnerId) return
    if (modelId) setPartnerRewardModel(partnerId, modelId)
    setPartnerRewardOverride(partnerId, overrideValue ? Number(overrideValue) : null)
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Вознаграждения</span>
          <h1>Модели выплат</h1>
          <p>Здесь настраивается модель вознаграждения и ручное переопределение суммы.</p>
        </div>
      </header>

      <div className="table-card">
        <div className="table-header">
          <span>Название модели</span>
          <span>Сумма за лида</span>
          <span>Комментарий</span>
          <span>ID</span>
        </div>
        {data.rewardModels.map((model) => (
          <div key={model.id} className="table-row">
            <strong>{model.name}</strong>
            <span>{model.amountPerLead} ₽</span>
            <span>{model.comment}</span>
            <span>{model.id}</span>
          </div>
        ))}
      </div>

      <section className="page-card">
        <h3>Назначение модели партнеру</h3>
        <div className="filters-row">
          <label className="field compact-field">
            Партнер
            <select value={partnerId} onChange={(event) => setPartnerId(event.target.value)}>
              {data.partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field compact-field">
            Модель
            <select value={modelId} onChange={(event) => setModelId(event.target.value)}>
              {data.rewardModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field compact-field">
            Сумма вручную
            <input
              type="number"
              value={overrideValue}
              onChange={(event) => setOverrideValue(event.target.value)}
              placeholder="Пусто = по модели"
            />
          </label>

          <button className="primary-button" onClick={applySettings}>
            Применить
          </button>
        </div>
      </section>
    </div>
  )
}
