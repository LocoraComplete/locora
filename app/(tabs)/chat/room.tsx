import { API_BASE_URL } from "@/config/api";
import { getSocket } from "@/config/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../../../config/colors";
import { useLanguage } from "../../../context/languagecontext";
import { useTheme } from "../../../context/themecontext";

export default function Room() {
  const {
    chatId,
    title,
    isPrivate,
    otherUserId,
    otherUserHandle,
  } = useLocalSearchParams<{
    chatId: string;
    title?: string;
    isPrivate?: string;
    otherUserId?: string;
    otherUserHandle?: string;
  }>();

  const router = useRouter();
  const socket = getSocket();
  const CHAT_ID = chatId;

  const { theme } = useTheme();
  const themeColors = colors[theme];
  const { t } = useLanguage();

  const [USER_ID, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  const formatMessageTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* LOAD USER */
  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) return;

      const user = JSON.parse(userString);
      const id = user?.UserId || user?.id;

      setUserId(id);

      if (id) {
        socket.emit("register_user", id);
      }
    };

    loadUser();
  }, []);

  /* LOAD MESSAGES */
  const loadMessages = async () => {
    if (!CHAT_ID || !USER_ID) return;

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/messages/${CHAT_ID}?userId=${USER_ID}`
      );

      setMessages(res.data);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } catch (err: any) {
      console.log("Load messages error", err?.response?.data || err.message);

      if (err?.response?.status === 403) {
        Alert.alert(t("chatAccessRemoved") || "You are no longer in this chat");
        router.back();
      }
    }
  };

  /* SOCKET LISTENER */
  useEffect(() => {
    if (!CHAT_ID || !USER_ID) return;

    loadMessages();

    socket.emit("join_chat", CHAT_ID);

    const handleReceive = (message: any) => {
      setMessages((prev) => [...prev, message]);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [CHAT_ID, USER_ID]);

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!inputText.trim() || !CHAT_ID || !USER_ID) return;

    socket.emit("send_message", {
      ChatId: CHAT_ID,
      SenderId: USER_ID,
      ReceiverId: isPrivate === "true" ? otherUserId : null,
      Text: inputText.trim(),
      IsSystem: false,
    });

    setInputText("");
  };

  /* OPEN GROUP INFO */
  const openGroupInfo = () => {
    if (!CHAT_ID || isPrivate === "true") return;

    router.push({
      pathname: "/chat/info",
      params: { chatId: CHAT_ID },
    });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "padding"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { borderColor: themeColors.border, backgroundColor: themeColors.background },
        ]}
      >
        <Pressable onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Text style={{ fontSize: 18, color: themeColors.text }}>←</Text>
        </Pressable>

        <View style={{ flex: 1 }}>
          {isPrivate === "true" ? (
            <Pressable
              onPress={() => {
                if (otherUserId) {
                  router.push({
                    pathname: "/profile/[id]",
                    params: { id: otherUserId },
                  });
                }
              }}
            >
              <Text
                style={[
                  styles.headerTitle,
                  { color: themeColors.text },
                ]}
              >
                {otherUserHandle}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: themeColors.secondaryText },
                ]}
              >
                {t("tapViewProfile") || "Tap to view profile"}
              </Text>
            </Pressable>
          ) : (
            <TouchableOpacity onPress={openGroupInfo}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: themeColors.text },
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.headerSubtitle,
                  { color: themeColors.secondaryText },
                ]}
              >
                {t("tapViewGroupInfo") || "Tap to view group info"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MESSAGES */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={{ paddingVertical: 10 }}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => {
          if (msg.IsSystem) {
            return (
              <View
                key={index}
                style={[
                  styles.systemMessage,
                  { backgroundColor: themeColors.card },
                ]}
              >
                <Text
                  style={[
                    styles.systemText,
                    { color: themeColors.secondaryText },
                  ]}
                >
                  {msg.Text}
                </Text>
              </View>
            );
          }

          const isMine = msg.SenderId === USER_ID;

          return (
            <View
              key={index}
              style={[
                isMine ? styles.messageSent : styles.messageReceived,
                {
                  backgroundColor: isMine
                    ? theme === "dark"
                      ? "#2c2c2e"
                      : "#DCF8C6"
                    : themeColors.card,
                },
              ]}
            >
              {!isMine && (
                <Text
                  style={[styles.senderName, { color: themeColors.text }]}
                >
                  {msg.SenderName || otherUserHandle || t("user") || "User"}
                </Text>
              )}

              <Text style={{ color: themeColors.text }}>{msg.Text}</Text>

              <Text
                style={[
                  styles.timestamp,
                  {
                    color: themeColors.secondaryText,
                    alignSelf: isMine ? "flex-end" : "flex-start",
                  },
                ]}
              >
                {formatMessageTime(msg.CreatedAt)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* INPUT */}
      <View
        style={[
          styles.inputRow,
          { borderColor: themeColors.border, backgroundColor: themeColors.background },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              borderColor: themeColors.border,
              color: themeColors.text,
              backgroundColor: themeColors.card,
            },
          ]}
          placeholder={t("typeMessage") || "Type a message..."}
          placeholderTextColor={theme === "dark" ? "#999" : "#666"}
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
        />

        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: themeColors.text }]}
          onPress={sendMessage}
        >
          <Text style={[styles.sendText, { color: themeColors.background }]}>
            {t("send") || "Send"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  headerSubtitle: { fontSize: 12, marginTop: 2 },
  messages: { flex: 1, paddingHorizontal: 15 },
  messageReceived: {
    alignSelf: "flex-start",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "75%",
  },
  messageSent: {
    alignSelf: "flex-end",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "75%",
  },
  senderName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  systemMessage: {
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 10,
  },
  systemText: { fontSize: 12 },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    minHeight: 40,
  },
  sendBtn: {
    marginLeft: 10,
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
  },
  sendText: {
    fontWeight: "bold",
  },
});