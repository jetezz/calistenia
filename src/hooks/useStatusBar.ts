import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { StatusBar, Style } from "@capacitor/status-bar";

/**
 * Hook para configurar la barra de estado en dispositivos móviles
 */
export function useStatusBar() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      // Detectar si el tema es oscuro
      const isDark = document.documentElement.classList.contains("dark");

      // Configurar la barra de estado para que no se solape con el contenido
      StatusBar.setStyle({
        style: isDark ? Style.Dark : Style.Light,
      }).catch(console.error);

      StatusBar.setBackgroundColor({
        color: isDark ? "#0f172a" : "#ffffff",
      }).catch(console.error);

      StatusBar.setOverlaysWebView({ overlay: false }).catch(console.error);
    }
  }, []);
}
