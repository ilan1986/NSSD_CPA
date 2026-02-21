export type PartnerLevel = 'base' | 'pro' | 'expert'

export type User = {
  id: string
  contact: string
  level: PartnerLevel
  createdAt: string
}
