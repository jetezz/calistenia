import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWeightStatsForm } from "@/hooks/client/WeightStats/useWeightStatsForm";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

interface AddMeasurementFormProps {
  onSuccess?: () => void;
  className?: string;
}

export const AddMeasurementForm = ({ onSuccess, className }: AddMeasurementFormProps) => {
  const { formData, errors, isSubmitting, updateField, handleSubmit, resetForm } =
    useWeightStatsForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();

    if (success) {
      toast.success("Medición guardada correctamente");
      onSuccess?.();
    } else {
      toast.error("Error al guardar la medición");
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Añadir Nueva Medición</CardTitle>
        <CardDescription>
          Registra tus métricas de composición corporal. Solo el peso es obligatorio.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Peso - OBLIGATORIO */}
            <div className="space-y-2">
              <Label htmlFor="weight">
                Peso (kg) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                placeholder="70.5"
                value={formData.weight}
                onChange={(e) => updateField("weight", e.target.value)}
                className={errors.weight ? "border-destructive" : ""}
              />
              {errors.weight && (
                <p className="text-sm text-destructive">{errors.weight}</p>
              )}
            </div>

            {/* Fecha */}
            <div className="space-y-2">
              <Label htmlFor="recorded_at">
                Fecha de medición <span className="text-destructive">*</span>
              </Label>
              <Input
                id="recorded_at"
                type="date"
                value={formData.recorded_at}
                onChange={(e) => updateField("recorded_at", e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className={errors.recorded_at ? "border-destructive" : ""}
              />
              {errors.recorded_at && (
                <p className="text-sm text-destructive">{errors.recorded_at}</p>
              )}
            </div>

            {/* Grasa Corporal */}
            <div className="space-y-2">
              <Label htmlFor="body_fat_percentage">Grasa Corporal (%)</Label>
              <Input
                id="body_fat_percentage"
                type="number"
                step="0.1"
                placeholder="15.5"
                value={formData.body_fat_percentage}
                onChange={(e) => updateField("body_fat_percentage", e.target.value)}
                className={errors.body_fat_percentage ? "border-destructive" : ""}
              />
              {errors.body_fat_percentage && (
                <p className="text-sm text-destructive">{errors.body_fat_percentage}</p>
              )}
            </div>

            {/* Masa Muscular */}
            <div className="space-y-2">
              <Label htmlFor="muscle_mass">Masa Muscular (kg)</Label>
              <Input
                id="muscle_mass"
                type="number"
                step="0.1"
                placeholder="55.2"
                value={formData.muscle_mass}
                onChange={(e) => updateField("muscle_mass", e.target.value)}
                className={errors.muscle_mass ? "border-destructive" : ""}
              />
              {errors.muscle_mass && (
                <p className="text-sm text-destructive">{errors.muscle_mass}</p>
              )}
            </div>

            {/* Masa Ósea */}
            <div className="space-y-2">
              <Label htmlFor="bone_mass">Masa Ósea (kg)</Label>
              <Input
                id="bone_mass"
                type="number"
                step="0.01"
                placeholder="3.2"
                value={formData.bone_mass}
                onChange={(e) => updateField("bone_mass", e.target.value)}
                className={errors.bone_mass ? "border-destructive" : ""}
              />
              {errors.bone_mass && (
                <p className="text-sm text-destructive">{errors.bone_mass}</p>
              )}
            </div>

            {/* IMC */}
            <div className="space-y-2">
              <Label htmlFor="bmi">IMC (Índice de Masa Corporal)</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                placeholder="23.5"
                value={formData.bmi}
                onChange={(e) => updateField("bmi", e.target.value)}
                className={errors.bmi ? "border-destructive" : ""}
              />
              {errors.bmi && <p className="text-sm text-destructive">{errors.bmi}</p>}
            </div>

            {/* Calorías Diarias */}
            <div className="space-y-2">
              <Label htmlFor="daily_calorie_intake">Calorías Diarias (kcal)</Label>
              <Input
                id="daily_calorie_intake"
                type="number"
                placeholder="2000"
                value={formData.daily_calorie_intake}
                onChange={(e) => updateField("daily_calorie_intake", e.target.value)}
                className={errors.daily_calorie_intake ? "border-destructive" : ""}
              />
              {errors.daily_calorie_intake && (
                <p className="text-sm text-destructive">{errors.daily_calorie_intake}</p>
              )}
            </div>

            {/* Edad Metabólica */}
            <div className="space-y-2">
              <Label htmlFor="metabolic_age">Edad Metabólica (años)</Label>
              <Input
                id="metabolic_age"
                type="number"
                placeholder="25"
                value={formData.metabolic_age}
                onChange={(e) => updateField("metabolic_age", e.target.value)}
                className={errors.metabolic_age ? "border-destructive" : ""}
              />
              {errors.metabolic_age && (
                <p className="text-sm text-destructive">{errors.metabolic_age}</p>
              )}
            </div>

            {/* Agua Corporal */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="total_body_water_percentage">Agua Corporal (%)</Label>
              <Input
                id="total_body_water_percentage"
                type="number"
                step="0.1"
                placeholder="60.5"
                value={formData.total_body_water_percentage}
                onChange={(e) =>
                  updateField("total_body_water_percentage", e.target.value)
                }
                className={errors.total_body_water_percentage ? "border-destructive" : ""}
              />
              {errors.total_body_water_percentage && (
                <p className="text-sm text-destructive">
                  {errors.total_body_water_percentage}
                </p>
              )}
            </div>

            {/* Notas */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Ej: Medición en ayunas, después de entrenar..."
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  Guardar Medición
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
