import { useEffect, useMemo, useState } from 'react'
import { loadAdminDataFromStorage } from '../admin/context'
import type { AdminPartnerLevel, PartnerFeatures, ReportTemplate } from '../admin/types'
import type { User } from '../types'

type PartnerAccess = {
  partnerId: string | null
  partnerName: string | null
  level: AdminPartnerLevel
  status: 'active' | 'blocked'
  features: PartnerFeatures
  apiKey: string | null
  apiKeyActive: boolean
  supportLink: string
  reportTemplates: ReportTemplate[]
}

const defaultAccess: PartnerAccess = {
  partnerId: null,
  partnerName: null,
  level: 'base',
  status: 'active',
  features: {
    advancedReporting: false,
    bulkLeadUpload: false,
    apiIntegration: false,
    multiReferralLinks: false,
    customRewardModel: false,
  },
  apiKey: null,
  apiKeyActive: false,
  supportLink: 'https://t.me/example_support',
  reportTemplates: [],
}

function normalize(value: string) {
  return value.trim().toLowerCase()
}

function resolvePartnerAccess(user: User | null): PartnerAccess {
  if (!user) return defaultAccess

  const data = loadAdminDataFromStorage()
  const target = normalize(user.contact)

  const partner = data.partners.find((item) => {
    const contact = normalize(item.contact)
    return contact.includes(target) || target.includes(contact)
  })

  if (!partner) {
    return {
      ...defaultAccess,
      supportLink: data.settings.supportLink,
      reportTemplates: data.reportTemplates,
    }
  }

  return {
    partnerId: partner.id,
    partnerName: partner.name,
    level: partner.level,
    status: partner.status,
    features: partner.features,
    apiKey: partner.apiKey,
    apiKeyActive: partner.apiKeyActive,
    supportLink: data.settings.supportLink,
    reportTemplates: data.reportTemplates,
  }
}

export function usePartnerAccess(user: User | null) {
  const [version, setVersion] = useState(0)

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'nssd:admin-data') {
        setVersion((v) => v + 1)
      }
    }

    window.addEventListener('storage', onStorage)

    const intervalId = window.setInterval(() => {
      setVersion((v) => v + 1)
    }, 1500)

    const onFocus = () => setVersion((v) => v + 1)
    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      window.clearInterval(intervalId)
    }
  }, [])

  return useMemo(() => resolvePartnerAccess(user), [user, version])
}

