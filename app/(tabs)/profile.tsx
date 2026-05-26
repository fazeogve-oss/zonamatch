import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useAuth } from "@/hooks/use-auth";
import { trpc } from "@/lib/trpc";

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useColors();
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
      <ScreenContainer containerClassName="bg-background">
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 32 }}>
          <Text style={{ fontSize: 40 }}>👤</Text>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, textAlign: "center" }}>
            Inicia sesión para ver tu perfil
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/onboarding" as never)}
            style={{ backgroundColor: colors.primary, borderRadius: 16, paddingHorizontal: 32, paddingVertical: 14 }}
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 24, fontWeight: "800", color: colors.foreground }}>Mi Perfil</Text>
          <TouchableOpacity onPress={() => router.push("/setup-profile" as never)} style={{ backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ color: colors.primary, fontWeight: "600", fontSize: 14 }}>✏️ Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Profile photo */}
        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: photos[0] }}
              style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 3, borderColor: colors.primary }}
            />
            {profile?.isPremium && (
              <View style={{ position: "absolute", bottom: 0, right: 0, backgroundColor: "#FFD700", borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 }}>
                <Text style={{ fontSize: 12 }}>👑</Text>
              </View>
            )}
          </View>
          <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground, marginTop: 12 }}>
            {profile?.displayName || user?.name || "Tu nombre"}
            {age ? `, ${age}` : ""}
          </Text>
          {profile?.city && (
            <Text style={{ color: colors.muted, fontSize: 14, marginTop: 4 }}>📍 {profile.city}</Text>
          )}
        </View>

        {/* Stats */}
        <View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 20, backgroundColor: colors.surface, borderRadius: 16, padding: 16, gap: 0 }}>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: colors.primary }}>
              {profile?.swipesLeft === 9999 ? "∞" : profile?.swipesLeft ?? 20}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Swipes</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#00B4D8" }}>
              {profile?.superLikesLeft ?? 1}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Super Likes</Text>
          </View>
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 22, fontWeight: "700", color: "#FFD700" }}>
              {profile?.boostsLeft ?? 0}
            </Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 2 }}>Boosts</Text>
          </View>
        </View>

        {/* Bio */}
        {profile?.bio && (
          <View style={{ marginHorizontal: 20, marginBottom: 20, backgroundColor: colors.surface, borderRadius: 16, padding: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Sobre mí</Text>
            <Text style={{ color: colors.foreground, fontSize: 15, lineHeight: 22 }}>{profile.bio}</Text>
          </View>
        )}

        {/* Interests */}
        {interests.length > 0 && (
          <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>Intereses</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {interests.map((interest) => (
                <View key={interest} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.primary + "20", borderWidth: 1, borderColor: colors.primary + "40" }}>
                  <Text style={{ color: colors.primary, fontWeight: "500", fontSize: 13 }}>{interest}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Premium CTA */}
        {!profile?.isPremium && (
          <TouchableOpacity
            onPress={() => router.push("/premium" as never)}
            style={{ marginHorizontal: 20, marginBottom: 20, borderRadius: 16, overflow: "hidden", backgroundColor: "#FFD700" + "22", borderWidth: 1.5, borderColor: "#FFD700", padding: 16, flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <Text style={{ fontSize: 28 }}>👑</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#B8860B" }}>Hazte Premium</Text>
              <Text style={{ color: "#B8860B", fontSize: 13, opacity: 0.8 }}>Swipes ilimitados, ver quién te gustó y más</Text>
            </View>
            <Text style={{ color: "#B8860B", fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        )}

        {/* Settings */}
        <View style={{ marginHorizontal: 20, marginBottom: 32, gap: 12 }}>
          <TouchableOpacity
            onPress={handleLogout}
            style={{ backgroundColor: colors.surface, borderRadius: 16, padding: 16, alignItems: "center", borderWidth: 1, borderColor: colors.border }}
          >
            <Text style={{ color: colors.error, fontWeight: "600", fontSize: 16 }}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
