# 🚀 Guía de Configuración - GoChat

## Estado Actual

GoChat es una aplicación de citas moderna construida con **Expo SDK 54**, **React Native**, **TypeScript** y **Tailwind CSS (NativeWind)**. La app ha sido pulida para cumplir con los requisitos de publicación en Google Play.

## ✅ Completado

### Fase 1: Branding y Configuración
- ✅ Renombrado a **GoChat** (de ZonaMatch)
- ✅ Bundle ID: `com.gochat.dating`
- ✅ Logo neon heart con gradiente magenta/violeta (#E91E8C → #7C3AED)
- ✅ Colores actualizados en `theme.config.js`
- ✅ Permisos configurados en `app.config.ts`:
  - Cámara
  - Galería (lectura/escritura)
  - Ubicación
  - Notificaciones push

### Fase 2: Verificación de Edad y Privacidad
- ✅ **Pantalla Age Gate** (`app/(auth)/age-gate.tsx`)
  - Selector de fecha de nacimiento
  - Validación de 18+ años
  - Mensajes claros de error
  - Haptic feedback

- ✅ **Política de Privacidad** (`app/privacy-policy.tsx`)
  - Documento completo y legal
  - Secciones sobre recopilación y uso de datos
  - Información sobre derechos del usuario

- ✅ **Términos de Servicio** (`app/terms-of-service.tsx`)
  - Términos legales completos
  - Secciones sobre conducta del usuario
  - Política de suscripciones

### Fase 3: Monetización (Implementado)
- ✅ **Servicio de Compras In-App** (`lib/iap.ts`)
  - Suscripciones: Premium ($9.99/mes) y Gold ($19.99/mes)
  - Consumibles: Boosts, Super Likes, Rewinds
  - Persistencia con AsyncStorage
  - Simulación para testing

## 📋 Próximas Fases

### Fase 4: Integración de Age Gate
- [ ] Integrar Age Gate en flujo de onboarding
- [ ] Guardar verificación de edad en backend
- [ ] Mostrar Age Gate solo una vez

### Fase 5: Mejorar Premium
- [ ] Integrar compras in-app reales (Google Play Billing)
- [ ] Mejorar UI de pantalla Premium
- [ ] Agregar validación de suscripción en funcionalidades

### Fase 6: Notificaciones Push
- [ ] Configurar Expo Notifications
- [ ] Implementar notificaciones al recibir match
- [ ] Implementar notificaciones de nuevos mensajes

### Fase 7: Validación Final
- [ ] Probar flujo completo de registro
- [ ] Probar compras in-app en modo sandbox
- [ ] Validar en iOS y Android
- [ ] Revisar console para errores

## 🛠️ Instalación y Desarrollo

### Requisitos
- Node.js 22.13.0+
- pnpm 9.12.0+
- Expo CLI
- iOS Simulator o Android Emulator (opcional)

### Instalación
```bash
cd zonamatch
pnpm install
```

### Desarrollo
```bash
# Iniciar servidor de desarrollo
pnpm dev

# O por separado:
pnpm dev:metro    # Metro bundler (puerto 8081)
pnpm dev:server   # Backend (puerto 3000)
```

### Testing
```bash
# Ejecutar tests
pnpm test

# Linting
pnpm lint

# Formatear código
pnpm format
```

### Build
```bash
# Generar APK para Android
pnpm android

# Generar IPA para iOS
pnpm ios

# Build para producción
pnpm build
```

## 📁 Estructura de Archivos

```
app/
├── (auth)/
│   ├── age-gate.tsx          ← Verificación de 18+
│   ├── login.tsx
│   ├── onboarding.tsx
│   └── _layout.tsx
├── (tabs)/
│   ├── index.tsx             ← Home (Swipe)
│   ├── matches.tsx
│   ├── profile.tsx
│   └── _layout.tsx
├── chat/
│   └── [id].tsx
├── privacy-policy.tsx        ← Política de Privacidad
├── terms-of-service.tsx      ← Términos de Servicio
├── premium.tsx
└── _layout.tsx

lib/
├── iap.ts                    ← Servicio de Compras In-App
├── trpc.ts
└── utils.ts

components/
├── screen-container.tsx
└── ui/

theme.config.js              ← Colores de marca
app.config.ts                ← Configuración de Expo
```

## 🎨 Colores de GoChat

| Token | Light | Dark |
|-------|-------|------|
| Primary | #E91E8C | #E91E8C |
| Background | #FFFFFF | #0A0A0F |
| Surface | #F8F8F8 | #1A1A1A |
| Foreground | #1A1A1A | #F5F5F5 |
| Muted | #9E9E9E | #9E9E9E |
| Border | #EEEEEE | #2A2A2A |
| Accent | #7C3AED | #A855F7 |

## 🔐 Permisos Requeridos

### iOS (infoPlist)
- `NSCameraUsageDescription`: Fotos de perfil
- `NSPhotoLibraryUsageDescription`: Galería
- `NSLocationWhenInUseUsageDescription`: Ubicación
- `NSUserTrackingUsageDescription`: Tracking

### Android
- `POST_NOTIFICATIONS`: Notificaciones push
- `CAMERA`: Cámara
- `READ_EXTERNAL_STORAGE`: Lectura de galería
- `WRITE_EXTERNAL_STORAGE`: Escritura de galería
- `ACCESS_FINE_LOCATION`: Ubicación precisa
- `ACCESS_COARSE_LOCATION`: Ubicación aproximada

## 📦 Productos IAP Disponibles

### Suscripciones
- `com.gochat.premium.monthly`: Premium $9.99/mes
- `com.gochat.gold.monthly`: Gold $19.99/mes

### Consumibles
- `com.gochat.boost.1`: 1 Boost $1.99
- `com.gochat.boost.5`: 5 Boosts $7.99
- `com.gochat.superlikes.10`: 10 Super Likes $4.99
- `com.gochat.rewinds.5`: 5 Rewinds $2.99

## 🧪 Testing de Compras In-App

Para testing, usa las funciones de simulación en `lib/iap.ts`:

```typescript
import { simulatePurchaseSubscription, simulatePurchaseConsumable } from "@/lib/iap";

// Simular compra de suscripción
const result = await simulatePurchaseSubscription(IAP_PRODUCTS.PREMIUM_MONTHLY);

// Simular compra de consumible
const result = await simulatePurchaseConsumable(IAP_PRODUCTS.BOOST_1);
```

## 📱 Pantallas Principales

1. **Age Gate** - Verificación de 18+ años
2. **Onboarding** - Introducción a la app
3. **Login/Register** - Autenticación
4. **Setup Profile** - Completar perfil
5. **Home (Swipe)** - Descubrir perfiles
6. **Matches** - Lista de matches
7. **Chat** - Conversaciones 1 a 1
8. **Profile** - Perfil propio
9. **Premium** - Planes de suscripción
10. **Privacy Policy** - Política de privacidad
11. **Terms of Service** - Términos de servicio

## 🚀 Próximos Pasos para Publicación

1. **Integrar Google Play Billing**
   - Configurar cuenta de Google Play Console
   - Crear productos en Google Play Console
   - Integrar SDK de Google Play Billing

2. **Generar APK/AAB**
   ```bash
   eas build --platform android --type apk
   ```

3. **Testing en Google Play**
   - Crear versión de prueba interna
   - Invitar testers
   - Recopilar feedback

4. **Publicar en Google Play**
   - Completar ficha de la app
   - Subir screenshots y videos
   - Enviar a revisión

## 📞 Contacto y Soporte

- Email: support@gochat.app
- Sitio Web: www.gochat.app
- GitHub: github.com/fazeogve-oss/zonamatch

## 📄 Licencia

Todos los derechos reservados © 2026 GoChat
