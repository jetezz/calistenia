import { useState, useEffect } from 'react'
import { Search, UserPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { profileService } from '@/services'
import { bookingService } from '@/services'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AddUserToSlotDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  slotId: string
  bookingDate: string
  slotTime: string
}

export function AddUserToSlotDialog({
  isOpen,
  onClose,
  onSuccess,
  slotId,
  bookingDate,
  slotTime
}: AddUserToSlotDialogProps) {
  const [users, setUsers] = useState<Profile[]>([])
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadUsers()
      setSearchTerm('')
    }
  }, [isOpen])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = users.filter(user => 
        user.full_name?.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await profileService.getAll()
      const nonAdminUsers = data.filter(user => user.role !== 'admin')
      setUsers(nonAdminUsers)
      setFilteredUsers(nonAdminUsers)
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (userId: string) => {
    setCreating(true)
    try {
      await bookingService.create({
        user_id: userId,
        time_slot_id: slotId,
        booking_date: bookingDate,
        status: 'confirmed'
      })
      
      toast.success('Usuario añadido a la clase')
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error creating booking:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes('duplicate')) {
        toast.error('Este usuario ya tiene una reserva para esta clase')
      } else {
        toast.error('Error al añadir usuario')
      }
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Añadir usuario a la clase</DialogTitle>
          <DialogDescription>
            {slotTime} - {bookingDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto border rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Cargando usuarios...</p>
                </div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{user.full_name || 'Sin nombre'}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Créditos: {user.credits || 0}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddUser(user.id)}
                      disabled={creating}
                    >
                      <UserPlus className="size-4 mr-2" />
                      Añadir
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
