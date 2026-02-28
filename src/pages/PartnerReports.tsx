import { SupportCta } from '../components/SupportCta'
import type { ReportTemplate } from '../admin/types'

type PartnerReportsPageProps = {
  enabled: boolean
  templates: ReportTemplate[]
}

function templateColumnsCount(template: ReportTemplate) {
  return Object.values(template.columns).filter(Boolean).length
}

export function PartnerReportsPage({ enabled, templates }: PartnerReportsPageProps) {
  if (!enabled) {
    return (
      <div className="page">
        <header className="page-header compact">
          <div>
            <span className="eyebrow">Отчеты</span>
            <h1>Отчеты недоступны</h1>
            <p>Функция будет доступна после активации администратором.</p>
          </div>
        </header>
        <SupportCta message="Для подключения отчетов обратитесь в поддержку" />
      </div>
    )
  }

  return (
    <div className="page">
      <header className="page-header compact">
        <div>
          <span className="eyebrow">Отчеты</span>
          <h1>Доступные отчеты</h1>
          <p>Открывайте шаблоны отчетов и выгружайте данные в файл.</p>
        </div>
      </header>

      {templates.length === 0 ? (
        <section className="page-card">
          <h3>Здесь пока нет данных</h3>
          <p className="muted">Шаблоны отчетов появятся после настройки администратором.</p>
        </section>
      ) : (
        <div className="table-card">
          <div className="table-header">
            <span>Название</span>
            <span>Источник данных</span>
            <span>Колонки</span>
            <span>Действия</span>
          </div>
          {templates.map((template) => (
            <div className="table-row" key={template.id}>
              <strong>{template.name}</strong>
              <span>
                {[template.includeLeads && 'Лиды', template.includeStatuses && 'Статусы', template.includePartners && 'Партнеры', template.includeDates && 'Даты']
                  .filter(Boolean)
                  .join(', ')}
              </span>
              <span>{templateColumnsCount(template)} колонок</span>
              <div className="pill-row">
                <button className="secondary-button">Открыть</button>
                <button className="secondary-button">Выгрузить</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
