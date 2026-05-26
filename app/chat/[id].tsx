import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/use-auth";
import type { ChatMessage } from "@/shared/types";

const DEMO_MESSAGES: ChatMessage[] = [
  { id: 1, matchId: 1, senderId: 101, text: "Hola! Me encantó tu perfil 💜", read: true, createdAt: new Date(Date.now() - 600000) },
  { id: 2, matchId: 1, senderId: 1, text: "¡Gracias! El tuyo también está increíble 😄", read: true, createdAt: new Date(Date.now() - 540000) },
  { id: 3, matchId: 1, senderId: 101, text: "¿De dónde eres?", read: true, createdAt: new Date(Date.now() - 480000) },
  { id: 4, matchId: 1, senderId: 1, text: "Soy de Bogotá, ¿y tú?", read: true, createdAt: new Date(Date.now() - 420000) },
  { id: 5, matchId: 1, senderId: 101, text: "¡Yo de Medellín! ¿Alguna vez has venido? 🌸", read: false, createdAt: new Date(Date.now() - 300000) },
];

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
      const newMsg: ChatMessage = {
        id: Date.now(), matchId, senderId: 1, text: trimmed, read: false, createdAt: new Date(),
      };
      setLocalMessages((prev) => [...prev, newMsg]);
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
    <View style={{ flex: 1, backgroundColor: "#0A0A0F" }}>
      <LinearGradient colors={["#0A0A0F", "#13111C"]} style={StyleSheet.absoluteFillObject} />

      <ScreenContainer containerClassName="bg-transparent" edges={["top", "left", "right"]}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "rgba(168,85,247,0.15)", gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 18, color: "#C084FC" }}>‹</Text>
          </TouchableOpacity>

          <LinearGradient colors={["#7C3AED", "#EC4899"]} style={{ width: 44, height: 44, borderRadius: 22, padding: 2 }}>
            <Image source={{ uri: "https://picsum.photos/200/200?random=10" }} style={{ width: "100%", height: "100%", borderRadius: 20 }} />
          </LinearGradient>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>Valentina</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#10B981" }} />
              <Text style={{ fontSize: 12, color: "#10B981" }}>En línea</Text>
            </View>
          </View>

          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.07)", alignItems: "center", justifyContent: "center" }}>
            <Text style={{ fontSize: 18, color: "rgba(255,255,255,0.6)" }}>⋯</Text>
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {/* Messages */}
          <FlatList
            ref={flatListRef}
            data={localMessages}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            renderItem={({ item }) => {
              const isMe = item.senderId === myUserId;
              return (
                <View style={{ alignItems: isMe ? "flex-end" : "flex-start" }}>
                  {isMe ? (
                    <LinearGradient
                      colors={["#7C3AED", "#A855F7", "#EC4899"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ maxWidth: "75%", borderRadius: 20, borderBottomRightRadius: 4, paddingHorizontal: 16, paddingVertical: 11 }}
                    >
                      <Text style={{ color: "#fff", fontSize: 15, lineHeight: 22 }}>{item.text}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={{ maxWidth: "75%", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 20, borderBottomLeftRadius: 4, paddingHorizontal: 16, paddingVertical: 11, borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" }}>
                      <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: 22 }}>{item.text}</Text>
                    </View>
                  )}
                  <Text style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 4, marginHorizontal: 4 }}>
                    {formatMessageTime(new Date(item.createdAt))}
                    {isMe && <Text style={{ color: item.read ? "#A855F7" : "rgba(255,255,255,0.25)" }}> {item.read ? " ✓✓" : " ✓"}</Text>}
                  </Text>
                </View>
              );
            }}
          />

          {/* Input */}
          <View style={{ flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 12, paddingVertical: 10, paddingBottom: Platform.OS === "ios" ? 28 : 10, borderTopWidth: 1, borderTopColor: "rgba(168,85,247,0.1)", gap: 10, backgroundColor: "rgba(10,10,15,0.95)" }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Escribe un mensaje..."
              placeholderTextColor="rgba(255,255,255,0.25)"
              multiline
              style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, color: "#fff", maxHeight: 100, borderWidth: 1, borderColor: "rgba(168,85,247,0.2)" }}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!text.trim()}
              style={{ width: 46, height: 46, borderRadius: 23, overflow: "hidden" }}
            >
              {text.trim() ? (
                <LinearGradient colors={["#7C3AED", "#EC4899"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18, color: "#fff" }}>➤</Text>
                </LinearGradient>
              ) : (
                <View style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontSize: 18, color: "rgba(255,255,255,0.3)" }}>➤</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </View>
  );
}
