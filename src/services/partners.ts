import type { User } from '../types'
import { supabase } from '../lib/supabase'

type CreatePartnerResult =
  | { ok: true }
  | { ok: false; reason: string }

export async function createPartner(user: User): Promise<CreatePartnerResult> {
  if (!supabase) return { ok: false, reason: 'supabase-disabled' }

  const { error } = await supabase.from('partners').insert({
    id: user.id,
    contact: user.contact,
    level: user.level,
    created_at: user.createdAt,
  })

  if (error) {
    return { ok: false, reason: error.message }
  }

  return { ok: true }
}
