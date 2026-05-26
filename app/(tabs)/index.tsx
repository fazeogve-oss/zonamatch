import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import type { UserProfile } from "@/shared/types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.28;

const DEMO_PROFILES: UserProfile[] = [
  { id: 1, userId: 101, displayName: "Valentina", birthDate: "1998-03-15", gender: "woman", lookingFor: "everyone", bio: "Amo viajar, el café y los atardeceres 🌅 Busco alguien con quien explorar el mundo.", photos: ["https://picsum.photos/400/600?random=10"], interests: ["Viajes", "Fotografía", "Yoga"], city: "Bogotá", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  { id: 2, userId: 102, displayName: "Sebastián", birthDate: "1995-07-22", gender: "man", lookingFor: "everyone", bio: "Chef de corazón, gamer de alma 🎮🍕 La vida es demasiado corta para comer mal.", photos: ["https://picsum.photos/400/600?random=20"], interests: ["Gaming", "Cocina", "Música"], city: "Medellín", isPremium: true, premiumPlan: "premium", swipesLeft: 9999, superLikesLeft: 5, boostsLeft: 1 },
  { id: 3, userId: 103, displayName: "Camila", birthDate: "2000-11-08", gender: "woman", lookingFor: "everyone", bio: "Artista y soñadora ✨ Busco aventuras únicas y conversaciones que duren hasta el amanecer.", photos: ["https://picsum.photos/400/600?random=30"], interests: ["Arte", "Música", "Lectura"], city: "Cali", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  { id: 4, userId: 104, displayName: "Andrés", birthDate: "1993-05-30", gender: "man", lookingFor: "everyone", bio: "Deportista y aventurero 🏋️‍♂️🏕️ El gym es mi templo, la montaña mi hogar.", photos: ["https://picsum.photos/400/600?random=40"], interests: ["Fitness", "Senderismo", "Deportes"], city: "Barranquilla", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  { id: 5, userId: 105, displayName: "Isabella", birthDate: "1997-09-14", gender: "woman", lookingFor: "everyone", bio: "Tecnóloga y lectora empedernida 📚💻 Creo que el café y el código son el mejor combo.", photos: ["https://picsum.photos/400/600?random=50"], interests: ["Tecnología", "Lectura", "Cine"], city: "Bogotá", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
];

function SwipeCard({ profile, onSwipe, isTop, stackIndex }: { profile: UserProfile; onSwipe: (dir: "left" | "right" | "up") => void; isTop: boolean; stackIndex: number }) {
  const position = useRef(new Animated.ValueXY()).current;
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | "up" | null>(null);

  const rotate = position.x.interpolate({ inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2], outputRange: ["-12deg", "0deg", "12deg"] });
  const likeOpacity = position.x.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: "clamp" });
  const nopeOpacity = position.x.interpolate({ inputRange: [-80, 0], outputRange: [1, 0], extrapolate: "clamp" });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isTop,
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy });
        if (gesture.dx > 50) setSwipeDir("right");
        else if (gesture.dx < -50) setSwipeDir("left");
        else if (gesture.dy < -50) setSwipeDir("up");
        else setSwipeDir(null);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          Animated.spring(position, { toValue: { x: SCREEN_WIDTH + 100, y: gesture.dy }, useNativeDriver: false }).start(() => onSwipe("right"));
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          Animated.spring(position, { toValue: { x: -SCREEN_WIDTH - 100, y: gesture.dy }, useNativeDriver: false }).start(() => onSwipe("left"));
        } else if (gesture.dy < -SWIPE_THRESHOLD) {
          Animated.spring(position, { toValue: { x: gesture.dx, y: -SCREEN_HEIGHT }, useNativeDriver: false }).start(() => onSwipe("up"));
        } else {
          Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 6, useNativeDriver: false }).start(() => setSwipeDir(null));
        }
      },
    })
  ).current;

  const photo = profile.photos[0] || "https://picsum.photos/400/600";
  const age = new Date().getFullYear() - new Date(profile.birthDate).getFullYear();
  const scale = 1 - stackIndex * 0.04;
  const translateY = stackIndex * 10;

  return (
    <Animated.View
      {...(isTop ? panResponder.panHandlers : {})}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        transform: isTop
          ? [{ translateX: position.x }, { translateY: position.y }, { rotate }]
          : [{ scale }, { translateY }],
        zIndex: 10 - stackIndex,
      }}
    >
      <View style={{ flex: 1, borderRadius: 24, overflow: "hidden", shadowColor: "#A855F7", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 }}>
        <Image source={{ uri: photo }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />

        {/* Bottom gradient overlay */}
        <LinearGradient
          colors={["transparent", "rgba(10,10,15,0.6)", "rgba(10,10,15,0.95)"]}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", padding: 20, justifyContent: "flex-end" }}
        >
          {/* Interests chips */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
            {profile.interests.slice(0, 3).map((interest) => (
              <View key={interest} style={{ backgroundColor: "rgba(168,85,247,0.35)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(168,85,247,0.5)" }}>
                <Text style={{ color: "#E9D5FF", fontSize: 11, fontWeight: "600" }}>{interest}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: "800", color: "#fff", letterSpacing: -0.5 }}>
              {profile.displayName}, {age}
            </Text>
            {profile.isPremium && (
              <LinearGradient colors={["#F59E0B", "#EF4444"]} style={{ borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>👑 PRO</Text>
              </LinearGradient>
            )}
          </View>
          {profile.city && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>📍 {profile.city}</Text>
            </View>
          )}
          {profile.bio && (
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 6, lineHeight: 18 }} numberOfLines={2}>
              {profile.bio}
            </Text>
          )}
        </LinearGradient>

        {/* Swipe indicators */}
        <Animated.View style={{ position: "absolute", top: 40, left: 20, opacity: likeOpacity, transform: [{ rotate: "-15deg" }] }}>
          <LinearGradient colors={["#10B981", "#34D399"]} style={{ borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "900" }}>LIKE ♥</Text>
          </LinearGradient>
        </Animated.View>
        <Animated.View style={{ position: "absolute", top: 40, right: 20, opacity: nopeOpacity, transform: [{ rotate: "15deg" }] }}>
          <LinearGradient colors={["#EF4444", "#F87171"]} style={{ borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ color: "#fff", fontSize: 26, fontWeight: "900" }}>NOPE ✕</Text>
          </LinearGradient>
        </Animated.View>
        {swipeDir === "up" && (
          <View style={{ position: "absolute", top: 40, alignSelf: "center" }}>
            <LinearGradient colors={["#7C3AED", "#A855F7"]} style={{ borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8 }}>
              <Text style={{ color: "#fff", fontSize: 26, fontWeight: "900" }}>SUPER ⭐</Text>
            </LinearGradient>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default function DiscoverScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const [profiles, setProfiles] = useState<UserProfile[]>(DEMO_PROFILES);
  const [showMatch, setShowMatch] = useState<UserProfile | null>(null);
  const [swipesUsed, setSwipesUsed] = useState(0);
  const FREE_LIMIT = 20;

  const profileQuery = trpc.discover.getProfiles.useQuery({ limit: 10 }, { enabled: isAuthenticated, retry: false });
  const swipeMutation = trpc.likes.swipe.useMutation();

  useEffect(() => {
    if (profileQuery.data && profileQuery.data.length > 0) {
      setProfiles(profileQuery.data as UserProfile[]);
    }
  }, [profileQuery.data]);

  const handleSwipe = (direction: "left" | "right" | "up", profile: UserProfile) => {
    const type = direction === "right" ? "like" : direction === "up" ? "superlike" : "nope";
    setProfiles((prev) => prev.filter((p) => p.id !== profile.id));
    setSwipesUsed((prev) => prev + 1);
    if (isAuthenticated) {
      swipeMutation.mutate({ toUserId: profile.userId, type }, {
        onSuccess: (data) => { if (data.matched) setShowMatch(profile); },
      });
    } else if (direction !== "left" && Math.random() > 0.7) {
      setShowMatch(profile);
    }
  };

  const handleButtonSwipe = (dir: "left" | "right" | "up") => {
    if (profiles.length === 0) return;
    handleSwipe(dir, profiles[profiles.length - 1]);
  };

  const isLimited = !isAuthenticated && swipesUsed >= FREE_LIMIT;
  const visibleProfiles = profiles.slice(-3).reverse();

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#13111C"]} style={StyleSheet.absoluteFillObject} />

      <ScreenContainer containerClassName="bg-transparent" edges={["left", "right"]}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: insets.top + 12, paddingBottom: 14 }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: "900", color: "#fff", letterSpacing: -0.5 }}>💜 GoChat</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/premium" as never)}
            style={{ borderRadius: 20, overflow: "hidden" }}
          >
            <LinearGradient colors={["#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingHorizontal: 14, paddingVertical: 7 }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>👑 Premium</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Card stack */}
        <View style={{ flex: 1, marginHorizontal: 16, marginBottom: 8 }}>
          {isLimited ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 20 }}>
              <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: "rgba(168,85,247,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(168,85,247,0.4)" }}>
                <Text style={{ fontSize: 40 }}>🔒</Text>
              </View>
              <Text style={{ fontSize: 22, fontWeight: "700", color: "#fff", textAlign: "center" }}>Límite diario alcanzado</Text>
              <Text style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 22 }}>Hazte Premium para swipes ilimitados y más funciones exclusivas</Text>
              <TouchableOpacity onPress={() => router.push("/premium" as never)} style={{ borderRadius: 18, overflow: "hidden" }}>
                <LinearGradient colors={["#7C3AED", "#A855F7", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingHorizontal: 36, paddingVertical: 16 }}>
                  <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Ver planes Premium</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : profiles.length === 0 ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 14 }}>
              {profileQuery.isLoading
                ? <ActivityIndicator color="#A855F7" size="large" />
                : <>
                    <Text style={{ fontSize: 40 }}>🎉</Text>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#fff" }}>¡Has visto todos los perfiles!</Text>
                    <Text style={{ color: "rgba(255,255,255,0.5)" }}>Vuelve más tarde para más matches</Text>
                  </>
              }
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {visibleProfiles.map((profile, index) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  isTop={index === visibleProfiles.length - 1}
                  stackIndex={visibleProfiles.length - 1 - index}
                  onSwipe={(dir) => handleSwipe(dir, profile)}
                />
              ))}
            </View>
          )}
        </View>

        {/* Action buttons */}
        {!isLimited && profiles.length > 0 && (
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 18, paddingBottom: 20, paddingHorizontal: 40 }}>
            <TouchableOpacity
              onPress={() => handleButtonSwipe("left")}
              style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: "rgba(239,68,68,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(239,68,68,0.5)" }}
            >
              <Text style={{ fontSize: 24, color: "#F87171" }}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleButtonSwipe("up")}
              style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "rgba(168,85,247,0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(168,85,247,0.5)" }}
            >
              <Text style={{ fontSize: 20 }}>⭐</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleButtonSwipe("right")}
              style={{ width: 70, height: 70, borderRadius: 35, overflow: "hidden", shadowColor: "#A855F7", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.5, shadowRadius: 12, elevation: 8 }}
            >
              <LinearGradient
                colors={["#7C3AED", "#A855F7", "#EC4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              >
                <Text style={{ fontSize: 28 }}>♥</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScreenContainer>

      {/* Match modal */}
      {showMatch && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <LinearGradient colors={["rgba(10,10,15,0.97)", "#1E1B4B", "rgba(10,10,15,0.97)"]} style={StyleSheet.absoluteFillObject} />
          <View style={{ alignItems: "center", gap: 16 }}>
            <Text style={{ fontSize: 64 }}>💜</Text>
            <Text style={{ fontSize: 34, fontWeight: "900", color: "#fff", letterSpacing: -1 }}>¡Es un Match!</Text>
            <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 24 }}>
              Tú y {showMatch.displayName} se gustaron mutuamente
            </Text>
            <Image source={{ uri: showMatch.photos[0] }} style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 3, borderColor: "#A855F7", marginVertical: 8 }} />
            <TouchableOpacity
              onPress={() => { setShowMatch(null); router.push("/(tabs)/matches" as never); }}
              style={{ borderRadius: 18, overflow: "hidden", width: "100%" }}
            >
              <LinearGradient colors={["#7C3AED", "#A855F7", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 17, alignItems: "center" }}>
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>Enviar mensaje 💬</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowMatch(null)}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 15 }}>Seguir explorando</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
