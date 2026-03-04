import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Download, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function UpdateAppPage() {
  const [version, setVersion] = useState<string | null>(null);
  const [apkUrl, setApkUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
          if (typeof remoteVersion === 'string') {
            remoteVersion = remoteVersion.replace(/"/g, '');
          }
          setVersion(remoteVersion);
        } else {
          console.warn("App version not found in app_settings", versionError);
          setVersion("más reciente");
        }

        // 2. Find APK in releases bucket
        const { data: files, error: filesError } = await supabase
          .storage
          .from("releases")
          .list();

        if (filesError) {
          console.warn("Releases bucket is not available", filesError);
          setApkUrl(null);
        } else {
          const apkFile = files?.find((file) => file.name.endsWith(".apk"));

          if (apkFile) {
            const { data: publicUrlData } = supabase
              .storage
              .from("releases")
              .getPublicUrl(apkFile.name);

            setApkUrl(publicUrlData.publicUrl);
          } else {
            setApkUrl(null);
          }
        }
      } catch (err: any) {
        console.error("Error fetching update info", err);
        setError("No se pudo cargar la información de actualización.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUpdateInfo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
        <Skeleton className="h-16 w-16 rounded-full mb-6" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-48 mb-8" />
        <Skeleton className="h-12 w-full max-w-sm rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background text-center">
        <AlertTriangle className="h-16 w-16 text-destructive mb-6" />
        <h1 className="text-2xl font-bold mb-2">Oops</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-background text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <Download className="h-12 w-12 text-primary" />
      </div>
      
      <h1 className="text-3xl font-extrabold mb-2 tracking-tight">
        Nueva actualización disponible
      </h1>
      
      <p className="text-lg text-muted-foreground mb-8">
        Versión {version || "más reciente"}
      </p>

      {apkUrl ? (
        <Button 
          size="lg" 
          className="w-full max-w-sm text-lg h-14 font-semibold shadow-lg"
          onClick={() => { window.location.href = apkUrl; }}
        >
          Descargar APK
        </Button>
      ) : (
        <Button disabled size="lg" className="w-full max-w-sm text-lg h-14">
          APK no disponible
        </Button>
      )}

      <p className="mt-8 text-sm text-muted-foreground max-w-xs">
        Descarga e instala el archivo APK para continuar disfrutando de las últimas funciones y mejoras.
      </p>
    </div>
  );
}
