import { useMemo, useState } from 'react'
import type { User } from '../types'

type EducationPageProps = {
  user: User
}

type Lesson = {
  id: string
  title: string
  description: string
}

const baseLessons: Lesson[] = [
  {
    id: 'L1',
    title: 'Введение в процесс банкротства',
    description: 'Ключевые этапы и как объяснять их клиенту.',
  },
  {
    id: 'L2',
    title: 'Квалификация лида',
    description: 'Какие вводные данные нужно собрать до передачи.',
  },
  {
    id: 'L3',
    title: 'Скрипт первичного контакта',
    description: 'Базовая структура разговора с клиентом.',
  },
  {
    id: 'L4',
    title: 'Частые возражения',
    description: 'Как корректно отвечать и не терять интерес клиента.',
  },
  {
    id: 'L5',
    title: 'Проверка качества переданного лида',
    description: 'Что влияет на принятие и отклонение.',
  },
]

export function EducationPage({ user }: EducationPageProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([])

  const levelLabel = user.level === 'base' ? 'Базовый' : user.level === 'pro' ? 'Про' : 'Эксперт'

  const progress = useMemo(() => {
    const percent = Math.round((completedIds.length / baseLessons.length) * 100)
    return Number.isFinite(percent) ? percent : 0
  }, [completedIds])

  const isEducationCompleted = completedIds.length === baseLessons.length

  function toggleLesson(id: string) {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <span className="eyebrow">Обучение</span>
          <h1>Обучение партнера</h1>
          <p>Уровень доступа: {levelLabel}. Отметьте уроки как пройденные, чтобы завершить обучение.</p>
        </div>
        <div className="page-card highlight">
          <span className="badge">Прогресс</span>
          <h3>{progress}%</h3>
          <p>
            {completedIds.length} из {baseLessons.length} уроков завершено
          </p>
        </div>
      </header>

      {!isEducationCompleted ? (
        <div className="form-error">Для полноценной работы в системе необходимо пройти обучение</div>
      ) : (
        <div className="form-info">Обучение завершено. Базовые материалы пройдены полностью.</div>
      )}

      <section className="page-card lessons-list">
        {baseLessons.map((lesson) => {
          const done = completedIds.includes(lesson.id)
          return (
            <article key={lesson.id} className="lesson-item">
              <div>
                <h3>{lesson.title}</h3>
                <p className="muted">{lesson.description}</p>
                <span className={`tag ${done ? 'tag-done' : ''}`}>
                  {done ? 'Пройден' : 'Не пройден'}
                </span>
              </div>
              <button className="secondary-button" onClick={() => toggleLesson(lesson.id)}>
                Смотреть
              </button>
            </article>
          )
        })}
      </section>

      <section className="grid-2">
        <div className="page-card locked">
          <h3>Расширенное обучение</h3>
          <p>Продвинутые модули, тесты и сертификация будут подключены позже.</p>
          <div className="lock-tag">Требуется уровень Про</div>
        </div>
      </section>
    </div>
  )
}
