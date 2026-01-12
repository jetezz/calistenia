import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StandardPage } from "@/components/common";
import { useWeightStatsLogic } from "@/hooks/client/WeightStats/useWeightStatsLogic";
import { useWeightStatsCharts } from "@/hooks/client/WeightStats/useWeightStatsCharts";
import { WeightCompositionChart } from "@/components/weight-stats/WeightCompositionChart";
import { BodyPercentagesChart } from "@/components/weight-stats/BodyPercentagesChart";
import { BMIChart } from "@/components/weight-stats/BMIChart";
import { MetabolismChart } from "@/components/weight-stats/MetabolismChart";
import { MetricsOverview } from "@/components/weight-stats/MetricsOverview";
import { TimeRangeSelector } from "@/components/weight-stats/TimeRangeSelector";
import { AddMeasurementForm } from "@/components/weight-stats/AddMeasurementForm";
import { EmptyState } from "@/components/weight-stats/EmptyState";
import { BiometricsSetupModal } from "@/components/weight-stats/BiometricsSetupModal";
import { Plus, Activity, Settings2, RefreshCw } from "lucide-react";

export default function WeightStatsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBiometricsOpen, setIsBiometricsOpen] = useState(false);

  const {
    stats,
    latestStat,
    hasData,
    selectedTimeRange,
    handleTimeRangeChange,
    isLoading,
    error,
    refreshData,
    recommendations,
  } = useWeightStatsLogic();

  const {
    weightCompositionData,
    bodyPercentagesData,
    bmiData,
    metabolismData,
    latestMetrics,
    trends,
  } = useWeightStatsCharts(stats);

  const handleFormSuccess = () => {
    setIsDialogOpen(false);
    refreshData();
  };

  // Error state
  if (error) {
    return (
      <StandardPage
        icon={Activity}
        title="Estadísticas"
        description="Seguimiento de tu composición corporal"
        maxWidth="max-w-7xl"
      >
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
            <Button onClick={refreshData} className="mt-4">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </StandardPage>
    );
  }

  // Empty state
  if (!hasData && !isLoading) {
    return (
      <StandardPage
        icon={Activity}
        title="Estadísticas"
        description="Seguimiento de tu composición corporal"
        topActions={
          <>
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 shadow-sm hover:shadow transition-shadow shrink-0"
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBiometricsOpen(true)}
            >
              <Settings2 className="mr-1 size-4" />
              Configurar
            </Button>
          </>
        }
        bottomActions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 size-4" />
                Nueva
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Medición</DialogTitle>
                <DialogDescription>
                  Registra tus métricas de composición corporal. Solo el peso es
                  obligatorio.
                </DialogDescription>
              </DialogHeader>
              <AddMeasurementForm onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        }
        maxWidth="max-w-7xl"
      >
        <EmptyState
          action={
            <Button onClick={() => setIsDialogOpen(true)} size="lg">
              <Plus className="mr-1 size-4" />
              Añadir Primera Medición
            </Button>
          }
        />
        <BiometricsSetupModal
          open={isBiometricsOpen}
          onOpenChange={setIsBiometricsOpen}
          onComplete={() => refreshData()}
        />
      </StandardPage>
    );
  }

  // Main content with data
  return (
    <>
      <StandardPage
        icon={Activity}
        title="Estadísticas"
        description="Seguimiento de tu composición corporal"
        topActions={
          <>
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 shadow-sm hover:shadow transition-shadow shrink-0"
            >
              <RefreshCw className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBiometricsOpen(true)}
            >
              <Settings2 className="mr-1 size-4" />
              Configurar
            </Button>
          </>
        }
        bottomActions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 size-4" />
                Nueva
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
              <DialogHeader>
                <DialogTitle>Añadir Nueva Medición</DialogTitle>
                <DialogDescription>
                  Registra tus métricas de composición corporal. Solo el peso es
                  obligatorio.
                </DialogDescription>
              </DialogHeader>
              <AddMeasurementForm onSuccess={handleFormSuccess} />
            </DialogContent>
          </Dialog>
        }
        isLoading={isLoading}
        loadingMessage="Cargando tus estadísticas..."
        maxWidth="max-w-7xl"
      >
        {hasData && latestMetrics && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="history">Historial</TabsTrigger>
            </TabsList>

            {/* Tab: Resumen */}
            <TabsContent value="overview" className="space-y-6">
              {/* Time Range Selector */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-xl font-semibold">Métricas Actuales</h2>
                <TimeRangeSelector
                  selected={selectedTimeRange}
                  onChange={handleTimeRangeChange}
                />
              </div>

              {/* Metrics Overview */}
              <MetricsOverview
                metrics={latestMetrics}
                trends={trends}
                recommendations={recommendations}
              />

              {/* Gráficas especializadas */}
              <div className="space-y-6">
                <WeightCompositionChart
                  data={weightCompositionData}
                  recommendations={recommendations}
                />
                <BodyPercentagesChart
                  data={bodyPercentagesData}
                  recommendations={recommendations}
                />
                <BMIChart data={bmiData} recommendations={recommendations} />
                <MetabolismChart data={metabolismData} />
              </div>

              {latestStat?.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Notas de la Última Medición
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {latestStat.notes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab: Historial */}
            <TabsContent value="history" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Historial de Mediciones
                </h2>
                <p className="text-sm text-muted-foreground">
                  Total: {stats.length}{" "}
                  {stats.length === 1 ? "medición" : "mediciones"}
                </p>
              </div>

              <div className="grid gap-4">
                {stats.map((stat) => (
                  <Card key={stat.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {new Date(stat.recorded_at).toLocaleDateString(
                          "es-ES",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </CardTitle>
                      <CardDescription>
                        Registrado el{" "}
                        {new Date(stat.created_at).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Peso:</span>
                          <span className="font-medium">{stat.weight} kg</span>
                        </div>
                        {stat.body_fat_percentage && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Grasa:
                            </span>
                            <span className="font-medium">
                              {stat.body_fat_percentage}%
                            </span>
                          </div>
                        )}
                        {stat.muscle_mass && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Músculo:
                            </span>
                            <span className="font-medium">
                              {stat.muscle_mass} kg
                            </span>
                          </div>
                        )}
                        {stat.bone_mass && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Hueso:
                            </span>
                            <span className="font-medium">
                              {stat.bone_mass} kg
                            </span>
                          </div>
                        )}
                        {stat.bmi && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IMC:</span>
                            <span className="font-medium">{stat.bmi}</span>
                          </div>
                        )}
                        {stat.total_body_water_percentage && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Agua:</span>
                            <span className="font-medium">
                              {stat.total_body_water_percentage}%
                            </span>
                          </div>
                        )}
                        {stat.daily_calorie_intake && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Calorías:
                            </span>
                            <span className="font-medium">
                              {stat.daily_calorie_intake} kcal
                            </span>
                          </div>
                        )}
                        {stat.metabolic_age && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Edad Metabólica:
                            </span>
                            <span className="font-medium">
                              {stat.metabolic_age} años
                            </span>
                          </div>
                        )}
                        {stat.notes && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="text-muted-foreground italic">
                              {stat.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </StandardPage>
      <BiometricsSetupModal
        open={isBiometricsOpen}
        onOpenChange={setIsBiometricsOpen}
        onComplete={() => refreshData()}
      />
    </>
  );
}
