import { useMemo, useState } from 'react'
import { SupportCta } from '../components/SupportCta'
import type { PartnerFeatures } from '../admin/types'
import type { User } from '../types'

type LeadsPageProps = {
  user: User
  features: PartnerFeatures
  supportLink: string
}

type LeadStatus = 'new' | 'in_progress' | 'accepted' | 'rejected'

type LeadHistoryItem = {
  status: LeadStatus
  at: string
  note: string
}

type Lead = {
  id: string
  createdAt: string
  name: string
  phone: string
  status: LeadStatus
  partnerComment: string
  rejectionReason?: string
  history: LeadHistoryItem[]
}

const statusLabel: Record<LeadStatus, string> = {
  new: 'Новый',
  in_progress: 'В работе',
  accepted: 'Принят',
  rejected: 'Отклонен',
}

const seedLeads: Lead[] = [
  {
    id: 'L-1001',
    createdAt: '2026-03-01T10:30:00.000Z',
    name: 'Иван Петров',
    phone: '+7 901 123-45-67',
    status: 'new',
    partnerComment: 'Оставил заявку на консультацию',
    history: [{ status: 'new', at: '2026-03-01T10:30:00.000Z', note: 'Лид создан' }],
  },
  {
    id: 'L-1002',
    createdAt: '2026-02-28T14:10:00.000Z',
    name: 'Мария Смирнова',
    phone: '+7 903 987-00-11',
    status: 'in_progress',
    partnerComment: 'Удобно звонить после 18:00',
    history: [
      { status: 'new', at: '2026-02-28T14:10:00.000Z', note: 'Лид создан' },
      { status: 'in_progress', at: '2026-02-28T15:00:00.000Z', note: 'Лид взят в работу' },
    ],
  },
]

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ru-RU')
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('ru-RU')
}

export function LeadsPage({ features, supportLink }: LeadsPageProps) {
  const [leads, setLeads] = useState<Lead[]>(seedLeads)
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [query, setQuery] = useState('')

  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formComment, setFormComment] = useState('')
  const [formError, setFormError] = useState('')
  const [showBulkPanel, setShowBulkPanel] = useState(false)

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && lead.status !== statusFilter) {
        return false
      }

      if (dateFilter) {
        const leadDate = new Date(lead.createdAt).toISOString().slice(0, 10)
        if (leadDate !== dateFilter) {
          return false
        }
      }

      if (query.trim()) {
        const normalized = query.trim().toLowerCase()
        const target = `${lead.name} ${lead.phone}`.toLowerCase()
        if (!target.includes(normalized)) {
          return false
        }
      }

      return true
    })
  }, [leads, statusFilter, dateFilter, query])

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) ?? null,
    [leads, selectedLeadId],
  )

  function resetForm() {
    setFormName('')
    setFormPhone('')
    setFormComment('')
    setFormError('')
  }

  function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!formName.trim() || !formPhone.trim()) {
      setFormError('Имя клиента и телефон обязательны')
      return
    }

    const now = new Date().toISOString()
    const newLead: Lead = {
      id: `L-${Math.floor(Math.random() * 9000 + 1000)}`,
      createdAt: now,
      name: formName.trim(),
      phone: formPhone.trim(),
      status: 'new',
      partnerComment: formComment.trim(),
      history: [{ status: 'new', at: now, note: 'Лид создан' }],
    }

    setLeads((prev) => [newLead, ...prev])
    setShowAddForm(false)
    setSelectedLeadId(newLead.id)
    resetForm()
  }

  const isListMode = !showAddForm && !selectedLead

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Лиды</span>
          <h1>Лиды партнера</h1>
          <p>Передача лидов, фильтры и карточка с историей статусов.</p>
        </div>
        <div className="pill-row">
          <button
            className="primary-button"
            onClick={() => {
              setSelectedLeadId(null)
              setShowAddForm(true)
            }}
          >
            Добавить лида
          </button>
          {features.bulkLeadUpload ? (
            <button className="secondary-button" onClick={() => setShowBulkPanel((prev) => !prev)}>
              Загрузить лиды файлом
            </button>
          ) : null}
        </div>
      </header>

      {!features.bulkLeadUpload ? (
        <div className="form-info">Функция массовой загрузки доступна по запросу через поддержку.</div>
      ) : null}

      {showBulkPanel ? (
        <section className="page-card">
          <h3>Массовая загрузка лидов</h3>
          <p className="muted">Выберите CSV или Excel файл и загрузите лиды пакетно.</p>
          <input type="file" />
          <div className="form-info">Файл принят в демо-режиме. Обработка выполняется на стороне сервера.</div>
        </section>
      ) : null}

      {isListMode ? (
        <>
          <section className="page-card filters-row">
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
              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
              />
            </label>
            <label className="field compact-field grow">
              Поиск
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Имя клиента или телефон"
              />
            </label>
          </section>

          <div className="table-card">
            <div className="table-header leads-table">
              <span>Дата создания</span>
              <span>Имя клиента</span>
              <span>Телефон</span>
              <span>Статус лида</span>
              <span>Комментарий</span>
            </div>
            {filteredLeads.length === 0 ? (
              <div className="table-row leads-table">
                <span>—</span>
                <span>Здесь пока нет данных</span>
                <span>—</span>
                <span>—</span>
                <span>Добавьте первого лида вручную или через файл</span>
              </div>
            ) : (
              filteredLeads.map((lead) => (
                <button
                  key={lead.id}
                  className="table-row leads-table table-row-button"
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <span>{formatDate(lead.createdAt)}</span>
                  <strong>{lead.name}</strong>
                  <span>{lead.phone}</span>
                  <span className="status">{statusLabel[lead.status]}</span>
                  <span className="clamp-1">{lead.partnerComment || '—'}</span>
                </button>
              ))
            )}
          </div>

          <section className="grid-2">
            <div className="page-card locked">
              <h3>Расширенные инструменты</h3>
              <p>API и расширенные отчеты включаются администратором в карточке партнера.</p>
              <div className="lock-tag">Недоступно на текущем уровне</div>
            </div>
            <SupportCta href={supportLink} />
          </section>
        </>
      ) : null}

      {showAddForm ? (
        <section className="page-card form-card">
          <div className="card-actions-top">
            <h3>Добавление лида</h3>
            <button
              className="ghost-button"
              onClick={() => {
                setShowAddForm(false)
                resetForm()
              }}
            >
              Назад к списку
            </button>
          </div>
          <form className="support-form" onSubmit={submitLead}>
            <label className="field">
              Имя клиента
              <input
                type="text"
                value={formName}
                onChange={(event) => setFormName(event.target.value)}
                placeholder="Например: Сергей Иванов"
              />
            </label>
            <label className="field">
              Телефон
              <input
                type="text"
                value={formPhone}
                onChange={(event) => setFormPhone(event.target.value)}
                placeholder="+7 900 000-00-00"
              />
            </label>
            <label className="field">
              Комментарий (необязательно)
              <textarea
                rows={4}
                value={formComment}
                onChange={(event) => setFormComment(event.target.value)}
                placeholder="Короткая заметка"
              />
            </label>
            <div className="form-info">
              Перед отправкой убедитесь, что клиент дал согласие на обработку персональных данных.
            </div>
            {formError ? <div className="form-error">{formError}</div> : null}
            <div className="card-actions-bottom">
              <button className="primary-button" type="submit">
                Сохранить лид
              </button>
              <button className="secondary-button" type="button" onClick={resetForm}>
                Очистить
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {selectedLead ? (
        <section className="grid-2 detail-grid">
          <div className="page-card">
            <div className="card-actions-top">
              <h3>Карточка лида</h3>
              <button className="ghost-button" onClick={() => setSelectedLeadId(null)}>
                Назад к списку
              </button>
            </div>
            <div className="details-list">
              <div>
                <span className="muted">Имя клиента</span>
                <strong>{selectedLead.name}</strong>
              </div>
              <div>
                <span className="muted">Телефон</span>
                <strong>{selectedLead.phone}</strong>
              </div>
              <div>
                <span className="muted">Дата создания</span>
                <strong>{formatDateTime(selectedLead.createdAt)}</strong>
              </div>
              <div>
                <span className="muted">Текущий статус</span>
                <strong>{statusLabel[selectedLead.status]}</strong>
              </div>
              <div>
                <span className="muted">Комментарий партнера</span>
                <strong>{selectedLead.partnerComment || '—'}</strong>
              </div>
            </div>
            {selectedLead.status === 'rejected' ? (
              <div className="form-error">Причина отклонения: {selectedLead.rejectionReason || 'Не указана'}</div>
            ) : null}
          </div>

          <div className="page-card">
            <h3>История статусов</h3>
            <div className="timeline">
              {selectedLead.history.map((item) => (
                <div key={`${selectedLead.id}-${item.status}-${item.at}`} className="timeline-item">
                  <div className="timeline-dot" />
                  <div>
                    <strong>{statusLabel[item.status]}</strong>
                    <p>{item.note}</p>
                    <small>{formatDateTime(item.at)}</small>
                  </div>
                </div>
              ))}
            </div>
            <SupportCta variant="inline" href={supportLink} />
          </div>
        </section>
      ) : null}
    </div>
  )
}
