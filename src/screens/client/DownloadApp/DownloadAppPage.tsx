import { Link } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import { StandardPage } from "@/components/common";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { getFullPath } from "@/lib/routeUtils";
import { openReleaseApkDownload } from "@/lib/apkDownload";

export function DownloadAppPage() {
  const apkFilename =
    import.meta.env.VITE_RELEASE_APK_FILENAME || "app-calistenia-emerita.apk";

  const handleDownload = async () => {
    try {
      await openReleaseApkDownload();
    } catch (error) {
      console.error("Error descargando APK", error);
    }
  };

  return (
    <StandardPage
      icon={Download}
      title="Descargar App"
      description="Descarga la APK de Android y vuelve a la app cuando termines"
      maxWidth="max-w-3xl"
    >
      <Card>
        <CardHeader>
          <CardTitle>Versión móvil de Calistenia Emérita</CardTitle>
          <CardDescription>
            Archivo disponible en Storage: {apkFilename}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pulsa en descargar para obtener la APK. Después puedes volver al
            inicio y seguir usando la aplicación web sin perder sesión.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleDownload} className="sm:min-w-55">
              <Download className="mr-2 size-4" />
              Descargar APK
            </Button>

            <Button asChild variant="outline" className="sm:min-w-55">
              <Link to={ROUTES.APP.ROOT}>
                <ArrowLeft className="mr-2 size-4" />
                Volver al inicio
              </Link>
            </Button>

            <Button asChild variant="ghost" className="sm:min-w-55">
              <Link to={getFullPath(ROUTES.APP.BOOK)}>Ir a reservar clase</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </StandardPage>
  );
}
