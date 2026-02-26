import { API_BASE_URL } from "@/config/api";
import { getSocket } from "@/config/socket";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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
  const { chatId } = useLocalSearchParams<{ chatId: string }>();

  const CHAT_ID = chatId;
  const socket = getSocket();

  const [USER_ID, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  // ✅ Load logged-in user
  useEffect(() => {
    const loadUser = async () => {
      const userString = await AsyncStorage.getItem("user");

      if (userString) {
        const user = JSON.parse(userString);
        console.log("Loaded user:", user);
        setUserId(user.UserId);
      } else {
        console.log("No user found in AsyncStorage");
      }
    };

    loadUser();
  }, []);

  // ✅ Load chat history
  const loadMessages = async () => {
    try {
      console.log("Loading messages for:", CHAT_ID);

      const res = await axios.get(
        `${API_BASE_URL}/api/messages/${CHAT_ID}`
      );

      console.log("Messages received:", res.data);

      setMessages(res.data);

      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 200);
    } catch (err) {
      console.log("Load messages error", err);
    }
  };

  // ✅ Join room + listen
  useEffect(() => {
    if (!CHAT_ID || !USER_ID) {
      console.log("Waiting for CHAT_ID or USER_ID");
      return;
    }

    console.log("Joining chat:", CHAT_ID);

    loadMessages();

    socket.emit("join_chat", CHAT_ID);

    const handleReceive = (message: any) => {
      console.log("Received message:", message);

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

  // ✅ Send message
  const sendMessage = () => {
    if (!inputText.trim() || !CHAT_ID || !USER_ID) return;

    socket.emit("send_message", {
      ChatId: CHAT_ID,
      SenderId: USER_ID,
      Text: inputText,
    });

    setInputText("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {messages.map((msg, index) => {
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  messages: { flex: 1, paddingHorizontal: 15 },
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