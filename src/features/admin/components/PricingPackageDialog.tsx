import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePricingPackage } from '@/hooks'
import { toast } from 'sonner'
import type { Database } from '@/types/database'

type PricingPackage = Database['public']['Tables']['pricing_packages']['Row']

interface PricingPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingPackage: PricingPackage | null
}

export function PricingPackageDialog({ 
  open, 
  onOpenChange,
  editingPackage 
}: PricingPackageDialogProps) {
  const { createPackage, updatePackage } = usePricingPackage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    package_name: '',
    name: '',
    credits: '',
    price: '',
    display_order: '',
    is_active: true
  })

  useEffect(() => {
    if (editingPackage) {
      setFormData({
        package_name: editingPackage.package_name || '',
        name: editingPackage.name,
        credits: editingPackage.credits.toString(),
        price: editingPackage.price.toString(),
        display_order: editingPackage.display_order.toString(),
        is_active: editingPackage.is_active
      })
    } else {
      setFormData({
        package_name: '',
        name: '',
        credits: '',
        price: '',
        display_order: '0',
        is_active: true
      })
    }
  }, [editingPackage, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.credits || !formData.price) {
      toast.error('Por favor completa todos los campos obligatorios')
      return
    }

    const credits = parseInt(formData.credits)
    const price = parseFloat(formData.price)
    const displayOrder = parseInt(formData.display_order)

    if (credits <= 0) {
      toast.error('El número de clases debe ser mayor a 0')
      return
    }

    if (price < 0) {
      toast.error('El precio no puede ser negativo')
      return
    }

    setIsSubmitting(true)

    try {
      const packageData = {
        package_name: formData.package_name || null,
        name: formData.name,
        credits,
        price,
        display_order: displayOrder,
        is_active: formData.is_active
      }

      if (editingPackage) {
        await updatePackage(editingPackage.id, packageData)
        toast.success('Paquete actualizado correctamente')
      } else {
        await createPackage(packageData)
        toast.success('Paquete creado correctamente')
      }

      onOpenChange(true)
    } catch (error) {
      console.error('Error saving package:', error)
      toast.error('Error al guardar el paquete')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingPackage ? 'Editar Paquete' : 'Nuevo Paquete'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="package_name">Nombre del Paquete (opcional)</Label>
            <Input
              id="package_name"
              placeholder="Ej: Pack Básico, Pack Premium..."
              value={formData.package_name}
              onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Este nombre aparecerá antes del número de clases
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre del Paquete *</Label>
            <Input
              id="name"
              placeholder="Ej: 4 clases"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="credits">Número de Clases *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                placeholder="4"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Precio (€) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="40.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
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
              Los paquetes se ordenan de menor a mayor (0 = primero)
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
              Paquete activo (visible para clientes)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : editingPackage ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
