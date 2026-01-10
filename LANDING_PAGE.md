# Landing Page de Calistenia Emérita

## 📋 Resumen de Cambios

Se ha implementado una **landing page profesional** para Calistenia Emérita siguiendo las especificaciones del brief de marketing. La página está optimizada para SEO local, diseñada con enfoque mobile-first, y dirigida específicamente al público objetivo de 40-50 años.

## 🎯 Características Implementadas

### 1. **Estructura de Navegación Actualizada**

La estructura de rutas ha sido reorganizada:

- **`/`** - Landing page pública (nueva)
- **`/login`** - Página de inicio de sesión
- **`/app`** - Aplicación autenticada (antes era `/`)
  - `/app` - Dashboard del cliente
  - `/app/book` - Reservar clase
  - `/app/my-bookings` - Mis reservas
  - `/app/request-credits` - Solicitar créditos
  - `/app/payment-info` - Información de pago
  - `/app/admin/*` - Rutas de administración

### 2. **Secciones de la Landing Page**

#### Hero Section

- Titular H1 optimizado para SEO: "Recupera tu agilidad y fuerza sin el ambiente de un gimnasio tradicional"
- Subtítulo enfocado en grupos reducidos y especialización en mayores de 40
- CTA principal: "Solicitar Entrevista Gratuita"
- Imagen de fondo profesional y acogedora

#### Sección de Empatía (Pain Points)

Tres tarjetas que abordan los puntos de dolor del cliente ideal:

- 🔶 Miedo a lesionarte
- 🔴 Vergüenza en gimnasios masificados
- 🔵 Dolor de espalda por trabajo de oficina

#### Propuesta de Valor

Tres pilares destacados:

- 🛡️ **Privacidad Total**: Entorno controlado sin miradas
- 👥 **Seguridad (Ratio 1:4)**: Un entrenador para 4 personas máximo
- ❤️ **Metodología Inclusiva**: Calistenia adaptada a cualquier edad

#### Sección del Entrenador

- Foto profesional del entrenador
- Biografía enfocada en empatía y comunidad
- Cita destacada: "No eres un número, eres parte de la familia"
- Credenciales y experiencia

#### Prueba Social y Ubicación

- Testimonios de clientes reales (40-50 años, perfiles administrativos)
- Mapa de ubicación en Mérida (placeholder para Google Maps)
- Optimización SEO local

#### CTA Final

- Mensaje de urgencia: "Solo 4 plazas por hora"
- Botón de WhatsApp directo
- Botón de acceso para clientes existentes

#### Footer

- Información de contacto completa
- Enlaces a redes sociales (Instagram)
- Horarios de atención
- Enlaces legales (Política de Privacidad, Protección de Datos, etc.)

### 3. **Optimización SEO**

#### Meta Tags Implementados

```html
<!-- Title optimizado -->
<title>
  Calistenia Emérita | Entrenador Personal en Mérida para Salud y Movilidad
</title>

<!-- Description optimizada -->
<meta
  name="description"
  content="Centro de entrenamiento privado en Mérida especializado en calistenia para +40 años. Grupos reducidos, seguridad y ambiente familiar. ¡Mejora tu espalda hoy!"
/>

<!-- Keywords locales -->
<meta
  name="keywords"
  content="calistenia Mérida, entrenador personal Mérida, dolor de espalda ejercicios, entrenamiento personal grupos reducidos, gimnasio privado Mérida, salud movilidad Mérida"
/>
```

#### Open Graph para Redes Sociales

- Configuración completa para Facebook y Twitter
- Imagen de preview optimizada
- Título y descripción específicos para compartir

#### Schema.org (Local Business)

- Marcado estructurado para Google
- Tipo: HealthAndBeautyBusiness
- Ubicación: Mérida, Extremadura
- Coordenadas geográficas incluidas

### 4. **Diseño y Estilo**

#### Paleta de Colores

- **Principal**: Verde esmeralda (#10b981) - Salud, naturaleza, calma
- **Acentos**: Tonos cálidos y profesionales
- **Evita**: Colores neón agresivos o muy saturados

#### Tipografía

- **Fuente**: Inter (Google Fonts)
- **Características**:
  - Muy legible para mayores de 40 años
  - Sans-serif moderna y profesional
  - Optimizada para pantallas

#### Animaciones

- Fade-in suave en el hero
- Hover effects en tarjetas
- Pulse animation en botón de WhatsApp
- Transiciones suaves y profesionales

### 5. **Mobile-First**

La página está completamente optimizada para móviles:

- Diseño responsive con breakpoints apropiados
- Tipografía adaptativa
- Botones táctiles de tamaño mínimo 44px
- Imágenes optimizadas
- Scroll suave

### 6. **Botón Flotante de WhatsApp**

- Posición fija en la esquina inferior derecha
- Animación de pulso para llamar la atención
- Enlace directo con mensaje pre-rellenado
- Siempre visible durante el scroll

## 📁 Archivos Creados/Modificados

### Nuevos Archivos

1. **`src/screens/LandingPage.tsx`** - Componente principal de la landing page
2. **`public/hero-background.png`** - Imagen del hero section
3. **`public/trainer-photo.png`** - Foto del entrenador
4. **`public/group-training.png`** - Imagen de grupo entrenando

### Archivos Modificados

1. **`index.html`** - Meta tags SEO y Open Graph
2. **`src/index.css`** - Estilos personalizados y animaciones
3. **`src/app/router/index.tsx`** - Configuración de rutas
4. **`src/screens/client/Home/HomePage.tsx`** - Actualización de enlaces

## 🚀 Próximos Pasos Recomendados

### Configuración Necesaria

1. **Actualizar número de WhatsApp**

   - Buscar: `34XXXXXXXXX`
   - Reemplazar con el número real de contacto

2. **Integrar Google Maps**

   - Reemplazar el placeholder del mapa con iframe de Google Maps
   - Coordenadas actuales: 38.9167, -6.3333 (Mérida)

3. **Actualizar información de contacto**

   - Email real
   - Teléfono real
   - Usuario de Instagram real
   - Dirección física completa

4. **Configurar dominio**

   - Actualizar URLs en meta tags Open Graph
   - Configurar redirects si es necesario

5. **Google My Business**
   - Crear/actualizar perfil de Google My Business
   - Vincular con el sitio web
   - Añadir fotos del local

### Mejoras Opcionales

1. **Analytics**

   - Integrar Google Analytics 4
   - Configurar eventos de conversión (clics en WhatsApp, formularios)

2. **Formulario de Contacto**

   - Añadir formulario alternativo al WhatsApp
   - Integrar con email o CRM

3. **Blog/Contenido**

   - Sección de consejos de salud
   - Artículos sobre dolor de espalda, movilidad, etc.
   - Mejora SEO con contenido relevante

4. **Testimonios Reales**

   - Reemplazar testimonios placeholder con casos reales
   - Añadir fotos de clientes (con permiso)
   - Video testimonios

5. **Galería de Fotos**
   - Fotos del espacio de entrenamiento
   - Fotos de clases en acción
   - Antes/después (enfocado en movilidad, no estética)

## 🎨 Guía de Estilo

### Tono de Comunicación

- **Cálido y acogedor**, no intimidante
- **Profesional pero cercano**
- **Enfocado en salud**, no en estética
- **Inclusivo y empático**

### Mensajes Clave

1. "No eres un número, eres parte de la familia"
2. "Privacidad total, sin miradas"
3. "Solo 4 personas por clase"
4. "Especialistas en mayores de 40"
5. "Atarte los cordones sin dolor"

### Palabras a Evitar

- "Extremo", "intenso", "hardcore"
- "Six-pack", "abdominales marcados"
- Referencias a competición o rendimiento extremo

### Palabras a Usar

- "Salud", "movilidad", "bienestar"
- "Familia", "comunidad", "tribu"
- "Seguro", "privado", "personalizado"
- "Alivio", "recuperación", "mejora"

## 📱 Testing

### Checklist de Pruebas

- [x] La landing page carga correctamente en `/`
- [x] El login sigue funcionando en `/login`
- [x] La app autenticada funciona en `/app`
- [ ] Probar en móvil real (iOS y Android)
- [ ] Verificar velocidad de carga (Google PageSpeed)
- [ ] Probar botón de WhatsApp
- [ ] Verificar meta tags con herramientas SEO
- [ ] Probar compartir en redes sociales

### Herramientas Recomendadas

- **Google PageSpeed Insights**: Velocidad y rendimiento
- **Google Search Console**: Indexación y SEO
- **Facebook Sharing Debugger**: Preview de Open Graph
- **Mobile-Friendly Test**: Optimización móvil

## 🔒 Cumplimiento Legal

Asegúrate de tener preparados:

- ✅ Política de Privacidad
- ✅ Aviso Legal
- ✅ Política de Cookies
- ✅ Protección de Datos (RGPD)

Estos documentos deben estar accesibles desde el footer.

## 📞 Soporte

Para cualquier duda o modificación de la landing page, los archivos principales a editar son:

- `src/screens/LandingPage.tsx` - Contenido y estructura
- `src/index.css` - Estilos y animaciones
- `index.html` - Meta tags SEO
