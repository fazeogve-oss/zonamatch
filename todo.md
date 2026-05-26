# ZonaMatch - TODO

## Setup y Configuración
- [x] Configurar colores de marca (rosa/magenta) en theme.config.js
- [x] Generar logo de la app y actualizar app.config.ts
- [x] Configurar esquema de base de datos (profiles, matches, messages, likes, premium)
- [x] Configurar rutas de navegación completas

## Pantallas de Autenticación
- [x] Pantalla de Onboarding (3 slides)
- [x] Pantalla de Login (con OAuth)
- [x] Pantalla de Completar Perfil (nombre, edad, género, fotos, bio, intereses)

## Pantalla Principal - Swipe
- [x] Componente de tarjeta de perfil con foto, nombre, edad
- [x] Animación de swipe (izquierda/derecha) con PanResponder
- [x] Botones de acción (Nope, Super Like, Like)
- [x] Lógica de match cuando ambos se gustan
- [x] Modal de "¡Es un Match!"
- [x] Límite de swipes para usuarios gratuitos (20/día)
- [x] Indicadores visuales de swipe (LIKE/NOPE/SUPER)

## Pantalla de Matches y Chat
- [x] Lista de matches con último mensaje
- [x] Sección de nuevos matches (sin mensaje)
- [x] Pantalla de chat 1 a 1
- [x] Envío y recepción de mensajes
- [x] Indicador de mensajes no leídos

## Perfil de Usuario
- [x] Ver perfil propio con fotos, bio e intereses
- [x] Estadísticas (swipes, super likes, boosts)
- [x] Badge de usuario Premium
- [x] Cerrar sesión

## Premium y Monetización
- [x] Pantalla de planes Premium (Premium y Gold)
- [x] Sistema de suscripción (simulado/UI)
- [x] Compras in-app: Boosts, Super Likes
- [x] Badge de usuario Premium en perfiles

## Backend y Base de Datos
- [x] Schema de base de datos completo
- [x] API de perfiles y swipes
- [x] API de matches y mensajes
- [x] API de premium

## Pendiente / Mejoras futuras
- [ ] Subida real de fotos de perfil
- [ ] Notificaciones push al recibir match o mensaje
- [ ] Filtros avanzados (distancia, edad, intereses)
- [ ] Rewind (deshacer último swipe) - solo premium
- [ ] Modo incógnito - solo premium
- [ ] Integración con pasarela de pagos real (Stripe, etc.)
- [ ] Actualización en tiempo real del chat (WebSocket/polling)

## Entrega
- [x] Checkpoint final

## Rediseño Visual (inspirado en Purple)
- [x] Nuevo logo neon heart con gradiente violeta/rosa
- [x] Paleta oscura premium (#0A0A0F + violeta/rosa neón)
- [x] Tab bar dark con gradiente activo en íconos
- [x] Pantalla onboarding dark con gradientes y blobs decorativos
- [x] Pantalla login dark premium
- [x] Pantalla swipe dark premium con gradientes
- [x] Pantalla matches dark premium con buscador
- [x] Pantalla chat dark premium con burbujas gradiente
- [x] Pantalla perfil dark premium con stats y menú
- [x] Pantalla premium dark con cards glassmorphism
- [x] Pantalla setup-profile dark con progress bar gradiente
