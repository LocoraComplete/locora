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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Room() {
  const { chatId, title } = useLocalSearchParams<{
    chatId: string;
    title?: string;
  }>();

  const router = useRouter();
  const socket = getSocket();

  const CHAT_ID = chatId;

  const [USER_ID, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  /* ================= LOAD USER & CONNECT SOCKET ================= */
  useEffect(() => {
    socket.connect();

    const loadUser = async () => {
      const userString = await AsyncStorage.getItem("user");
      if (!userString) return;

      const user = JSON.parse(userString);
      setUserId(user.UserId);

      socket.emit("register_user", user.UserId);
    };

    loadUser();

    return () => {
      socket.disconnect();
    };
  }, []);

  /* ================= LOAD MESSAGES ================= */
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
        Alert.alert("You are no longer in this group");
        router.replace("/chat");
      }
    }
  };

  /* ================= SOCKET LISTENER ================= */
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

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!inputText.trim() || !CHAT_ID || !USER_ID) return;

    socket.emit("send_message", {
      ChatId: CHAT_ID,
      SenderId: USER_ID,
      Text: inputText.trim(),
      IsSystem: false,
    });

    setInputText("");
  };

  /* ================= OPEN GROUP INFO ================= */
  const openGroupInfo = () => {
    if (!CHAT_ID) return;

    router.push({
      pathname: "/chat/info",
      params: { chatId: CHAT_ID },
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={openGroupInfo}>
          <Text style={styles.headerTitle}>
            {title || "Group Chat"}
          </Text>
          <Text style={styles.headerSubtitle}>
            Tap to view group info
          </Text>
        </TouchableOpacity>
      </View>

      {/* MESSAGES */}
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {messages.map((msg, index) => {
          if (msg.IsSystem) {
            return (
              <View key={index} style={styles.systemMessage}>
                <Text style={styles.systemText}>{msg.Text}</Text>
              </View>
            );
          }

          const isMine = msg.SenderId === USER_ID;

          return (
            <View
              key={index}
              style={isMine ? styles.messageSent : styles.messageReceived}
            >
              {!isMine && (
                <Text style={styles.senderName}>
                  {msg.SenderName || "User"}
                </Text>
              )}
              <Text>{msg.Text}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* INPUT */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },

  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  messages: {
    flex: 1,
    paddingHorizontal: 15,
  },

  messageReceived: {
    alignSelf: "flex-start",
    backgroundColor: "#EAEAEA",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "75%",
  },

  messageSent: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
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

  systemMessage: {
    alignSelf: "center",
    backgroundColor: "#EEE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 10,
  },

  systemText: {
    fontSize: 12,
    color: "#666",
  },

  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#EEE",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },

  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: "center",
  },

  sendText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});