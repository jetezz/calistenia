import { useState } from 'react'
import { Search, Users, Plus, Minus, UserCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { PageLoadingState } from '@/components/common'
import { useAdminUsers } from '../hooks'

export function AdminUsersPage() {
  const {
    users,
    allUsers,
    isLoading,
    searchQuery,
    setSearchQuery,
    paymentStatusFilter,
    setPaymentStatusFilter,
    updateUserCredits,
    updateUserPaymentStatus
  } = useAdminUsers()

  const [updatingCredits, setUpdatingCredits] = useState<Record<string, boolean>>({})

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 text-white">Al día</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
      case 'unpaid':
        return <Badge variant="destructive">No pagado</Badge>
      default:
        return <Badge variant="secondary">Sin definir</Badge>
    }
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleCreditsChange = async (userId: string, change: number) => {
    const user = users.find(u => u.id === userId)
    if (!user) return

    const newCredits = Math.max(0, user.credits + change)
    
    try {
      setUpdatingCredits(prev => ({ ...prev, [userId]: true }))
      await updateUserCredits(userId, newCredits)
    } catch (error) {
      console.error('Error updating credits:', error)
    } finally {
      setUpdatingCredits(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handlePaymentStatusChange = async (userId: string, status: string) => {
    try {
      await updateUserPaymentStatus(userId, status)
    } catch (error) {
      console.error('Error updating payment status:', error)
    }
  }

  if (isLoading) {
    return <PageLoadingState message="Cargando usuarios..." />
  }

  return (
    <div className="container mx-auto px-3 py-4 pb-20 space-y-4 max-w-4xl">
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground">
            Administra los clientes y sus créditos
          </p>
        </div>

        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          
          <Select
            value={paymentStatusFilter}
            onValueChange={setPaymentStatusFilter}
          >
            <SelectTrigger className="h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="paid">Al día</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="unpaid">No pagado</SelectItem>
              <SelectItem value="none">Sin definir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>Total: {allUsers.length}</span>
          <span>•</span>
          <span>Mostrando: {users.length}</span>
        </div>
      </div>

      {users.length === 0 && searchQuery === '' && paymentStatusFilter === 'all' ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No hay usuarios registrados</h3>
            <p className="text-sm text-muted-foreground">
              Los nuevos usuarios aparecerán aquí cuando se registren
            </p>
          </CardContent>
        </Card>
      ) : users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron usuarios</h3>
            <p className="text-sm text-muted-foreground">
              Intenta ajustar los filtros de búsqueda
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-12 shrink-0">
                      <AvatarFallback className="text-base font-medium">
                        {getInitials(user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-base leading-tight mb-1">
                        {user.full_name || 'Sin nombre'}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-3">
                      <div className="text-2xl font-bold leading-none mb-1">{user.credits}</div>
                      <div className="text-xs text-muted-foreground">créditos</div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-12 w-12"
                        onClick={() => handleCreditsChange(user.id, -1)}
                        disabled={user.credits === 0 || updatingCredits[user.id]}
                      >
                        <Minus className="size-5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-12 w-12"
                        onClick={() => handleCreditsChange(user.id, 1)}
                        disabled={updatingCredits[user.id]}
                      >
                        <Plus className="size-5" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estado de pago</span>
                      {getPaymentStatusBadge(user.payment_status)}
                    </div>
                    <Select
                      value={user.payment_status}
                      onValueChange={(value) => handlePaymentStatusChange(user.id, value)}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin definir</SelectItem>
                        <SelectItem value="paid">Al día</SelectItem>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="unpaid">No pagado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button asChild className="w-full h-11" variant="outline">
                    <Link to={`/admin/users/${user.id}`}>
                      <UserCheck className="size-4 mr-2" />
                      Ver detalle
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
