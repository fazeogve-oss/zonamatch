import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: "center", gap: 3 }}>
      {focused ? (
        <LinearGradient
          colors={["#7C3AED", "#A855F7", "#EC4899"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: 44, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18 }}>{emoji}</Text>
        </LinearGradient>
      ) : (
        <View style={{ width: 44, height: 32, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20, opacity: 0.45 }}>{emoji}</Text>
        </View>
      )}
      <Text style={{ fontSize: 10, color: focused ? "#C084FC" : "rgba(255,255,255,0.3)", fontWeight: focused ? "700" : "400" }}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 64 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingTop: 10,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: "#0D0B14",
          borderTopColor: "rgba(168,85,247,0.2)",
          borderTopWidth: 1,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔥" label="Descubrir" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Mensajes" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Perfil" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
