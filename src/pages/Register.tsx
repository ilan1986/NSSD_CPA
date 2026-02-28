import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../types'
import { createPartner } from '../services/partners'
import { isSupabaseEnabled } from '../lib/supabase'

type RegisterPageProps = {
  auth: {
    login: (user: User) => void
  }
}

export function RegisterPage({ auth }: RegisterPageProps) {
  const navigate = useNavigate()
  const [contact, setContact] = useState('')
  const [password, setPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const isValid = useMemo(
    () => contact.trim().length > 3 && password.trim().length >= 6 && agree,
    [contact, password, agree],
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) {
      setError('Р—Р°РїРѕР»РЅРёС‚Рµ РїРѕР»СЏ Рё РїРѕРґС‚РІРµСЂРґРёС‚Рµ СЃРѕРіР»Р°СЃРёРµ СЃ СѓСЃР»РѕРІРёСЏРјРё.')
      return
    }

    const nextUser: User = {
      id: crypto.randomUUID(),
      contact: contact.trim(),
      level: 'base',
      createdAt: new Date().toISOString(),
    }

    auth.login(nextUser)

    if (isSupabaseEnabled) {
      const result = await createPartner(nextUser)
      if (!result.ok) {
        setInfo('РџСЂРѕС„РёР»СЊ СЃРѕС…СЂР°РЅС‘РЅ Р»РѕРєР°Р»СЊРЅРѕ. РћС€РёР±РєР° Р·Р°РїРёСЃРё РІ Р‘Р”.')
      }
    }

    navigate('/app/home')
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <span className="eyebrow">Р РµРіРёСЃС‚СЂР°С†РёСЏ</span>
        <h2>РЎРѕР·РґР°Р№С‚Рµ РїР°СЂС‚РЅС‘СЂСЃРєРёР№ Р°РєРєР°СѓРЅС‚</h2>
        <p>РЎС‚Р°СЂС‚РѕРІС‹Р№ РґРѕСЃС‚СѓРї вЂ” Р±Р°Р·РѕРІС‹Р№. РџРѕСЃР»Рµ Р°РєС‚РёРІР°С†РёРё СЃРјРѕР¶РµС‚Рµ РїРѕРІС‹С€Р°С‚СЊ СѓСЂРѕРІРµРЅСЊ.</p>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="field">
          Email РёР»Рё С‚РµР»РµС„РѕРЅ
          <input
            type="text"
            placeholder="partner@email.ru РёР»Рё +7 900 000-00-00"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
          />
        </label>
        <label className="field">
          РџР°СЂРѕР»СЊ
          <input
            type="password"
            placeholder="РњРёРЅРёРјСѓРј 6 СЃРёРјРІРѕР»РѕРІ"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={agree}
            onChange={(event) => setAgree(event.target.checked)}
          />
          РЎРѕРіР»Р°СЃРµРЅ СЃ СѓСЃР»РѕРІРёСЏРјРё РїР°СЂС‚РЅС‘СЂСЃРєРѕР№ РїСЂРѕРіСЂР°РјРјС‹
        </label>
        {error ? <div className="form-error">{error}</div> : null}
        {info ? <div className="form-info">{info}</div> : null}
        <button className="primary-button" type="submit" disabled={!isValid}>
          РЎРѕР·РґР°С‚СЊ Р°РєРєР°СѓРЅС‚
        </button>
      </form>
      <div className="auth-footer">
        РЈР¶Рµ РµСЃС‚СЊ Р°РєРєР°СѓРЅС‚? <Link to="/login">Р’РѕР№С‚Рё</Link>
      </div>
    </div>
  )
}

