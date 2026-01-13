import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (value: string) => void;
  approvalStatusFilter: string;
  onApprovalStatusChange: (value: string) => void;
}

export function UsersFilters({
  searchQuery,
  onSearchChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  approvalStatusFilter,
  onApprovalStatusChange,
}: UsersFiltersProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
          <Input
            placeholder="Nombre o email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-10 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">
          Estado
        </label>
        <Select
          value={approvalStatusFilter}
          onValueChange={onApprovalStatusChange}
        >
          <SelectTrigger className="h-10 text-sm w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="approved">Aprobados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="rejected">Rechazados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">
          Estado de pago
        </label>
        <Select
          value={paymentStatusFilter}
          onValueChange={onPaymentStatusChange}
        >
          <SelectTrigger className="h-10 text-sm w-full">
            <SelectValue placeholder="Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="paid">Al día</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="unpaid">No pagado</SelectItem>
            <SelectItem value="none">Sin definir</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
