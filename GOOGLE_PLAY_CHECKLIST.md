# ✅ Checklist de Publicación en Google Play - GoChat

## 📋 Requisitos Previos

### Cuenta de Desarrollador
- [ ] Crear cuenta de Google Play Developer
- [ ] Pagar tarifa de registro ($25 USD)
- [ ] Verificar email y teléfono
- [ ] Configurar perfil de pagos

### Información Legal
- [ ] Política de Privacidad completada ✅ (`app/privacy-policy.tsx`)
- [ ] Términos de Servicio completados ✅ (`app/terms-of-service.tsx`)
- [ ] Verificación de edad (18+) implementada ✅ (`app/(auth)/age-gate.tsx`)

---

## 🎨 Assets Gráficos

### Icono de la Aplicación
- [x] Icono 512×512 píxeles ✅
- [x] Formato PNG de 32 bits ✅
- [x] Peso máximo 1024 KB ✅
- [x] Ubicación: `assets/images/icon.png` ✅

### Capturas de Pantalla
- [ ] 2-8 capturas de pantalla de alta calidad
- [ ] Resolución: 320 px a 3840 px
- [ ] Relación de aspecto: máximo 2:1
- [ ] Formato: JPG o PNG de 24 bits
- [ ] Mostrar características principales:
  - [ ] Pantalla de Swipe
  - [ ] Pantalla de Matches
  - [ ] Pantalla de Chat
  - [ ] Pantalla de Premium
  - [ ] Pantalla de Perfil

### Imagen de Encabezado (Feature Graphic)
- [ ] Dimensiones: 1024 × 500 píxeles
- [ ] Formato: JPEG o PNG de 24 bits
- [ ] Mostrar propuesta de valor

### Icono Adaptativo de Android
- [x] Foreground: 108 × 108 píxeles ✅
- [x] Background: 108 × 108 píxeles ✅
- [x] Monochrome: 108 × 108 píxeles ✅
- [x] Formato: PNG ✅

---

## 📝 Información de la Aplicación

### Nombre y Descripción
- [x] Nombre: "GoChat" ✅
- [ ] Descripción corta (máx. 80 caracteres)
  - Sugerencia: "Conoce gente nueva y encuentra conexiones reales"
- [ ] Descripción completa (máx. 4000 caracteres)
  - Incluir: características, seguridad, verificación de edad

### Palabras Clave
- [ ] Agregar 5-10 palabras clave relevantes
  - Ejemplos: dating, citas, conocer gente, matches, chat, relaciones

### Categoría
- [x] Categoría: "Lifestyle" o "Social" ✅

### Clasificación de Contenido
- [ ] Completar cuestionario de clasificación por edades
- [ ] Resultado esperado: 16+ o 18+ (dating app)
- [ ] Seleccionar características:
  - [ ] Contacto con otros usuarios
  - [ ] Compras in-app
  - [ ] Datos personales recopilados

---

## 🔐 Privacidad y Seguridad

### Política de Privacidad
- [x] Documento completado ✅
- [x] Accesible desde la app ✅
- [ ] URL pública (si es necesario)
- [ ] Cubre:
  - [x] Recopilación de datos ✅
  - [x] Uso de información ✅
  - [x] Compartir de datos ✅
  - [x] Derechos del usuario ✅

### Términos de Servicio
- [x] Documento completado ✅
- [x] Accesible desde la app ✅
- [ ] URL pública (si es necesario)
- [ ] Cubre:
  - [x] Elegibilidad (18+) ✅
  - [x] Conducta del usuario ✅
  - [x] Contenido de usuario ✅
  - [x] Suscripciones ✅

### Datos Personales
- [ ] Declarar qué datos se recopilan
- [ ] Explicar cómo se usan
- [ ] Confirmar cumplimiento con GDPR (si aplica)

---

## 🛠️ Configuración Técnica

### Build y Compilación
- [ ] Generar APK/AAB para testing
  ```bash
  eas build --platform android --type apk
  ```
- [ ] Verificar que no hay errores de compilación
- [ ] Versión: 1.0.0
- [ ] Código de versión: 1

### Permisos
- [x] Cámara configurada ✅
- [x] Galería configurada ✅
- [x] Ubicación configurada ✅
- [x] Notificaciones configuradas ✅
- [ ] Revisar permisos en app.config.ts
- [ ] Solicitar permisos en runtime

### Características Nativas
- [x] Age Gate implementado ✅
- [x] Notificaciones push configuradas ✅
- [ ] Probar en dispositivo real
- [ ] Verificar que funciona en Android 7.0+ (minSdkVersion: 24)

### Monetización
- [x] Servicio IAP implementado ✅
- [ ] Productos configurados en Google Play Console:
  - [ ] com.gochat.premium.monthly ($9.99/mes)
  - [ ] com.gochat.gold.monthly ($19.99/mes)
  - [ ] com.gochat.boost.1 ($1.99)
  - [ ] com.gochat.boost.5 ($7.99)
  - [ ] com.gochat.superlikes.10 ($4.99)
  - [ ] com.gochat.rewinds.5 ($2.99)
- [ ] Integrar Google Play Billing Library
- [ ] Probar compras en modo sandbox

---

## 🧪 Testing

### Pruebas Funcionales
- [ ] Flujo de registro completo
  - [ ] Age Gate funciona
  - [ ] Verificación de 18+ años
  - [ ] Registro con email/contraseña
  - [ ] Completar perfil
- [ ] Flujo de login
  - [ ] Login con credenciales
  - [ ] Recuperar contraseña
- [ ] Pantalla de Swipe
  - [ ] Swipes funcionan
  - [ ] Animaciones suaves
  - [ ] Límite de swipes para usuarios gratuitos
- [ ] Matches y Chat
  - [ ] Crear match
  - [ ] Enviar mensajes
  - [ ] Recibir mensajes
- [ ] Premium
  - [ ] Ver planes
  - [ ] Comprar suscripción (sandbox)
  - [ ] Verificar acceso premium
- [ ] Privacidad
  - [ ] Acceder a Política de Privacidad
  - [ ] Acceder a Términos de Servicio
  - [ ] Cerrar sesión

### Pruebas de Calidad
- [ ] No hay console errors
- [ ] No hay crashes
- [ ] Rendimiento aceptable
- [ ] Interfaz responsive
- [ ] Textos claros y sin errores

### Pruebas en Dispositivos
- [ ] Probar en Android 7.0 (minSdkVersion)
- [ ] Probar en Android 13+ (latest)
- [ ] Probar en diferentes tamaños de pantalla
- [ ] Probar en modo oscuro y claro

---

## 📤 Preparación para Envío

### Antes de Enviar
- [ ] Versión final compilada y testada
- [ ] Todos los assets gráficos listos
- [ ] Descripción y palabras clave finalizadas
- [ ] Política de privacidad y términos accesibles
- [ ] Clasificación de contenido completada
- [ ] Precio establecido (gratuito con IAP)
- [ ] Países de distribución seleccionados

### Crear Versión en Google Play Console
- [ ] Ir a Play Console → GoChat → Lanzamientos
- [ ] Crear nueva versión de prueba interna
- [ ] Subir AAB/APK
- [ ] Agregar notas de lanzamiento
- [ ] Revisar antes de enviar

### Testing Interno
- [ ] Invitar testers internos
- [ ] Recopilar feedback
- [ ] Corregir bugs encontrados
- [ ] Hacer nueva versión si es necesario

### Prueba Cerrada (Opcional)
- [ ] Crear grupo de prueba cerrada
- [ ] Invitar usuarios de confianza
- [ ] Recopilar feedback más amplio
- [ ] Duración: 1-2 semanas

### Prueba Abierta (Opcional)
- [ ] Crear grupo de prueba abierta
- [ ] Permitir que cualquiera se una
- [ ] Monitorear feedback y ratings
- [ ] Duración: 1-2 semanas

---

## 🚀 Envío a Producción

### Checklist Final
- [ ] Todas las pruebas pasadas
- [ ] Feedback positivo de testers
- [ ] Assets gráficos finales
- [ ] Descripción y keywords optimizadas
- [ ] Clasificación de contenido correcta
- [ ] Política de privacidad y términos listos
- [ ] Monetización configurada
- [ ] Versión final compilada

### Enviar a Revisión
- [ ] Ir a Play Console → GoChat → Lanzamientos → Producción
- [ ] Crear nuevo lanzamiento
- [ ] Subir AAB final
- [ ] Revisar toda la información
- [ ] Hacer clic en "Enviar a revisión"

### Después del Envío
- [ ] Esperar revisión (24 horas a varios días)
- [ ] Monitorear estado en Play Console
- [ ] Estar atento a emails de Google
- [ ] Si hay rechazos, revisar motivos y corregir
- [ ] Reenviar si es necesario

---

## 📊 Post-Lanzamiento

### Monitoreo
- [ ] Revisar ratings y comentarios diariamente
- [ ] Responder a comentarios negativos
- [ ] Monitorear crashes en Play Console
- [ ] Revisar estadísticas de usuarios

### Mejoras
- [ ] Recopilar feedback de usuarios
- [ ] Planificar mejoras para v1.1
- [ ] Corregir bugs reportados
- [ ] Agregar nuevas características

### Actualizaciones
- [ ] Publicar actualizaciones regularmente
- [ ] Mantener app actualizada
- [ ] Seguir políticas de Google Play
- [ ] Responder a cambios de política

---

## 🔗 Enlaces Útiles

- [Google Play Console](https://play.google.com/console)
- [Documentación de Publicación](https://developer.android.com/distribute/console)
- [Políticas de Google Play](https://play.google.com/about/developer-content-policy/)
- [Guía de Diseño Material](https://m3.material.io/)
- [Expo Documentation](https://docs.expo.dev/)

---

## 📝 Notas

- Fecha de inicio: Mayo 2026
- Versión: 1.0.0
- Bundle ID: com.gochat.dating
- Nombre de desarrollador: GoChat
- Contacto: support@gochat.app
