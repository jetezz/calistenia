import {
  CreditCard,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/features/auth";
import { useRequestCreditsLogic } from "@/hooks/client/RequestCredits/useRequestCreditsLogic";
import { toast } from "sonner";
import { StandardPage } from "@/components/common";
import { getPaymentMethodIcon } from "@/lib/payment-utils";
import type { Database } from "@/types/database";

type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];

export function RequestCreditsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { packages, methods, isLoading, isSubmitting, submitRequest, refresh } =
    useRequestCreditsLogic();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    credits: "",
    paymentMethod: "",
    notes: "",
  });

  const selectedPackage = packages.find(
    (pkg) => pkg.credits.toString() === formData.credits
  );
  const selectedMethod = methods.find((m) => m.id === formData.paymentMethod);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.credits) {
      toast.error("Por favor selecciona un paquete de clases");
      return;
    }

    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.paymentMethod) {
      toast.error("Por favor selecciona un método de pago");
      return;
    }

    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!user) {
      toast.error("Error de autenticación");
      return;
    }

    try {
      await submitRequest({
        user_id: user.id,
        credits_requested: parseInt(formData.credits),
        payment_method_id: formData.paymentMethod,
        admin_notes: formData.notes || undefined,
      });

      toast.success("Solicitud de créditos enviada correctamente");

      setFormData({
        credits: "",
        paymentMethod: "",
        notes: "",
      });

      navigate(ROUTES.APP.ROOT);
    } catch (error) {
      console.error("Error submitting credit request:", error);
      toast.error("Error al enviar la solicitud. Inténtalo de nuevo.");
    }
  };

  const renderPaymentDetails = (method: PaymentMethod) => {
    const details = [];

    if (method.contact_phone) {
      details.push({ label: "Teléfono", value: method.contact_phone });
    }
    if (method.contact_email) {
      details.push({ label: "Email", value: method.contact_email });
    }
    if (method.bank_account) {
      details.push({ label: "Cuenta bancaria", value: method.bank_account });
    }

    return details;
  };

  return (
    <StandardPage
      icon={CreditCard}
      title="Solicitar Créditos"
      onRefresh={refresh}
      isLoading={isLoading}
      loadingMessage="Cargando información..."
      description={
        step === 1
          ? "Selecciona el paquete de clases que necesitas"
          : step === 2
          ? "Realiza el pago y selecciona el método utilizado"
          : "Confirma tu solicitud"
      }
      maxWidth="max-w-2xl"
    >
      {packages.length === 0 && !isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="size-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay paquetes disponibles
            </h3>
            <p className="text-muted-foreground">
              Por favor, contacta con el administrador
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-5" />
                  Paquetes de Clases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="credits">Selecciona un paquete</Label>
                    <Select
                      value={formData.credits}
                      onValueChange={(value) =>
                        setFormData({ ...formData, credits: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Elige el número de clases" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages.map((pkg) => (
                          <SelectItem
                            key={pkg.id}
                            value={pkg.credits.toString()}
                          >
                            <div className="flex justify-between items-center w-full">
                              <span>
                                {pkg.package_name && (
                                  <strong>{pkg.package_name} - </strong>
                                )}
                                {pkg.name}
                              </span>
                              <span className="font-medium text-green-600 ml-4">
                                {pkg.price}€
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedPackage && (
                      <p className="text-sm text-muted-foreground">
                        Precio:{" "}
                        <span className="font-medium text-green-600">
                          {selectedPackage.price}€
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Añade cualquier comentario o solicitud especial..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="min-h-[100px]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!formData.credits}
                  >
                    <ArrowRight className="size-4 mr-2" />
                    Solicitar Créditos
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && selectedPackage && (
            <>
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">
                    Realiza el pago
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4">
                    <div className="text-4xl font-bold text-blue-900 mb-2">
                      {selectedPackage.price}€
                    </div>
                    <div className="text-blue-700">
                      {selectedPackage.package_name && (
                        <strong>{selectedPackage.package_name} - </strong>
                      )}
                      {selectedPackage.name}
                    </div>
                  </div>

                  {selectedMethod && (
                    <div className="bg-white rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-blue-900">
                        Datos para realizar el pago:
                      </h3>
                      {renderPaymentDetails(selectedMethod).map(
                        (detail, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm text-muted-foreground">
                              {detail.label}:
                            </span>
                            <span className="font-medium">{detail.value}</span>
                          </div>
                        )
                      )}
                      {selectedMethod.instructions && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">
                            {selectedMethod.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Selecciona el método de pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleStep2Submit} className="space-y-4">
                    <div className="space-y-3">
                      {methods.map((method) => {
                        const Icon = getPaymentMethodIcon(method.type);
                        const isSelected = formData.paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                paymentMethod: method.id,
                              })
                            }
                            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 bg-gray-50 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon
                                className={`size-6 ${
                                  isSelected
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                }`}
                              />
                              <div className="flex-1">
                                <div className="font-medium">{method.name}</div>
                                {method.instructions && (
                                  <div className="text-sm text-muted-foreground">
                                    {method.instructions}
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <CheckCircle2 className="size-5 text-primary" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!formData.paymentMethod}
                    >
                      <CheckCircle2 className="size-4 mr-2" />
                      Ya he realizado el pago
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}

          {step === 3 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-900 flex items-center gap-2">
                  <CheckCircle2 className="size-6" />
                  Información importante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 text-green-800">
                  <p className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>Tu solicitud será revisada por el administrador</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Recibirás información de pago una vez aprobada la
                      solicitud
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Los créditos se activarán tras confirmar el pago
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>
                      Puedes ver el estado de tu solicitud en la página
                      principal
                    </span>
                  </p>
                </div>

                <Button
                  onClick={handleFinalSubmit}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  <CheckCircle2 className="size-4 mr-2" />
                  {isSubmitting ? "Enviando solicitud..." : "Aceptar"}
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </StandardPage>
  );
}
