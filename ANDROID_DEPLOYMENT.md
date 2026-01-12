# Android App Bundle (.aab) Generation Guide

## Overview

To generate a professional Android App Bundle (.aab) for this mobile-first web application ("calistenia"), we are using **Capacitor**. Capacitor is a modern cross-platform native runtime that allows us to wrap the existing React/Vite web application into a native Android container without rewriting code. This is the industry-standard approach for modern web-to-native conversions.

## Prerequisites

- **Node.js** (Installed)
- **Android Studio & SDK**: Required for the final compilation of the `.aab` file. You need the Android SDK Command-line Tools and a valid Java installation.

## Approach

1.  **Wrap with Capacitor**: We install Capacitor to bridge the web app with native Android APIs.
2.  **Build Web Asset**: We build the React app (`pnpm run build`) to generate the `dist` folder.
3.  **Sync with Android**: We copy these assets into a native Android project structure.
4.  **Build Bundle**: We use Gradle (via Capacitor) to build the release bundle.

## Phases & Tasks

### Phase 1: Installation & Configuration

- [x] Install Capacitor Core & CLI
- [x] Install Android Platform
- [x] Initialize Capacitor Project
- [ ] Configure `capacitor.config.ts`

### Phase 2: Building the Web App

- [x] Run `pnpm run build` to generate production assets
- [x] Verify `dist` folder exists

### Phase 3: Android Platform Setup

- [x] Add Android platform (`npx cap add android`)
- [x] Sync assets (`npx cap sync`)

### Phase 4: App Bundle & APK Generation

- [x] Generate `.aab` (Android App Bundle) using Gradle (`bundleRelease`)
- [x] Generate `.apk` for testing (`assembleDebug`)
- [x] (Optional) Open in Android Studio for manual signing if automated build fails due to environment

## Output

The generated files are located at:

- **AAB (Publishing)**: `android/app/build/outputs/bundle/release/app-release.aab`
- **APK (Testing)**: `android/app/build/outputs/apk/debug/app-debug.apk`

## Next Steps (Signing & Publishing)

This bundle is currently **unsigned** (or debug signed). To publish to the Play Store, you must sign it.

1.  **Generate a Keystore** (if you don't have one):
    ```bash
    keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
    ```
2.  **Sign the Bundle**:
    You can use `jarsigner` or configure the signing in `android/app/build.gradle`.
    Alternatively, open the `android` folder in **Android Studio**, go to **Build > Generate Signed Bundle / APK**, and follow the wizard.

## Troubleshooting

- **Java Version**: This project uses Capacitor 8+ which defaults to Java 21. If you have Java 17, you may need to adjust `sourceCompatibility` in `node_modules/@capacitor/android/capacitor/build.gradle` or upgrade your Java environment.
- **SDK Location**: Ensure `android/local.properties` exists and points to your Android SDK (e.g., `sdk.dir=C\:\\Users\\YourUser\\AppData\\Local\\Android\\Sdk`).

## Usage

Once setup is complete, you can generate a new build at any time with:

```bash
pnpm run build
npx cap sync

# For Publishing (AAB)
cd android && ./gradlew bundleRelease

# For Testing (APK)
cd android && ./gradlew assembleDebug
```
