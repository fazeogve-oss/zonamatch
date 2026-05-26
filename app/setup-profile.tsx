import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { INTERESTS } from "@/shared/types";

type Step = "name" | "birthdate" | "gender" | "photos" | "bio" | "interests";
const STEPS: Step[] = ["name", "birthdate", "gender", "photos", "bio", "interests"];

const STEP_META: Record<Step, { emoji: string; title: string; subtitle: string }> = {
  name: { emoji: "✨", title: "¿Cómo te llamas?", subtitle: "Este será tu nombre en la app." },
  birthdate: { emoji: "🎂", title: "¿Cuándo naciste?", subtitle: "Debes tener al menos 18 años." },
  gender: { emoji: "💜", title: "¿Cómo te identificas?", subtitle: "Cuéntanos más sobre ti." },
  photos: { emoji: "📸", title: "Tu mejor foto", subtitle: "Es lo primero que verán los demás." },
  bio: { emoji: "📝", title: "Cuéntate un poco", subtitle: "Opcional. Máx. 300 caracteres." },
  interests: { emoji: "🎯", title: "Tus intereses", subtitle: "Selecciona hasta 10." },
};

export default function SetupProfileScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"man" | "woman" | "nonbinary" | "other">("man");
  const [lookingFor, setLookingFor] = useState<"men" | "women" | "everyone">("everyone");
  const [bio, setBio] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [photos] = useState<string[]>(["https://picsum.photos/400/500?random=1"]);

  const createProfile = trpc.profile.create.useMutation({
    onSuccess: () => router.replace("/(tabs)" as never),
    onError: (err) => Alert.alert("Error", err.message),
  });

  const currentStepIndex = STEPS.indexOf(step);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;
  const meta = STEP_META[step];

  const handleNext = () => {
    if (step === "name") {
      if (!displayName.trim()) return Alert.alert("Campo requerido", "Ingresa tu nombre.");
      setStep("birthdate");
    } else if (step === "birthdate") {
      if (!birthDate.trim()) return Alert.alert("Campo requerido", "Ingresa tu fecha de nacimiento.");
      setStep("gender");
    } else if (step === "gender") {
      setStep("photos");
    } else if (step === "photos") {
      setStep("bio");
    } else if (step === "bio") {
      setStep("interests");
    } else {
      createProfile.mutate({ displayName, birthDate, gender, lookingFor, bio: bio || undefined, photos, interests: selectedInterests });
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : prev.length < 10 ? [...prev, interest] : prev
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#13111C"]} style={StyleSheet.absoluteFillObject} />
      <View style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: "#7C3AED", opacity: 0.1 }} />

      <ScreenContainer containerClassName="bg-transparent" edges={["top", "bottom", "left", "right"]}>
        {/* Header with progress */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            {currentStepIndex > 0 && (
              <TouchableOpacity
                onPress={() => setStep(STEPS[currentStepIndex - 1])}
                style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)", alignItems: "center", justifyContent: "center", marginRight: 12 }}
              >
                <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>‹</Text>
              </TouchableOpacity>
            )}
            <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: "600" }}>
              {currentStepIndex + 1} / {STEPS.length}
            </Text>
          </View>

          {/* Progress bar */}
          <View style={{ height: 4, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <LinearGradient
              colors={["#7C3AED", "#A855F7", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ height: "100%", width: `${progress}%`, borderRadius: 2 }}
            />
          </View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Step header */}
          <View style={{ marginBottom: 28 }}>
            <Text style={{ fontSize: 36, marginBottom: 10 }}>{meta.emoji}</Text>
            <Text style={{ fontSize: 26, fontWeight: "900", color: "#fff", letterSpacing: -0.5, marginBottom: 6 }}>{meta.title}</Text>
            <Text style={{ color: "rgba(255,255,255,0.45)", fontSize: 14 }}>{meta.subtitle}</Text>
          </View>

          {/* Name step */}
          {step === "name" && (
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Tu nombre"
              placeholderTextColor="rgba(255,255,255,0.25)"
              style={{ borderWidth: 1.5, borderColor: displayName ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)", borderRadius: 16, padding: 18, fontSize: 18, color: "#fff", backgroundColor: "rgba(255,255,255,0.05)" }}
              maxLength={50}
              autoFocus
            />
          )}

          {/* Birthdate step */}
          {step === "birthdate" && (
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="rgba(255,255,255,0.25)"
              keyboardType="numeric"
              style={{ borderWidth: 1.5, borderColor: birthDate ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)", borderRadius: 16, padding: 18, fontSize: 18, color: "#fff", backgroundColor: "rgba(255,255,255,0.05)" }}
              maxLength={10}
              autoFocus
            />
          )}

          {/* Gender step */}
          {step === "gender" && (
            <View style={{ gap: 12 }}>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 4 }}>Soy...</Text>
              {(["man", "woman", "nonbinary", "other"] as const).map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGender(g)}
                  style={{ borderWidth: 1.5, borderColor: gender === g ? "#A855F7" : "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, backgroundColor: gender === g ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Text style={{ fontSize: 16, color: gender === g ? "#C084FC" : "rgba(255,255,255,0.7)", fontWeight: gender === g ? "700" : "400" }}>
                    {g === "man" ? "👨 Hombre" : g === "woman" ? "👩 Mujer" : g === "nonbinary" ? "🧑 No binario" : "🌈 Otro"}
                  </Text>
                  {gender === g && (
                    <LinearGradient colors={["#7C3AED", "#EC4899"]} style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              ))}

              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase", marginTop: 12, marginBottom: 4 }}>Busco...</Text>
              {(["men", "women", "everyone"] as const).map((l) => (
                <TouchableOpacity
                  key={l}
                  onPress={() => setLookingFor(l)}
                  style={{ borderWidth: 1.5, borderColor: lookingFor === l ? "#A855F7" : "rgba(255,255,255,0.1)", borderRadius: 16, padding: 16, backgroundColor: lookingFor === l ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.04)", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
                >
                  <Text style={{ fontSize: 16, color: lookingFor === l ? "#C084FC" : "rgba(255,255,255,0.7)", fontWeight: lookingFor === l ? "700" : "400" }}>
                    {l === "men" ? "Hombres" : l === "women" ? "Mujeres" : "Todos"}
                  </Text>
                  {lookingFor === l && (
                    <LinearGradient colors={["#7C3AED", "#EC4899"]} style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 12 }}>✓</Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Photos step */}
          {step === "photos" && (
            <View style={{ gap: 16 }}>
              <TouchableOpacity style={{ height: 220, borderRadius: 20, borderWidth: 2, borderColor: "rgba(168,85,247,0.4)", borderStyle: "dashed", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(168,85,247,0.07)", gap: 12 }}>
                <LinearGradient colors={["#7C3AED", "#EC4899"]} style={{ width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 28 }}>📷</Text>
                </LinearGradient>
                <Text style={{ color: "#C084FC", fontWeight: "700", fontSize: 16 }}>Agregar foto</Text>
                <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>JPG, PNG hasta 10MB</Text>
              </TouchableOpacity>
              <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, textAlign: "center" }}>
                En la versión final podrás subir tus fotos reales desde la galería.
              </Text>
            </View>
          )}

          {/* Bio step */}
          {step === "bio" && (
            <View style={{ gap: 10 }}>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Escribe algo sobre ti... ¿Qué te apasiona? ¿Qué buscas?"
                placeholderTextColor="rgba(255,255,255,0.25)"
                multiline
                style={{ borderWidth: 1.5, borderColor: bio ? "rgba(168,85,247,0.6)" : "rgba(255,255,255,0.1)", borderRadius: 16, padding: 18, fontSize: 16, color: "#fff", backgroundColor: "rgba(255,255,255,0.05)", height: 160, textAlignVertical: "top" }}
                maxLength={300}
              />
              <Text style={{ color: "rgba(255,255,255,0.3)", textAlign: "right", fontSize: 12 }}>{bio.length}/300</Text>
            </View>
          )}

          {/* Interests step */}
          {step === "interests" && (
            <View style={{ gap: 14 }}>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                Seleccionados: {selectedInterests.length}/10
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {INTERESTS.map((interest) => {
                  const selected = selectedInterests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={interest}
                      onPress={() => toggleInterest(interest)}
                      style={{ borderRadius: 22, overflow: "hidden" }}
                    >
                      {selected ? (
                        <LinearGradient colors={["#7C3AED", "#A855F7", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingHorizontal: 16, paddingVertical: 9 }}>
                          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>{interest}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={{ paddingHorizontal: 16, paddingVertical: 9, borderRadius: 22, borderWidth: 1.5, borderColor: "rgba(255,255,255,0.12)", backgroundColor: "rgba(255,255,255,0.04)" }}>
                          <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{interest}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={{ paddingHorizontal: 24, paddingBottom: 32, paddingTop: 12 }}>
          <TouchableOpacity
            onPress={handleNext}
            disabled={createProfile.isPending}
            style={{ borderRadius: 18, overflow: "hidden", opacity: createProfile.isPending ? 0.7 : 1 }}
          >
            <LinearGradient
              colors={["#7C3AED", "#A855F7", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 18, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "800" }}>
                {step === "interests" ? (createProfile.isPending ? "Guardando..." : "¡Listo! Empezar 🚀") : "Continuar →"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    </View>
  );
}
