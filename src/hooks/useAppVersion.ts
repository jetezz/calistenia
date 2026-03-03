import { useState, useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase/client";

export const useAppVersion = () => {
  const [isUpdateRequired, setIsUpdateRequired] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        if (!Capacitor.isNativePlatform()) {
          setIsLoading(false);
          return;
        }

        const appInfo = await App.getInfo();
        const localVersion = appInfo.version;
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

        if (localVersion !== remoteVersion) {
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
