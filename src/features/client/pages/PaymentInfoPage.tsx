import { CreditCard, Smartphone, Mail, Phone, MapPin, Clock, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function PaymentInfoPage() {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Using a simple alert since we don't have access to toast here
      alert(`${label} copiado al portapapeles: ${text}`)
    }).catch(() => {
      alert(`Error al copiar. ${label}: ${text}`)
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Información de Pago</h1>
          <p className="text-muted-foreground">
            Métodos de pago disponibles y datos de contacto
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Smartphone className="size-5" />
                Bizum
                <Badge className="bg-green-100 text-green-700">Recomendado</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-green-600 bg-green-50 p-4 rounded-lg">
                  629 845 671
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard('629845671', 'Número de Bizum')}
                >
                  Copiar número
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Instrucciones:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Abre tu app de Bizum</li>
                  <li>2. Envía el importe indicado</li>
                  <li>3. Incluye tu nombre completo en el concepto</li>
                  <li>4. Los créditos se activarán en 24-48h</li>
                </ul>
              </div>

              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex gap-2 text-sm">
                  <AlertCircle className="size-4 text-green-600 shrink-0 mt-0.5" />
                  <div className="text-green-700">
                    <p className="font-medium">Pago instantáneo</p>
                    <p>Método más rápido y seguro</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <CreditCard className="size-5" />
                PayPal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-lg font-mono text-blue-600 bg-blue-50 p-4 rounded-lg break-all">
                  calistenia.center@gmail.com
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard('calistenia.center@gmail.com', 'Email de PayPal')}
                >
                  Copiar email
                </Button>
              </div>
              
              <div className="space-y-2 text-sm">
                <h4 className="font-medium">Instrucciones:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>1. Accede a tu cuenta PayPal</li>
                  <li>2. Envía dinero a amigos</li>
                  <li>3. Incluye tu nombre y número de clases</li>
                  <li>4. Confirma el pago por WhatsApp</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex gap-2 text-sm">
                  <AlertCircle className="size-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-blue-700">
                    <p className="font-medium">Pago seguro</p>
                    <p>Protección del comprador incluida</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price List */}
        <Card>
          <CardHeader>
            <CardTitle>Tarifas de Clases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-700">4</div>
                <div className="text-sm text-muted-foreground mb-2">clases</div>
                <div className="text-xl font-bold text-green-600">40€</div>
                <div className="text-xs text-muted-foreground">10€/clase</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-700">8</div>
                <div className="text-sm text-muted-foreground mb-2">clases</div>
                <div className="text-xl font-bold text-blue-600">70€</div>
                <div className="text-xs text-muted-foreground">8.75€/clase</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-700">12</div>
                <div className="text-sm text-muted-foreground mb-2">clases</div>
                <div className="text-xl font-bold text-purple-600">100€</div>
                <div className="text-xs text-muted-foreground">8.33€/clase</div>
                <Badge className="mt-1 bg-purple-100 text-purple-700 text-xs">Popular</Badge>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-700">20</div>
                <div className="text-sm text-muted-foreground mb-2">clases</div>
                <div className="text-xl font-bold text-orange-600">160€</div>
                <div className="text-xs text-muted-foreground">8€/clase</div>
                <Badge className="mt-1 bg-orange-100 text-orange-700 text-xs">Mejor valor</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contacto y Ubicación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Teléfono / WhatsApp</div>
                    <div className="text-sm text-muted-foreground">629 845 671</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">calistenia.center@gmail.com</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Ubicación</div>
                    <div className="text-sm text-muted-foreground">Centro de Calistenia<br />Madrid, España</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="size-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Horario de atención</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Lun-Vie: 9:00 - 21:00</div>
                      <div>Sábado: 9:00 - 14:00</div>
                      <div>Domingo: Cerrado</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Notas Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-orange-700">
              <div className="flex gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Confirmación de pago:</strong> Confirma siempre tu pago por WhatsApp para acelerar la activación de créditos.
                </p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Tiempo de activación:</strong> Los créditos se activan en un máximo de 48 horas después del pago.
                </p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Caducidad:</strong> Los créditos no caducan, pero se recomienda usarlos de forma regular para mantener la progresión.
                </p>
              </div>
              <div className="flex gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>
                  <strong>Devoluciones:</strong> Las cancelaciones con más de 2 horas de antelación no consumen crédito.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}