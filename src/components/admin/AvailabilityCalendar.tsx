import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface AvailabilityCalendarProps {
  onDateClick: (date: string, slots: any[]) => void;
}

export function AvailabilityCalendar({
  onDateClick,
}: AvailabilityCalendarProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Calendar className="size-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Calendario de Disponibilidad
        </h3>
        <p className="text-sm text-muted-foreground">
          El calendario interactivo se implementará en la siguiente fase.
        </p>
      </CardContent>
    </Card>
  );
}
