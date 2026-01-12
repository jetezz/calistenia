import { useState, useCallback } from "react";
import { useWeightStatsStore } from "@/stores/weightStatsStore";
import type { WeightStatsInsert } from "@/services/weightStatsService";
import { useProfile } from "@/features/auth";

/**
 * Formulario para agregar nueva medición de peso
 */
export interface WeightStatsFormData {
  weight: string;
  body_fat_percentage: string;
  muscle_mass: string;
  bone_mass: string;
  bmi: string;
  daily_calorie_intake: string;
  metabolic_age: string;
  total_body_water_percentage: string;
  recorded_at: string;
  notes: string;
}

export interface WeightStatsFormErrors {
  weight?: string;
  body_fat_percentage?: string;
  muscle_mass?: string;
  bone_mass?: string;
  bmi?: string;
  daily_calorie_intake?: string;
  metabolic_age?: string;
  total_body_water_percentage?: string;
  recorded_at?: string;
}

const initialFormData: WeightStatsFormData = {
  weight: "",
  body_fat_percentage: "",
  muscle_mass: "",
  bone_mass: "",
  bmi: "",
  daily_calorie_intake: "",
  metabolic_age: "",
  total_body_water_percentage: "",
  recorded_at: new Date().toISOString().split("T")[0], // Fecha de hoy por defecto
  notes: "",
};

/**
 * Hook para el formulario de agregar mediciones
 */
export const useWeightStatsForm = () => {
  const { profile } = useProfile();
  const userId = profile?.id;
  const { create } = useWeightStatsStore();

  const [formData, setFormData] = useState<WeightStatsFormData>(initialFormData);
  const [errors, setErrors] = useState<WeightStatsFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar un campo del formulario
  const updateField = useCallback((field: keyof WeightStatsFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al editarlo
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  // Validar formulario
  const validate = useCallback((): boolean => {
    const newErrors: WeightStatsFormErrors = {};

    // Weight es obligatorio
    if (!formData.weight || parseFloat(formData.weight) <= 0) {
      newErrors.weight = "El peso es obligatorio y debe ser mayor a 0";
    }

    // Validar rangos opcionales
    if (formData.body_fat_percentage) {
      const value = parseFloat(formData.body_fat_percentage);
      if (value < 0 || value > 100) {
        newErrors.body_fat_percentage = "Debe estar entre 0 y 100";
      }
    }

    if (formData.muscle_mass) {
      const value = parseFloat(formData.muscle_mass);
      if (value < 0 || value > 300) {
        newErrors.muscle_mass = "Debe estar entre 0 y 300 kg";
      }
    }

    if (formData.bone_mass) {
      const value = parseFloat(formData.bone_mass);
      if (value < 0 || value > 50) {
        newErrors.bone_mass = "Debe estar entre 0 y 50 kg";
      }
    }

    if (formData.bmi) {
      const value = parseFloat(formData.bmi);
      if (value < 0 || value > 100) {
        newErrors.bmi = "Debe estar entre 0 y 100";
      }
    }

    if (formData.daily_calorie_intake) {
      const value = parseInt(formData.daily_calorie_intake);
      if (value < 0 || value > 10000) {
        newErrors.daily_calorie_intake = "Debe estar entre 0 y 10000 calorías";
      }
    }

    if (formData.metabolic_age) {
      const value = parseInt(formData.metabolic_age);
      if (value < 0 || value > 150) {
        newErrors.metabolic_age = "Debe estar entre 0 y 150 años";
      }
    }

    if (formData.total_body_water_percentage) {
      const value = parseFloat(formData.total_body_water_percentage);
      if (value < 0 || value > 100) {
        newErrors.total_body_water_percentage = "Debe estar entre 0 y 100";
      }
    }

    // Validar fecha
    if (!formData.recorded_at) {
      newErrors.recorded_at = "La fecha es obligatoria";
    } else {
      const selectedDate = new Date(formData.recorded_at);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Fin del día de hoy

      if (selectedDate > today) {
        newErrors.recorded_at = "La fecha no puede ser futura";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Enviar formulario
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!userId) {
      setErrors({ weight: "Usuario no autenticado" });
      return false;
    }

    if (!validate()) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const data: WeightStatsInsert = {
        user_id: userId,
        weight: parseFloat(formData.weight),
        body_fat_percentage: formData.body_fat_percentage
          ? parseFloat(formData.body_fat_percentage)
          : null,
        muscle_mass: formData.muscle_mass ? parseFloat(formData.muscle_mass) : null,
        bone_mass: formData.bone_mass ? parseFloat(formData.bone_mass) : null,
        bmi: formData.bmi ? parseFloat(formData.bmi) : null,
        daily_calorie_intake: formData.daily_calorie_intake
          ? parseInt(formData.daily_calorie_intake)
          : null,
        metabolic_age: formData.metabolic_age
          ? parseInt(formData.metabolic_age)
          : null,
        total_body_water_percentage: formData.total_body_water_percentage
          ? parseFloat(formData.total_body_water_percentage)
          : null,
        recorded_at: new Date(formData.recorded_at).toISOString(),
        notes: formData.notes || null,
      };

      await create(data);

      // Reset form
      setFormData(initialFormData);
      setErrors({});

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al guardar";
      setErrors({ weight: errorMessage });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [userId, formData, validate, create]);

  // Reset formulario
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  // Calcular BMI automáticamente (opcional, requiere altura del perfil)
  const calculateBMI = useCallback((weight: number, heightInMeters: number): string => {
    if (heightInMeters <= 0) return "";
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2);
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    handleSubmit,
    resetForm,
    validate,
    calculateBMI,
  };
};
