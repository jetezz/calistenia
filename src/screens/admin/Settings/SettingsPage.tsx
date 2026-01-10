import { useState, useEffect } from "react";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLoadingState } from "@/components/common";
import {
  ImageUpload,
  VisibilityToggle,
  TestimonialEditor,
} from "@/components/admin";
import { useBrandingSettings } from "@/hooks/admin/Branding/useBrandingSettings";
import { toast } from "sonner";
import type {
  BrandingSettingsUpdate,
  ImageType,
  Testimonial,
} from "@/types/branding";
import { useAdminSettingsLogic } from "@/hooks/admin/Settings/useAdminSettingsLogic";
import { ADMIN_AVAILABLE_ACTIONS, ICONS } from "@/types/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const { settings, isLoading, updateSettings, uploadImage, refresh } =
    useBrandingSettings();
  const {
    getQuickActions,
    updateQuickActions,
    refresh: refreshAppSettings,
  } = useAdminSettingsLogic();

  const quickActions = getQuickActions();

  const handleToggleAction = async (path: string, checked: boolean) => {
    if (path === "/app/admin") return; // Prevent toggling dashboard

    let newActions = [...quickActions];
    if (checked) {
      if (newActions.length >= 4) {
        toast.error("Solo puedes seleccionar hasta 4 acciones");
        return;
      }
      newActions.push(path);
    } else {
      newActions = newActions.filter((a) => a !== path);
    }
    await updateQuickActions(newActions);
    await refreshAppSettings();
  };
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<BrandingSettingsUpdate>({});

  // Update form data when settings load
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleInputChange = (
    field: keyof BrandingSettingsUpdate,
    value: string | boolean | number | Testimonial[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File, type: ImageType) => {
    const result = await uploadImage(file, type);
    if (result.success) {
      toast.success("Imagen subida correctamente");
      // Refresh settings to get the updated image URL
      await refresh();
    } else {
      toast.error(result.error || "Error al subir la imagen");
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateSettings(formData);
      if (result.success) {
        toast.success("Configuración guardada correctamente");
        await refresh();
      } else {
        toast.error(result.error || "Error al guardar la configuración");
      }
    } catch {
      toast.error("Error al guardar la configuración");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = async () => {
    const result = await refresh();
    if (result.success) {
      toast.success("Configuración actualizada");
      if (settings) {
        setFormData(settings);
      }
    } else {
      toast.error(result.error || "Error al actualizar");
    }
  };

  if (isLoading && !settings) {
    return <PageLoadingState message="Cargando configuración..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-32 md:pb-20 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Configuración de Marca</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Personaliza la información que aparece en tu landing page y
            aplicación
          </p>
        </div>
        {/* Desktop buttons - hidden on mobile */}
        <div className="hidden md:flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className="size-4 mr-2" />
            Actualizar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            <Save className="size-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="identity" className="space-y-6">
        <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full overflow-x-auto">
          <TabsTrigger value="identity">Identidad</TabsTrigger>
          <TabsTrigger value="images">Imágenes</TabsTrigger>
          <TabsTrigger value="contact">Contacto</TabsTrigger>
          <TabsTrigger value="location">Ubicación</TabsTrigger>
          <TabsTrigger value="schedule">Horarios</TabsTrigger>
          <TabsTrigger value="texts">Textos</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonios</TabsTrigger>
          <TabsTrigger value="navigation">Navegación</TabsTrigger>
        </TabsList>

        {/* Tab: Identidad */}
        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Identidad de Marca</CardTitle>
              <CardDescription>
                Configura el nombre y logo de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="business_name">Nombre del Negocio</Label>
                <Input
                  id="business_name"
                  value={formData.business_name || ""}
                  onChange={(e) =>
                    handleInputChange("business_name", e.target.value)
                  }
                  placeholder="Ej: Calistenia Emérita"
                />
              </div>

              <ImageUpload
                label="Logo"
                currentImage={settings?.logo_url || formData.logo_url}
                onUpload={(file) => handleImageUpload(file, "logo")}
                aspectRatio="square"
              />

              <VisibilityToggle
                label="Mostrar Logo"
                checked={formData.show_logo ?? true}
                onCheckedChange={(checked) =>
                  handleInputChange("show_logo", checked)
                }
                description="Controla si el logo aparece en la aplicación"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Imágenes */}
        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Imágenes de la Landing Page</CardTitle>
              <CardDescription>
                Sube y gestiona las imágenes principales de tu sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <ImageUpload
                  label="Imagen Principal (Hero)"
                  currentImage={
                    settings?.hero_image_url || formData.hero_image_url
                  }
                  onUpload={(file) => handleImageUpload(file, "hero")}
                  aspectRatio="video"
                />
                <VisibilityToggle
                  label="Mostrar Imagen Hero"
                  checked={formData.show_hero_image ?? true}
                  onCheckedChange={(checked) =>
                    handleInputChange("show_hero_image", checked)
                  }
                />
              </div>

              <div className="space-y-4">
                <ImageUpload
                  label="Foto del Entrenador"
                  currentImage={
                    settings?.trainer_image_url || formData.trainer_image_url
                  }
                  onUpload={(file) => handleImageUpload(file, "trainer")}
                  aspectRatio="square"
                />
                <VisibilityToggle
                  label="Mostrar Foto del Entrenador"
                  checked={formData.show_trainer_image ?? true}
                  onCheckedChange={(checked) =>
                    handleInputChange("show_trainer_image", checked)
                  }
                />
              </div>

              <div className="space-y-4">
                <ImageUpload
                  label="Foto del Grupo"
                  currentImage={
                    settings?.group_image_url || formData.group_image_url
                  }
                  onUpload={(file) => handleImageUpload(file, "group")}
                  aspectRatio="video"
                />
                <VisibilityToggle
                  label="Mostrar Foto del Grupo"
                  checked={formData.show_group_image ?? true}
                  onCheckedChange={(checked) =>
                    handleInputChange("show_group_image", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Contacto */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de Contacto</CardTitle>
              <CardDescription>
                Configura los datos de contacto que aparecerán en la landing
                page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="info@ejemplo.com"
                  />
                </div>
                <VisibilityToggle
                  label="Mostrar Email"
                  checked={formData.show_email ?? true}
                  onCheckedChange={(checked) =>
                    handleInputChange("show_email", checked)
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+34 XXX XXX XXX"
                  />
                </div>
                <VisibilityToggle
                  label="Mostrar Teléfono"
                  checked={formData.show_phone ?? true}
                  onCheckedChange={(checked) =>
                    handleInputChange("show_phone", checked)
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={formData.whatsapp || ""}
                    onChange={(e) =>
                      handleInputChange("whatsapp", e.target.value)
                    }
                    placeholder="34XXXXXXXXX"
                  />
                  <p className="text-sm text-muted-foreground">
                    Número sin espacios ni símbolos (ej: 34612345678)
                  </p>
                </div>
                <VisibilityToggle
                  label="Mostrar WhatsApp"
                  checked={formData.show_whatsapp ?? true}
                  onCheckedChange={(checked) =>
                    handleInputChange("show_whatsapp", checked)
                  }
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram || ""}
                    onChange={(e) =>
                      handleInputChange("instagram", e.target.value)
                    }
                    placeholder="@tuusuario"
                  />
                </div>
                <VisibilityToggle
                  label="Mostrar Instagram"
                  checked={formData.show_instagram ?? true}
                  onCheckedChange={(checked) =>
                    handleInputChange("show_instagram", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Ubicación */}
        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ubicación</CardTitle>
              <CardDescription>
                Información sobre la ubicación de tu negocio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Calle Ejemplo, 123"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="Mérida"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Región/Provincia</Label>
                  <Input
                    id="region"
                    value={formData.region || ""}
                    onChange={(e) =>
                      handleInputChange("region", e.target.value)
                    }
                    placeholder="Extremadura"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    value={formData.country || ""}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    placeholder="España"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="google_maps_url">URL de Google Maps</Label>
                <Input
                  id="google_maps_url"
                  type="url"
                  value={formData.google_maps_url || ""}
                  onChange={(e) =>
                    handleInputChange("google_maps_url", e.target.value)
                  }
                  placeholder="https://maps.google.com/..."
                />
                <p className="text-sm text-muted-foreground">
                  Obtén el enlace desde Google Maps → Compartir → Copiar enlace
                </p>
              </div>

              <VisibilityToggle
                label="Mostrar Ubicación"
                checked={formData.show_location ?? true}
                onCheckedChange={(checked) =>
                  handleInputChange("show_location", checked)
                }
                description="Controla si la ubicación aparece en la landing page"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Horarios */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Horarios de Atención</CardTitle>
              <CardDescription>
                Define los horarios de tu centro
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="schedule_weekdays">Lunes - Viernes</Label>
                <Input
                  id="schedule_weekdays"
                  value={formData.schedule_weekdays || ""}
                  onChange={(e) =>
                    handleInputChange("schedule_weekdays", e.target.value)
                  }
                  placeholder="7:00 - 21:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule_saturday">Sábados</Label>
                <Input
                  id="schedule_saturday"
                  value={formData.schedule_saturday || ""}
                  onChange={(e) =>
                    handleInputChange("schedule_saturday", e.target.value)
                  }
                  placeholder="9:00 - 14:00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule_sunday">Domingos</Label>
                <Input
                  id="schedule_sunday"
                  value={formData.schedule_sunday || ""}
                  onChange={(e) =>
                    handleInputChange("schedule_sunday", e.target.value)
                  }
                  placeholder="Cerrado"
                />
              </div>

              <VisibilityToggle
                label="Mostrar Horarios"
                checked={formData.show_schedule ?? true}
                onCheckedChange={(checked) =>
                  handleInputChange("show_schedule", checked)
                }
                description="Controla si los horarios aparecen en la landing page"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Textos */}
        <TabsContent value="texts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Textos de la Landing Page</CardTitle>
              <CardDescription>
                Personaliza los mensajes principales de tu sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hero_title">Título Principal (Hero)</Label>
                <Textarea
                  id="hero_title"
                  value={formData.hero_title || ""}
                  onChange={(e) =>
                    handleInputChange("hero_title", e.target.value)
                  }
                  rows={2}
                  placeholder="Recupera tu agilidad y fuerza..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_subtitle">Subtítulo (Hero)</Label>
                <Textarea
                  id="hero_subtitle"
                  value={formData.hero_subtitle || ""}
                  onChange={(e) =>
                    handleInputChange("hero_subtitle", e.target.value)
                  }
                  rows={3}
                  placeholder="Entrenamiento personal en grupos reducidos..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hero_cta_text">Texto del Botón Principal</Label>
                <Input
                  id="hero_cta_text"
                  value={formData.hero_cta_text || ""}
                  onChange={(e) =>
                    handleInputChange("hero_cta_text", e.target.value)
                  }
                  placeholder="Solicitar Entrevista Gratuita"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_trainer_text">Sobre el Entrenador</Label>
                <Textarea
                  id="about_trainer_text"
                  value={formData.about_trainer_text || ""}
                  onChange={(e) =>
                    handleInputChange("about_trainer_text", e.target.value)
                  }
                  rows={4}
                  placeholder="Con años de experiencia..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_trainer_quote">Cita del Entrenador</Label>
                <Input
                  id="about_trainer_quote"
                  value={formData.about_trainer_quote || ""}
                  onChange={(e) =>
                    handleInputChange("about_trainer_quote", e.target.value)
                  }
                  placeholder="No eres un número, eres parte de la familia"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Testimonios */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Testimonios de Clientes</CardTitle>
              <CardDescription>
                Gestiona los testimonios que aparecen en la landing page
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TestimonialEditor
                testimonials={formData.testimonials || []}
                onChange={(testimonials) =>
                  handleInputChange("testimonials", testimonials)
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
        {/* Tab: Navegación */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Menú Inferior (App)</CardTitle>
              <CardDescription>
                Selecciona las 4 acciones rápidas que aparecerán en el menú
                inferior de la app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {ADMIN_AVAILABLE_ACTIONS.map((action) => {
                  const Icon = ICONS[action.icon];
                  const isDashboard = action.to === "/app/admin";
                  const isSelected =
                    isDashboard || quickActions.includes(action.to);

                  // Dashboard always disabled (locked). Others disabled if limit reached and not selected
                  const isDisabled =
                    isDashboard || (!isSelected && quickActions.length >= 4);

                  return (
                    <div
                      key={action.to}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg border p-4 transition-colors",
                        isDashboard && "bg-muted/50 border-primary/20"
                      )}
                    >
                      <Checkbox
                        id={`action-${action.to}`}
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={(checked) =>
                          // Dashboard change prevented in handler, but redundant safety here
                          !isDashboard &&
                          handleToggleAction(action.to, checked as boolean)
                        }
                      />
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <Label
                          htmlFor={`action-${action.to}`}
                          className="cursor-pointer font-medium"
                        >
                          {action.label} {isDashboard && "(Obligatorio)"}
                        </Label>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                Seleccionados: {quickActions.length} / 4
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky Action Buttons (Mobile Only) */}
      <div className="fixed bottom-16 left-0 right-0 md:hidden px-4 pb-4 bg-gradient-to-t from-background via-background to-transparent pt-6">
        <div className="flex gap-2 max-w-5xl mx-auto">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex-1 shadow-lg"
            size="lg"
          >
            <RefreshCw className="size-4 mr-2" />
            Actualizar
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="flex-1 shadow-lg"
            size="lg"
          >
            <Save className="size-4 mr-2" />
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
