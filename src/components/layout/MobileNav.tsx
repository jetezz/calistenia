import { NavLink } from 'react-router-dom'
import { Home, CalendarDays, CreditCard, LayoutDashboard, Users, Clock, Calendar } from 'lucide-react'
import { useProfile } from '@/features/auth'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

export function MobileNav() {
  const { isAdmin } = useProfile()

  const clientNavItems: NavItem[] = [
    { to: '/', icon: <Home className="size-5" />, label: 'Inicio' },
    { to: '/book', icon: <CalendarDays className="size-5" />, label: 'Reservar' },
    { to: '/my-bookings', icon: <Calendar className="size-5" />, label: 'Mis Clases' },
    { to: '/request-credits', icon: <CreditCard className="size-5" />, label: 'Créditos' },
  ]

  const adminNavItems: NavItem[] = [
    { to: '/admin', icon: <LayoutDashboard className="size-5" />, label: 'Panel' },
    { to: '/admin/slots', icon: <Clock className="size-5" />, label: 'Horarios' },
    { to: '/admin/users', icon: <Users className="size-5" />, label: 'Usuarios' },
    { to: '/admin/bookings', icon: <CalendarDays className="size-5" />, label: 'Reservas' },
  ]

  const navItems = isAdmin ? adminNavItems : clientNavItems

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-20 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 h-full gap-1.5 text-xs font-medium transition-all duration-200 rounded-lg mx-1 min-w-[60px]',
                'hover:bg-accent/50 active:bg-accent active:scale-95 transform',
                'focus:outline-none focus:ring-2 focus:ring-primary/50',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            <div className={cn(
              'transition-transform duration-200',
              'group-active:scale-110'
            )}>
              {item.icon}
            </div>
            <span className="text-[11px] leading-tight">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
