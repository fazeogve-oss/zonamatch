import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import * as Haptics from "expo-haptics";

export default function AgeGateScreen() {
  const router = useRouter();
  const colors = useColors();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const isOver18 = () => {
    if (!selectedDay || !selectedMonth || !selectedYear) return false;
    const birthDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  };

  const handleConfirm = async () => {
    if (!isOver18()) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Debes tener al menos 18 años para usar GoChat");
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/(auth)/login");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#13111C"]} style={StyleSheet.absoluteFillObject} />

      <ScreenContainer containerClassName="bg-transparent" className="flex-1 justify-between py-6">
        {/* Header */}
        <View style={{ alignItems: "center", gap: 12, marginBottom: 24 }}>
          <Text style={{ fontSize: 40 }}>🔞</Text>
          <Text style={{ fontSize: 28, fontWeight: "800", color: "#fff", textAlign: "center" }}>
            Verificación de Edad
          </Text>
          <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 20 }}>
            GoChat es solo para mayores de 18 años. Confirma tu fecha de nacimiento para continuar.
          </Text>
        </View>

        {/* Date Picker */}
        <View style={{ gap: 16, marginBottom: 32 }}>
          <View style={{ flexDirection: "row", gap: 12, justifyContent: "center" }}>
            {/* Day */}
            <View style={{ flex: 1, maxWidth: 100 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                DÍA
              </Text>
              <ScrollView
                style={{
                  height: 150,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(168,85,247,0.3)",
                  backgroundColor: "rgba(168,85,247,0.05)",
                }}
                scrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setSelectedDay(day)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      alignItems: "center",
                      backgroundColor: selectedDay === day ? "rgba(168,85,247,0.3)" : "transparent",
                      borderRadius: 8,
                      marginVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: selectedDay === day ? "700" : "500",
                        color: selectedDay === day ? "#A855F7" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Month */}
            <View style={{ flex: 1, maxWidth: 100 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                MES
              </Text>
              <ScrollView
                style={{
                  height: 150,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(168,85,247,0.3)",
                  backgroundColor: "rgba(168,85,247,0.05)",
                }}
                scrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    onPress={() => setSelectedMonth(index + 1)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      alignItems: "center",
                      backgroundColor: selectedMonth === index + 1 ? "rgba(168,85,247,0.3)" : "transparent",
                      borderRadius: 8,
                      marginVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: selectedMonth === index + 1 ? "700" : "500",
                        color: selectedMonth === index + 1 ? "#A855F7" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Year */}
            <View style={{ flex: 1, maxWidth: 100 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>
                AÑO
              </Text>
              <ScrollView
                style={{
                  height: 150,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "rgba(168,85,247,0.3)",
                  backgroundColor: "rgba(168,85,247,0.05)",
                }}
                scrollEnabled
                showsVerticalScrollIndicator={false}
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      alignItems: "center",
                      backgroundColor: selectedYear === year ? "rgba(168,85,247,0.3)" : "transparent",
                      borderRadius: 8,
                      marginVertical: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: selectedYear === year ? "700" : "500",
                        color: selectedYear === year ? "#A855F7" : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Selected Date Display */}
          {selectedDay && selectedMonth && selectedYear && (
            <View
              style={{
                backgroundColor: "rgba(168,85,247,0.1)",
                borderRadius: 12,
                padding: 12,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "rgba(168,85,247,0.3)",
              }}
            >
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>
                Fecha de nacimiento
              </Text>
              <Text style={{ color: "#A855F7", fontSize: 16, fontWeight: "700" }}>
                {selectedDay} de {months[selectedMonth - 1]} de {selectedYear}
              </Text>
            </View>
          )}
        </View>

        {/* Buttons */}
        <View style={{ gap: 12 }}>
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selectedDay || !selectedMonth || !selectedYear}
            style={{ borderRadius: 16, overflow: "hidden", opacity: selectedDay && selectedMonth && selectedYear ? 1 : 0.5 }}
          >
            <LinearGradient
              colors={["#7C3AED", "#A855F7", "#EC4899"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ paddingVertical: 16, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
                Confirmar Edad
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(168,85,247,0.3)",
              backgroundColor: "rgba(168,85,247,0.05)",
            }}
          >
            <Text style={{ color: "rgba(255,255,255,0.7)", fontWeight: "600", fontSize: 14 }}>
              Volver
            </Text>
          </TouchableOpacity>
        </View>

        {/* Legal text */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center", lineHeight: 16 }}>
            Al confirmar tu edad, aceptas nuestros{" "}
            <Text style={{ color: "#A855F7", fontWeight: "600" }}>Términos de Servicio</Text> y{" "}
            <Text style={{ color: "#A855F7", fontWeight: "600" }}>Política de Privacidad</Text>
          </Text>
        </View>
      </ScreenContainer>
    </View>
  );
}
