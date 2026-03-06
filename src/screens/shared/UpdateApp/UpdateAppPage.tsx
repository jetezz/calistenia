import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Download,
  AlertTriangle,
  Smartphone,
  Calendar,
  CreditCard,
  Trophy,
  CheckCircle2,
  Shield,
  Star,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const AppLogo = ({ className }: { className?: string }) => (
  <img src="/logo.webp" alt="Calistenia Emérita" className={className} />
);

export function UpdateAppPage() {
  const [version, setVersion] = useState<string | null>(null);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    async function fetchUpdateInfo() {
      try {
        // 1. Get version
        const { data: versionData, error: versionError } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "app-version")
          .single();

        if (!versionError && versionData) {
          let remoteVersion = versionData.value as string;
          if (typeof remoteVersion === "string") {
            remoteVersion = remoteVersion.replace(/"/g, "");
          }
          setVersion(remoteVersion);
        } else {
          console.warn("App version not found in app_settings", versionError);
          setVersion("más reciente");
        }

        // 2. Find APK in releases bucket
        const { data: files, error: filesError } = await supabase.storage
          .from("releases")
          .list();

        if (filesError) {
          console.warn("Releases bucket is not available", filesError);
          setApkUrl(null);
        } else {
          const apkFile = files?.find((file) => file.name.endsWith(".apk"));

          if (apkFile) {
            const { data: publicUrlData } = supabase.storage
              .from("releases")
              .getPublicUrl(apkFile.name);

            const ts = apkFile.updated_at
              ? new Date(apkFile.updated_at).getTime()
              : Date.now();
            setApkUrl(`${publicUrlData.publicUrl}?t=${ts}`);
          } else {
            setApkUrl(null);
          }
        }
      } catch (err: unknown) {
        console.error("Error fetching update info", err);
        setError("No se pudo cargar la información de actualización.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpdateInfo();
  }, []);

  const handleDownload = () => {
    if (!apkUrl) return;
    setIsDownloading(true);
    window.location.href = apkUrl;
    setTimeout(() => setIsDownloading(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 gap-4">
        <Skeleton className="h-20 w-20 rounded-2xl bg-white/10" />
        <Skeleton className="h-8 w-56 bg-white/10" />
        <Skeleton className="h-5 w-36 bg-white/10" />
        <Skeleton className="h-14 w-full max-w-sm rounded-xl bg-white/10 mt-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-500/20 p-5 rounded-full mb-6">
          <AlertTriangle className="h-12 w-12 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Algo salió mal
        </h1>
        <p className="text-gray-400 max-w-xs">{error}</p>
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: "Reserva clases",
      description: "Reserva y gestiona tus sesiones de entrenamiento con un solo toque.",
    },
    {
      icon: CreditCard,
      title: "Gestiona pagos",
      description: "Consulta tus bonos, realiza pagos y revisa tu historial fácilmente.",
    },
    {
      icon: Trophy,
      title: "Seguimiento",
      description: "Visualiza tu progreso y estadísticas para mantener la motivación.",
    },
    {
      icon: Dumbbell,
      title: "Rutinas a mano",
      description: "Accede a tus rutinas personalizadas en cualquier momento y lugar.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Descarga el APK",
      description: "Pulsa el botón de descarga y guarda el archivo en tu dispositivo.",
    },
    {
      number: "2",
      title: "Permite instalación",
      description: "En Ajustes > Seguridad, activa \"Instalar apps desconocidas\".",
    },
    {
      number: "3",
      title: "Abre e instala",
      description: "Abre el archivo descargado y sigue los pasos de instalación.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative bg-gray-950 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-12 sm:pt-24 sm:pb-16 max-w-2xl mx-auto">
          {/* App icon */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150" />
            <div className="relative bg-white rounded-2xl p-4 shadow-2xl shadow-black/60 w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
              <AppLogo className="w-16 h-16 sm:w-20 sm:h-20 object-contain" />
            </div>
          </div>

          {/* Version badge */}
          {version && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-300 text-xs font-medium mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              Versión {version} disponible
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight text-balance mb-4">
            App de Calistenia Emérita
          </h1>

          <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-sm text-balance mb-8">
            Lleva tu entrenamiento siempre contigo. Reserva, sigue tu progreso y gestiona tus pagos desde el móvil.
          </p>

          {/* Download CTA */}
          <div className="w-full max-w-sm space-y-3">
            {apkUrl ? (
              <Button
                size="lg"
                className="w-full h-14 text-base font-bold bg-white hover:bg-gray-100 text-gray-900 shadow-xl shadow-black/30 rounded-xl gap-3 transition-all duration-200 active:scale-95"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                <Download className="h-5 w-5" />
                {isDownloading ? "Iniciando descarga…" : "Descargar APK gratis"}
              </Button>
            ) : (
              <Button
                disabled
                size="lg"
                className="w-full h-14 text-base rounded-xl"
              >
                <Download className="h-5 w-5 mr-2" />
                APK no disponible
              </Button>
            )}

            <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-gray-400" />
              Solo para Android • Instalación segura
            </p>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <div className="bg-black py-3 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-6 text-gray-400 text-xs font-medium flex-wrap">
          
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Actualizaciones gratis
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 fill-current" />
            Exclusivo para clientes
          </span>
        </div>
      </div>

      {/* Features Section */}
      <section className="px-4 py-12 sm:py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Todo lo que necesitas
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              Diseñada para que saques el máximo partido a tu entrenamiento
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start"
              >
                <div className="shrink-0 bg-gray-100 rounded-lg p-2.5">
                  <Icon className="h-5 w-5 text-gray-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Steps */}
      <section className="px-4 py-12 sm:py-16 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Instala en 3 pasos
            </h2>
            <p className="mt-2 text-gray-500 text-sm sm:text-base">
              Sencillo y rápido, menos de 2 minutos
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-4 items-start p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-black text-lg">
                  {step.number}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">{step.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-12 sm:py-16 bg-gray-950">
        <div className="max-w-sm mx-auto text-center space-y-5">
          <div className="bg-white/10 rounded-full p-3 w-fit mx-auto">
            <Smartphone className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight text-balance">
            ¿Listo para entrenar?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Descarga la app y empieza a gestionar todo tu entrenamiento desde tu móvil.
          </p>
          {apkUrl ? (
            <Button
              size="lg"
              className="w-full h-14 text-base font-bold bg-white text-gray-900 hover:bg-gray-100 rounded-xl shadow-xl gap-3 transition-all duration-200 active:scale-95"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-5 w-5" />
              {isDownloading ? "Iniciando descarga…" : "Descargar ahora"}
            </Button>
          ) : (
            <Button
              disabled
              size="lg"
              className="w-full h-14 text-base rounded-xl bg-white/10 text-gray-400"
            >
              APK no disponible
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-6 px-4 text-center">
        <p className="text-gray-500 text-xs">
          © {new Date().getFullYear()} Calistenia Emérita · App exclusiva para clientes
        </p>
      </footer>
    </div>
  );
}
