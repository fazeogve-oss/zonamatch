import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import type { MatchWithProfile } from "@/shared/types";

const DEMO_MATCHES: MatchWithProfile[] = [
  { id: 1, user1Id: 1, user2Id: 101, unreadCount: 2, lastMessage: "Hola! Me encantó tu perfil 💜", lastMessageAt: new Date(Date.now() - 5 * 60000), createdAt: new Date(Date.now() - 86400000), otherProfile: { id: 1, userId: 101, displayName: "Valentina", birthDate: "1998-03-15", gender: "woman", lookingFor: "everyone", bio: "", photos: ["https://picsum.photos/200/200?random=10"], interests: [], city: "Bogotá", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 } },
  { id: 2, user1Id: 1, user2Id: 102, unreadCount: 1, lastMessage: "¿Te gustaría tomar un café? ☕", lastMessageAt: new Date(Date.now() - 30 * 60000), createdAt: new Date(Date.now() - 172800000), otherProfile: { id: 2, userId: 102, displayName: "Camila", birthDate: "2000-11-08", gender: "woman", lookingFor: "everyone", bio: "", photos: ["https://picsum.photos/200/200?random=30"], interests: [], city: "Cali", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 } },
  { id: 3, user1Id: 1, user2Id: 103, unreadCount: 0, lastMessage: "¡Fue genial conocerte! 😊", lastMessageAt: new Date(Date.now() - 2 * 3600000), createdAt: new Date(Date.now() - 259200000), otherProfile: { id: 3, userId: 103, displayName: "Isabella", birthDate: "1997-09-14", gender: "woman", lookingFor: "everyone", bio: "", photos: ["https://picsum.photos/200/200?random=50"], interests: [], city: "Bogotá", isPremium: true, premiumPlan: "premium", swipesLeft: 9999, superLikesLeft: 5, boostsLeft: 1 } },
  { id: 4, user1Id: 1, user2Id: 104, unreadCount: 0, lastMessage: null, lastMessageAt: null, createdAt: new Date(Date.now() - 3600000), otherProfile: { id: 4, userId: 104, displayName: "Sebastián", birthDate: "1995-07-22", gender: "man", lookingFor: "everyone", bio: "", photos: ["https://picsum.photos/200/200?random=20"], interests: [], city: "Medellín", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 } },
  { id: 5, user1Id: 1, user2Id: 105, unreadCount: 0, lastMessage: null, lastMessageAt: null, createdAt: new Date(Date.now() - 7200000), otherProfile: { id: 5, userId: 105, displayName: "Andrés", birthDate: "1993-05-30", gender: "man", lookingFor: "everyone", bio: "", photos: ["https://picsum.photos/200/200?random=40"], interests: [], city: "Barranquilla", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 } },
];

function formatTime(date: Date | null): string {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return `${Math.floor(diff / 86400000)}d`;
}

export default function MatchesScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");

  const matchesQuery = trpc.matches.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const allMatches = (matchesQuery.data as MatchWithProfile[] | undefined) || DEMO_MATCHES;

  const filtered = allMatches.filter((m) =>
    (m.otherProfile?.displayName || "").toLowerCase().includes(search.toLowerCase())
  );
  const newMatches = filtered.filter((m) => !m.lastMessage);
  const conversations = filtered.filter((m) => !!m.lastMessage);

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#13111C"]} style={StyleSheet.absoluteFillObject} />

      <ScreenContainer containerClassName="bg-transparent">
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16 }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: "#fff", letterSpacing: -0.5, marginBottom: 14 }}>
            Mensajes 💬
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: "rgba(168,85,247,0.2)" }}>
            <Text style={{ color: "rgba(255,255,255,0.4)", marginRight: 8, fontSize: 15 }}>🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar conversación..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              style={{ flex: 1, color: "#fff", fontSize: 14 }}
            />
          </View>
        </View>

        {matchesQuery.isLoading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#A855F7" size="large" />
          </View>
        ) : (
          <FlatList
            data={conversations}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            ListHeaderComponent={
              newMatches.length > 0 ? (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 14 }}>
                    Nuevos matches ✨
                  </Text>
                  <FlatList
                    data={newMatches}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => `new-${item.id}`}
                    contentContainerStyle={{ gap: 16 }}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => router.push(`/chat/${item.id}` as never)}
                        style={{ alignItems: "center", gap: 6 }}
                      >
                        <LinearGradient colors={["#7C3AED", "#A855F7", "#EC4899"]} style={{ width: 68, height: 68, borderRadius: 34, padding: 2.5 }}>
                          <Image source={{ uri: item.otherProfile?.photos[0] || "https://picsum.photos/200/200" }} style={{ width: "100%", height: "100%", borderRadius: 31 }} />
                        </LinearGradient>
                        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "600" }} numberOfLines={1}>
                          {item.otherProfile?.displayName}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              ) : null
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => router.push(`/chat/${item.id}` as never)}
                style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" }}
              >
                <View style={{ position: "relative" }}>
                  {item.unreadCount > 0 ? (
                    <LinearGradient colors={["#7C3AED", "#EC4899"]} style={{ width: 58, height: 58, borderRadius: 29, padding: 2 }}>
                      <Image source={{ uri: item.otherProfile?.photos[0] || "https://picsum.photos/200/200" }} style={{ width: "100%", height: "100%", borderRadius: 27 }} />
                    </LinearGradient>
                  ) : (
                    <Image source={{ uri: item.otherProfile?.photos[0] || "https://picsum.photos/200/200" }} style={{ width: 58, height: 58, borderRadius: 29, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.1)" }} />
                  )}
                  {item.otherProfile?.isPremium && (
                    <View style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: "#F59E0B", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "#0A0A0F" }}>
                      <Text style={{ fontSize: 9 }}>👑</Text>
                    </View>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>{item.otherProfile?.displayName}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>{formatTime(item.lastMessageAt)}</Text>
                  </View>
                  <Text style={{ color: item.unreadCount > 0 ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: item.unreadCount > 0 ? "600" : "400" }} numberOfLines={1}>
                    {item.lastMessage || "¡Di hola! 👋"}
                  </Text>
                </View>

                {item.unreadCount > 0 && (
                  <LinearGradient colors={["#7C3AED", "#EC4899"]} style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>{item.unreadCount}</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 12 }}>
                <Text style={{ fontSize: 48 }}>💜</Text>
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Sin conversaciones aún</Text>
                <Text style={{ color: "rgba(255,255,255,0.4)", textAlign: "center" }}>¡Haz swipe y consigue tu primer match!</Text>
              </View>
            }
          />
        )}
      </ScreenContainer>
    </View>
  );
}
