import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { MobileNav } from './MobileNav'
import { AuthGuard } from '@/features/auth'

export function RootLayout() {
  return (
    <AuthGuard>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-24 custom-scrollbar">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </AuthGuard>
  )
}
