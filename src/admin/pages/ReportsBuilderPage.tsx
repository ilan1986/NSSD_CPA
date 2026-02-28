import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context'
import type { ReportTemplate } from '../types'

export function ReportsBuilderPage() {
  const { adminUser, data, saveReportTemplate } = useAdmin()
  const [name, setName] = useState('Новый шаблон отчета')
  const [includeLeads, setIncludeLeads] = useState(true)
  const [includeStatuses, setIncludeStatuses] = useState(true)
  const [includePartners, setIncludePartners] = useState(true)
  const [includeDates, setIncludeDates] = useState(true)
  const [columns, setColumns] = useState({
    clientName: true,
    phone: true,
    partnerName: true,
    status: true,
    createdAt: true,
  })

  if (adminUser?.role !== 'admin') {
    return <Navigate to="/admin/leads" replace />
  }

  function saveTemplate() {
    const template: ReportTemplate = {
      id: `T-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      includeLeads,
      includeStatuses,
      includePartners,
      includeDates,
      columns,
    }
    saveReportTemplate(template)
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Отчеты</span>
          <h1>Конструктор отчетов</h1>
          <p>Выберите данные, колонки и сохраните шаблон для партнеров.</p>
        </div>
      </header>

      <section className="page-card">
        <label className="field">
          Название шаблона
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <h3>Источник данных</h3>
        <div className="toggle-grid">
          <label className="switch-row"><input type="checkbox" checked={includeLeads} onChange={(e) => setIncludeLeads(e.target.checked)} />Лиды</label>
          <label className="switch-row"><input type="checkbox" checked={includeStatuses} onChange={(e) => setIncludeStatuses(e.target.checked)} />Статусы</label>
          <label className="switch-row"><input type="checkbox" checked={includePartners} onChange={(e) => setIncludePartners(e.target.checked)} />Партнеры</label>
          <label className="switch-row"><input type="checkbox" checked={includeDates} onChange={(e) => setIncludeDates(e.target.checked)} />Даты</label>
        </div>

        <h3>Колонки отчета</h3>
        <div className="toggle-grid">
          <label className="switch-row"><input type="checkbox" checked={columns.clientName} onChange={(e) => setColumns({ ...columns, clientName: e.target.checked })} />Имя клиента</label>
          <label className="switch-row"><input type="checkbox" checked={columns.phone} onChange={(e) => setColumns({ ...columns, phone: e.target.checked })} />Телефон</label>
          <label className="switch-row"><input type="checkbox" checked={columns.partnerName} onChange={(e) => setColumns({ ...columns, partnerName: e.target.checked })} />Партнер</label>
          <label className="switch-row"><input type="checkbox" checked={columns.status} onChange={(e) => setColumns({ ...columns, status: e.target.checked })} />Статус</label>
          <label className="switch-row"><input type="checkbox" checked={columns.createdAt} onChange={(e) => setColumns({ ...columns, createdAt: e.target.checked })} />Дата создания</label>
        </div>

        <button className="primary-button" onClick={saveTemplate}>Сохранить шаблон</button>
      </section>

      <div className="table-card">
        <div className="table-header">
          <span>Шаблон</span>
          <span>Источник</span>
          <span>Колонки</span>
          <span>ID</span>
        </div>
        {data.reportTemplates.map((template) => {
          const source = [
            template.includeLeads ? 'Лиды' : null,
            template.includeStatuses ? 'Статусы' : null,
            template.includePartners ? 'Партнеры' : null,
            template.includeDates ? 'Даты' : null,
          ]
            .filter(Boolean)
            .join(', ')

          const columnsList = Object.entries(template.columns)
            .filter(([, enabled]) => enabled)
            .map(([key]) => key)
            .join(', ')

          return (
            <div className="table-row" key={template.id}>
              <strong>{template.name}</strong>
              <span>{source || '—'}</span>
              <span>{columnsList || '—'}</span>
              <span>{template.id}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
