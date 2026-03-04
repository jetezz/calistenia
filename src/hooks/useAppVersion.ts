import { useState, useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase/client";

const isEnvTrue = (value: string | boolean | undefined) =>
  value === true || value === "true";

const normalizeVersion = (value: string) => {
  const cleaned = value.trim();
  if (!cleaned) return cleaned;

  const segments = cleaned.split(".");
  while (segments.length > 1 && segments[segments.length - 1] === "0") {
    segments.pop();
  }

  return segments.join(".");
};

export const useAppVersion = () => {
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const appPlatform = (import.meta.env.VITE_APP_PLATFORM || "web").toLowerCase();
        const forceUpdateScreen = isEnvTrue(import.meta.env.VITE_FORCE_UPDATE_REQUIRED_SCREEN);
        const shouldValidateAsMobile =
          Capacitor.isNativePlatform() || appPlatform === "mobile" || forceUpdateScreen;

        if (forceUpdateScreen) {
          setIsUpdateRequired(true);
        }

        if (!shouldValidateAsMobile) {
          setIsLoading(false);
          return;
        }

        let localVersion = import.meta.env.VITE_DEBUG_CURRENT_APP_VERSION || "web-debug";

        if (Capacitor.isNativePlatform()) {
          const appInfo = await App.getInfo();
          localVersion = appInfo.version;
        }

        setCurrentVersion(localVersion);

        const { data, error } = await supabase
          .from("app_settings")
          .select("value")
          .eq("key", "app-version")
          .single();

        if (error || !data) {
          console.error("Error fetching app version from DB", error);
          setIsLoading(false);
          return;
        }

        // El valor viene como jsonb, si es un string (e.g. '"1.0.0"'), Supabase en js
        // podría devolverlo sin las comillas, o tal vez siga siendo string.
        let remoteVersion = data.value as string;
        if (typeof remoteVersion === 'string') {
          remoteVersion = remoteVersion.replace(/"/g, '');
        }

        setLatestVersion(remoteVersion);

        const normalizedLocalVersion = normalizeVersion(localVersion);
        const normalizedRemoteVersion = normalizeVersion(remoteVersion);

        if (normalizedLocalVersion !== normalizedRemoteVersion) {
          setIsUpdateRequired(true);
        }
      } catch (err) {
        console.error("Failed to check app version", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkVersion();
  }, []);

  return { isUpdateRequired, latestVersion, currentVersion, isLoading };
};
