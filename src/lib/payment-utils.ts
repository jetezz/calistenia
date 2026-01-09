import { Phone, Mail, Landmark, Wallet } from "lucide-react";

export const getPaymentMethodIcon = (type: string) => {
  switch (type) {
    case "bizum":
      return Phone;
    case "paypal":
      return Mail;
    case "bank_transfer":
      return Landmark;
    case "cash":
      return Wallet;
    default:
      return Wallet;
  }
};

export const getPaymentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    bizum: "Bizum",
    paypal: "PayPal",
    bank_transfer: "Transferencia",
    cash: "Efectivo",
    other: "Otro",
  };
  return labels[type] || type;
};
