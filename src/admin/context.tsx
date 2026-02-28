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
  addOperator: (name: string, email: string, role: OperatorRecord['role']) => void
  setOperatorRole: (operatorId: string, role: OperatorRecord['role']) => void
  setOperatorStatus: (operatorId: string, status: OperatorRecord['status']) => void
  setLeadStatus: (leadId: string, status: LeadStatus, note: string) => void
  setSupportLink: (link: string) => void
}

const ADMIN_USER_KEY = 'nssd:admin-user'
const ADMIN_DATA_KEY = 'nssd:admin-data'

function loadAdminUser(): AdminUser | null {
  const raw = localStorage.getItem(ADMIN_USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AdminUser
  } catch {
    return null
  }
}

function loadAdminData(): AdminData {
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
  const [data, setData] = useState<AdminData>(() => loadAdminData())

  function persist(nextData: AdminData) {
    setData(nextData)
    localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(nextData))
  }

  function login(email: string, password: string): AdminUser | null {
    if (!email.trim() || password.trim().length < 3) return null

    const role = email.toLowerCase().includes('operator') || email.toLowerCase().includes('op@')
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

  function setPartnerLevel(partnerId: string, level: AdminPartnerLevel) {
    persist({
      ...data,
      partners: data.partners.map((p) => (p.id === partnerId ? { ...p, level } : p)),
    })
  }

  function setPartnerStatus(partnerId: string, status: AdminPartnerStatus) {
    persist({
      ...data,
      partners: data.partners.map((p) => (p.id === partnerId ? { ...p, status } : p)),
    })
  }

  function setPartnerComment(partnerId: string, comment: string) {
    persist({
      ...data,
      partners: data.partners.map((p) => (p.id === partnerId ? { ...p, adminComment: comment } : p)),
    })
  }

  function setPartnerFeature(partnerId: string, key: keyof PartnerFeatures, value: boolean) {
    persist({
      ...data,
      partners: data.partners.map((p) =>
        p.id === partnerId ? { ...p, features: { ...p.features, [key]: value } } : p,
      ),
    })
  }

  function setPartnerExtraField(partnerId: string, key: keyof PartnerExtraFields, value: boolean) {
    persist({
      ...data,
      partners: data.partners.map((p) =>
        p.id === partnerId ? { ...p, extraFields: { ...p.extraFields, [key]: value } } : p,
      ),
    })
  }

  function setPartnerRewardModel(partnerId: string, modelId: string) {
    persist({
      ...data,
      partners: data.partners.map((p) => (p.id === partnerId ? { ...p, rewardModelId: modelId } : p)),
    })
  }

  function setPartnerRewardOverride(partnerId: string, amount: number | null) {
    persist({
      ...data,
      partners: data.partners.map((p) => (p.id === partnerId ? { ...p, rewardOverride: amount } : p)),
    })
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
              history: [
                ...lead.history,
                { status, at: new Date().toLocaleString('ru-RU'), note },
              ],
            }
          : lead,
      ),
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
      addOperator,
      setOperatorRole,
      setOperatorStatus,
      setLeadStatus,
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
