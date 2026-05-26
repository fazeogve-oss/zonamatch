import { useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#13111C"]} style={StyleSheet.absoluteFillObject} />

      <ScreenContainer containerClassName="bg-transparent" edges={["left", "right"]}>
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: insets.top + 12,
            paddingBottom: 16,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={{ fontSize: 24, color: "#A855F7" }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>
            Política de Privacidad
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 22, marginBottom: 20 }}>
            <Text style={{ fontWeight: "700", color: "#fff" }}>Última actualización: Mayo 2026</Text>
          </Text>

          <Section title="1. Introducción">
            GoChat ("nosotros", "nuestro" o "la Aplicación") se compromete a proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y salvaguardamos tu información cuando usas nuestra aplicación móvil.
          </Section>

          <Section title="2. Información que Recopilamos">
            Recopilamos información de varias formas:
            {"\n\n"}
            <Text style={{ fontWeight: "600" }}>Información de Registro:</Text> Nombre, correo electrónico, contraseña, fecha de nacimiento, género y preferencias.
            {"\n\n"}
            <Text style={{ fontWeight: "600" }}>Información de Perfil:</Text> Fotos, biografía, intereses y ubicación.
            {"\n\n"}
            <Text style={{ fontWeight: "600" }}>Información de Uso:</Text> Datos sobre cómo interactúas con la aplicación (swipes, matches, mensajes).
            {"\n\n"}
            <Text style={{ fontWeight: "600" }}>Información Técnica:</Text> Dirección IP, tipo de dispositivo, sistema operativo y datos de cookies.
          </Section>

          <Section title="3. Cómo Usamos Tu Información">
            Usamos la información recopilada para:
            {"\n\n"}• Proporcionar, mantener y mejorar nuestros servicios
            {"\n"}• Personalizar tu experiencia de usuario
            {"\n"}• Procesar transacciones y enviar notificaciones relacionadas
            {"\n"}• Enviar comunicaciones de marketing (con tu consentimiento)
            {"\n"}• Detectar y prevenir fraude o abuso
            {"\n"}• Cumplir con obligaciones legales
          </Section>

          <Section title="4. Compartir de Información">
            No vendemos tu información personal. Sin embargo, podemos compartir información con:
            {"\n\n"}• Proveedores de servicios que nos ayudan a operar la aplicación
            {"\n"}• Autoridades legales cuando sea requerido por ley
            {"\n"}• Otros usuarios (solo información de perfil visible)
          </Section>

          <Section title="5. Seguridad de Datos">
            Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información. Sin embargo, ningún sistema es completamente seguro.
          </Section>

          <Section title="6. Retención de Datos">
            Retenemos tu información personal mientras tu cuenta esté activa. Puedes solicitar la eliminación de tu cuenta en cualquier momento, y eliminaremos tus datos dentro de 30 días, excepto cuando sea requerido retenerlos por ley.
          </Section>

          <Section title="7. Derechos del Usuario">
            Tienes derecho a:
            {"\n\n"}• Acceder a tu información personal
            {"\n"}• Corregir información inexacta
            {"\n"}• Solicitar la eliminación de tu información
            {"\n"}• Optar por no recibir comunicaciones de marketing
            {"\n"}• Exportar tus datos
          </Section>

          <Section title="8. Cookies y Tecnologías de Seguimiento">
            Usamos cookies y tecnologías similares para mejorar tu experiencia. Puedes controlar las preferencias de cookies a través de la configuración de tu dispositivo.
          </Section>

          <Section title="9. Enlaces a Terceros">
            La Aplicación puede contener enlaces a sitios web de terceros. No somos responsables de sus prácticas de privacidad. Te recomendamos revisar sus políticas de privacidad.
          </Section>

          <Section title="10. Cambios a Esta Política">
            Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios significativos mediante la aplicación o correo electrónico.
          </Section>

          <Section title="11. Contacto">
            Si tienes preguntas sobre esta Política de Privacidad, contáctanos en:
            {"\n\n"}
            <Text style={{ fontWeight: "600" }}>Email:</Text> privacy@gochat.app
            {"\n"}
            <Text style={{ fontWeight: "600" }}>Sitio Web:</Text> www.gochat.app
          </Section>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Accept Button */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ borderRadius: 12, overflow: "hidden" }}
          >
            <LinearGradient
              colors={["#7C3AED", "#A855F7"]}
              style={{ paddingVertical: 14, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                Entendido
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color: "#A855F7", marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 20 }}>
        {children}
      </Text>
    </View>
  );
}
