import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { startOAuthLogin } from "@/constants/oauth";

export default function LoginScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient
        colors={["#0A0A0F", "#1E1B4B", "#2D1F4E"]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Decorative blobs */}
      <View style={{ position: "absolute", top: -100, left: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: "#7C3AED", opacity: 0.12 }} />
      <View style={{ position: "absolute", bottom: 50, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "#EC4899", opacity: 0.1 }} />

      <ScreenContainer containerClassName="bg-transparent" edges={["top", "bottom", "left", "right"]}>
        <View style={{ flex: 1, justifyContent: "space-between", paddingHorizontal: 28 }}>
          {/* Logo area */}
          <View style={{ alignItems: "center", marginTop: 90 }}>
            <View style={{ width: 90, height: 90, borderRadius: 28, backgroundColor: "rgba(168,85,247,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(168,85,247,0.4)", marginBottom: 20 }}>
              <Text style={{ fontSize: 44 }}>💜</Text>
            </View>
            <Text style={{ fontSize: 36, fontWeight: "900", color: "#fff", letterSpacing: -1, marginBottom: 8 }}>
              GoChat
            </Text>
            <Text style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 22 }}>
              Donde las conexiones reales{"\n"}comienzan
            </Text>
          </View>

          {/* Features list */}
          <View style={{ gap: 16 }}>
            {[
              { icon: "✨", text: "Perfiles verificados y auténticos" },
              { icon: "🔥", text: "Matches basados en intereses reales" },
              { icon: "💬", text: "Chat privado y seguro" },
            ].map((item) => (
              <View key={item.text} style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(168,85,247,0.2)" }}>
                <Text style={{ fontSize: 22 }}>{item.icon}</Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, flex: 1 }}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Buttons */}
          <View style={{ gap: 14, paddingBottom: 36 }}>
            <TouchableOpacity onPress={() => startOAuthLogin()} style={{ borderRadius: 18, overflow: "hidden" }}>
              <LinearGradient
                colors={["#7C3AED", "#A855F7", "#EC4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 18, alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.3 }}>
                  Crear cuenta gratis ✨
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => startOAuthLogin()}
              style={{ paddingVertical: 17, alignItems: "center", borderRadius: 18, borderWidth: 1.5, borderColor: "rgba(168,85,247,0.5)", backgroundColor: "rgba(168,85,247,0.08)" }}
            >
              <Text style={{ color: "#C084FC", fontSize: 16, fontWeight: "700" }}>
                Ya tengo cuenta
              </Text>
            </TouchableOpacity>

            <Text style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: 12, lineHeight: 18 }}>
              Al continuar aceptas nuestros Términos de Servicio.{"\n"}Solo para mayores de 18 años.
            </Text>
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}
