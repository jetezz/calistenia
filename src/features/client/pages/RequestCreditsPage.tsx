import { CreditCard, Send, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/features/auth'
import { usePaymentRequest } from '@/hooks'
import { toast } from 'sonner'

const creditPackages = [
  { value: '4', label: '4 clases', price: '40€' },
  { value: '8', label: '8 clases', price: '70€' },
  { value: '12', label: '12 clases', price: '100€' },
  { value: '20', label: '20 clases', price: '160€' }
]

export function RequestCreditsPage() {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    credits: '',
    notes: ''
  })
  
  const { createPaymentRequest } = usePaymentRequest()

  const selectedPackage = creditPackages.find(pkg => pkg.value === formData.credits)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.credits) {
      toast.error('Por favor selecciona un paquete de clases')
      return
    }

    if (!user) {
      toast.error('Error de autenticación')
      return
    }

    setIsSubmitting(true)

    try {
      await createPaymentRequest({
        user_id: user.id,
        credits_requested: parseInt(formData.credits),
        admin_notes: formData.notes || undefined
      })

      toast.success('Solicitud de créditos enviada correctamente')
      
      // Reset form
      setFormData({
        credits: '',
        notes: ''
      })
      
      // Redirect to home to see the request status
      window.location.href = '/'
    } catch (error) {
      console.error('Error submitting credit request:', error)
      toast.error('Error al enviar la solicitud. Inténtalo de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Solicitar Créditos</h1>
          <p className="text-muted-foreground">
            Selecciona el paquete de clases que necesitas
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="size-5" />
              Paquetes de Clases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="credits">Selecciona un paquete</Label>
                <Select
                  value={formData.credits}
                  onValueChange={(value) => setFormData({ ...formData, credits: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Elige el número de clases" />
                  </SelectTrigger>
                  <SelectContent>
                    {creditPackages.map((pkg) => (
                      <SelectItem key={pkg.value} value={pkg.value}>
                        <div className="flex justify-between items-center w-full">
                          <span>{pkg.label}</span>
                          <span className="font-medium text-green-600 ml-4">{pkg.price}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPackage && (
                  <p className="text-sm text-muted-foreground">
                    Precio: <span className="font-medium text-green-600">{selectedPackage.price}</span>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Añade cualquier comentario o solicitud especial..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !formData.credits}
              >
                <Send className="size-4 mr-2" />
                {isSubmitting ? 'Enviando solicitud...' : 'Solicitar Créditos'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="space-y-3 text-sm">
                <h3 className="font-medium text-orange-800">
                  Información importante
                </h3>
                <div className="space-y-2 text-orange-700">
                  <p>• Tu solicitud será revisada por el administrador</p>
                  <p>• Recibirás información de pago una vez aprobada la solicitud</p>
                  <p>• Los créditos se activarán tras confirmar el pago</p>
                  <p>• Puedes ver el estado de tu solicitud en la página principal</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métodos de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs">
                    B
                  </div>
                  <span className="font-medium">Bizum</span>
                </div>
                <span className="text-blue-600">Recomendado</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                    PP
                  </div>
                  <span className="font-medium">PayPal</span>
                </div>
                <span className="text-muted-foreground">También disponible</span>
              </div>

              <p className="text-muted-foreground text-center pt-2">
                Recibirás los detalles de pago tras la aprobación
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
