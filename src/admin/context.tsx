import { createContext, useContext, useMemo, useState } from 'react'
import { initialAdminData } from './data'
import type {
  AdminData,
  AdminLead,
  AdminPartnerLevel,
  AdminPartnerStatus,
  AdminUser,
  LeadStatus,
  OperatorRecord,
  PartnerExtraFields,
  PartnerFeatures,
  ReportTemplate,
} from './types'

type AdminContextValue = {
  adminUser: AdminUser | null
  data: AdminData
  login: (email: string, password: string) => AdminUser | null
  logout: () => void
  setPartnerLevel: (partnerId: string, level: AdminPartnerLevel) => void
  setPartnerStatus: (partnerId: string, status: AdminPartnerStatus) => void
  setPartnerComment: (partnerId: string, comment: string) => void
  setPartnerFeature: (partnerId: string, key: keyof PartnerFeatures, value: boolean) => void
  setPartnerExtraField: (partnerId: string, key: keyof PartnerExtraFields, value: boolean) => void
  setPartnerRewardModel: (partnerId: string, modelId: string) => void
  setPartnerRewardOverride: (partnerId: string, amount: number | null) => void
  createApiKey: (partnerId: string) => void
  disableApiKey: (partnerId: string) => void
  addOperator: (name: string, email: string, role: OperatorRecord['role']) => void
  setOperatorRole: (operatorId: string, role: OperatorRecord['role']) => void
  setOperatorStatus: (operatorId: string, status: OperatorRecord['status']) => void
  setLeadStatus: (leadId: string, status: LeadStatus, note: string) => void
  saveReportTemplate: (template: ReportTemplate) => void
  setSupportLink: (link: string) => void
}

export const ADMIN_USER_KEY = 'nssd:admin-user'
export const ADMIN_DATA_KEY = 'nssd:admin-data'

function loadAdminUser(): AdminUser | null {
  const raw = localStorage.getItem(ADMIN_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

export function loadAdminDataFromStorage(): AdminData {
  const raw = localStorage.getItem(ADMIN_DATA_KEY)
  if (!raw) return initialAdminData
  try {
    return JSON.parse(raw) as AdminData
  } catch {
    return initialAdminData
  }
}

const AdminContext = createContext<AdminContextValue | null>(null)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => loadAdminUser())
  const [data, setData] = useState<AdminData>(() => loadAdminDataFromStorage())

  function persist(nextData: AdminData) {
    setData(nextData)
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(nextData))
  }

  function login(email: string, password: string): AdminUser | null {
    if (!email.trim() || password.trim().length < 3) return null

    const role =
      email.toLowerCase().includes('operator') || email.toLowerCase().includes('op@')
        ? 'operator'
        : 'admin'
    const user: AdminUser = {
      id: role === 'admin' ? 'A-1' : 'O-1',
      name: role === 'admin' ? 'Главный администратор' : 'Оператор',
      email: email.trim(),
      role,
    }
    setAdminUser(user)
    localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user))
    return user
  }

  function logout() {
    setAdminUser(null)
    localStorage.removeItem(ADMIN_USER_KEY)
  }

  function updatePartner(partnerId: string, updater: (partner: AdminData['partners'][number]) => AdminData['partners'][number]) {
    persist({
      ...data,
      partners: data.partners.map((partner) => (partner.id === partnerId ? updater(partner) : partner)),
    })
  }

  function setPartnerLevel(partnerId: string, level: AdminPartnerLevel) {
    updatePartner(partnerId, (partner) => ({ ...partner, level }))
  }

  function setPartnerStatus(partnerId: string, status: AdminPartnerStatus) {
    updatePartner(partnerId, (partner) => ({ ...partner, status }))
  }

  function setPartnerComment(partnerId: string, comment: string) {
    updatePartner(partnerId, (partner) => ({ ...partner, adminComment: comment }))
  }

  function setPartnerFeature(partnerId: string, key: keyof PartnerFeatures, value: boolean) {
    updatePartner(partnerId, (partner) => ({ ...partner, features: { ...partner.features, [key]: value } }))
  }

  function setPartnerExtraField(partnerId: string, key: keyof PartnerExtraFields, value: boolean) {
    updatePartner(partnerId, (partner) => ({ ...partner, extraFields: { ...partner.extraFields, [key]: value } }))
  }

  function setPartnerRewardModel(partnerId: string, modelId: string) {
    updatePartner(partnerId, (partner) => ({ ...partner, rewardModelId: modelId }))
  }

  function setPartnerRewardOverride(partnerId: string, amount: number | null) {
    updatePartner(partnerId, (partner) => ({ ...partner, rewardOverride: amount }))
  }

  function createApiKey(partnerId: string) {
    updatePartner(partnerId, (partner) => ({
      ...partner,
      apiKey: `nssd_${crypto.randomUUID().replace(/-/g, '')}`,
      apiKeyActive: true,
      features: { ...partner.features, apiIntegration: true },
    }))
  }

  function disableApiKey(partnerId: string) {
    updatePartner(partnerId, (partner) => ({
      ...partner,
      apiKeyActive: false,
    }))
  }

  function addOperator(name: string, email: string, role: OperatorRecord['role']) {
    const next: OperatorRecord = {
      id: `U-${Math.floor(Math.random() * 9000 + 1000)}`,
      name,
      email,
      role,
      status: 'active',
    }
    persist({ ...data, operators: [next, ...data.operators] })
  }

  function setOperatorRole(operatorId: string, role: OperatorRecord['role']) {
    persist({
      ...data,
      operators: data.operators.map((o) => (o.id === operatorId ? { ...o, role } : o)),
    })
  }

  function setOperatorStatus(operatorId: string, status: OperatorRecord['status']) {
    persist({
      ...data,
      operators: data.operators.map((o) => (o.id === operatorId ? { ...o, status } : o)),
    })
  }

  function setLeadStatus(leadId: string, status: LeadStatus, note: string) {
    persist({
      ...data,
      leads: data.leads.map((lead: AdminLead) =>
        lead.id === leadId
          ? {
              ...lead,
              status,
              history: [...lead.history, { status, at: new Date().toLocaleString('ru-RU'), note }],
            }
          : lead,
      ),
    })
  }

  function saveReportTemplate(template: ReportTemplate) {
    const exists = data.reportTemplates.some((t) => t.id === template.id)
    persist({
      ...data,
      reportTemplates: exists
        ? data.reportTemplates.map((t) => (t.id === template.id ? template : t))
        : [template, ...data.reportTemplates],
    })
  }

  function setSupportLink(link: string) {
    persist({ ...data, settings: { ...data.settings, supportLink: link } })
  }

  const value = useMemo<AdminContextValue>(
    () => ({
      adminUser,
      data,
      login,
      logout,
      setPartnerLevel,
      setPartnerStatus,
      setPartnerComment,
      setPartnerFeature,
      setPartnerExtraField,
      setPartnerRewardModel,
      setPartnerRewardOverride,
      createApiKey,
      disableApiKey,
      addOperator,
      setOperatorRole,
      setOperatorStatus,
      setLeadStatus,
      saveReportTemplate,
      setSupportLink,
    }),
    [adminUser, data],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used inside AdminProvider')
  }
  return context
}
