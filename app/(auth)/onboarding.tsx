import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, FlatList, Text, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    emoji: "💘",
    title: "Encuentra tu match",
    subtitle: "Desliza perfiles y conecta con personas que comparten tus intereses.",
  },
  {
    id: "2",
    emoji: "💬",
    title: "Chatea sin límites",
    subtitle: "Cuando hay match, el chat se abre. Habla, ríe y conócete mejor.",
  },
  {
    id: "3",
    emoji: "✨",
    title: "Empieza hoy",
    subtitle: "Crea tu perfil en minutos y comienza a conocer personas increíbles.",
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
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      goToLogin();
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "bottom", "left", "right"]}>
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width, flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
              <Text style={{ fontSize: 80, marginBottom: 32 }}>{item.emoji}</Text>
              <Text style={{ fontSize: 28, fontWeight: "700", color: colors.foreground, textAlign: "center", marginBottom: 16 }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 16, color: colors.muted, textAlign: "center", lineHeight: 24 }}>
                {item.subtitle}
              </Text>
            </View>
          )}
        />

        {/* Dots */}
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 24, gap: 8 }}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === currentIndex ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 32, gap: 12 }}>
          <TouchableOpacity
            onPress={handleNext}
            style={{ backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
              {currentIndex < SLIDES.length - 1 ? "Continuar" : "Empezar"}
            </Text>
          </TouchableOpacity>

          {currentIndex === SLIDES.length - 1 && (
            <TouchableOpacity
              onPress={goToLogin}
              style={{ paddingVertical: 14, alignItems: "center" }}
            >
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: "600" }}>
                Ya tengo cuenta
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
}
