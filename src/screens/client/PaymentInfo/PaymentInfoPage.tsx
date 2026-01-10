import {
  Smartphone,
  Mail,
  Phone,
  Landmark,
  Wallet,
  AlertCircle,
  Clock,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StandardPage } from "@/components/common";
import { usePaymentInfoLogic } from "@/hooks/client/PaymentInfo/usePaymentInfoLogic";
import { toast } from "sonner";

const getPaymentIcon = (type: string) => {
  switch (type) {
    case "bizum":
      return <Smartphone className="size-5" />;
    case "paypal":
      return <Mail className="size-5" />;
    case "bank_transfer":
      return <Landmark className="size-5" />;
    case "cash":
      return <Wallet className="size-5" />;
    default:
      return <Wallet className="size-5" />;
  }
};

const getPaymentColor = (type: string) => {
  switch (type) {
    case "bizum":
      return "green";
    case "paypal":
      return "blue";
    case "bank_transfer":
      return "purple";
    case "cash":
      return "orange";
    default:
      return "gray";
  }
};

export function PaymentInfoPage() {
  const { methods, isLoading, refresh } = usePaymentInfoLogic();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${label} copiado al portapapeles`);
      })
      .catch(() => {
        toast.error("Error al copiar");
      });
  };

  return (
    <StandardPage
      icon={CreditCard}
      title="Información de Pago"
      description="Métodos de pago disponibles y datos de contacto"
      onRefresh={refresh}
      isLoading={isLoading}
      loadingMessage="Cargando información de pago..."
      maxWidth="max-w-4xl"
    >
      {methods.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay métodos de pago disponibles
            </h3>
            <p className="text-muted-foreground">
              Por favor, contacta con el administrador
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {methods.map((method, index) => {
            const color = getPaymentColor(method.type);
            const isRecommended = index === 0;

            return (
              <Card key={method.id} className={`border-${color}-200`}>
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 text-${color}-700`}
                  >
                    {getPaymentIcon(method.type)}
                    {method.name}
                    {isRecommended && (
                      <Badge className={`bg-${color}-100 text-${color}-700`}>
                        Recomendado
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {method.contact_phone && (
                    <div className="text-center">
                      <div
                        className={`text-2xl font-mono font-bold text-${color}-600 bg-${color}-50 p-4 rounded-lg`}
                      >
                        {method.contact_phone}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          copyToClipboard(
                            method.contact_phone!.replace(/\s/g, ""),
                            `Número de ${method.name}`
                          )
                        }
                      >
                        Copiar número
                      </Button>
                    </div>
                  )}

                  {method.contact_email && (
                    <div className="text-center">
                      <div
                        className={`text-lg font-mono text-${color}-600 bg-${color}-50 p-4 rounded-lg break-all`}
                      >
                        {method.contact_email}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          copyToClipboard(
                            method.contact_email!,
                            `Email de ${method.name}`
                          )
                        }
                      >
                        Copiar email
                      </Button>
                    </div>
                  )}

                  {method.bank_account && (
                    <div className="text-center">
                      <div
                        className={`text-sm font-mono text-${color}-600 bg-${color}-50 p-4 rounded-lg break-all`}
                      >
                        {method.bank_account}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() =>
                          copyToClipboard(
                            method.bank_account!.replace(/\s/g, ""),
                            "Cuenta bancaria"
                          )
                        }
                      >
                        Copiar cuenta
                      </Button>
                    </div>
                  )}

                  {method.instructions && (
                    <div className="space-y-2 text-sm">
                      <h4 className="font-medium">Instrucciones:</h4>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {method.instructions}
                      </p>
                    </div>
                  )}

                  <div className={`bg-${color}-50 p-3 rounded-lg`}>
                    <div className="flex gap-2 text-sm">
                      <AlertCircle
                        className={`size-4 text-${color}-600 shrink-0 mt-0.5`}
                      />
                      <div className={`text-${color}-700`}>
                        <p className="font-medium">
                          Método{" "}
                          {method.type === "cash" ? "presencial" : "seguro"}
                        </p>
                        <p>
                          {method.type === "cash"
                            ? "Paga en el centro"
                            : "Pago protegido y verificado"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

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
                  <div className="text-sm text-muted-foreground">
                    629 845 671
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    calistenia.center@gmail.com
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Ubicación</div>
                  <div className="text-sm text-muted-foreground">
                    Centro de Calistenia
                    <br />
                    Madrid, España
                  </div>
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
                <strong>Confirmación de pago:</strong> Confirma siempre tu pago
                por WhatsApp para acelerar la activación de créditos.
              </p>
            </div>
            <div className="flex gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p>
                <strong>Tiempo de activación:</strong> Los créditos se activan
                en un máximo de 48 horas después del pago.
              </p>
            </div>
            <div className="flex gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p>
                <strong>Caducidad:</strong> Los créditos no caducan, pero se
                recomienda usarlos de forma regular para mantener la progresión.
              </p>
            </div>
            <div className="flex gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <p>
                <strong>Devoluciones:</strong> Las cancelaciones con más de 2
                horas de antelación no consumen crédito.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </StandardPage>
  );
}
