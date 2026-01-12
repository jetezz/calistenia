import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile } from "@/features/auth";
import { useProfileStore } from "@/stores/profileStore";
import {
  calculateRecommendations,
  type Gender,
  type PhysicalObjective,
  type IdealStats,
} from "@/utils/biometricsCalculators";
import { Target, Scale, Activity } from "lucide-react";
import { ResponsiveModal } from "./ResponsiveModal";

interface BiometricsSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export function BiometricsSetupModal({
  open,
  onOpenChange,
  onComplete,
}: BiometricsSetupModalProps) {
  const { profile } = useProfile();
  const updateProfile = useProfileStore((state) => state.update);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    gender: Gender | "";
    height: string;
    birth_date: string;
    physical_objective: PhysicalObjective | "";
  }>({
    gender: "",
    height: "",
    birth_date: "",
    physical_objective: "",
  });

  // Initialize form with current profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        gender: (profile.gender as Gender) || "",
        height: profile.height?.toString() || "",
        birth_date: profile.birth_date || "",
        physical_objective:
          (profile.physical_objective as PhysicalObjective) || "",
      });
    }
  }, [profile]);

  // Calculate preview recommendations
  const previewStats: IdealStats | null = useMemo(() => {
    if (
      formData.gender &&
      formData.height &&
      formData.birth_date &&
      formData.physical_objective
    ) {
      try {
        return calculateRecommendations({
          gender: formData.gender as Gender,
          height: parseFloat(formData.height),
          birth_date: formData.birth_date,
          physical_objective: formData.physical_objective as PhysicalObjective,
        });
      } catch {
        return null;
      }
    }
    return null;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (
      !formData.gender ||
      !formData.height ||
      !formData.birth_date ||
      !formData.physical_objective
    ) {
      // Basic validation
      return;
    }

    setLoading(true);
    try {
      await updateProfile(profile.id, {
        gender: formData.gender,
        height: parseFloat(formData.height),
        birth_date: formData.birth_date,
        physical_objective: formData.physical_objective,
      });
      onOpenChange(false);
      onComplete?.();
    } catch (error) {
      console.error("Failed to update biometrics:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveModal
      isOpen={open}
      onOpenChange={onOpenChange}
      title="Configuración de Biometría"
      description="Ajusta tus datos para recalcular tus objetivos ideales."
      maxWidth="sm:max-w-[750px]"
      footer={
        <div className="flex w-full gap-3 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="biometrics-form"
            disabled={loading}
            className="flex-1 sm:flex-none"
          >
            {loading ? "Guardando..." : "Confirmar y Guardar"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Form */}
        <form
          id="biometrics-form"
          onSubmit={handleSubmit}
          className="grid gap-4"
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gender" className="text-right">
              Género
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, gender: val as Gender }))
              }
            >
              <SelectTrigger className="col-span-3" id="gender">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Hombre</SelectItem>
                <SelectItem value="female">Mujer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="height" className="text-right">
              Altura (cm)
            </Label>
            <Input
              id="height"
              type="number"
              value={formData.height}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, height: e.target.value }))
              }
              className="col-span-3"
              placeholder="Ej: 175"
              min="50"
              max="300"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birth_date" className="text-right">
              Nacimiento
            </Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  birth_date: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="objective" className="text-right">
              Objetivo
            </Label>
            <Select
              value={formData.physical_objective}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  physical_objective: val as PhysicalObjective,
                }))
              }
            >
              <SelectTrigger className="col-span-3" id="objective">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="health">Salud General</SelectItem>
                <SelectItem value="strength">Fuerza / Hipertrofia</SelectItem>
                <SelectItem value="longevity">Longevidad</SelectItem>
                <SelectItem value="aesthetics">
                  Estética / Definición
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        {/* Right Column: Preview Cards */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
            <Target className="size-4" />
            Tus Nuevas Metas Estimadas
          </h4>

          {previewStats ? (
            <div className="grid gap-3">
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 relative overflow-hidden">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                      Peso Ideal
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-primary">
                        {previewStats.weight.ideal}
                      </span>
                      <span className="text-sm text-primary/80">kg</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Rango: {previewStats.weight.min} -{" "}
                      {previewStats.weight.max} kg
                    </p>
                  </div>
                  <Scale className="size-8 text-primary/20 absolute right-2 bottom-2" />
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 relative overflow-hidden">
                <div className="flex justify-between items-start z-10 relative">
                  <div>
                    <p className="text-xs text-emerald-700 font-medium uppercase tracking-wider">
                      Masa Muscular Estimada
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-emerald-800">
                        {previewStats.muscleMass.min}-
                        {previewStats.muscleMass.max}
                      </span>
                      <span className="text-sm text-emerald-600">kg</span>
                    </div>
                    <p className="text-[10px] text-emerald-600/80 mt-1 leading-tight">
                      Calculado en base a tu composición objetivo
                    </p>
                  </div>
                  <Activity className="size-8 text-emerald-500/20 absolute right-2 bottom-2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 border border-border rounded-xl p-3 relative overflow-hidden">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      Grasa Corporal
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-bold">
                        {previewStats.bodyFat.min}%
                      </span>
                      <span className="text-xs text-muted-foreground">
                        - {previewStats.bodyFat.max}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary/50 border border-border rounded-xl p-3 relative overflow-hidden">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">
                      IMC Objetivo
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-lg font-bold">
                        {previewStats.bmi.min}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        - {previewStats.bmi.max}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-800">
                <Activity className="size-3 inline-block mr-1 mb-0.5" />
                Estos objetivos están optimizados para{" "}
                <strong>
                  {formData.physical_objective === "health"
                    ? "Salud y Bienestar"
                    : formData.physical_objective === "strength"
                    ? "Fuerza y Rendimiento"
                    : formData.physical_objective === "longevity"
                    ? "Longevidad"
                    : "Definición Estética"}
                </strong>
                .
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-xl border-muted-foreground/20">
              <Target className="size-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">
                Completa el formulario para ver tus metas personalizadas
              </p>
            </div>
          )}
        </div>
      </div>
    </ResponsiveModal>
  );
}
