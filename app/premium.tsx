import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";

const PLANS = [
  {
    id: "premium" as const,
    name: "Premium",
    emoji: "💎",
    color: "#9B59B6",
    price: "$9.99",
    period: "/mes",
    features: [
      "Swipes ilimitados",
      "Ver quién te gustó",
      "5 Super Likes por día",
      "1 Boost por mes",
      "Sin anuncios",
      "Modo incógnito",
    ],
  },
  {
    id: "gold" as const,
    name: "Gold",
    emoji: "👑",
    color: "#F39C12",
    price: "$19.99",
    period: "/mes",
    popular: true,
    features: [
      "Todo lo de Premium",
      "Super Likes ilimitados",
      "5 Boosts por mes",
      "Prioridad en descubrir",
      "Filtros avanzados",
      "Rewind ilimitado",
    ],
  },
];

const PURCHASES = [
  { id: "boost_1", emoji: "⚡", name: "1 Boost", desc: "Destácate por 30 min", price: "$2.99" },
  { id: "boost_5", emoji: "⚡⚡", name: "5 Boosts", desc: "Ahorra 40%", price: "$9.99" },
  { id: "superlike_5", emoji: "⭐", name: "5 Super Likes", desc: "Destaca tu interés", price: "$4.99" },
  { id: "superlike_20", emoji: "⭐⭐", name: "20 Super Likes", desc: "Ahorra 50%", price: "$14.99" },
];

export default function PremiumScreen() {
  const router = useRouter();
  const colors = useColors();
  const { isAuthenticated } = useAuth();

  const activateMutation = trpc.premium.activate.useMutation({
    onSuccess: () => {
      Alert.alert("¡Activado!", "Tu plan Premium está activo. ¡Disfrútalo!", [{ text: "OK", onPress: () => router.back() }]);
    },
    onError: (err) => Alert.alert("Error", err.message),
  });

  const boostMutation = trpc.premium.purchaseBoost.useMutation({
    onSuccess: () => Alert.alert("¡Comprado!", "Tus Boosts han sido agregados."),
  });

  const superLikeMutation = trpc.premium.purchaseSuperLikes.useMutation({
    onSuccess: () => Alert.alert("¡Comprado!", "Tus Super Likes han sido agregados."),
  });

  const handlePlan = (planId: "premium" | "gold") => {
    if (!isAuthenticated) {
      Alert.alert("Inicia sesión", "Necesitas una cuenta para suscribirte.");
      return;
    }
    Alert.alert(
      "Confirmar suscripción",
      `¿Activar plan ${planId === "gold" ? "Gold" : "Premium"} por 1 mes?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => activateMutation.mutate({ plan: planId, months: 1 }) },
      ]
    );
  };

  const handlePurchase = (purchaseId: string) => {
    if (!isAuthenticated) {
      Alert.alert("Inicia sesión", "Necesitas una cuenta para comprar.");
      return;
    }
    if (purchaseId.startsWith("boost")) {
      const qty = purchaseId === "boost_5" ? 5 : 1;
      boostMutation.mutate({ quantity: qty });
    } else {
      const qty = purchaseId === "superlike_20" ? 20 : 5;
      superLikeMutation.mutate({ quantity: qty });
    }
  };

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "bottom", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Text style={{ fontSize: 24, color: colors.primary }}>✕</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 22, fontWeight: "800", color: colors.foreground }}>Hazte Premium</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero */}
        <View style={{ alignItems: "center", paddingVertical: 24, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>💘</Text>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground, textAlign: "center" }}>
            Más matches, más conexiones
          </Text>
          <Text style={{ color: colors.muted, textAlign: "center", marginTop: 8, lineHeight: 22 }}>
            Desbloquea funciones exclusivas y aumenta tus posibilidades de encontrar el match perfecto.
          </Text>
        </View>

        {/* Plans */}
        <View style={{ paddingHorizontal: 16, gap: 16, marginBottom: 32 }}>
          {PLANS.map((plan) => (
            <View
              key={plan.id}
              style={{
                borderRadius: 20,
                borderWidth: plan.popular ? 2 : 1.5,
                borderColor: plan.popular ? plan.color : colors.border,
                overflow: "hidden",
                backgroundColor: colors.surface,
              }}
            >
              {plan.popular && (
                <View style={{ backgroundColor: plan.color, paddingVertical: 6, alignItems: "center" }}>
                  <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>⭐ MÁS POPULAR</Text>
                </View>
              )}
              <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <Text style={{ fontSize: 28 }}>{plan.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, fontWeight: "700", color: colors.foreground }}>{plan.name}</Text>
                    <View style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}>
                      <Text style={{ fontSize: 24, fontWeight: "800", color: plan.color }}>{plan.price}</Text>
                      <Text style={{ color: colors.muted, fontSize: 14 }}>{plan.period}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ gap: 8, marginBottom: 20 }}>
                  {plan.features.map((feature) => (
                    <View key={feature} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ color: plan.color, fontSize: 16 }}>✓</Text>
                      <Text style={{ color: colors.foreground, fontSize: 14 }}>{feature}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  onPress={() => handlePlan(plan.id)}
                  disabled={activateMutation.isPending}
                  style={{ backgroundColor: plan.color, borderRadius: 14, paddingVertical: 14, alignItems: "center" }}
                >
                  <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
                    {activateMutation.isPending ? "Procesando..." : `Obtener ${plan.name}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Individual purchases */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.foreground, marginBottom: 16 }}>
            Compras individuales
          </Text>
          <View style={{ gap: 12 }}>
            {PURCHASES.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePurchase(item.id)}
                style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.border, gap: 14 }}
              >
                <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.foreground }}>{item.name}</Text>
                  <Text style={{ color: colors.muted, fontSize: 13 }}>{item.desc}</Text>
                </View>
                <View style={{ backgroundColor: colors.primary + "20", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 14 }}>{item.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={{ textAlign: "center", color: colors.muted, fontSize: 12, paddingHorizontal: 32 }}>
          Los pagos son procesados de forma segura. Las suscripciones se renuevan automáticamente. Puedes cancelar en cualquier momento.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}
