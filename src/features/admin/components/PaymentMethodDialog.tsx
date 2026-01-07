import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { usePaymentMethod } from '@/hooks'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type PaymentMethod = Database['public']['Tables']['payment_methods']['Row']

interface PaymentMethodDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingMethod: PaymentMethod | null
}

const paymentTypes = [
  { value: 'bizum', label: 'Bizum' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank_transfer', label: 'Transferencia Bancaria' },
  { value: 'cash', label: 'Efectivo' },
  { value: 'other', label: 'Otro' }
]

export function PaymentMethodDialog({ 
  open, 
  onOpenChange,
  editingMethod 
}: PaymentMethodDialogProps) {
  const { createMethod, updateMethod } = usePaymentMethod()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'bizum',
    contact_email: '',
    contact_phone: '',
    bank_account: '',
    instructions: '',
    display_order: '0',
    is_active: true
  })

  useEffect(() => {
    if (editingMethod) {
      setFormData({
        name: editingMethod.name,
        type: editingMethod.type,
        contact_email: editingMethod.contact_email || '',
        contact_phone: editingMethod.contact_phone || '',
        bank_account: editingMethod.bank_account || '',
        instructions: editingMethod.instructions || '',
        display_order: editingMethod.display_order.toString(),
        is_active: editingMethod.is_active
      })
    } else {
      setFormData({
        name: '',
        type: 'bizum',
        contact_email: '',
        contact_phone: '',
        bank_account: '',
        instructions: '',
        display_order: '0',
        is_active: true
      })
    }
  }, [editingMethod, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type) {
      toast.error('Por favor completa todos los campos obligatorios')
      return
    }

    const displayOrder = parseInt(formData.display_order)

    setIsSubmitting(true)

    try {
      const methodData = {
        name: formData.name,
        type: formData.type,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        bank_account: formData.bank_account || null,
        instructions: formData.instructions || null,
        display_order: displayOrder,
        is_active: formData.is_active
      }

      if (editingMethod) {
        await updateMethod(editingMethod.id, methodData)
        toast.success('Método de pago actualizado correctamente')
      } else {
        await createMethod(methodData)
        toast.success('Método de pago creado correctamente')
      }

      onOpenChange(true)
    } catch (error) {
      console.error('Error saving payment method:', error)
      toast.error('Error al guardar el método de pago')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  const showEmailField = ['paypal', 'other'].includes(formData.type)
  const showPhoneField = ['bizum', 'other'].includes(formData.type)
  const showBankField = ['bank_transfer', 'other'].includes(formData.type)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMethod ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Método *</Label>
              <Input
                id="name"
                placeholder="Ej: Bizum, PayPal..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Método *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showPhoneField && (
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Número de Teléfono</Label>
              <Input
                id="contact_phone"
                type="tel"
                placeholder="629845671"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>
          )}

          {showEmailField && (
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input
                id="contact_email"
                type="email"
                placeholder="ejemplo@email.com"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
          )}

          {showBankField && (
            <div className="space-y-2">
              <Label htmlFor="bank_account">Cuenta Bancaria / IBAN</Label>
              <Input
                id="bank_account"
                placeholder="ES12 1234 1234 12 1234567890"
                value={formData.bank_account}
                onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="instructions">Instrucciones</Label>
            <Textarea
              id="instructions"
              placeholder="Instrucciones adicionales para el cliente..."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Estas instrucciones se mostrarán a los clientes al solicitar créditos
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_order">Orden de Visualización</Label>
            <Input
              id="display_order"
              type="number"
              min="0"
              placeholder="0"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Los métodos se ordenan de menor a mayor (0 = primero)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Método activo (visible para clientes)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : editingMethod ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
