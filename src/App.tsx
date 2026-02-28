import { useMemo, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminProvider } from './admin/context'
import { AdminLayout } from './admin/layout/AdminLayout'
import { AdminIndexRoute } from './admin/pages/AdminIndexRoute'
import { AdminLeadsPage } from './admin/pages/AdminLeadsPage'
import { AdminLoginPage } from './admin/pages/AdminLoginPage'
import { PartnerDetailsPage } from './admin/pages/PartnerDetailsPage'
import { PartnersPage } from './admin/pages/PartnersPage'
import { RewardsPage } from './admin/pages/RewardsPage'
import { SettingsPage } from './admin/pages/SettingsPage'
import { UsersPage } from './admin/pages/UsersPage'
import { AuthLayout } from './layouts/AuthLayout'
import { DashboardLayout } from './layouts/DashboardLayout'
import { EducationPage } from './pages/Education'
import { HomePage } from './pages/Home'
import { LeadsPage } from './pages/Leads'
import { LoginPage } from './pages/Login'
import { PayoutsPage } from './pages/Payouts'
import { ReferralPage } from './pages/Referral'
import { RegisterPage } from './pages/Register'
import { SupportPage } from './pages/Support'
import type { User } from './types'
import { loadUser, saveUser } from './utils/auth'

function App() {
  const [user, setUser] = useState<User | null>(() => loadUser())

  const auth = useMemo(
    () => ({
      user,
      login: (nextUser: User) => {
        setUser(nextUser)
        saveUser(nextUser)
      },
      logout: () => {
        setUser(null)
        saveUser(null)
      },
    }),
    [user],
  )

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<Navigate to={user ? '/app/home' : '/login'} replace />} />

          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage auth={auth} />
              </AuthLayout>
            }
          />
          <Route
            path="/register"
            element={
              <AuthLayout>
                <RegisterPage auth={auth} />
              </AuthLayout>
            }
          />

          <Route
            path="/app"
            element={
              user ? <DashboardLayout user={user} onLogout={auth.logout} /> : <Navigate to="/login" replace />
            }
          >
            <Route path="home" element={<HomePage user={user!} />} />
            <Route path="leads" element={<LeadsPage user={user!} />} />
            <Route path="education" element={<EducationPage user={user!} />} />
            <Route path="referral" element={<ReferralPage user={user!} />} />
            <Route path="payouts" element={<PayoutsPage user={user!} />} />
            <Route path="support" element={<SupportPage user={user!} />} />
            <Route path="*" element={<Navigate to="/app/home" replace />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminIndexRoute />} />
            <Route path="partners" element={<PartnersPage />} />
            <Route path="partners/:partnerId" element={<PartnerDetailsPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
            <Route path="rewards" element={<RewardsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<AdminIndexRoute />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminProvider>
    </BrowserRouter>
  )
}

export default App
