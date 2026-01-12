# Solución al problema de solapamiento con la barra de estado de Android

## Problema

El contenido de la aplicación se estaba solapando con la barra de estado superior de Android (donde aparece la hora, WiFi, batería, etc.), haciendo que la información fuera difícil de leer.

## Causa

La aplicación no estaba configurada para respetar las "safe areas" del dispositivo, específicamente el `safe-area-inset-top` que define el espacio ocupado por la barra de estado del sistema.

## Solución implementada

### 1. Instalación del plugin de StatusBar de Capacitor

```bash
pnpm add @capacitor/status-bar
```

### 2. Actualización de `capacitor.config.ts`

Se agregó la configuración del plugin StatusBar para evitar que el contenido se solape:

```typescript
plugins: {
  StatusBar: {
    style: 'default',
    backgroundColor: '#ffffff',
    overlaysWebView: false  // Clave: evita que el contenido se solape
  }
}
```

### 3. Creación de clases CSS para safe-area

En `src/index.css`, se agregaron utilidades CSS para manejar las safe areas:

```css
/* Safe area utilities for mobile devices */
.safe-area-pt {
  padding-top: env(safe-area-inset-top);
}

.safe-area-pb {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-pl {
  padding-left: env(safe-area-inset-left);
}

.safe-area-pr {
  padding-right: env(safe-area-inset-right);
}
```

### 4. Actualización del componente Header

En `src/components/layout/Header.tsx`, se agregó la clase `safe-area-pt` al header:

```tsx
<header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border safe-area-pt">
```

### 5. Creación del hook useStatusBar

Se creó `src/hooks/useStatusBar.ts` para configurar programáticamente la StatusBar:

```typescript
export function useStatusBar() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      const isDark = document.documentElement.classList.contains("dark");

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
```

### 6. Integración en RootLayout

Se integró el hook en `src/components/layout/RootLayout.tsx`:

```tsx
export function RootLayout() {
  const location = useLocation();
  const element = useOutlet();

  // Configurar la barra de estado en dispositivos móviles
  useStatusBar();

  // ... resto del componente
}
```

## Resultado esperado

- ✅ El contenido ya no se solapa con la barra de estado de Android
- ✅ El header respeta el espacio de la barra de estado
- ✅ La barra de estado se adapta al tema (claro/oscuro)
- ✅ La configuración funciona tanto en Android como en iOS

## Próximos pasos

Para aplicar estos cambios a tu APK:

1. Ejecuta el build completo:

   ```bash
   pnpm run build:apk
   ```

2. Instala el nuevo APK en tu dispositivo Android

3. Verifica que el contenido ya no se solape con la barra de estado

## Notas técnicas

- La propiedad `viewport-fit=cover` en el `index.html` ya estaba correctamente configurada
- El plugin StatusBar de Capacitor maneja automáticamente las diferencias entre Android e iOS
- Las clases de safe-area utilizan `env()` que es soportado nativamente por los navegadores modernos
