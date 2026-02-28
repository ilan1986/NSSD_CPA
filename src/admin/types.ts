export type AdminRole = 'admin' | 'operator'

export type AdminUser = {
  id: string
  name: string
  email: string
  role: AdminRole
}

export type AdminPartnerLevel = 'base' | 'extended' | 'max'
export type AdminPartnerStatus = 'active' | 'blocked'

export type PartnerFeatures = {
  advancedReporting: boolean
  bulkLeadUpload: boolean
  apiIntegration: boolean
  multiReferralLinks: boolean
  customRewardModel: boolean
}

export type PartnerExtraFields = {
  companyName: boolean
  trafficSource: boolean
  telegram: boolean
  contractNumber: boolean
}

export type PartnerRecord = {
  id: string
  registeredAt: string
  name: string
  contact: string
  level: AdminPartnerLevel
  status: AdminPartnerStatus
  adminComment: string
  features: PartnerFeatures
  extraFields: PartnerExtraFields
  rewardModelId: string
  rewardOverride: number | null
  apiKey: string | null
  apiKeyActive: boolean
}

export type LeadStatus = 'new' | 'in_progress' | 'accepted' | 'rejected'

export type LeadHistoryItem = {
  status: LeadStatus
  at: string
  note: string
}

export type AdminLead = {
  id: string
  partnerId: string
  createdAt: string
  clientName: string
  phone: string
  status: LeadStatus
  comment: string
  history: LeadHistoryItem[]
}

export type RewardModel = {
  id: string
  name: string
  amountPerLead: number
  comment: string
}

export type OperatorRecord = {
  id: string
  name: string
  email: string
  role: AdminRole
  status: 'active' | 'blocked'
}

export type ReportTemplate = {
  id: string
  name: string
  includeLeads: boolean
  includeStatuses: boolean
  includePartners: boolean
  includeDates: boolean
  columns: {
    clientName: boolean
    phone: boolean
    partnerName: boolean
    status: boolean
    createdAt: boolean
  }
}

export type AdminData = {
  partners: PartnerRecord[]
  leads: AdminLead[]
  rewardModels: RewardModel[]
  operators: OperatorRecord[]
  reportTemplates: ReportTemplate[]
  settings: {
    supportLink: string
    platformName: string
    platformNote: string
  }
}

