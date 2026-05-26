import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    emoji: "✨",
    title: "Conexiones reales",
    subtitle: "Encuentra personas que vibran en tu misma frecuencia. Auténtico, cercano y sin filtros.",
    gradient: ["#7C3AED", "#A855F7", "#EC4899"] as const,
  },
  {
    id: "2",
    emoji: "💜",
    title: "Swipe con estilo",
    subtitle: "Desliza perfiles únicos. Cuando hay match, la magia comienza.",
    gradient: ["#4C1D95", "#7C3AED", "#DB2777"] as const,
  },
  {
    id: "3",
    emoji: "🔥",
    title: "Tu historia empieza aquí",
    subtitle: "Miles de personas esperan conocerte. ¿Estás listo para tu próxima aventura?",
    gradient: ["#1E1B4B", "#4C1D95", "#A855F7"] as const,
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colors = useColors();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const goToLogin = () => router.push("/(auth)/login" as never);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrentIndex(next);
    } else {
      goToLogin();
    }
  };

  const current = SLIDES[currentIndex];

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      {/* Background gradient that changes with slide */}
      <LinearGradient
        colors={["#0A0A0F", current.gradient[0], current.gradient[1]]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      />

      {/* Decorative circles */}
      <View style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: current.gradient[2], opacity: 0.15 }} />
      <View style={{ position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: current.gradient[0], opacity: 0.2 }} />

      <ScreenContainer containerClassName="bg-transparent" edges={["top", "bottom", "left", "right"]}>
        <View style={{ flex: 1 }}>
          {/* Skip button */}
          <View style={{ alignItems: "flex-end", paddingHorizontal: 24, paddingTop: 8 }}>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 15 }}>Omitir</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width, flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40 }}>
                {/* Emoji with glow */}
                <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(168,85,247,0.2)", alignItems: "center", justifyContent: "center", marginBottom: 40, borderWidth: 1, borderColor: "rgba(168,85,247,0.4)" }}>
                  <Text style={{ fontSize: 56 }}>{item.emoji}</Text>
                </View>
                <Text style={{ fontSize: 30, fontWeight: "800", color: "#fff", textAlign: "center", marginBottom: 16, letterSpacing: -0.5 }}>
                  {item.title}
                </Text>
                <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", textAlign: "center", lineHeight: 26 }}>
                  {item.subtitle}
                </Text>
              </View>
            )}
          />

          {/* Dots */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 32, gap: 8 }}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === currentIndex ? 28 : 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: i === currentIndex ? "#A855F7" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </View>

          {/* Buttons */}
          <View style={{ paddingHorizontal: 24, paddingBottom: 40, gap: 14 }}>
            <TouchableOpacity
              onPress={handleNext}
              style={{ borderRadius: 18, overflow: "hidden" }}
            >
              <LinearGradient
                colors={["#7C3AED", "#A855F7", "#EC4899"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 18, alignItems: "center" }}
              >
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800", letterSpacing: 0.3 }}>
                  {currentIndex < SLIDES.length - 1 ? "Continuar →" : "Comenzar ahora ✨"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {currentIndex === SLIDES.length - 1 && (
              <TouchableOpacity onPress={goToLogin} style={{ paddingVertical: 14, alignItems: "center" }}>
                <Text style={{ color: "rgba(255,255,255,0.55)", fontSize: 15 }}>
                  Ya tengo una cuenta
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScreenContainer>
    </View>
  );
}
