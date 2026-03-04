import { useAppVersion } from "@/hooks/useAppVersion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { openReleaseApkDownload } from "@/lib/apkDownload";
import { Download } from "lucide-react";

export function UpdateRequiredModal() {
  const { isUpdateRequired, latestVersion } = useAppVersion();

  const handleUpdate = async () => {
    try {
      await openReleaseApkDownload();
    } catch (error) {
      console.error("Error al abrir el navegador", error);
    }
  };

  if (!isUpdateRequired || window.location.pathname === ROUTES.UPDATE_APP) {
    return null;
  }

  // Dialog en modo controlado y bloqueante (no se puede cerrar)
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="sm:max-w-md text-center rounded-2xl mx-4">
        <DialogHeader className="flex flex-col items-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Download className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold">Actualización Necesaria</DialogTitle>
          <DialogDescription className="text-base mt-2">
            Hay una nueva versión de la aplicación disponible ({latestVersion}). 
            Por favor, actualiza para continuar usando Calistenia App.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 sm:justify-center">
          <Button size="lg" className="w-full text-base font-semibold" onClick={handleUpdate}>
            Descargar Actualización
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
