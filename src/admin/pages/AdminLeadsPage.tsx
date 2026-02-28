import { useMemo, useState } from 'react'
import { useAdmin } from '../context'
import type { LeadStatus } from '../types'

const statusLabel: Record<LeadStatus, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  accepted: 'Принят',
  rejected: 'Отклонен',
}

export function AdminLeadsPage() {
  const { data, adminUser, setLeadStatus } = useAdmin()

  const [partnerFilter, setPartnerFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)

  const leadList = useMemo(
    () =>
      data.leads.filter((lead) => {
        if (partnerFilter !== 'all' && lead.partnerId !== partnerFilter) return false
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false
        if (dateFilter && lead.createdAt !== dateFilter) return false
        return true
      }),
    [data.leads, partnerFilter, statusFilter, dateFilter],
  )

  const selectedLead = data.leads.find((lead) => lead.id === selectedLeadId) ?? null
  const canChangeStatus = Boolean(adminUser)

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Лиды</span>
          <h1>Работа с лидами</h1>
          <p>Операторы и администраторы видят единый список лидов и карточки со статусами.</p>
        </div>
      </header>

      <section className="page-card filters-row">
        <label className="field compact-field">
          Партнер
          <select value={partnerFilter} onChange={(event) => setPartnerFilter(event.target.value)}>
            <option value="all">Все</option>
            {data.partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field compact-field">
          Статус
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as 'all' | LeadStatus)}
          >
            <option value="all">Все</option>
            <option value="new">Новый</option>
            <option value="in_progress">В работе</option>
            <option value="accepted">Принят</option>
            <option value="rejected">Отклонен</option>
          </select>
        </label>

        <label className="field compact-field">
          Дата
          <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
        </label>
      </section>

      <div className="table-card">
        <div className="table-header admin-leads-table">
          <span>Дата</span>
          <span>Клиент</span>
          <span>Партнер</span>
          <span>Статус</span>
          <span>Действие</span>
        </div>

        {leadList.map((lead) => {
          const partner = data.partners.find((item) => item.id === lead.partnerId)
          return (
            <div key={lead.id} className="table-row admin-leads-table">
              <span>{lead.createdAt}</span>
              <strong>{lead.clientName}</strong>
              <span>{partner?.name ?? '—'}</span>
              <span className="status">{statusLabel[lead.status]}</span>
              <button className="secondary-button" onClick={() => setSelectedLeadId(lead.id)}>
                Открыть
              </button>
            </div>
          )
        })}
      </div>

      {selectedLead ? (
        <section className="grid-2 detail-grid">
          <div className="page-card">
            <h3>Карточка лида</h3>
            <div className="details-list">
              <div>
                <span className="muted">Клиент</span>
                <strong>{selectedLead.clientName}</strong>
              </div>
              <div>
                <span className="muted">Телефон</span>
                <strong>{selectedLead.phone}</strong>
              </div>
              <div>
                <span className="muted">Партнер</span>
                <strong>{data.partners.find((p) => p.id === selectedLead.partnerId)?.name ?? '—'}</strong>
              </div>
              <div>
                <span className="muted">Комментарий</span>
                <strong>{selectedLead.comment || '—'}</strong>
              </div>
            </div>

            {canChangeStatus ? (
              <div className="toggle-grid">
                {(['new', 'in_progress', 'accepted', 'rejected'] as LeadStatus[]).map((status) => (
                  <button
                    key={status}
                    className="secondary-button"
                    onClick={() =>
                      setLeadStatus(
                        selectedLead.id,
                        status,
                        `Статус изменен на: ${statusLabel[status]}`,
                      )
                    }
                  >
                    {statusLabel[status]}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="page-card">
            <h3>История статусов</h3>
            <div className="timeline">
              {selectedLead.history.map((item, index) => (
                <div key={`${item.status}-${item.at}-${index}`} className="timeline-item">
                  <div className="timeline-dot" />
                  <div>
                    <strong>{statusLabel[item.status]}</strong>
                    <p>{item.note}</p>
                    <small>{item.at}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
