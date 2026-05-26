import { useRouter } from "expo-router";
import { FlatList, Image, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import type { MatchWithProfile } from "@/shared/types";

const DEMO_MATCHES: MatchWithProfile[] = [
  {
    id: 1, user1Id: 1, user2Id: 101, unreadCount: 2, lastMessage: "Hola! Me gustó tu perfil 😊", lastMessageAt: new Date(Date.now() - 300000), createdAt: new Date(Date.now() - 86400000),
    otherProfile: { id: 1, userId: 101, displayName: "Valentina", birthDate: "1998-03-15", gender: "woman", lookingFor: "everyone", bio: "Amo viajar", photos: ["https://picsum.photos/200/200?random=10"], interests: [], city: "Bogotá", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  },
  {
    id: 2, user1Id: 1, user2Id: 102, unreadCount: 0, lastMessage: "¿Cuándo nos tomamos ese café?", lastMessageAt: new Date(Date.now() - 3600000), createdAt: new Date(Date.now() - 172800000),
    otherProfile: { id: 2, userId: 102, displayName: "Sebastián", birthDate: "1995-07-22", gender: "man", lookingFor: "everyone", bio: "Chef gamer", photos: ["https://picsum.photos/200/200?random=20"], interests: [], city: "Medellín", isPremium: true, premiumPlan: "premium", swipesLeft: 9999, superLikesLeft: 5, boostsLeft: 1 },
  },
  {
    id: 3, user1Id: 1, user2Id: 103, unreadCount: 0, lastMessage: null, lastMessageAt: null, createdAt: new Date(Date.now() - 3600000),
    otherProfile: { id: 3, userId: 103, displayName: "Camila", birthDate: "2000-11-08", gender: "woman", lookingFor: "everyone", bio: "Artista", photos: ["https://picsum.photos/200/200?random=30"], interests: [], city: "Cali", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  },
];

function formatTime(date: Date | null): string {
  if (!date) return "";
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

export default function MatchesScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated } = useAuth();

  const matchesQuery = trpc.matches.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const displayMatches = (matchesQuery.data as MatchWithProfile[] | undefined) || DEMO_MATCHES;

  const newMatches = displayMatches.filter((m) => !m.lastMessage);
  const conversations = displayMatches.filter((m) => m.lastMessage);

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "800", color: colors.foreground }}>Matches</Text>
      </View>

      {matchesQuery.isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={() => (
            <>
              {/* New matches row */}
              {newMatches.length > 0 && (
                <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Nuevos Matches
                  </Text>
                  <FlatList
                    horizontal
                    data={newMatches}
                    keyExtractor={(item) => `new-${item.id}`}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => router.push(`/chat/${item.id}` as never)}
                        style={{ alignItems: "center", marginRight: 16 }}
                      >
                        <View style={{ position: "relative" }}>
                          <Image
                            source={{ uri: item.otherProfile?.photos[0] || "https://picsum.photos/200/200" }}
                            style={{ width: 70, height: 70, borderRadius: 35, borderWidth: 3, borderColor: colors.primary }}
                          />
                          <View style={{ position: "absolute", bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: "#00C851", borderWidth: 2, borderColor: colors.background }} />
                        </View>
                        <Text style={{ color: colors.foreground, fontSize: 12, marginTop: 6, fontWeight: "500" }} numberOfLines={1}>
                          {item.otherProfile?.displayName}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
              {conversations.length > 0 && (
                <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted, marginBottom: 4, paddingHorizontal: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Mensajes
                </Text>
              )}
            </>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/chat/${item.id}` as never)}
              style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14, gap: 14 }}
            >
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: item.otherProfile?.photos[0] || "https://picsum.photos/200/200" }}
                  style={{ width: 58, height: 58, borderRadius: 29 }}
                />
                {item.unreadCount > 0 && (
                  <View style={{ position: "absolute", top: -2, right: -2, backgroundColor: colors.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>{item.unreadCount}</Text>
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={{ fontSize: 16, fontWeight: item.unreadCount > 0 ? "700" : "600", color: colors.foreground }}>
                    {item.otherProfile?.displayName}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{formatTime(item.lastMessageAt)}</Text>
                </View>
                <Text style={{ color: item.unreadCount > 0 ? colors.foreground : colors.muted, fontSize: 14, marginTop: 2 }} numberOfLines={1}>
                  {item.lastMessage || "¡Nuevo match! Di hola 👋"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 92 }} />}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 12 }}>
              <Text style={{ fontSize: 40 }}>💘</Text>
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground }}>Sin matches aún</Text>
              <Text style={{ color: colors.muted, textAlign: "center" }}>Sigue deslizando para encontrar tu match</Text>
            </View>
          )}
        />
      )}
    </ScreenContainer>
  );
}
