import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

const PLANS = [
  {
    id: "premium" as const,
    name: "Premium",
    emoji: "💎",
    colors: ["#7C3AED", "#A855F7"] as const,
    price: "$9.99",
    period: "/mes",
    features: ["Swipes ilimitados", "Ver quién te gustó", "5 Super Likes/día", "1 Boost por mes", "Sin anuncios", "Modo incógnito"],
  },
  {
    id: "gold" as const,
    name: "Gold",
    emoji: "👑",
    colors: ["#F59E0B", "#EF4444"] as const,
    price: "$19.99",
    period: "/mes",
    popular: true,
    features: ["Todo lo de Premium", "Super Likes ilimitados", "5 Boosts por mes", "Prioridad en descubrir", "Filtros avanzados", "Rewind ilimitado"],
  },
];

const PURCHASES = [
  { id: "boost_1", emoji: "⚡", name: "1 Boost", desc: "Destácate por 30 minutos", price: "$2.99", colors: ["#7C3AED", "#A855F7"] as const },
  { id: "boost_5", emoji: "⚡", name: "5 Boosts", desc: "Ahorra un 40%", price: "$9.99", colors: ["#7C3AED", "#A855F7"] as const },
  { id: "superlike_5", emoji: "⭐", name: "5 Super Likes", desc: "Destaca tu interés", price: "$4.99", colors: ["#EC4899", "#F43F5E"] as const },
  { id: "superlike_20", emoji: "⭐", name: "20 Super Likes", desc: "Ahorra un 50%", price: "$14.99", colors: ["#EC4899", "#F43F5E"] as const },
];

export default function PremiumScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const activateMutation = trpc.premium.activate.useMutation({
    onSuccess: () => Alert.alert("¡Activado! 🎉", "Tu plan Premium está activo.", [{ text: "OK", onPress: () => router.back() }]),
    onError: (err) => Alert.alert("Error", err.message),
  });

  const boostMutation = trpc.premium.purchaseBoost.useMutation({
    onSuccess: () => Alert.alert("¡Comprado! ⚡", "Tus Boosts han sido agregados."),
  });

  const superLikeMutation = trpc.premium.purchaseSuperLikes.useMutation({
    onSuccess: () => Alert.alert("¡Comprado! ⭐", "Tus Super Likes han sido agregados."),
  });

  const handlePlan = (planId: "premium" | "gold") => {
    if (!isAuthenticated) { Alert.alert("Inicia sesión", "Necesitas una cuenta para suscribirte."); return; }
    Alert.alert("Confirmar suscripción", `¿Activar plan ${planId === "gold" ? "Gold" : "Premium"}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Confirmar", onPress: () => activateMutation.mutate({ plan: planId, months: 1 }) },
    ]);
  };

  const handlePurchase = (purchaseId: string) => {
    if (!isAuthenticated) { Alert.alert("Inicia sesión", "Necesitas una cuenta para comprar."); return; }
    if (purchaseId.startsWith("boost")) {
      boostMutation.mutate({ quantity: purchaseId === "boost_5" ? 5 : 1 });
    } else {
      superLikeMutation.mutate({ quantity: purchaseId === "superlike_20" ? 20 : 5 });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#1E1B4B", "#0A0A0F"]} style={StyleSheet.absoluteFillObject} />
      {/* Decorative blobs */}
      <View style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: 110, backgroundColor: "#7C3AED", opacity: 0.12 }} />
      <View style={{ position: "absolute", top: 200, left: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: "#EC4899", opacity: 0.08 }} />

      <ScreenContainer containerClassName="bg-transparent" edges={["top", "bottom", "left", "right"]}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 14 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
            <Text style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>✕</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "900", color: "#fff", letterSpacing: -0.5 }}>Hazte Premium 👑</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 48 }}>
          {/* Hero */}
          <View style={{ alignItems: "center", paddingVertical: 20, paddingHorizontal: 24 }}>
            <LinearGradient colors={["rgba(124,58,237,0.3)", "rgba(236,72,153,0.2)"]} style={{ width: 90, height: 90, borderRadius: 45, alignItems: "center", justifyContent: "center", marginBottom: 16, borderWidth: 1.5, borderColor: "rgba(168,85,247,0.4)" }}>
              <Text style={{ fontSize: 44 }}>💜</Text>
            </LinearGradient>
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff", textAlign: "center", letterSpacing: -0.5, marginBottom: 8 }}>
              Más matches, más conexiones
            </Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", lineHeight: 22, fontSize: 14 }}>
              Desbloquea funciones exclusivas y aumenta tus posibilidades de encontrar el match perfecto.
            </Text>
          </View>

          {/* Plans */}
          <View style={{ paddingHorizontal: 16, gap: 16, marginBottom: 32 }}>
            {PLANS.map((plan) => (
              <View key={plan.id} style={{ borderRadius: 24, overflow: "hidden" }}>
                {plan.popular && (
                  <LinearGradient colors={plan.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 7, alignItems: "center" }}>
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12, letterSpacing: 1.5 }}>⭐ MÁS POPULAR</Text>
                  </LinearGradient>
                )}
                <View style={{ backgroundColor: "rgba(255,255,255,0.06)", borderWidth: 1.5, borderColor: plan.popular ? plan.colors[0] : "rgba(255,255,255,0.1)", borderTopWidth: plan.popular ? 0 : 1.5, padding: 22 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18 }}>
                    <LinearGradient colors={plan.colors} style={{ width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontSize: 24 }}>{plan.emoji}</Text>
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 20, fontWeight: "800", color: "#fff" }}>{plan.name}</Text>
                      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}>
                        <Text style={{ fontSize: 26, fontWeight: "900", color: plan.colors[0] }}>{plan.price}</Text>
                        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>{plan.period}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ gap: 10, marginBottom: 20 }}>
                    {plan.features.map((feature) => (
                      <View key={feature} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <LinearGradient colors={plan.colors} style={{ width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
                          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}>✓</Text>
                        </LinearGradient>
                        <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity onPress={() => handlePlan(plan.id)} disabled={activateMutation.isPending} style={{ borderRadius: 16, overflow: "hidden" }}>
                    <LinearGradient colors={plan.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 16, alignItems: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 16, fontWeight: "800" }}>
                        {activateMutation.isPending ? "Procesando..." : `Obtener ${plan.name} ✨`}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Individual purchases */}
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff", marginBottom: 14, letterSpacing: -0.3 }}>
              Compras individuales
            </Text>
            <View style={{ gap: 10 }}>
              {PURCHASES.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handlePurchase(item.id)}
                  style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", gap: 14 }}
                >
                  <LinearGradient colors={item.colors} style={{ width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>{item.name}</Text>
                    <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 }}>{item.desc}</Text>
                  </View>
                  <LinearGradient colors={item.colors} style={{ borderRadius: 12, paddingHorizontal: 14, paddingVertical: 7 }}>
                    <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>{item.price}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 12, paddingHorizontal: 32, lineHeight: 18 }}>
            Los pagos son procesados de forma segura.{"\n"}Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento.
          </Text>
        </ScrollView>
      </ScreenContainer>
    </View>
  );
}
