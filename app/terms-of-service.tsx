import { useRouter } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TermsOfServiceScreen() {
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
            Términos de Servicio
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

          <Section title="1. Aceptación de Términos">
            Al descargar, acceder y usar GoChat, aceptas estar vinculado por estos Términos de Servicio. Si no aceptas alguno de estos términos, no uses la Aplicación.
          </Section>

          <Section title="2. Elegibilidad">
            Debes tener al menos 18 años de edad para usar GoChat. Al usar la Aplicación, garantizas que tienes la edad legal requerida y que toda la información que proporcionas es verdadera y precisa.
          </Section>

          <Section title="3. Cuenta de Usuario">
            Eres responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra bajo tu cuenta. Aceptas notificarnos inmediatamente de cualquier uso no autorizado de tu cuenta.
          </Section>

          <Section title="4. Conducta del Usuario">
            Aceptas no usar GoChat para:
            {"\n\n"}• Acosar, amenazar, intimidar o abusar de otros usuarios
            {"\n"}• Publicar contenido obsceno, ofensivo o ilegal
            {"\n"}• Engañar o defraudar a otros usuarios
            {"\n"}• Violar derechos de propiedad intelectual
            {"\n"}• Usar bots o scripts automatizados
            {"\n"}• Recopilar datos de otros usuarios sin consentimiento
          </Section>

          <Section title="5. Contenido del Usuario">
            Eres responsable de todo el contenido que publiques en GoChat. Al publicar contenido, nos otorgas una licencia no exclusiva para usar, reproducir y distribuir ese contenido en la Aplicación.
          </Section>

          <Section title="6. Fotos de Perfil">
            Las fotos de perfil deben ser tuyas y apropiadas. No se permiten:
            {"\n\n"}• Fotos de otras personas sin consentimiento
            {"\n"}• Contenido sexual explícito
            {"\n"}• Violencia o contenido ilegal
            {"\n"}• Logos o marcas comerciales
            {"\n\n"}Nos reservamos el derecho de eliminar fotos que violen estos términos.
          </Section>

          <Section title="7. Suscripciones y Pagos">
            • Las suscripciones se renuevan automáticamente a menos que las canceles
            {"\n"}• Puedes cancelar en cualquier momento a través de la configuración de tu cuenta
            {"\n"}• Los reembolsos se procesan según la política de reembolsos de tu tienda de aplicaciones
            {"\n"}• Los precios pueden cambiar con aviso previo
          </Section>

          <Section title="8. Limitación de Responsabilidad">
            GoChat se proporciona "tal cual". No garantizamos que la Aplicación sea ininterrumpida, segura o libre de errores. En la máxima medida permitida por la ley, no somos responsables de daños indirectos, incidentales o consecuentes.
          </Section>

          <Section title="9. Indemnización">
            Aceptas indemnizar y defender a GoChat de cualquier reclamo, daño o gasto derivado de tu uso de la Aplicación o violación de estos términos.
          </Section>

          <Section title="10. Terminación">
            Podemos suspender o terminar tu cuenta en cualquier momento si violamos estos términos o por cualquier otra razón a nuestro criterio.
          </Section>

          <Section title="11. Cambios a los Términos">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor cuando se publiquen en la Aplicación.
          </Section>

          <Section title="12. Ley Aplicable">
            Estos Términos se rigen por las leyes de la jurisdicción donde se registra GoChat, sin considerar sus disposiciones sobre conflictos de leyes.
          </Section>

          <Section title="13. Contacto">
            Si tienes preguntas sobre estos Términos de Servicio, contáctanos en:
            {"\n\n"}
            <Text style={{ fontWeight: "600" }}>Email:</Text> support@gochat.app
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
