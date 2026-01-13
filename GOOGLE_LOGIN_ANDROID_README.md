# Google Login en Android con Capacitor y Supabase

Este documento detalla por qué falla la implementación actual de Google Login en la versión Android y describe el plan de acción para solucionarlo.

## 🛑 El Problema Actual

Actualmente, la aplicación utiliza `supabase.auth.signInWithOAuth()` con el flujo web estándar.

1.  **En Web**: Funciona porque el navegador maneja la redirección a Google y el retorno a la URL de la aplicación (`window.location.origin`).
2.  **En Android (Capacitor)**: Falla por una de las siguientes razones:
    - **Redirección Incorrecta**: Cuando Google intenta redirigir al usuario después del login, no sabe cómo "volver" a la aplicación nativa porque no hay un esquema de enlace profundo (Deep Link) configurado (ej. `com.calistenia.app://`).
    - **Restricciones de Webview**: Google bloquea intentos de login OAuth desde ciertos tipos de webviews incrustados por seguridad (Error 403: disallowed_useragent), aunque Capacitor suele manejar esto, la experiencia no es nativa.
    - **Falta de Configuración Nativa**: Capacitor necesita plugins nativos para interactuar correctamente con los servicios de Google Play en el dispositivo.

## 🛠️ La Solución: Plugin Nativo

Para que funcione correctamente y de forma profesional en Android, debemos usar el plugin oficial de la comunidad: **`@capacitor-community/google-sign-in`**.

El flujo cambiará así en Android:

1.  La App solicita el login a través del plugin nativo.
2.  El plugin usa el diálogo nativo de Android (más rápido y seguro).
3.  Google devuelve un `idToken`.
4.  La App envía este `idToken` a Supabase para iniciar sesión (`signInWithIdToken`).

## 📋 Requisitos Previos (Google Cloud Console)

Para que esto funcione, necesitas acceso a la consola de Google Cloud donde tienes configurado el OAuth actual. Necesitarás crear una **Credencial de Cliente ID para Android** vinculada al `package name` de tu app (`com.calistenia.app`) y a la huella digital **SHA-1** de tu certificado de firma (debug o release).
