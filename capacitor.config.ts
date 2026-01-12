import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.calistenia.app",
  appName: "calistenia",
  webDir: "dist",
  server: {
    url: undefined,
    cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      style: "default",
      backgroundColor: "#ffffff",
      overlaysWebView: false,
    },
  },
};

export default config;
