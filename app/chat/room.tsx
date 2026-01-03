import React, { useRef, useState } from "react";
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

export default function Room() { // Must match file export
  const [messages, setMessages] = useState([
    { type: "received", text: "Hello! Are you joining the trip?" },
    { type: "sent", text: "Yes, I will be there." },
  ]);
  const [inputText, setInputText] = useState("");

  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (inputText.trim() === "") return;

    setMessages([...messages, { type: "sent", text: inputText }]);
    setInputText("");

    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.messages}
        ref={scrollRef}
        contentContainerStyle={{ paddingVertical: 10 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={msg.type === "sent" ? styles.messageSent : styles.messageReceived}
          >
            <Text>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
          returnKeyType="send"
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
  sendText: { color: "#FFF", fontWeight: "bold" },
});
