import { Badge } from "@/components/ui/badge";
import { Info, BookOpen, Target, Lightbulb } from "lucide-react";
import { ResponsiveModal } from "./ResponsiveModal";
import type { PhysicalObjective } from "@/utils/biometricsCalculators";
import { Button } from "@/components/ui/button";

export type MetricType = "weight" | "bodyFat" | "bmi" | "muscleMass";

interface ScientificInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: MetricType;
  objective: PhysicalObjective;
}

const OBJECTIVE_LABELS: Record<PhysicalObjective, string> = {
  health: "Salud y Bienestar",
  strength: "Fuerza e Hipertrofia",
  longevity: "Longevidad",
  aesthetics: "Estética y Definición",
};

const METRIC_LABELS: Record<MetricType, string> = {
  weight: "Peso Corporal Ideal",
  bodyFat: "Grasa Corporal",
  bmi: "IMC",
  muscleMass: "Masa Muscular",
};

const KNOWLEDGE_BASE = {
  weight: {
    explanation: (obj: PhysicalObjective) =>
      obj === "strength"
        ? "Para objetivos de fuerza, el peso ideal se calcula permitiendo un superávit de masa muscular sobre la fórmula estándar médica."
        : "El peso ideal se calcula utilizando la Fórmula de Devine (1974), un estándar médico utilizado para estimar el peso corporal saludable basado en la altura y el género.",
    study: (obj: PhysicalObjective) =>
      obj === "strength"
        ? "Los estándares de fuerza sugieren que un IMC ligeramente superior debido a masa magra no conlleva los riesgos cardiovasculares asociados a la grasa."
        : "La Fórmula de Devine fue desarrollada originalmente para calcular dosis de medicamentos, pero se ha convertido en el estándar más utilizado para estimar el peso corporal ideal (IBW) en entornos clínicos.",
    reference:
      "Devine BJ. Gentamicin therapy. Drug Intell Clin Pharm. 1974;8:650–655.",
    tips: [
      "El peso es solo un número; la composición (grasa vs músculo) es más importante.",
      "Las fluctuaciones diarias de 1-2kg por agua son normales.",
    ],
  },
  bodyFat: {
    explanation: (obj: PhysicalObjective) => {
      switch (obj) {
        case "aesthetics":
          return "Para estética, buscamos niveles de grasa corporal bajos (8-12% hombres, 16-20% mujeres) que permitan la máxima definición muscular visible.";
        case "longevity":
          return "Para longevidad, se busca un nivel de grasa bajo pero sostenible, minimizando la grasa visceral que es metabólicamente activa y proinflamatoria.";
        default:
          return "Basado en los rangos saludables del American Council on Exercise (ACE) y el American College of Sports Medicine (ACSM).";
      }
    },
    study: () =>
      "El porcentaje de grasa corporal es considerado por muchos expertos como el mejor indicador único de salud física, superior al IMC, ya que distingue entre masa magra y masa grasa.",
    reference:
      "American Council on Exercise (ACE) Body Fat Categorization; American College of Sports Medicine guidelines.",
    tips: [
      "La grasa esencial es necesaria para la vida (3-5% hombres, 10-13% mujeres).",
      "Bajar de cierto nivel puede afectar hormonalmente; escucha a tu cuerpo.",
    ],
  },
  bmi: {
    explanation: (obj: PhysicalObjective) =>
      obj === "strength"
        ? "Tu rango de IMC objetivo es superior al estándar (25.0 - 27.5). Tradicionalmente esto sería 'sobrepeso', pero en contextos de fuerza, este rango acomoda la masa muscular extra necesaria para el rendimiento."
        : "El Índice de Masa Corporal (IMC) es una relación peso/altura utilizada globalmente para detectar riesgos de salud.",
    study: () =>
      "La Organización Mundial de la Salud (OMS) define los rangos de IMC. Sin embargo, estudios recientes (ej. NHANES) sugieren que para la longevidad, un IMC en la parte media-alta de 'normal' o 'ligero sobrepeso' (por músculo) puede ser protector en la vejez.",
    reference:
      "World Health Organization. Physical status: the use and interpretation of anthropometry. 1995.",
    tips: [
      "El IMC no distingue entre grasa y músculo.",
      "Es una herramienta de cribado, no un diagnóstico de salud corporal.",
    ],
  },
  muscleMass: {
    explanation: (obj: PhysicalObjective) =>
      obj === "strength"
        ? "Para fuerza, tu objetivo de masa muscular es muy ambicioso. Buscamos maximizar el tejido contráctil para generar mayor tensión y potencia."
        : "La masa muscular es vital no solo para el movimiento, sino como órgano endocrino y reserva metabólica.",
    study: () =>
      "La masa magra (FFM) se correlaciona inversamente con la mortalidad por todas las causas. Mantener masa muscular es crucial para prevenir la sarcopenia y mantener la sensibilidad a la insulina.",
    reference:
      "Srikanthan P, Karlamangla AS. Muscle mass index as a predictor of longevity in older adults. Am J Med. 2014.",
    tips: [
      "Para ganar músculo: superávit calórico ligero + proteína adecuada + estímulo de fuerza.",
      "El descanso es cuando el músculo crece, no durante el entrenamiento.",
    ],
  },
};

export function ScientificInfoModal({
  isOpen,
  onClose,
  metric,
  objective,
}: ScientificInfoModalProps) {
  const info = KNOWLEDGE_BASE[metric];

  if (!info) return null;

  if (!info) return null;
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={
        <>
          {METRIC_LABELS[metric]}
          <Info className="size-4 text-muted-foreground shrink-0" />
        </>
      }
      description="Por qué te recomendamos este objetivo específico."
      badges={
        <>
          <Badge
            variant="secondary"
            className="text-[10px] px-1.5 py-0.5 font-medium"
          >
            Evidencia Científica
          </Badge>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0.5 bg-background/80"
          >
            {OBJECTIVE_LABELS[objective]}
          </Badge>
        </>
      }
      footer={
        <Button onClick={onClose} className="w-full" size="sm">
          Entendido
        </Button>
      }
      footerClassName="sm:hidden"
    >
      {/* 1. Personalized Goal */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Target className="size-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">Tu Objetivo Personalizado</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed pl-8">
          {info.explanation(objective)}
        </p>
      </section>

      {/* 2. Science Says */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <BookOpen className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-sm">Lo que dice la Ciencia</h3>
        </div>
        <div className="bg-muted/40 border border-border/50 rounded-xl p-3.5 pl-8 relative">
          <div className="absolute left-3 top-3 text-muted-foreground/20 text-3xl leading-none font-serif">
            "
          </div>
          <p className="text-[13px] leading-relaxed text-foreground/90 italic">
            {info.study(objective)}
          </p>
        </div>
        <p className="text-[11px] text-muted-foreground pl-8 leading-relaxed">
          <span className="font-semibold">Fuente:</span> {info.reference}
        </p>
      </section>

      {/* 3. Key Tips */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-yellow-500/10 rounded-lg">
            <Lightbulb className="size-4 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="font-semibold text-sm">Consejos Clave</h3>
        </div>
        <ul className="space-y-2 pl-8">
          {info.tips.map((tip, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
            >
              <div className="mt-1.5 size-1.5 rounded-full bg-primary/60 shrink-0" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </section>
    </ResponsiveModal>
  );
}
