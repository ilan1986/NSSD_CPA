import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context'

type ParsedLead = {
  clientName: string
  phone: string
  comment: string
}

export function BulkUploadPage() {
  const { adminUser } = useAdmin()
  const [raw, setRaw] = useState('Иван,+79990000001,Комментарий\nМария,+79990000002,')
  const [confirmed, setConfirmed] = useState(false)

  if (adminUser?.role !== 'admin') {
    return <Navigate to="/admin/leads" replace />
  }

  const parsed = useMemo(() => {
    const rows = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const valid: ParsedLead[] = []
    const invalid: string[] = []

    rows.forEach((row, index) => {
      const [clientName, phone, comment = ''] = row.split(',').map((cell) => cell?.trim())
      if (!clientName || !phone) {
        invalid.push(`Строка ${index + 1}`)
        return
      }
      valid.push({ clientName, phone, comment })
    })

    return { valid, invalid }
  }, [raw])

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Массовая загрузка лидов</span>
          <h1>Импорт CSV / Excel</h1>
          <p>Сценарий: загрузка файла, предпросмотр, проверка и подтверждение.</p>
        </div>
      </header>

      <section className="page-card">
        <label className="field">
          Вставьте данные CSV (демо)
          <textarea rows={8} value={raw} onChange={(event) => setRaw(event.target.value)} />
        </label>

        <div className="grid-2">
          <div className="stat-card">
            <span className="stat-label">Корректные лиды</span>
            <strong>{parsed.valid.length}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">С ошибками</span>
            <strong>{parsed.invalid.length}</strong>
          </div>
        </div>

        <div className="card-actions-bottom">
          <button className="primary-button" onClick={() => setConfirmed(true)}>
            Подтвердить загрузку
          </button>
          {confirmed ? <div className="form-info">Загрузка подтверждена. Бэкенд обработает файл.</div> : null}
        </div>
      </section>

      <div className="table-card">
        <div className="table-header">
          <span>Имя клиента</span>
          <span>Телефон</span>
          <span>Комментарий</span>
          <span>Статус строки</span>
        </div>
        {parsed.valid.map((row, index) => (
          <div className="table-row" key={`${row.phone}-${index}`}>
            <strong>{row.clientName}</strong>
            <span>{row.phone}</span>
            <span>{row.comment || '—'}</span>
            <span className="status">Корректно</span>
          </div>
        ))}
        {parsed.invalid.map((row) => (
          <div className="table-row" key={row}>
            <strong>—</strong>
            <span>—</span>
            <span>{row}</span>
            <span className="status">Ошибка</span>
          </div>
        ))}
      </div>
    </div>
  )
}
