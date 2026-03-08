import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { supabase } from "@/lib/supabase/client";

const getReleaseApkFilename = () =>
  import.meta.env.VITE_RELEASE_APK_FILENAME || "app-calistenia-emerita.apk";

export const getReleaseApkPublicUrl = () => {
  const { data } = supabase.storage
    .from("releases")
    .getPublicUrl(getReleaseApkFilename());

  // Cache-busting: Supabase CDN caches by URL, so replacing a file with the
  // same name returns stale content until the cache expires.
  return `${data.publicUrl}?t=${Date.now()}`;
};

export const openReleaseApkDownload = async () => {
  const apkUrl = getReleaseApkPublicUrl();

  if (Capacitor.isNativePlatform()) {
    await Browser.open({ url: apkUrl });
    return;
  }

  window.location.assign(apkUrl);
};
