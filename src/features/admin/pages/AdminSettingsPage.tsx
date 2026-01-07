import { useState, useEffect } from 'react'
import { Settings, Save, Clock, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks'
import { useAuth } from '@/features/auth'
import { useAppSettings } from '@/hooks/useAppSettings'
import { PageLoadingState } from '@/components/common'

export function AdminSettingsPage() {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const { cancellationPolicy, loading, updateCancellationPolicy, fetchCancellationPolicy } = useAppSettings()
  
  const [unit, setUnit] = useState<'hours' | 'days'>('hours')
  const [value, setValue] = useState<string>('2')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchCancellationPolicy()
  }, [fetchCancellationPolicy])

  useEffect(() => {
    if (cancellationPolicy) {
      setUnit(cancellationPolicy.unit)
      setValue(cancellationPolicy.value.toString())
    }
  }, [cancellationPolicy])

  const handleSave = async () => {
    if (!user) return
    
    const numValue = value === '' ? 0 : parseInt(value)
    
    if (isNaN(numValue) || numValue < 0) {
      showError('El valor debe ser 0 o mayor')
      return
    }

    setIsSaving(true)
    try {
      await updateCancellationPolicy({ unit, value: numValue }, user.id)
      success('Política de cancelación actualizada correctamente')
    } catch (error) {
      console.error('Error updating cancellation policy:', error)
      showError('Error al actualizar la política de cancelación')
    } finally {
      setIsSaving(false)
    }
  }

  const getPreviewText = () => {
    const numValue = value === '' ? 0 : parseInt(value)
    if (isNaN(numValue) || numValue === 0) {
      return 'Los clientes podrán cancelar sus reservas en cualquier momento, incluso minutos antes de la clase'
    }
    if (unit === 'hours') {
      return `Los clientes podrán cancelar sus reservas con al menos ${numValue} ${numValue === 1 ? 'hora' : 'horas'} de antelación`
    } else {
      return `Los clientes podrán cancelar sus reservas con al menos ${numValue} ${numValue === 1 ? 'día' : 'días'} de antelación`
    }
  }

  if (loading && !cancellationPolicy) {
    return <PageLoadingState message="Cargando configuración..." />
  }

  return (
    <div className="container mx-auto px-3 py-4 pb-20 space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Settings className="size-8" />
        <div>
          <h1 className="text-2xl font-bold">Configuración</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona las políticas y configuraciones de la aplicación
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Política de Cancelación
          </CardTitle>
          <CardDescription>
            Configura el tiempo mínimo requerido antes de que un cliente pueda cancelar una reserva
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="value">Tiempo mínimo</Label>
              <Input
                id="value"
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">0 = Siempre se puede cancelar</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unidad</Label>
              <Select value={unit} onValueChange={(value) => setUnit(value as 'hours' | 'days')}>
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4" />
                      <span>Horas</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="days">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>Días</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <h4 className="font-medium text-sm mb-2 text-blue-900">Vista previa</h4>
            <p className="text-sm text-blue-800">
              {getPreviewText()}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none"
            >
              <Save className="size-4 mr-2" />
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Información</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <span className="font-medium min-w-[120px]">Configuración actual:</span>
              <span>
                {cancellationPolicy?.value} {cancellationPolicy?.unit === 'hours' ? 'horas' : 'días'}
              </span>
            </div>
            <div className="pt-3 border-t space-y-2">
              <p>• Esta configuración afecta a todos los clientes</p>
              <p>• Los cambios se aplican inmediatamente</p>
              <p>• Las reservas existentes no se verán afectadas retroactivamente</p>
              <p>• Los clientes verán el mensaje actualizado en su panel</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
