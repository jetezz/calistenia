import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { AuthGuard } from '@/features/auth'

export function RootLayout() {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-24">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </AuthGuard>
  )
}
