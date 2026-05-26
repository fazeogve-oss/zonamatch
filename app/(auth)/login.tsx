import { Text, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { startOAuthLogin } from "@/constants/oauth";

export default function LoginScreen() {
  const colors = useColors();

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "bottom", "left", "right"]}>
      <View style={{ flex: 1, justifyContent: "space-between", padding: 24 }}>
        {/* Header */}
        <View style={{ alignItems: "center", marginTop: 60 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>💘</Text>
          <Text style={{ fontSize: 32, fontWeight: "800", color: colors.primary, marginBottom: 8 }}>
            ZonaMatch
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted, textAlign: "center" }}>
            Encuentra tu match perfecto
          </Text>
        </View>

        {/* Buttons */}
        <View style={{ gap: 16, paddingBottom: 32 }}>
          <TouchableOpacity
            onPress={() => startOAuthLogin()}
            style={{
              backgroundColor: colors.primary,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => startOAuthLogin()}
            style={{
              borderWidth: 2,
              borderColor: colors.primary,
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: "center",
            }}
          >
            <Text style={{ color: colors.primary, fontSize: 17, fontWeight: "700" }}>
              Crear cuenta
            </Text>
          </TouchableOpacity>

          <Text style={{ textAlign: "center", color: colors.muted, fontSize: 12, marginTop: 8 }}>
            Al continuar, aceptas nuestros Términos de Servicio.{"\n"}
            Solo para mayores de 18 años.
          </Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
