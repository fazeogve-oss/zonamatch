import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { INTERESTS } from "@/shared/types";

type Step = "name" | "birthdate" | "gender" | "photos" | "bio" | "interests";
const STEPS: Step[] = ["name", "birthdate", "gender", "photos", "bio", "interests"];

export default function SetupProfileScreen() {
  const router = useRouter();
  const colors = useColors();
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
    } else if (step === "interests") {
      createProfile.mutate({
        displayName,
        birthDate,
        gender,
        lookingFor,
        bio: bio || undefined,
        photos,
        interests: selectedInterests,
      });
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : prev.length < 10 ? [...prev, interest] : prev
    );
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "bottom", "left", "right"]}>
      {/* Progress bar */}
      <View style={{ height: 4, backgroundColor: colors.border, marginHorizontal: 0 }}>
        <View style={{ height: 4, backgroundColor: colors.primary, width: `${progress}%` }} />
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        {step === "name" && (
          <View style={{ flex: 1, gap: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>¿Cómo te llamas?</Text>
            <Text style={{ color: colors.muted }}>Este será tu nombre en la app.</Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Tu nombre"
              placeholderTextColor={colors.muted}
              style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 17, color: colors.foreground, backgroundColor: colors.surface }}
              maxLength={50}
            />
          </View>
        )}

        {step === "birthdate" && (
          <View style={{ flex: 1, gap: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>¿Cuándo naciste?</Text>
            <Text style={{ color: colors.muted }}>Debes tener al menos 18 años.</Text>
            <TextInput
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 17, color: colors.foreground, backgroundColor: colors.surface }}
              maxLength={10}
            />
          </View>
        )}

        {step === "gender" && (
          <View style={{ flex: 1, gap: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>¿Cómo te identificas?</Text>
            {(["man", "woman", "nonbinary", "other"] as const).map((g) => (
              <TouchableOpacity
                key={g}
                onPress={() => setGender(g)}
                style={{ borderWidth: 1.5, borderColor: gender === g ? colors.primary : colors.border, borderRadius: 12, padding: 16, backgroundColor: gender === g ? colors.primary + "15" : colors.surface }}
              >
                <Text style={{ fontSize: 16, color: gender === g ? colors.primary : colors.foreground, fontWeight: gender === g ? "600" : "400" }}>
                  {g === "man" ? "Hombre" : g === "woman" ? "Mujer" : g === "nonbinary" ? "No binario" : "Otro"}
                </Text>
              </TouchableOpacity>
            ))}
            <Text style={{ fontSize: 16, fontWeight: "600", color: colors.foreground, marginTop: 8 }}>¿A quién buscas?</Text>
            {(["men", "women", "everyone"] as const).map((l) => (
              <TouchableOpacity
                key={l}
                onPress={() => setLookingFor(l)}
                style={{ borderWidth: 1.5, borderColor: lookingFor === l ? colors.primary : colors.border, borderRadius: 12, padding: 16, backgroundColor: lookingFor === l ? colors.primary + "15" : colors.surface }}
              >
                <Text style={{ fontSize: 16, color: lookingFor === l ? colors.primary : colors.foreground, fontWeight: lookingFor === l ? "600" : "400" }}>
                  {l === "men" ? "Hombres" : l === "women" ? "Mujeres" : "Todos"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === "photos" && (
          <View style={{ flex: 1, gap: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>Agrega tu foto</Text>
            <Text style={{ color: colors.muted }}>Tu foto principal es lo primero que verán.</Text>
            <View style={{ height: 200, backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1.5, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 40 }}>📷</Text>
              <Text style={{ color: colors.muted, marginTop: 8 }}>Foto de perfil (demo)</Text>
            </View>
            <Text style={{ color: colors.muted, fontSize: 13, textAlign: "center" }}>
              En la versión final podrás subir tus fotos reales.
            </Text>
          </View>
        )}

        {step === "bio" && (
          <View style={{ flex: 1, gap: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>Cuéntate un poco</Text>
            <Text style={{ color: colors.muted }}>Opcional. Máx. 300 caracteres.</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Escribe algo sobre ti..."
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={5}
              style={{ borderWidth: 1.5, borderColor: colors.border, borderRadius: 12, padding: 16, fontSize: 16, color: colors.foreground, backgroundColor: colors.surface, height: 140, textAlignVertical: "top" }}
              maxLength={300}
            />
            <Text style={{ color: colors.muted, textAlign: "right" }}>{bio.length}/300</Text>
          </View>
        )}

        {step === "interests" && (
          <View style={{ flex: 1, gap: 16 }}>
            <Text style={{ fontSize: 26, fontWeight: "700", color: colors.foreground }}>Tus intereses</Text>
            <Text style={{ color: colors.muted }}>Selecciona hasta 10.</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  onPress={() => toggleInterest(interest)}
                  style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: selectedInterests.includes(interest) ? colors.primary : colors.border, backgroundColor: selectedInterests.includes(interest) ? colors.primary : "transparent" }}
                >
                  <Text style={{ color: selectedInterests.includes(interest) ? "#fff" : colors.foreground, fontWeight: "500" }}>
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom button */}
      <View style={{ padding: 24, paddingBottom: 32 }}>
        <TouchableOpacity
          onPress={handleNext}
          disabled={createProfile.isPending}
          style={{ backgroundColor: colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: "center", opacity: createProfile.isPending ? 0.7 : 1 }}
        >
          <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
            {step === "interests" ? (createProfile.isPending ? "Guardando..." : "Finalizar") : "Continuar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
