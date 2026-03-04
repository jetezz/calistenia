import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase/client";

const getReleaseApkFilename = () =>
  import.meta.env.VITE_RELEASE_APK_FILENAME || "app-calistenia-emerita.apk";

export const getReleaseApkPublicUrl = () => {
  const { data } = supabase.storage
    .from("releases")
    .getPublicUrl(getReleaseApkFilename());

  return data.publicUrl;
};

export const openReleaseApkDownload = async () => {
  const apkUrl = getReleaseApkPublicUrl();

  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url: apkUrl });
    return;
  }

  window.location.assign(apkUrl);
};
