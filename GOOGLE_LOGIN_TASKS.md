# Lista de Tareas para Implementar Google Login en Android

Estas tareas deben realizarse en orden. Algunas requieren configuración manual en consolas externas (Google Cloud / Supabase).

## 1. Configuración en Código (Yo puedo hacer esto)

- [ ] **Instalar Dependencias**:

  - Instalar `@capacitor-community/google-sign-in`.
  - Sincronizar proyecto nativo (`npx cap sync`).

- [ ] **Configurar Capacitor**:

  - Actualizar `capacitor.config.ts` para incluir la configuración del plugin (Client ID).
  - Verificar `android/app/src/main/res/values/strings.xml` para el `server_client_id` (opcional, pero recomendado).

- [ ] **Modificar Lógica de Auth (`AuthContext.tsx`)**:

  - Detectar plataforma (`Capacitor.isNativePlatform()`).
  - **Si es Web**: Mantener `supabase.auth.signInWithOAuth`.
  - **Si es Nativo (Android/iOS)**:
    - Llamar `GoogleAuth.signIn()`.
    - Obtener `idToken`.
    - Llamar `supabase.auth.signInWithIdToken({ provider: 'google', token: idToken })`.

- [ ] **Configuración Android Manifest**:
  - Verificar permisos de internet (usualmente ya están).

## 2. Tareas de Configuración Externa (Tú debes hacer esto o darme los datos)

Estas tareas requieren acceso a tu Google Cloud Console.

### A. Obtener Huella SHA-1 (Debug)

Necesitamos la huella SHA-1 de tu entorno de desarrollo para probar en el emulador/dispositivo conectado.

1. Ejecuta en tu terminal:
   - Windows: `keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android`
   - Mac/Linux: `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`
2. Copia el valor **SHA1**.

### B. Consola de Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Selecciona tu proyecto.
3. Ve a **APIs & Services > Credentials**.
4. Crea una **Nueva Credencial > OAuth Client ID**.
5. Tipo de Aplicación: **Android**.
6. Package name: `com.calistenia.app` (Verifícalo en `capacitor.config.ts`).
7. SHA-1 Certificate fingerprint: Pega el SHA-1 obtenido en el paso A.
8. Crear.

### C. Copiar Client IDs

Necesitarás dos Client IDs:

1. **Web Client ID**: El que ya usas actualmente en Supabase (termina en `.apps.googleusercontent.com`).
2. **Android Client ID**: El que acabas de crear (no se usa directamente en el código a veces, pero es necesario que exista vinculado).
   _Nota: Para el plugin de Capacitor, usualmente configuramos el `serverClientId` con el valor del **Web Client ID**, no el de Android. El de Android solo sirve para autorizar a la app a usar ese Web ID._

### D. Supabase Dashboard

1. Asegúrate de que en Authentication > Providers > Google, tienes configurado el **Web Client ID** correcto.
2. Añade, si es necesario, `com.calistenia.app://google/link` (o similar) en los Redirect URL, aunque con el método de `signInWithIdToken` esto es menos crítico que con el flujo web.
