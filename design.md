# ZonaMatch - App de Citas: Diseño de Interfaz

## Identidad Visual

- **Nombre:** ZonaMatch
- **Colores principales:**
  - Primary (Acento): `#E91E8C` (Rosa vibrante / Magenta)
  - Background Light: `#FFFFFF`
  - Background Dark: `#0D0D0D`
  - Surface Light: `#F8F8F8`
  - Surface Dark: `#1A1A1A`
  - Foreground Light: `#1A1A1A`
  - Foreground Dark: `#F5F5F5`
  - Muted: `#9E9E9E`
  - Border Light: `#EEEEEE`
  - Border Dark: `#2A2A2A`
  - Gold (Premium): `#FFD700`

---

## Lista de Pantallas

| Pantalla | Ruta | Descripción |
|---|---|---|
| Splash / Onboarding | `/onboarding` | Bienvenida, propuesta de valor, CTA de registro |
| Verificación de Edad | `/age-gate` | Confirmar que el usuario tiene 18+ años |
| Registro | `/register` | Nombre, email, contraseña, fecha de nacimiento |
| Login | `/login` | Email + contraseña, opción "Olvidé contraseña" |
| Completar Perfil | `/setup-profile` | Fotos, bio, intereses, género, preferencias |
| Home / Swipe | `/(tabs)/index` | Tarjetas de perfiles con swipe izquierda/derecha |
| Matches | `/(tabs)/matches` | Lista de matches con último mensaje |
| Chat | `/chat/[id]` | Conversación 1 a 1 con un match |
| Perfil Propio | `/(tabs)/profile` | Ver y editar perfil propio |
| Perfil de Otro Usuario | `/user/[id]` | Ver perfil completo de otro usuario |
| Premium / Suscripción | `/premium` | Planes de suscripción y compras in-app |
| Configuración | `/settings` | Privacidad, notificaciones, cuenta, logout |
| Filtros de Búsqueda | `/filters` | Rango de edad, distancia, género (premium) |

---

## Contenido y Funcionalidad por Pantalla

### Onboarding
- 3 slides con ilustraciones y texto corto
- Botones: "Crear cuenta" y "Ya tengo cuenta"

### Verificación de Edad
- Selector de fecha de nacimiento
- Bloqueo si menor de 18 años con mensaje claro

### Registro / Login
- Formulario limpio con campos mínimos
- Validación en tiempo real
- Autenticación via backend (JWT)

### Completar Perfil
- Subir hasta 6 fotos (mínimo 1 requerida)
- Bio de texto libre (máx 300 caracteres)
- Selección de género e intereses (tags)
- Preferencias de búsqueda (qué busca, rango de edad)

### Home / Swipe (Pantalla Principal)
- Stack de tarjetas con foto principal, nombre, edad, distancia
- Swipe derecha = Like, Swipe izquierda = Nope
- Botones de acción: Nope (X), Super Like (estrella), Like (corazón)
- Animación de swipe con reanimated
- Indicador de "Match!" cuando ambos se gustan

### Matches
- Lista de conversaciones activas (FlatList)
- Avatar, nombre, último mensaje, hora
- Badge de mensajes no leídos
- Sección de "Nuevos Matches" (sin mensaje aún) en la parte superior

### Chat 1 a 1
- Mensajes en burbujas (propio a la derecha, otro a la izquierda)
- Input de texto con botón de enviar
- Indicador de "escribiendo..."
- Timestamp de mensajes
- Foto de perfil del otro usuario en el header

### Perfil Propio
- Foto principal grande
- Nombre, edad, bio
- Galería de fotos
- Botón de editar perfil
- Badge de usuario Premium (si aplica)

### Premium / Suscripción
- Comparativa de planes: Gratis vs Premium vs Gold
- Beneficios claros por plan
- Botones de compra con precio
- Compras in-app: Boosts (aparecer primero), Super Likes extra, Rewinds

---

## Flujos Principales de Usuario

### Flujo de Registro
`Splash → Onboarding → Verificación de Edad → Registro → Completar Perfil → Home`

### Flujo de Match y Chat
`Home (swipe) → Animación de Match → Matches Tab → Chat → Conversación`

### Flujo Premium
`Home (límite alcanzado) → Banner Premium → Pantalla Premium → Seleccionar Plan → Pago → Funciones desbloqueadas`

### Flujo de Filtros
`Home → Ícono de Filtros → Pantalla de Filtros (Premium) → Guardar → Home actualizado`

---

## Modelo de Datos Principal

### User
```
id, name, email, birthDate, gender, bio, photos[], interests[], location, isPremium, premiumUntil, createdAt
```

### Match
```
id, user1Id, user2Id, createdAt, lastMessage, unreadCount
```

### Message
```
id, matchId, senderId, text, createdAt, read
```

### Like
```
id, fromUserId, toUserId, type (like/superlike), createdAt
```

---

## Monetización

| Característica | Gratis | Premium ($9.99/mes) | Gold ($19.99/mes) |
|---|---|---|---|
| Swipes por día | 20 | Ilimitados | Ilimitados |
| Super Likes | 1/día | 5/día | Ilimitados |
| Ver quién te gustó | No | Sí | Sí |
| Filtros avanzados | No | Sí | Sí |
| Boost (1/mes) | No | 1/mes | 5/mes |
| Rewind (deshacer) | No | Sí | Sí |
| Modo Invisible | No | No | Sí |

### Compras In-App (consumibles)
- Boost x1: $1.99
- Boost x5: $7.99
- Super Likes x10: $4.99
- Rewinds x5: $2.99
