import { Navigate } from 'react-router-dom'
import { useAdmin } from '../context'

export function AdminIndexRoute() {
  const { adminUser } = useAdmin()

  if (!adminUser) return <Navigate to="/admin/login" replace />

  return <Navigate to={adminUser.role === 'admin' ? '/admin/partners' : '/admin/leads'} replace />
}
