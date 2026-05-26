import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();

  const profileQuery = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const profile = profileQuery.data;

  const age = profile?.birthDate
    ? new Date().getFullYear() - new Date(profile.birthDate).getFullYear()
    : null;

  const photos: string[] = profile?.photos
    ? (typeof profile.photos === "string" ? JSON.parse(profile.photos) : profile.photos)
    : ["https://picsum.photos/400/400?random=99"];

  const interests: string[] = profile?.interests
    ? (typeof profile.interests === "string" ? JSON.parse(profile.interests) : profile.interests)
    : [];

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Salir", style: "destructive", onPress: logout },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
        <LinearGradient colors={["#0A0A0F", "#1E1B4B"]} style={StyleSheet.absoluteFillObject} />
        <ScreenContainer containerClassName="bg-transparent">
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20, padding: 32 }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(168,85,247,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(168,85,247,0.4)" }}>
              <Text style={{ fontSize: 40 }}>👤</Text>
            </View>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", textAlign: "center" }}>
              Inicia sesión para ver tu perfil
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/onboarding" as never)} style={{ borderRadius: 18, overflow: "hidden" }}>
              <LinearGradient colors={["#7C3AED", "#A855F7", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingHorizontal: 36, paddingVertical: 16 }}>
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Iniciar sesión</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#13111C"]} style={StyleSheet.absoluteFillObject} />

      <ScreenContainer containerClassName="bg-transparent">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ fontSize: 26, fontWeight: "900", color: "#fff", letterSpacing: -0.5 }}>Mi Perfil</Text>
            <TouchableOpacity
              onPress={() => router.push("/setup-profile" as never)}
              style={{ backgroundColor: "rgba(168,85,247,0.15)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: "rgba(168,85,247,0.4)" }}
            >
              <Text style={{ color: "#C084FC", fontWeight: "700", fontSize: 13 }}>✏️ Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Profile hero */}
          <View style={{ alignItems: "center", paddingVertical: 10, marginBottom: 20 }}>
            <View style={{ position: "relative", marginBottom: 16 }}>
              <LinearGradient colors={["#7C3AED", "#A855F7", "#EC4899"]} style={{ width: 118, height: 118, borderRadius: 59, padding: 3 }}>
                <Image source={{ uri: photos[0] }} style={{ width: "100%", height: "100%", borderRadius: 56 }} />
              </LinearGradient>
              {profile?.isPremium && (
                <View style={{ position: "absolute", bottom: 2, right: 2, width: 28, height: 28, borderRadius: 14, backgroundColor: "#F59E0B", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#0A0A0F" }}>
                  <Text style={{ fontSize: 14 }}>👑</Text>
                </View>
              )}
            </View>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: -0.5, marginBottom: 4 }}>
              {profile?.displayName || user?.name || "Tu nombre"}
              {age ? `, ${age}` : ""}
            </Text>
            {profile?.city && (
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>📍 {profile.city}</Text>
            )}
            {profile?.isPremium && (
              <LinearGradient colors={["#F59E0B", "#EF4444"]} style={{ borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5, marginTop: 8 }}>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>👑 {profile.premiumPlan === "gold" ? "Gold" : "Premium"}</Text>
              </LinearGradient>
            )}
          </View>

          {/* Stats */}
          <View style={{ marginHorizontal: 20, marginBottom: 20, borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: "rgba(168,85,247,0.2)" }}>
            <LinearGradient colors={["rgba(124,58,237,0.15)", "rgba(168,85,247,0.08)"]} style={{ flexDirection: "row", padding: 20 }}>
              {[
                { value: profile?.swipesLeft === 9999 ? "∞" : String(profile?.swipesLeft ?? 20), label: "Swipes", color: "#A855F7" },
                { value: String(profile?.superLikesLeft ?? 1), label: "Super Likes", color: "#60A5FA" },
                { value: String(profile?.boostsLeft ?? 0), label: "Boosts", color: "#F59E0B" },
              ].map((stat, i, arr) => (
                <View key={stat.label} style={{ flex: 1, alignItems: "center" }}>
                  <Text style={{ fontSize: 26, fontWeight: "800", color: stat.color, marginBottom: 4 }}>{stat.value}</Text>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{stat.label}</Text>
                  {i < arr.length - 1 && <View style={{ position: "absolute", right: 0, top: 8, bottom: 8, width: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />}
                </View>
              ))}
            </LinearGradient>
          </View>

          {/* Bio */}
          {profile?.bio ? (
            <View style={{ marginHorizontal: 20, marginBottom: 16, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>Sobre mí</Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 24 }}>{profile.bio}</Text>
            </View>
          ) : null}

          {/* Interests */}
          {interests.length > 0 && (
            <View style={{ marginHorizontal: 20, marginBottom: 16 }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>Intereses</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {interests.map((interest) => (
                  <View key={interest} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: "rgba(168,85,247,0.15)", borderWidth: 1, borderColor: "rgba(168,85,247,0.4)" }}>
                    <Text style={{ color: "#C084FC", fontWeight: "600", fontSize: 13 }}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Premium CTA */}
          {!profile?.isPremium && (
            <TouchableOpacity onPress={() => router.push("/premium" as never)} style={{ marginHorizontal: 20, marginBottom: 16, borderRadius: 18, overflow: "hidden" }}>
              <LinearGradient colors={["rgba(245,158,11,0.2)", "rgba(239,68,68,0.15)"]} style={{ padding: 18, flexDirection: "row", alignItems: "center", gap: 14, borderWidth: 1, borderColor: "rgba(245,158,11,0.4)", borderRadius: 18 }}>
                <Text style={{ fontSize: 30 }}>👑</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: "#FCD34D" }}>Hazte Premium</Text>
                  <Text style={{ color: "rgba(252,211,77,0.7)", fontSize: 13, marginTop: 2 }}>Swipes ilimitados · Ver quién te gustó</Text>
                </View>
                <Text style={{ color: "#FCD34D", fontSize: 20 }}>›</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* Menu options */}
          <View style={{ marginHorizontal: 20, marginBottom: 32, gap: 10 }}>
            {[
              { icon: "🔔", label: "Notificaciones", action: () => {} },
              { icon: "🔒", label: "Privacidad", action: () => {} },
              { icon: "❓", label: "Ayuda y soporte", action: () => {} },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={item.action}
                style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" }}
              >
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, flex: 1 }}>{item.label}</Text>
                <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 18 }}>›</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={handleLogout}
              style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(239,68,68,0.08)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(239,68,68,0.25)", marginTop: 4 }}
            >
              <Text style={{ fontSize: 20 }}>🚪</Text>
              <Text style={{ color: "#F87171", fontSize: 15, fontWeight: "600", flex: 1 }}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
