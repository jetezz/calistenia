import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Minus,
  UserCheck,
  Trash,
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Tables } from "@/types/database";

interface UserCardProps {
  user: Tables<"profiles">;
  isUpdatingCredits: boolean;
  onCreditsChange: (userId: string, change: number) => void;
  onPaymentStatusChange: (userId: string, status: string) => void;
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string) => void;
  onUpdateApprovalStatus: (userId: string, status: string) => void;
  onDeleteUser: (userId: string, name: string) => void;
}

export function UserCard({
  user,
  isUpdatingCredits,
  onCreditsChange,
  onPaymentStatusChange,
  onApproveUser,
  onRejectUser,
  onUpdateApprovalStatus,
  onDeleteUser,
}: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
            Al día
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
            Pendiente
          </Badge>
        );
      case "unpaid":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
            No pagado
          </Badge>
        );
      default:
        return <Badge variant="secondary">Sin definir</Badge>;
    }
  };

  const getApprovalStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
            <CheckCircle className="size-3 mr-1" />
            Aprobado
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
            <Clock className="size-3 mr-1" />
            Pendiente
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500 text-red-700 bg-red-50">
            <XCircle className="size-3 mr-1" />
            Rechazado
          </Badge>
        );
      default:
        return <Badge variant="secondary">Sin definir</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-11 shrink-0">
            <AvatarFallback className="text-sm font-medium bg-primary/10">
              {getInitials(user.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm leading-tight mb-0.5">
              {user.full_name || "Sin nombre"}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-right">
              <div className="text-lg font-bold leading-none">
                {user.credits}
              </div>
              <div className="text-xs text-muted-foreground">créditos</div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              className="size-8 shrink-0"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          {getApprovalStatusBadge(user.approval_status)}
          {getPaymentStatusBadge(user.payment_status)}
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {/* Credits controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground flex-1">
                Gestionar créditos
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onCreditsChange(user.id, -1)}
                  disabled={user.credits === 0 || isUpdatingCredits}
                >
                  <Minus className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onCreditsChange(user.id, 1)}
                  disabled={isUpdatingCredits}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </div>

            {/* Approval status actions */}
            {user.approval_status === "pending" && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => onApproveUser(user.id)}
                >
                  <CheckCircle className="size-3.5 mr-1.5" />
                  Aprobar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => onRejectUser(user.id)}
                >
                  <XCircle className="size-3.5 mr-1.5" />
                  Rechazar
                </Button>
              </div>
            )}

            {user.approval_status === "rejected" && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-green-500 text-green-600 hover:bg-green-50"
                  onClick={() => onApproveUser(user.id)}
                >
                  <CheckCircle className="size-3.5 mr-1.5" />
                  Aprobar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => onUpdateApprovalStatus(user.id, "pending")}
                >
                  <Clock className="size-3.5 mr-1.5" />
                  Pendiente
                </Button>
              </div>
            )}

            {user.approval_status === "approved" && (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => onUpdateApprovalStatus(user.id, "pending")}
                >
                  <Clock className="size-3.5 mr-1.5" />
                  Pendiente
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-red-500 text-red-600 hover:bg-red-50"
                  onClick={() => onRejectUser(user.id)}
                >
                  <XCircle className="size-3.5 mr-1.5" />
                  Rechazar
                </Button>
              </div>
            )}

            {/* Payment status selector */}
            <div className="space-y-1.5">
              <span className="text-xs text-muted-foreground">
                Cambiar estado de pago
              </span>
              <Select
                value={user.payment_status}
                onValueChange={(value) => onPaymentStatusChange(user.id, value)}
              >
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin definir</SelectItem>
                  <SelectItem value="paid">Al día</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="unpaid">No pagado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={() =>
                  onDeleteUser(user.id, user.full_name || user.email)
                }
              >
                <Trash className="size-3.5 mr-1.5" />
                Eliminar
              </Button>
              <Button asChild size="sm" className="h-9">
                <Link to={`/admin/users/${user.id}`}>
                  <UserCheck className="size-3.5 mr-1.5" />
                  Ver detalle
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
