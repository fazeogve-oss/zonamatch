import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import type { ChatMessage } from "@/shared/types";

const DEMO_MESSAGES: ChatMessage[] = [
  { id: 1, matchId: 1, senderId: 101, text: "Hola! Me gustó mucho tu perfil 😊", read: true, createdAt: new Date(Date.now() - 600000) },
  { id: 2, matchId: 1, senderId: 1, text: "¡Gracias! El tuyo también está muy bien 😄", read: true, createdAt: new Date(Date.now() - 540000) },
  { id: 3, matchId: 1, senderId: 101, text: "¿De dónde eres?", read: true, createdAt: new Date(Date.now() - 480000) },
  { id: 4, matchId: 1, senderId: 1, text: "Soy de Bogotá, ¿y tú?", read: true, createdAt: new Date(Date.now() - 420000) },
  { id: 5, matchId: 1, senderId: 101, text: "Yo de Medellín! ¿Alguna vez has venido?", read: false, createdAt: new Date(Date.now() - 300000) },
];

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { user, isAuthenticated } = useAuth();
  const [text, setText] = useState("");
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>(DEMO_MESSAGES);
  const flatListRef = useRef<FlatList>(null);

  const matchId = parseInt(id || "0");

  const messagesQuery = trpc.matches.getMessages.useQuery(
    { matchId, limit: 50, offset: 0 },
    { enabled: isAuthenticated && matchId > 0, retry: false }
  );

  const sendMutation = trpc.matches.sendMessage.useMutation({
    onSuccess: () => messagesQuery.refetch(),
  });

  const markReadMutation = trpc.matches.markRead.useMutation();

  useEffect(() => {
    if (messagesQuery.data && messagesQuery.data.length > 0) {
      setLocalMessages(messagesQuery.data as ChatMessage[]);
    }
  }, [messagesQuery.data]);

  useEffect(() => {
    if (isAuthenticated && matchId > 0) {
      markReadMutation.mutate({ matchId });
    }
  }, [matchId, isAuthenticated]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");

    if (isAuthenticated) {
      sendMutation.mutate({ matchId, text: trimmed });
    } else {
      // Demo mode
      const newMsg: ChatMessage = {
        id: Date.now(),
        matchId,
        senderId: 1,
        text: trimmed,
        read: false,
        createdAt: new Date(),
      };
      setLocalMessages((prev) => [...prev, newMsg]);
      // Simulate reply
      setTimeout(() => {
        setLocalMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, matchId, senderId: 101, text: "¡Qué interesante! 😊", read: false, createdAt: new Date() },
        ]);
      }, 1500);
    }

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const myUserId = user?.id || 1;

  return (
    <ScreenContainer containerClassName="bg-background" edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: colors.border, gap: 12 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Text style={{ fontSize: 24, color: colors.primary }}>‹</Text>
        </TouchableOpacity>
        <Image source={{ uri: "https://picsum.photos/200/200?random=10" }} style={{ width: 40, height: 40, borderRadius: 20 }} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: "700", color: colors.foreground }}>Valentina</Text>
          <Text style={{ fontSize: 12, color: "#00C851" }}>En línea</Text>
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <Text style={{ fontSize: 20 }}>⋯</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={0}>
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={localMessages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isMe = item.senderId === myUserId;
            return (
              <View style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
                <View style={{ maxWidth: "75%", backgroundColor: isMe ? colors.primary : colors.surface, borderRadius: 18, borderBottomRightRadius: isMe ? 4 : 18, borderBottomLeftRadius: isMe ? 18 : 4, paddingHorizontal: 14, paddingVertical: 10 }}>
                  <Text style={{ color: isMe ? "#fff" : colors.foreground, fontSize: 15, lineHeight: 21 }}>{item.text}</Text>
                </View>
                <Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, marginHorizontal: 4 }}>
                  {formatMessageTime(new Date(item.createdAt))}
                  {isMe && <Text> {item.read ? " ✓✓" : " ✓"}</Text>}
                </Text>
              </View>
            );
          }}
        />

        {/* Input */}
        <View style={{ flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 12, paddingVertical: 10, paddingBottom: Platform.OS === "ios" ? 28 : 10, borderTopWidth: 0.5, borderTopColor: colors.border, gap: 10, backgroundColor: colors.background }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={colors.muted}
            multiline
            style={{ flex: 1, backgroundColor: colors.surface, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: colors.foreground, maxHeight: 100 }}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim()}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: text.trim() ? colors.primary : colors.border, alignItems: "center", justifyContent: "center" }}
          >
            <Text style={{ fontSize: 18 }}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
