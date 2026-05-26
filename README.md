# 💜 GoChat - Aplicación de Citas Moderna

[![GitHub](https://img.shields.io/badge/GitHub-fazeogve--oss-blue?style=flat-square&logo=github)](https://github.com/fazeogve-oss/zonamatch)
[![Expo](https://img.shields.io/badge/Expo-54.0.29-black?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

GoChat es una aplicación de citas moderna, segura y hermosa construida con **Expo SDK 54**, **React Native**, **TypeScript** y **Tailwind CSS**. Diseñada para cumplir con los más altos estándares de Google Play.

## 🎯 Características Principales

- **Swipe Intuitivo:** Descubre perfiles con animaciones suaves y naturales
- **Matches en Tiempo Real:** Conecta con personas que también te gustan
- **Chat Privado:** Mensajes seguros 1 a 1 con otros usuarios
- **Verificación de Edad:** Cumplimiento obligatorio de 18+ años
- **Suscripciones Premium:** Planes flexibles con características exclusivas
- **Diseño Moderno:** Interfaz dark mode con gradientes y animaciones
- **Seguridad:** Encriptación, validación de datos y protección de privacidad

## 🚀 Inicio Rápido

### Requisitos
- Node.js 22.13.0+
- pnpm 9.12.0+
- Expo CLI

### Instalación
```bash
git clone https://github.com/fazeogve-oss/zonamatch.git
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
pnpm test
pnpm lint
pnpm format
```

## 📁 Estructura del Proyecto

```
app/
├── (auth)/                    # Autenticación
│   ├── age-gate.tsx          # Verificación 18+
│   ├── login.tsx
│   ├── onboarding.tsx
│   └── _layout.tsx
├── (tabs)/                    # Navegación principal
│   ├── index.tsx             # Home (Swipe)
│   ├── matches.tsx           # Matches
│   ├── profile.tsx           # Perfil
│   └── _layout.tsx
├── chat/[id].tsx             # Chat 1 a 1
├── privacy-policy.tsx        # Política de Privacidad
├── terms-of-service.tsx      # Términos de Servicio
├── premium.tsx               # Planes Premium
└── _layout.tsx

lib/
├── iap.ts                    # Compras In-App
├── trpc.ts                   # Cliente tRPC
└── utils.ts

components/                   # Componentes reutilizables
server/                       # Backend Node.js
```

## 🎨 Diseño Visual

**Colores de Marca:**
- Primary: `#E91E8C` (Magenta vibrante)
- Accent: `#7C3AED` (Violeta)
- Background: `#0A0A0F` (Negro profundo)
- Surface: `#1A1A1A` (Gris oscuro)

**Tipografía:**
- Headings: Bold (700-800)
- Body: Regular (400-500)
- Captions: Medium (600)

## 📱 Pantallas Principales

| Pantalla | Descripción |
|----------|-------------|
| Age Gate | Verificación de 18+ años |
| Onboarding | Introducción a la app |
| Login/Register | Autenticación |
| Setup Profile | Completar perfil |
| Home (Swipe) | Descubrir perfiles |
| Matches | Lista de matches |
| Chat | Conversaciones 1 a 1 |
| Profile | Perfil propio |
| Premium | Planes de suscripción |

## 💳 Monetización

### Suscripciones
- **Premium:** $9.99/mes - Swipes ilimitados, 5 Super Likes/día
- **Gold:** $19.99/mes - Todo Premium + Modo Invisible, 5 Boosts/mes

### Consumibles
- Boosts: $1.99 (1x) o $7.99 (5x)
- Super Likes: $4.99 (10x)
- Rewinds: $2.99 (5x)

## 🔐 Seguridad y Privacidad

- ✅ Verificación obligatoria de 18+ años
- ✅ Política de Privacidad completa
- ✅ Términos de Servicio detallados
- ✅ Encriptación de datos
- ✅ Cumplimiento GDPR
- ✅ Validación de fotos
- ✅ Protección contra bots

## 📊 Stack Tecnológico

| Componente | Tecnología |
|-----------|-----------|
| Frontend | React Native 0.81.5 |
| Framework | Expo 54.0.29 |
| Lenguaje | TypeScript 5.9.3 |
| Styling | NativeWind 4.2.1 |
| Backend | Node.js + Express |
| API | tRPC 11.7.2 |
| Base de Datos | PostgreSQL |
| ORM | Drizzle 0.44.7 |
| Animaciones | Reanimated 4.1.6 |
| Almacenamiento | AsyncStorage |

## 📚 Documentación

- [**SETUP_GUIDE.md**](./SETUP_GUIDE.md) - Guía de instalación y desarrollo
- [**GOOGLE_PLAY_CHECKLIST.md**](./GOOGLE_PLAY_CHECKLIST.md) - Checklist para publicación
- [**DEVELOPMENT_ROADMAP.md**](./DEVELOPMENT_ROADMAP.md) - Hoja de ruta de desarrollo
- [**todo.md**](./todo.md) - Tareas pendientes

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Testing de compras in-app
# Ver lib/iap.ts para funciones de simulación
```

## 🚀 Publicación en Google Play

Ver [**GOOGLE_PLAY_CHECKLIST.md**](./GOOGLE_PLAY_CHECKLIST.md) para instrucciones completas.

### Pasos Rápidos
1. Crear cuenta de Google Play Developer
2. Completar información de la app
3. Subir APK/AAB
4. Enviar a revisión
5. Esperar aprobación

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor:
1. Verifica que no esté reportado
2. Crea un issue con descripción detallada
3. Incluye pasos para reproducir
4. Adjunta screenshots si es relevante

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Todos los derechos reservados © 2026 GoChat

## 📞 Contacto

- **Email:** support@gochat.app
- **Sitio Web:** www.gochat.app
- **GitHub:** github.com/fazeogve-oss/zonamatch

---

**Versión:** 1.0.0  
**Última actualización:** Mayo 26, 2026  
**Estado:** En desarrollo activo ✨
