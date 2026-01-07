import { useState, useEffect } from 'react'
import { CreditCard, Check, X, Clock, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { PageLoadingState } from '@/components/common'
import { usePaymentRequest, useProfile as useProfileHook, useToast } from '@/hooks'
import { useProfile } from '@/features/auth'
import type { Database } from '@/types/database'

type PaymentRequestWithUser = Database['public']['Tables']['payment_requests']['Row'] & {
  user: { id: string; full_name: string | null; email: string }
}

export function AdminPaymentRequestsPage() {
  const [processingRequest, setProcessingRequest] = useState<PaymentRequestWithUser | null>(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const { success, error: showError } = useToast()
  const { profile: adminProfile } = useProfile()
  const { 
    paymentRequests: requests, 
    loading: isLoading, 
    fetchPaymentRequests,
    updatePaymentRequest: updatePaymentRequestStatus
  } = usePaymentRequest()
  
  // Cast to include user relations since service returns joined data
  const typedRequests = requests as PaymentRequestWithUser[]
  const { updateCredits } = useProfileHook()

  const handleProcessRequest = async (status: 'approved' | 'rejected') => {
    if (!processingRequest || !adminProfile) return

    try {
      setIsProcessing(true)
      
      await updatePaymentRequestStatus(
        processingRequest.id,
        {
          status,
          admin_notes: adminNotes || null,
          processed_by: adminProfile.id,
          processed_at: new Date().toISOString()
        }
      )
      
      // If approved, also update user credits
      if (status === 'approved') {
        await updateCredits(
          processingRequest.user_id,
          processingRequest.credits_requested
        )
      }
      
      success(`Solicitud ${status === 'approved' ? 'aprobada' : 'rechazada'}`)
      setProcessingRequest(null)
      setAdminNotes('')
    } catch (error) {
      console.error('Error processing payment request:', error)
      showError('Error al procesar la solicitud')
    } finally {
      setIsProcessing(false)
    }
  }

  const getRequestStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
      case 'approved':
        return <Badge className="bg-green-500 text-white">Aprobada</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rechazada</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingRequests = typedRequests.filter(req => req.status === 'pending')
  const processedRequests = typedRequests.filter(req => req.status !== 'pending')

  useEffect(() => {
    fetchPaymentRequests()
  }, [fetchPaymentRequests])

  if (isLoading) {
    return <PageLoadingState message="Cargando solicitudes de pago..." />
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Solicitudes de Pago</h1>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de recarga de créditos
          </p>
        </div>
        <Button onClick={fetchPaymentRequests}>
          <CreditCard className="size-4 mr-2" />
          Actualizar Lista
        </Button>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="size-5" />
            Solicitudes Pendientes ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="size-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No hay solicitudes pendientes
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-yellow-50 border-yellow-200"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="size-12">
                      <AvatarFallback className="text-sm">
                        {getInitials(request.user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {request.user.full_name || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.user.email}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Solicitado: {formatDate(request.created_at)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {request.credits_requested}
                      </div>
                      <div className="text-xs text-muted-foreground">créditos</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4 sm:mt-0">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => setProcessingRequest(request)}
                    >
                      <Check className="size-4 mr-1" />
                      Aprobar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setProcessingRequest(request)}
                    >
                      <X className="size-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Solicitudes Procesadas ({processedRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10">
                      <AvatarFallback className="text-xs">
                        {getInitials(request.user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {request.user.full_name || 'Sin nombre'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {request.credits_requested} créditos • {formatDate(request.created_at)}
                      </div>
                      {request.admin_notes && (
                        <div className="text-xs text-muted-foreground italic">
                          "{request.admin_notes}"
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 mt-2 sm:mt-0">
                    {getRequestStatusBadge(request.status)}
                    {request.processed_at && (
                      <div className="text-xs text-muted-foreground">
                        {formatDate(request.processed_at)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Dialog */}
      <Dialog 
        open={!!processingRequest} 
        onOpenChange={() => !isProcessing && setProcessingRequest(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Procesar Solicitud de Pago</DialogTitle>
          </DialogHeader>
          
          {processingRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="size-12">
                  <AvatarFallback>
                    {getInitials(processingRequest.user.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {processingRequest.user.full_name || 'Sin nombre'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {processingRequest.user.email}
                  </div>
                  <div className="text-sm font-medium">
                    Solicita: {processingRequest.credits_requested} créditos
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="admin_notes">Notas del administrador (opcional)</Label>
                <Textarea
                  id="admin_notes"
                  placeholder="Agregar notas sobre esta decisión..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setProcessingRequest(null)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleProcessRequest('rejected')}
              disabled={isProcessing}
            >
              <X className="size-4 mr-1" />
              Rechazar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleProcessRequest('approved')}
              disabled={isProcessing}
            >
              <Check className="size-4 mr-1" />
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
