import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "heart.fill": "favorite",
  "xmark": "close",
  "star.fill": "star",
  "bubble.left.fill": "chat-bubble",
  "person.fill": "person",
  "person.crop.circle": "account-circle",
  "gearshape.fill": "settings",
  "arrow.uturn.backward": "undo",
  "bolt.fill": "bolt",
  "crown.fill": "workspace-premium",
  "magnifyingglass": "search",
  "bell.fill": "notifications",
  "camera.fill": "camera-alt",
  "photo.fill": "photo",
  "pencil": "edit",
  "checkmark": "check",
  "chevron.left": "chevron-left",
  "location.fill": "location-on",
  "lock.fill": "lock",
  "eye.fill": "visibility",
  "eye.slash.fill": "visibility-off",
  "trash.fill": "delete",
  "plus": "add",
  "arrow.right": "arrow-forward",
  "flame.fill": "local-fire-department",
  "sparkles": "auto-awesome",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
