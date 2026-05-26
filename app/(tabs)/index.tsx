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
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import type { UserProfile } from "@/shared/types";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

const DEMO_PROFILES: UserProfile[] = [
  { id: 1, userId: 101, displayName: "Valentina", birthDate: "1998-03-15", gender: "woman", lookingFor: "everyone", bio: "Amo viajar, el café y los atardeceres 🌅", photos: ["https://picsum.photos/400/500?random=10"], interests: ["Viajes", "Fotografía", "Yoga"], city: "Bogotá", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  { id: 2, userId: 102, displayName: "Sebastián", birthDate: "1995-07-22", gender: "man", lookingFor: "everyone", bio: "Chef de corazón, gamer de alma 🎮🍕", photos: ["https://picsum.photos/400/500?random=20"], interests: ["Gaming", "Cocina", "Música"], city: "Medellín", isPremium: true, premiumPlan: "premium", swipesLeft: 9999, superLikesLeft: 5, boostsLeft: 1 },
  { id: 3, userId: 103, displayName: "Camila", birthDate: "2000-11-08", gender: "woman", lookingFor: "everyone", bio: "Artista y soñadora ✨ Busco aventuras únicas", photos: ["https://picsum.photos/400/500?random=30"], interests: ["Arte", "Música", "Lectura"], city: "Cali", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  { id: 4, userId: 104, displayName: "Andrés", birthDate: "1993-05-30", gender: "man", lookingFor: "everyone", bio: "Deportista y aventurero 🏋️‍♂️🏕️", photos: ["https://picsum.photos/400/500?random=40"], interests: ["Fitness", "Senderismo", "Deportes"], city: "Barranquilla", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
  { id: 5, userId: 105, displayName: "Isabella", birthDate: "1997-09-14", gender: "woman", lookingFor: "everyone", bio: "Tecnóloga y lectora empedernida 📚💻", photos: ["https://picsum.photos/400/500?random=50"], interests: ["Tecnología", "Lectura", "Cine"], city: "Bogotá", isPremium: false, premiumPlan: "none", swipesLeft: 20, superLikesLeft: 1, boostsLeft: 0 },
];

function SwipeCard({ profile, onSwipe, isTop }: { profile: UserProfile; onSwipe: (dir: "left" | "right" | "up") => void; isTop: boolean }) {
  const colors = useColors();
  const position = useRef(new Animated.ValueXY()).current;
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | "up" | null>(null);

  const rotate = position.x.interpolate({ inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2], outputRange: ["-10deg", "0deg", "10deg"] });

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
          Animated.spring(position, { toValue: { x: gesture.dx, y: -SCREEN_WIDTH }, useNativeDriver: false }).start(() => onSwipe("up"));
        } else {
          Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start(() => setSwipeDir(null));
        }
      },
    })
  ).current;

  const photo = profile.photos[0] || "https://picsum.photos/400/500";
  const age = new Date().getFullYear() - new Date(profile.birthDate).getFullYear();

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }],
      }}
    >
      <View style={{ flex: 1, borderRadius: 20, overflow: "hidden", backgroundColor: colors.surface, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 }}>
        <Image source={{ uri: photo }} style={{ width: "100%", height: "75%" }} resizeMode="cover" />

        {/* Swipe indicators */}
        {swipeDir === "right" && (
          <View style={{ position: "absolute", top: 40, left: 20, borderWidth: 3, borderColor: "#00C851", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, transform: [{ rotate: "-15deg" }] }}>
            <Text style={{ color: "#00C851", fontSize: 28, fontWeight: "800" }}>LIKE</Text>
          </View>
        )}
        {swipeDir === "left" && (
          <View style={{ position: "absolute", top: 40, right: 20, borderWidth: 3, borderColor: "#FF4458", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, transform: [{ rotate: "15deg" }] }}>
            <Text style={{ color: "#FF4458", fontSize: 28, fontWeight: "800" }}>NOPE</Text>
          </View>
        )}
        {swipeDir === "up" && (
          <View style={{ position: "absolute", top: 40, alignSelf: "center", borderWidth: 3, borderColor: "#00B4D8", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
            <Text style={{ color: "#00B4D8", fontSize: 28, fontWeight: "800" }}>SUPER</Text>
          </View>
        )}

        {/* Profile info */}
        <View style={{ padding: 20, flex: 1, justifyContent: "space-between" }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 22, fontWeight: "700", color: colors.foreground }}>{profile.displayName}, {age}</Text>
              {profile.isPremium && <Text style={{ fontSize: 16 }}>👑</Text>}
            </View>
            {profile.city && <Text style={{ color: colors.muted, fontSize: 14 }}>📍 {profile.city}</Text>}
          </View>
          {profile.bio && <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 20 }} numberOfLines={2}>{profile.bio}</Text>}
        </View>
      </View>
    </Animated.View>
  );
}

export default function DiscoverScreen() {
  const router = useRouter();
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();
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

  return (
    <ScreenContainer containerClassName="bg-background">
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 12 }}>
        <Text style={{ fontSize: 26, fontWeight: "800", color: colors.primary }}>💘 ZonaMatch</Text>
        <TouchableOpacity onPress={() => router.push("/premium" as never)} style={{ backgroundColor: "#FFD700" + "22", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Text style={{ color: "#B8860B", fontWeight: "700", fontSize: 13 }}>👑 Premium</Text>
        </TouchableOpacity>
      </View>

      {/* Card stack */}
      <View style={{ flex: 1, marginHorizontal: 16, marginBottom: 8 }}>
        {isLimited ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16 }}>
            <Text style={{ fontSize: 40 }}>🔒</Text>
            <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, textAlign: "center" }}>Límite diario alcanzado</Text>
            <Text style={{ color: colors.muted, textAlign: "center" }}>Hazte Premium para swipes ilimitados</Text>
            <TouchableOpacity onPress={() => router.push("/premium" as never)} style={{ backgroundColor: colors.primary, borderRadius: 16, paddingHorizontal: 32, paddingVertical: 14 }}>
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>Ver planes Premium</Text>
            </TouchableOpacity>
          </View>
        ) : profiles.length === 0 ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
            {profileQuery.isLoading ? <ActivityIndicator color={colors.primary} size="large" /> : (
              <>
                <Text style={{ fontSize: 40 }}>🎉</Text>
                <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>¡Has visto todos los perfiles!</Text>
                <Text style={{ color: colors.muted }}>Vuelve más tarde para más matches</Text>
              </>
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            {profiles.map((profile, index) => (
              <SwipeCard
                key={profile.id}
                profile={profile}
                isTop={index === profiles.length - 1}
                onSwipe={(dir) => handleSwipe(dir, profile)}
              />
            ))}
          </View>
        )}
      </View>

      {/* Action buttons */}
      {!isLimited && profiles.length > 0 && (
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 20, paddingBottom: 24, paddingHorizontal: 40 }}>
          <TouchableOpacity onPress={() => handleButtonSwipe("left")} style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: "#FF4458" + "22", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FF4458" }}>
            <Text style={{ fontSize: 24 }}>✕</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonSwipe("up")} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: "#00B4D8" + "22", alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#00B4D8" }}>
            <Text style={{ fontSize: 20 }}>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleButtonSwipe("right")} style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }}>
            <Text style={{ fontSize: 28 }}>♥</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Match modal */}
      {showMatch && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.85)", alignItems: "center", justifyContent: "center", padding: 32 }}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>💘</Text>
          <Text style={{ fontSize: 32, fontWeight: "800", color: "#fff", marginBottom: 8 }}>¡Es un Match!</Text>
          <Text style={{ fontSize: 18, color: "#ffffff99", textAlign: "center", marginBottom: 32 }}>
            Tú y {showMatch.displayName} se gustaron mutuamente
          </Text>
          <Image source={{ uri: showMatch.photos[0] }} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: colors.primary, marginBottom: 32 }} />
          <TouchableOpacity onPress={() => { setShowMatch(null); router.push("/(tabs)/matches" as never); }} style={{ backgroundColor: colors.primary, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginBottom: 12 }}>
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>Enviar mensaje</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowMatch(null)}>
            <Text style={{ color: "#ffffff88", fontSize: 15 }}>Seguir explorando</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScreenContainer>
  );
}
